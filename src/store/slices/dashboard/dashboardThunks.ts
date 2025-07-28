import { createAsyncThunk } from '@reduxjs/toolkit';
import { ChecklistService } from '../../../features/dashboard/services/checklistService';
import type { DBDailyChecklistProgress, DBChecklistSummary } from '../../../types/database';
import type { Task } from './types';

/**
 * Fetch today's checklist from database
 */
export const fetchTodayChecklist = createAsyncThunk<Task[]>(
  'dashboard/fetchTodayChecklist',
  async () => {
    const checklistData = await ChecklistService.getTodayChecklist();
    
    // Convert database format to Redux format
    return checklistData.map((item: DBDailyChecklistProgress) => ({
      id: item.task_id,
      text: item.task_name,
      completed: item.completed
    }));
  }
);

/**
 * Complete a checklist task
 */
export const completeChecklistTask = createAsyncThunk<
  { taskId: number; success: boolean },
  number
>(
  'dashboard/completeChecklistTask',
  async (taskId: number) => {
    const success = await ChecklistService.completeTask(taskId);
    return { taskId, success };
  }
);

/**
 * Fetch checklist progress summary
 */
export const fetchChecklistProgress = createAsyncThunk<DBChecklistSummary>(
  'dashboard/fetchChecklistProgress',
  async () => {
    return await ChecklistService.getProgressSummary();
  }
);

/**
 * Complete checklist task based on part name
 */
export const completeChecklistForPart = createAsyncThunk<
  { taskId: number; success: boolean } | null,
  string
>(
  'dashboard/completeChecklistForPart',
  async (partName: string) => {
    const taskId = ChecklistService.getTaskIdForPart(partName);
    
    if (taskId === null) {
      console.warn(`Could not determine task ID for part: ${partName}`);
      return null;
    }
    
    const success = await ChecklistService.completeTask(taskId);
    return { taskId, success };
  }
);