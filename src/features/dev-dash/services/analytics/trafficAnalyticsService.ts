import { supabase } from '../../../../shared/services/supabase';
import { TrafficData, TrafficSource, DailyTraffic, TimePeriod } from '../../types';

// Utility function to calculate date range based on time period
const getDateRange = (timePeriod: TimePeriod) => {
  let startDate: Date | null = null;
  let daysToShow = 30; // Default

  switch (timePeriod) {
    case 'all':
      startDate = null; // No start date = all time
      daysToShow = 90;
      break;
    case '30d':
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      daysToShow = 30;
      break;
    case '7d':
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      daysToShow = 7;
      break;
    case '1d':
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 1);
      daysToShow = 1;
      break;
  }

  return { startDate, daysToShow };
};

// Traffic Analytics Service
export const trafficAnalyticsService = {
  async getTrafficData(timePeriod: TimePeriod = '30d'): Promise<TrafficData> {
    const { startDate, daysToShow } = getDateRange(timePeriod);

    // Build the query to get users with UTM data
    let query = supabase
      .from('user_profiles')
      .select('id, created_at, utm_source, utm_medium, utm_campaign, utm_content, utm_term')
      .order('created_at', { ascending: true });
    
    // Only add date filter if not "all time"
    if (startDate) {
      query = query.gte('created_at', startDate.toISOString());
    }

    const { data: users, error } = await query;

    if (error) throw error;

    // Group users by UTM source, medium, and campaign
    const sourceGroups: { [key: string]: TrafficSource } = {};
    let directTraffic = 0;
    
    users?.forEach(user => {
      const source = user.utm_source || 'direct';
      const medium = user.utm_medium || 'none';
      const campaign = user.utm_campaign || 'none';
      
      const key = `${source}-${medium}-${campaign}`;
      
      if (source === 'direct') {
        directTraffic++;
        return;
      }
      
      if (!sourceGroups[key]) {
        sourceGroups[key] = {
          source,
          medium,
          campaign,
          signups: 0
        };
      }
      
      sourceGroups[key].signups++;
    });

    // Convert to array - no fake calculations
    const trafficSources: TrafficSource[] = Object.values(sourceGroups);

    // Add direct traffic as a source if we have any
    if (directTraffic > 0) {
      trafficSources.push({
        source: 'direct',
        medium: 'none',
        campaign: 'none',
        signups: directTraffic
      });
    }

    // Generate daily traffic data with UTM source breakdown
    const dailyTraffic: DailyTraffic[] = [];
    const totalSignups = trafficSources.reduce((sum, source) => sum + source.signups, 0);
    
    // Group users by registration date AND UTM source
    const usersByDateAndSource: { [key: string]: { [key: string]: number } } = {};
    users?.forEach(user => {
      const date = new Date(user.created_at).toISOString().split('T')[0];
      const source = user.utm_source || 'direct';
      
      if (!usersByDateAndSource[date]) {
        usersByDateAndSource[date] = {};
      }
      
      usersByDateAndSource[date][source] = (usersByDateAndSource[date][source] || 0) + 1;
    });

    // Generate daily data using daysToShow from utility function
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const sourcesForDay = usersByDateAndSource[dateStr] || {};
      const dailySignups = Object.values(sourcesForDay).reduce((sum, count) => sum + count, 0);
      
      dailyTraffic.push({
        date: dateStr,
        signups: dailySignups,
        sources: sourcesForDay
      });
    }
    
    return {
      totalSignups,
      sources: trafficSources,
      dailyTraffic,
      timePeriod
    };
  },

  async getTrafficBySource(source: string, medium: string, campaign: string, timePeriod: TimePeriod = '30d'): Promise<TrafficSource> {
    const { startDate } = getDateRange(timePeriod);
    
    // Build query to filter by specific UTM parameters
    let query = supabase
      .from('user_profiles')
      .select('id, created_at')
      .eq('utm_source', source)
      .eq('utm_medium', medium)
      .eq('utm_campaign', campaign)
      .order('created_at', { ascending: false });
    
    if (startDate) {
      query = query.gte('created_at', startDate.toISOString());
    }
    
    const { data: users, error } = await query;
    
    if (error) throw error;
    
    const signups = users?.length || 0;
    
    return {
      source,
      medium,
      campaign,
      signups
    };
  }
};