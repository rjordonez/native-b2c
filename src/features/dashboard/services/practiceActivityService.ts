import { supabase } from '../../../shared/services/supabase';

export interface PracticeActivityDay {
  practice_date: string;
  tasks_completed: number;
  total_tasks: number;
}

export interface PracticeStreak {
  current_streak: number;
  longest_streak: number;
  total_practice_days: number;
  last_practice_date: string | null;
}

export interface WeeklySummary {
  week_start: string;
  practice_days: number;
  total_tasks_completed: number;
}

export interface HeatmapData {
  practice_date: string;
  intensity: number; // 0-3 scale
}

export class PracticeActivityService {
  /**
   * Get practice activity for a date range
   */
  static async getPracticeActivity(
    startDate?: Date,
    endDate?: Date
  ): Promise<PracticeActivityDay[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase.rpc('get_practice_activity', {
      p_user_id: user.user.id,
      p_start_date: startDate?.toISOString().split('T')[0],
      p_end_date: endDate?.toISOString().split('T')[0]
    });

    if (error) {
      console.error('Error fetching practice activity:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get practice streak information
   */
  static async getPracticeStreak(): Promise<PracticeStreak> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase.rpc('get_practice_streak', {
      p_user_id: user.user.id
    });

    if (error) {
      console.error('Error fetching practice streak:', error);
      throw error;
    }

    return data?.[0] || {
      current_streak: 0,
      longest_streak: 0,
      total_practice_days: 0,
      last_practice_date: null
    };
  }

  /**
   * Get weekly practice summary
   */
  static async getWeeklySummary(weeksBack: number = 12): Promise<WeeklySummary[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase.rpc('get_weekly_practice_summary', {
      p_user_id: user.user.id,
      p_weeks_back: weeksBack
    });

    if (error) {
      console.error('Error fetching weekly summary:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get practice heatmap data
   */
  static async getPracticeHeatmap(monthsBack: number = 12): Promise<HeatmapData[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase.rpc('get_practice_heatmap', {
      p_user_id: user.user.id,
      p_months_back: monthsBack
    });

    if (error) {
      console.error('Error fetching heatmap data:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Convert practice activity to calendar format
   */
  static formatForCalendar(activities: PracticeActivityDay[]): Date[] {
    return activities
      .filter(day => day.tasks_completed > 0)
      .map(day => new Date(day.practice_date));
  }
}