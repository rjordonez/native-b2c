import { supabase } from './supabase';
import { Database } from './database.types';

type Tables = Database['public']['Tables'];

// User Profile Service
export const userProfileService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Tables['user_profiles']['Update']) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async createProfile(profile: Tables['user_profiles']['Insert']) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profile)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};

// Topics Service
export const topicsService = {
  async getAllTopics() {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getTopicById(topicId: string) {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('id', topicId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getTopicsByCategory(category: string) {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
};

// User Topic Progress Service
export const userProgressService = {
  async getUserProgress(userId: string) {
    const { data, error } = await supabase
      .from('user_topic_progress')
      .select(`
        *,
        topics (*)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  },

  async updateProgress(
    userId: string, 
    topicId: string, 
    progress: number
  ) {
    const { data, error } = await supabase
      .from('user_topic_progress')
      .upsert({
        user_id: userId,
        topic_id: topicId,
        progress,
        completed: progress >= 100,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async toggleTopicCompletion(userId: string, topicId: string) {
    // First get current state
    const { data: current, error: fetchError } = await supabase
      .from('user_topic_progress')
      .select('completed')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
    
    const newCompleted = !current?.completed;
    
    const { data, error } = await supabase
      .from('user_topic_progress')
      .upsert({
        user_id: userId,
        topic_id: topicId,
        completed: newCompleted,
        progress: newCompleted ? 100 : 0,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};

// Real-time subscriptions
export const subscriptions = {
  subscribeToAuthChanges(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user || null);
    });
  },

  subscribeToUserProgress(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`user_progress:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_topic_progress',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },
};