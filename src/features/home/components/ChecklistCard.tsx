import React from 'react';
import { CheckSquare, Square } from 'phosphor-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/layout/ui/card';
import ProgressBar from '../../../shared/components/layout/ui/progress-bar';

const ChecklistCard: React.FC = () => {
  const tasks = [
    { id: 1, text: 'Complete Reading Practice Test', completed: true },
    { id: 2, text: 'Review vocabulary flashcards', completed: false },
    { id: 3, text: 'Practice speaking with partner', completed: false },
  ];

  const completedCount = tasks.filter(task => task.completed).length;

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
            <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
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