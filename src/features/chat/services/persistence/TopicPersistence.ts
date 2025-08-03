import { PersistenceBase } from './PersistenceBase';
import { Conversation, Message } from '../../types';
import { DBTopic, DBTopicQuestion, DBConversationWithRelations, DBMessageWithRelations } from '../../../../types/database';

export class TopicPersistence extends PersistenceBase {
  /**
   * Load conversations with topic practice state
   */
  async loadUserConversations(userId: string): Promise<{ 
    conversations: Conversation[], 
    topicPracticeState?: {
      currentTopic: DBTopic;
      currentQuestionIndex: number;
      questions: DBTopicQuestion[];
    }
  }> {
    return this.executeDbOperation(async () => {
      // Fetch conversations with their messages and related data
      const { data: conversations, error } = await this.supabase
        .from('conversations')
        .select(`
          *,
          messages (
            *,
            transcriptions (*),
            pronunciation_scores (*),
            enhanced_transcripts (*)
          )
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      if (!conversations) return { conversations: [] };

      // Transform DB data to Redux format
      const transformedConversations = conversations.map(conv => this.transformConversation(conv));
      
      // Find the active conversation (first one) and extract its topic practice state
      const activeConversation = conversations[0];
      let topicPracticeState = undefined;
      
      if (activeConversation && activeConversation.current_topic) {
        topicPracticeState = {
          currentTopic: activeConversation.current_topic,
          currentQuestionIndex: activeConversation.current_question_index || 0,
          questions: activeConversation.topic_questions || []
        };
      }
      
      return {
        conversations: transformedConversations,
        topicPracticeState
      };
    }, 'loadUserConversations');
  }

  /**
   * Transform DB conversation to Redux format
   */
  private transformConversation(dbConv: DBConversationWithRelations): Conversation {
    const messages: Message[] = (dbConv.messages || [])
      .map((msg: DBMessageWithRelations) => {
        
        const message: Message = {
          id: msg.client_id,
          content: msg.content,
          sender: msg.sender,
          timestamp: msg.created_at,
          // Fall back to audio_data if storage URL fails
          audioUrl: msg.audio_storage_url || msg.audio_url || msg.audio_data,
          audioData: msg.audio_data, // Keep for fallback
          isTopicQuestion: msg.is_topic_question,
          questionIndex: msg.question_index ?? undefined, // Add question_index
        };
        
        // Add transcription if available
        if (msg.transcriptions) {
          // Handle both array and object formats
          const trans = Array.isArray(msg.transcriptions)
            ? msg.transcriptions[0]
            : msg.transcriptions;
          
          if (trans && trans.text) {
            message.transcription = {
              text: trans.text,
              isLoading: false,
              confidence: trans.confidence,
              transcriptId: trans.transcript_id,
            };
          }
        }
        
        // Add pronunciation if available
        if (msg.pronunciation_scores) {
          // Handle both array and object formats
          const pron = Array.isArray(msg.pronunciation_scores) 
            ? msg.pronunciation_scores[0] 
            : msg.pronunciation_scores;
          
          if (pron && pron.overall_score !== undefined) {
            message.pronunciation = {
              words: pron.word_scores || [],
              overallScore: pron.overall_score,
              accuracy: pron.accuracy_score,
              fluency: pron.fluency_score,
              completeness: pron.completeness_score,
              isLoading: false,
            };
          }
        }
        
        return message;
      })
      .sort((a: Message, b: Message) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

    // Filter out any enhanced messages from regular messages to avoid duplicates
    const regularMessages = messages.filter(msg => !msg.isEnhanced);
    
    // Collect all enhanced transcripts from the enhanced_transcripts table
    const enhancedMessages: Message[] = [];
    dbConv.messages.forEach((dbMsg: DBMessageWithRelations) => {
      if (dbMsg.enhanced_transcripts) {
        const transcripts = Array.isArray(dbMsg.enhanced_transcripts)
          ? dbMsg.enhanced_transcripts
          : [dbMsg.enhanced_transcripts];
        
        transcripts.forEach((enhancedTrans) => {
          if (enhancedTrans && enhancedTrans.enhanced_text) {
            const enhancedMessage: Message = {
              id: `enhanced-${dbMsg.client_id}-${enhancedTrans.id}`,
              content: enhancedTrans.enhanced_text,
              sender: 'assistant',
              timestamp: enhancedTrans.created_at || new Date().toISOString(),
              isEnhanced: true,
            };
            enhancedMessages.push(enhancedMessage);
          }
        });
      }
    });

    // Combine regular messages and enhanced messages, then sort by timestamp
    const allMessages = [...regularMessages, ...enhancedMessages].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return {
      id: dbConv.client_id,
      title: dbConv.title,
      messages: allMessages,
      createdAt: dbConv.created_at,
      updatedAt: dbConv.updated_at,
    };
  }
}