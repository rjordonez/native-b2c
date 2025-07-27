import { supabase } from '../../../shared/services/supabase';

// Conversation Service
export const conversationService = {
  async getUserConversations(authUserId: string) {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', authUserId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getConversationMessageCounts(conversationIds: string[]) {
    if (conversationIds.length === 0) return {};
    
    const { data, error } = await supabase
      .from('messages')
      .select('conversation_id')
      .in('conversation_id', conversationIds);
    
    if (error) throw error;
    
    // Count messages per conversation
    const counts: { [key: string]: number } = {};
    data?.forEach(message => {
      counts[message.conversation_id] = (counts[message.conversation_id] || 0) + 1;
    });
    
    return counts;
  },

  async getConversationMessages(conversationId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        transcriptions(*),
        pronunciation_scores(*),
        enhanced_transcripts(*)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getCompleteUserData(userId: string) {
    try {
      // First get the user profile to get the auth_user_id
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      if (!profile) throw new Error('User not found');

      // Get conversations for this user using auth_user_id
      const { data: conversations, error: conversationsError } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', profile.auth_user_id)
        .order('created_at', { ascending: false });

      if (conversationsError) throw conversationsError;

      // Get message counts for each conversation
      let conversationsWithCounts = conversations || [];
      if (conversations && conversations.length > 0) {
        const conversationIds = conversations.map(c => c.id);
        const messageCounts = await this.getConversationMessageCounts(conversationIds);
        
        conversationsWithCounts = conversations.map(conversation => ({
          ...conversation,
          messageCount: messageCounts[conversation.id] || 0
        }));
      }

      return {
        profile,
        conversations: conversationsWithCounts,
        errors: {
          profile: profileError,
          conversations: conversationsError
        }
      };
    } catch (error) {
      throw error;
    }
  },
};