import React, { useEffect } from 'react';
import { CheckSquare, Square } from 'phosphor-react';
import { Card, CardHeader, CardTitle, CardContent } from '../layout/ui/card';
import ProgressBar from '../layout/ui/progress-bar';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { selectTasks, selectCompletedTasksCount } from '../../../store/slices/dashboard/dashboardSlice';
import { fetchTodayChecklist } from '../../../store/slices/dashboard/dashboardThunks';
import { ChecklistService } from '../../../features/dashboard/services/checklistService';

const ChecklistCard: React.FC = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasks);
  const completedCount = useAppSelector(selectCompletedTasksCount);

  // Fetch today's checklist on mount
  useEffect(() => {
    dispatch(fetchTodayChecklist());
  }, [dispatch]);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = ChecklistService.subscribeToChecklistUpdates(() => {
      // Refresh checklist when updates occur
      dispatch(fetchTodayChecklist());
    });

    return () => {
      channel.unsubscribe();
    };
  }, [dispatch]);

  // Removed handleTaskToggle - users can't manually check items

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Checklist</CardTitle>
      </CardHeader>
      
      <CardContent>
        <ProgressBar 
          value={completedCount} 
          max={tasks.length} 
          label="Progress" 
          showPercentage 
          className="mb-6" 
        />
        
        <div className="space-y-3">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className="flex items-center gap-3 p-2 rounded-lg bg-gray-50"
            >
              {task.completed ? (
                <CheckSquare size={18} className="text-green-500 flex-shrink-0" />
              ) : (
                <Square size={18} className="text-gray-400 flex-shrink-0" />
              )}
              <span className={`text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                {task.text}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Complete practice sessions to check off items
        </p>
      </CardContent>
    </Card>
  );
};

export default ChecklistCard;