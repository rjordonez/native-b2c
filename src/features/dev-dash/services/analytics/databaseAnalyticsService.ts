import { supabase } from '../../../../shared/services/supabase';

// Database Analytics Service
export const databaseAnalyticsService = {
  async getDatabaseMetrics() {
    // Get total topics
    const { count: topicsCount, error: topicsError } = await supabase
      .from('topics')
      .select('*', { count: 'exact', head: true });
    
    if (topicsError) throw topicsError;

    // Get total progress records
    const { count: progressCount, error: progressError } = await supabase
      .from('user_topic_progress')
      .select('*', { count: 'exact', head: true });
    
    if (progressError) throw progressError;

    // Get completion rate
    const { count: completedCount, error: completedError } = await supabase
      .from('user_topic_progress')
      .select('*', { count: 'exact', head: true })
      .eq('completed', true);
    
    if (completedError) throw completedError;

    const avgCompletionRate = progressCount ? ((completedCount || 0) / progressCount) * 100 : 0;

    return {
      totalTopics: topicsCount || 0,
      totalProgress: progressCount || 0,
      avgCompletionRate: Math.round(avgCompletionRate * 100) / 100,
    };
  },

  async getPracticeSessionData(days: number = 14) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Get practice sessions from user_topic_progress table
    const { data, error } = await supabase
      .from('user_topic_progress')
      .select('updated_at, completed')
      .gte('updated_at', startDate.toISOString())
      .order('updated_at', { ascending: true });
    
    if (error) throw error;
    
    // Group by date and count sessions/completions
    const sessionData: { [key: string]: { sessions: number; completions: number } } = {};
    
    data?.forEach(session => {
      const date = new Date(session.updated_at).toISOString().split('T')[0];
      if (!sessionData[date]) {
        sessionData[date] = { sessions: 0, completions: 0 };
      }
      sessionData[date].sessions += 1;
      if (session.completed) {
        sessionData[date].completions += 1;
      }
    });
    
    // Fill in missing dates with 0 values
    const result = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      const dateStr = date.toISOString().split('T')[0];
      
      result.push({
        date: dateStr,
        sessions: sessionData[dateStr]?.sessions || 0,
        completions: sessionData[dateStr]?.completions || 0,
      });
    }
    
    return result;
  },

  async getTopicAnalytics() {
    // Get topic practice counts
    const { data, error } = await supabase
      .from('user_topic_progress')
      .select(`
        topic_id,
        topics(title)
      `)
      .not('topics', 'is', null);
    
    if (error) throw error;
    
    // Count sessions per topic
    const topicCounts: { [key: string]: number } = {};
    data?.forEach(session => {
      const topicTitle = (session.topics as any)?.title || 'Unknown Topic';
      topicCounts[topicTitle] = (topicCounts[topicTitle] || 0) + 1;
    });
    
    // Convert to array and sort by count
    const topicData = Object.entries(topicCounts)
      .map(([topic, sessions]) => ({ topic, sessions }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 6); // Top 6 topics
    
    // Add colors for pie chart
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316'];
    return topicData.map((item, index) => ({
      ...item,
      color: colors[index % colors.length]
    }));
  },
};