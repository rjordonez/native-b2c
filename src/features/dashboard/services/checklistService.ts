import { supabase } from '../../../shared/services/supabase';
import type { DBDailyChecklistProgress, DBChecklistSummary } from '../../../types/database';

export class ChecklistService {
  /**
   * Get or create today's checklist for the current user
   */
  static async getTodayChecklist(): Promise<DBDailyChecklistProgress[]> {
    const { data, error } = await supabase.rpc('get_or_create_daily_checklist', {
      p_user_id: (await supabase.auth.getUser()).data.user?.id
    });

    if (error) {
      console.error('Error fetching daily checklist:', error);
      throw error;
    }

    // Map the returned data to match our interface
    return (data || []).map((item: any) => ({
      id: item.checklist_id,
      user_id: item.checklist_user_id,
      task_id: item.checklist_task_id,
      task_name: item.checklist_task_name,
      completed: item.checklist_completed,
      completed_at: item.checklist_completed_at,
      date: item.checklist_date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
  }

  /**
   * Mark a specific task as completed
   * @param taskId - 1 for Part 1, 2 for Part 2, 3 for Part 3
   */
  static async completeTask(taskId: number): Promise<boolean> {
    const { data, error } = await supabase.rpc('complete_checklist_task', {
      p_user_id: (await supabase.auth.getUser()).data.user?.id,
      p_task_id: taskId
    });

    if (error) {
      console.error('Error completing checklist task:', error);
      throw error;
    }

    return data || false;
  }

  /**
   * Get checklist progress summary for today
   */
  static async getProgressSummary(): Promise<DBChecklistSummary> {
    const { data, error } = await supabase.rpc('get_checklist_progress', {
      p_user_id: (await supabase.auth.getUser()).data.user?.id
    });

    if (error) {
      console.error('Error fetching checklist progress:', error);
      throw error;
    }

    return data?.[0] || { total_tasks: 0, completed_tasks: 0, progress_percentage: 0 };
  }

  /**
   * Subscribe to real-time checklist updates
   */
  static subscribeToChecklistUpdates(
    callback: (payload: any) => void
  ) {
    return supabase
      .channel('checklist_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_checklist_progress',
          filter: `date=eq.${new Date().toISOString().split('T')[0]}`
        },
        callback
      )
      .subscribe();
  }

  /**
   * Map part name to task ID
   */
  static getTaskIdForPart(part: string): number | null {
    const partMatch = part.match(/Part\s*(\d+)/i);
    if (partMatch) {
      const partNumber = parseInt(partMatch[1]);
      if (partNumber >= 1 && partNumber <= 3) {
        return partNumber;
      }
    }
    return null;
  }
}