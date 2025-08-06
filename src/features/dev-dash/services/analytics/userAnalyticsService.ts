import { supabase } from '../../../../shared/services/supabase';

// User Analytics Service
export const userAnalyticsService = {
  async getTotalUsers() {
    const { count, error } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return count || 0;
  },

  async getUsersCreatedToday() {
    const today = new Date().toISOString().split('T')[0];
    const { count, error } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`);
    
    if (error) throw error;
    return count || 0;
  },

  async getUsersCreatedThisWeek() {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const { count, error } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgo.toISOString());
    
    if (error) throw error;
    return count || 0;
  },

  async getUsersCreatedThisMonth() {
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    
    const { count, error } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', monthAgo.toISOString());
    
    if (error) throw error;
    return count || 0;
  },

  async getUserGrowthData(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    // Group by date and count users
    const growthData: { [key: string]: number } = {};
    data?.forEach(user => {
      const date = new Date(user.created_at).toISOString().split('T')[0];
      growthData[date] = (growthData[date] || 0) + 1;
    });
    
    return Object.entries(growthData).map(([date, count]) => ({
      date,
      count,
      cumulative: 0 // Will be calculated in the component
    }));
  },

  async getAllUserDetails() {
    
    // Use a more efficient approach: get all users and their conversation counts separately
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('id, email, full_name, username, created_at, country, target_band_score, current_level, auth_user_id')
      .order('created_at', { ascending: false });
    
    
    if (usersError) {
      throw usersError;
    }
    if (!users || users.length === 0) {
      return [];
    }

    // Extract auth_user_ids from users for batching
    const authUserIds = users.map(user => user.auth_user_id);

    // Get ALL conversations without limit by fetching in batches
    const countsByUser: { [key: string]: number } = {};
    
    // Fetch conversations in smaller batches to avoid limits
    const batchSize = 20; // Process 20 users at a time
    for (let i = 0; i < authUserIds.length; i += batchSize) {
      const batchUserIds = authUserIds.slice(i, i + batchSize);
      
      // For each batch of users, get their conversations
      const { data: batchConversations, error: batchError } = await supabase
        .from('conversations')
        .select('user_id')
        .in('user_id', batchUserIds);
      
      if (batchError) {
        continue; // Skip this batch but continue with others
      }
      
      
      // Count conversations for this batch
      batchConversations?.forEach(conv => {
        countsByUser[conv.user_id] = (countsByUser[conv.user_id] || 0) + 1;
      });
    }
    
    
    // Combine user data with conversation counts and remove auth_user_id from response
    const usersWithCounts = users.map(user => {
      const { auth_user_id, ...userWithoutAuthId } = user;
      const conversationCount = countsByUser[auth_user_id] || 0;
      
      return {
        ...userWithoutAuthId,
        conversationCount
      };
    });

    
    return usersWithCounts;
  },
};