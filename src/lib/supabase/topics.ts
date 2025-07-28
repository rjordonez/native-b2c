import { supabase } from '../../shared/services/supabase';
// Basic types for topics and questions
export interface Question {
  id: string;
  text: string;
  type: 'part1' | 'part2' | 'part3';
}

export interface Topic {
  id: string;
  title: string;
  part: 'part1' | 'part2' | 'part3';
  progress: number;
  completed: boolean;
  questions: string;
  estimatedTime: string;
  questionsList: Question[];
  expanded: boolean;
}

// Database types matching our SQL schema
export interface DatabaseTopic {
  id: string;
  title: string;
  part: 'part1' | 'part2' | 'part3';
  questions: string;
  estimated_time: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseQuestion {
  id: string;
  topic_id: string;
  text: string;
  question_order: number;
  part: 'part1' | 'part2' | 'part3';
  created_at: string;
  updated_at: string;
}

export interface UserTopicProgress {
  id: string;
  user_id: string;
  topic_id: string;
  progress: number;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

// Transform database topic to application format
const transformDatabaseTopic = (
  dbTopic: DatabaseTopic,
  questionsList: DatabaseQuestion[],
  userProgress?: UserTopicProgress
): Topic => {
  const topicQuestions: Question[] = questionsList
    .filter(q => q.topic_id === dbTopic.id)
    .sort((a, b) => a.question_order - b.question_order)
    .map(q => ({
      id: q.id,
      text: q.text,
      type: q.part as 'part1' | 'part2' | 'part3'
    }));

  return {
    id: dbTopic.id,
    title: dbTopic.title,
    part: dbTopic.part,
    progress: userProgress?.progress || 0,
    completed: userProgress?.completed || false,
    questions: dbTopic.questions,
    estimatedTime: dbTopic.estimated_time,
    questionsList: topicQuestions,
    expanded: false
  };
};

// Fetch all topics with their questions
export const fetchTopics = async (): Promise<Topic[]> => {
  try {
    // Fetch topics
    const { data: topics, error: topicsError } = await supabase
      .from('topics')
      .select('*')
      .order('title');

    if (topicsError) {
      console.error('Error fetching topics:', topicsError);
      throw new Error(`Failed to fetch topics: ${topicsError.message}`);
    }

    if (!topics || topics.length === 0) {
      return [];
    }

    // Fetch all questions for these topics
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .order('question_order');

    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
      throw new Error(`Failed to fetch questions: ${questionsError.message}`);
    }

    // Fetch user progress if authenticated
    let userProgress: UserTopicProgress[] = [];
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: progress, error: progressError } = await supabase
        .from('user_topic_progress')
        .select('*')
        .eq('user_id', user.id);

      if (progressError) {
        console.error('Error fetching user progress:', progressError);
        // Don't throw error for progress, just continue without it
      } else {
        userProgress = progress || [];
      }
    }

    // Transform and combine the data
    return topics.map(topic => {
      const topicProgress = userProgress.find(p => p.topic_id === topic.id);
      return transformDatabaseTopic(topic, questions || [], topicProgress);
    });

  } catch (error) {
    console.error('Error in fetchTopics:', error);
    throw error;
  }
};

// Update user progress for a specific topic
export const updateTopicProgress = async (
  topicId: string,
  progress: number,
  completed: boolean = false
): Promise<UserTopicProgress> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const updateData = {
      user_id: user.id,
      topic_id: topicId,
      progress,
      completed,
      completed_at: completed ? new Date().toISOString() : null
    };

    const { data, error } = await supabase
      .from('user_topic_progress')
      .upsert(updateData, { 
        onConflict: 'user_id,topic_id',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating topic progress:', error);
      throw new Error(`Failed to update progress: ${error.message}`);
    }

    return data;

  } catch (error) {
    console.error('Error in updateTopicProgress:', error);
    throw error;
  }
};

// Toggle topic completion status
export const toggleTopicCompletion = async (topicId: string): Promise<UserTopicProgress> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // First, get current progress
    const { data: currentProgress } = await supabase
      .from('user_topic_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('topic_id', topicId)
      .single();

    const isCurrentlyCompleted = currentProgress?.completed || false;
    const newCompleted = !isCurrentlyCompleted;
    const newProgress = newCompleted ? 100 : Math.max(0, (currentProgress?.progress || 0) - 10);

    return await updateTopicProgress(topicId, newProgress, newCompleted);

  } catch (error) {
    console.error('Error in toggleTopicCompletion:', error);
    throw error;
  }
};

// Get user progress for all topics
export const fetchUserProgress = async (): Promise<UserTopicProgress[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('user_topic_progress')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching user progress:', error);
      throw new Error(`Failed to fetch user progress: ${error.message}`);
    }

    return data || [];

  } catch (error) {
    console.error('Error in fetchUserProgress:', error);
    throw error;
  }
};

// Batch update multiple topic progress entries
export const batchUpdateTopicProgress = async (
  updates: Array<{ topicId: string; progress: number; completed: boolean }>
): Promise<UserTopicProgress[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const updateData = updates.map(update => ({
      user_id: user.id,
      topic_id: update.topicId,
      progress: update.progress,
      completed: update.completed,
      completed_at: update.completed ? new Date().toISOString() : null
    }));

    const { data, error } = await supabase
      .from('user_topic_progress')
      .upsert(updateData, { 
        onConflict: 'user_id,topic_id',
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      console.error('Error batch updating topic progress:', error);
      throw new Error(`Failed to batch update progress: ${error.message}`);
    }

    return data || [];

  } catch (error) {
    console.error('Error in batchUpdateTopicProgress:', error);
    throw error;
  }
};