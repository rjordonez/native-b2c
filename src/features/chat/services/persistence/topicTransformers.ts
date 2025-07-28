import { DBTopic, DBTopicQuestion } from '../../../../types/database';
import { Topic, Question } from '../../../../lib/supabase/topics';

/**
 * Transform database topic data to domain model
 */
export function transformDBTopicToDomain(
  dbTopic: DBTopic,
  dbQuestions: DBTopicQuestion[]
): Topic {
  // Transform questions
  const questionsList: Question[] = dbQuestions
    .sort((a, b) => a.order - b.order)
    .map(q => {
      // Handle both DBTopicQuestion format and full question object from JSONB
      const questionData = q as any;
      return {
        id: questionData.id,
        text: questionData.text,
        type: (questionData.type || questionData.part || 'part1') as 'part1' | 'part2' | 'part3'
      };
    });

  // Handle both minimal DBTopic and full topic object from JSONB
  const topicData = dbTopic as any; // Type assertion to handle JSONB data
  
  // Create Topic object with required fields
  return {
    id: topicData.id,
    title: topicData.title,
    part: topicData.part || 'part1' as const,
    progress: topicData.progress || 0,
    completed: topicData.completed || false,
    questions: topicData.questions || topicData.description || '',
    estimatedTime: topicData.estimatedTime || topicData.estimated_time || '15-20 mins',
    questionsList,
    expanded: false
  };
}

/**
 * Transform topic practice state from database to domain model
 */
export function transformTopicPracticeState(dbState: {
  currentTopic: DBTopic;
  currentQuestionIndex: number;
  questions: DBTopicQuestion[];
}) {
  return {
    currentTopic: transformDBTopicToDomain(dbState.currentTopic, dbState.questions),
    currentQuestionIndex: dbState.currentQuestionIndex,
    questions: dbState.questions
      .sort((a, b) => a.order - b.order)
      .map(q => {
        // Handle both DBTopicQuestion format and full question object from JSONB
        const questionData = q as any;
        return {
          id: questionData.id,
          text: questionData.text,
          type: (questionData.type || questionData.part || 'part1') as 'part1' | 'part2' | 'part3'
        };
      })
  };
}