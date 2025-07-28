import React, { useEffect, useState } from 'react';
import { Check, CaretRight, Shuffle } from 'phosphor-react';
import { Card, CardHeader, CardTitle, CardContent } from '../layout/ui/card';
import ProgressBar from '../layout/ui/progress-bar';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { selectTasks, selectCompletedTasksCount } from '../../../store/slices/dashboard/dashboardSlice';
import { fetchTodayChecklist } from '../../../store/slices/dashboard/dashboardThunks';
import { ChecklistService } from '../../../features/dashboard/services/checklistService';
import { TopicService } from '../../../features/dashboard/services/topicService';
import { useTopicPractice } from '../../hooks/useTopicPractice';

const ChecklistCard: React.FC = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasks);
  const completedCount = useAppSelector(selectCompletedTasksCount);
  const [hoveredTaskId, setHoveredTaskId] = useState<number | null>(null);
  const { startPractice } = useTopicPractice();

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

  const handlePracticeClick = async (taskId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // Map task ID to part
    const partMap: { [key: number]: string } = {
      1: 'part1',
      2: 'part2',
      3: 'part3'
    };
    
    const part = partMap[taskId];
    if (!part) return;

    // Get a random topic for this part
    const randomTopic = await TopicService.getRandomTopicForPart(part);
    if (randomTopic) {
      startPractice(randomTopic.title);
    } else if (part === 'part2') {
      // Part 2 doesn't have topics in database yet
      alert('Part 2 practice topics are coming soon!');
    }
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
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group cursor-pointer"
              onMouseEnter={() => setHoveredTaskId(task.id)}
              onMouseLeave={() => setHoveredTaskId(null)}
              onClick={() => handlePracticeClick(task.id)}
            >
              <div className="flex items-center gap-3">
                {/* Circle with number or checkmark */}
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                  ${task.completed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white border-2 border-gray-300 text-gray-600'
                  }
                `}>
                  {task.completed ? (
                    <Check size={16} weight="bold" />
                  ) : (
                    task.id
                  )}
                </div>
                
                {/* Task text */}
                <span className={`text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                  {task.text}
                </span>
              </div>

              {/* Navigation arrow with randomize icon */}
              <div
                className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Random practice"
              >
                {hoveredTaskId === task.id && (
                  <Shuffle size={16} className="animate-fade-in" />
                )}
                <CaretRight size={20} />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Complete practice sessions to check off items • Click any task for random practice
        </p>
      </CardContent>
    </Card>
  );
};

export default ChecklistCard;