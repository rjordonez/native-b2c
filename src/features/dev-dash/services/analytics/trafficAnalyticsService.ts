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

    // Build the query based on time period
    let query = supabase
      .from('user_profiles')
      .select('id, created_at, email')
      .order('created_at', { ascending: true });
    
    // Only add date filter if not "all time"
    if (startDate) {
      query = query.gte('created_at', startDate.toISOString());
    }

    const { data: users, error } = await query;

    if (error) throw error;

    // Sources - you can add more sources here
    const trafficSources: TrafficSource[] = [
      {
        source: 'threads',
        medium: 'social',
        campaign: 'productlaunch',
        visits: 0,
        conversions: users?.length || 0,
        conversionRate: 0
      }
    ];

    // Calculate conversion rate
    const estimatedVisits = (users?.length || 0) * 3;
    trafficSources[0].visits = estimatedVisits;
    trafficSources[0].conversionRate = estimatedVisits > 0 ? 
      ((users?.length || 0) / estimatedVisits) * 100 : 0;

    // Generate daily traffic data
    const dailyTraffic: DailyTraffic[] = [];
    const totalVisits = trafficSources.reduce((sum, source) => sum + source.visits, 0);
    const totalConversions = trafficSources.reduce((sum, source) => sum + source.conversions, 0);
    
    // Group users by registration date
    const usersByDate: { [key: string]: number } = {};
    users?.forEach(user => {
      const date = new Date(user.created_at).toISOString().split('T')[0];
      usersByDate[date] = (usersByDate[date] || 0) + 1;
    });

    // Generate daily data using daysToShow from utility function
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dailyConversions = usersByDate[dateStr] || 0;
      const dailyVisits = dailyConversions * 3;
      
      dailyTraffic.push({
        date: dateStr,
        visits: dailyVisits,
        conversions: dailyConversions,
        conversionRate: dailyVisits > 0 ? (dailyConversions / dailyVisits) * 100 : 0
      });
    }
    
    return {
      totalVisits,
      totalConversions,
      overallConversionRate: totalVisits > 0 ? (totalConversions / totalVisits) * 100 : 0,
      sources: trafficSources,
      dailyTraffic,
      timePeriod
    };
  },

  async getTrafficBySource(source: string, medium: string, campaign: string, timePeriod: TimePeriod = '30d'): Promise<TrafficSource> {
    const { startDate } = getDateRange(timePeriod);
    
    // Build query
    let query = supabase
      .from('user_profiles')
      .select('id, created_at')
      .order('created_at', { ascending: false });
    
    if (startDate) {
      query = query.gte('created_at', startDate.toISOString());
    }
    
    const { data: users, error } = await query;
    
    if (error) throw error;
    
    const conversions = users?.length || 0;
    const visits = conversions * 3;
    
    return {
      source,
      medium,
      campaign,
      visits,
      conversions,
      conversionRate: visits > 0 ? (conversions / visits) * 100 : 0
    };
  }
};