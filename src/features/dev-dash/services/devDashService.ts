import { supabase } from '../../../shared/services/supabase';

// Dev Dashboard Analytics Service
export const devDashService = {
  // User Analytics
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
    console.log('🔍 [getAllUserDetails] Starting to fetch user details with conversation counts...');
    
    // Use a more efficient approach: get all users and their conversation counts separately
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('id, email, full_name, username, created_at, country, target_band_score, current_level, auth_user_id')
      .order('created_at', { ascending: false });
    
    console.log('📊 [getAllUserDetails] Fetched users:', users?.length || 0, 'users');
    console.log('👤 [getAllUserDetails] Sample user data:', users?.[0]);
    
    if (usersError) {
      console.error('❌ [getAllUserDetails] Error fetching users:', usersError);
      throw usersError;
    }
    if (!users || users.length === 0) {
      console.log('⚠️ [getAllUserDetails] No users found');
      return [];
    }

    // Get conversation counts for all users at once
    const authUserIds = users.map(user => user.auth_user_id);
    console.log('🔑 [getAllUserDetails] Auth user IDs to check:', authUserIds);
    console.log('🔑 [getAllUserDetails] Auth user IDs with emails:');
    users.forEach(user => {
      console.log(`  - ${user.email}: auth_user_id = ${user.auth_user_id}`);
    });
    
    const { data: conversationCounts, error: countsError } = await supabase
      .from('conversations')
      .select('user_id')
      .in('user_id', authUserIds);
    
    console.log('💬 [getAllUserDetails] Fetched conversations:', conversationCounts?.length || 0, 'conversations');
    console.log('💬 [getAllUserDetails] Conversation data:', conversationCounts);
    
    // Debug: Let's also see ALL conversations in the table
    const { data: allConversations } = await supabase
      .from('conversations')
      .select('user_id, id')
      .limit(10);
    console.log('🔍 [getAllUserDetails] ALL conversations in table (sample):', allConversations);
    
    if (countsError) {
      console.error('❌ [getAllUserDetails] Error fetching conversations:', countsError);
      throw countsError;
    }

    // Count conversations per user
    const countsByUser: { [key: string]: number } = {};
    conversationCounts?.forEach(conv => {
      countsByUser[conv.user_id] = (countsByUser[conv.user_id] || 0) + 1;
    });
    
    console.log('📈 [getAllUserDetails] Conversation counts by user:', countsByUser);

    // Combine user data with conversation counts and remove auth_user_id from response
    const usersWithCounts = users.map(user => {
      const { auth_user_id, ...userWithoutAuthId } = user;
      const conversationCount = countsByUser[auth_user_id] || 0;
      console.log(`👤 [getAllUserDetails] User ${user.email}: ${conversationCount} conversations`);
      
      return {
        ...userWithoutAuthId,
        conversationCount
      };
    });

    console.log('✅ [getAllUserDetails] Final users with counts:', usersWithCounts.length, 'users');
    console.log('�� [getAllUserDetails] Sample final user:', usersWithCounts[0]);
    
    return usersWithCounts;
  },

  // Database Analytics
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

  // User Detail Modal Services
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