import React from 'react';
import { CheckSquare, Square } from 'phosphor-react';
import { Card, CardHeader, CardTitle, CardContent } from '../layout/ui/card';
import ProgressBar from '../layout/ui/progress-bar';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { selectTasks, selectCompletedTasksCount, toggleTask } from '../../../store/slices/dashboard/dashboardSlice';

const ChecklistCard: React.FC = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasks);
  const completedCount = useAppSelector(selectCompletedTasksCount);

  const handleTaskToggle = (taskId: number) => {
    dispatch(toggleTask(taskId));
  };

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
              className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleTaskToggle(task.id)}
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
      </CardContent>
    </Card>
  );
};

export default ChecklistCard;