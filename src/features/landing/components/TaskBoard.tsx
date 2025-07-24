
import React, { useState, useEffect } from 'react';
import { useToast } from "../hooks/use-toast";
import TaskColumn, { Column } from './TaskColumn';
import { Task } from './TaskCard';

// Initial data for the task board
const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    color: 'muted',
    tasks: [
      {
        id: 't1',
        title: 'Update landing page hero section',
        description: 'Review new design mockups and update copy',
        tag: { color: 'purple', label: 'Design' },
        dueDate: 'May 20',
        assignees: 2,
        progress: { completed: 3, total: 5 }
      },
      {
        id: 't2',
        title: 'Social media campaign planning',
        description: 'Outline Q2 campaign goals and content calendar',
        tag: { color: 'accent', label: 'Marketing' },
        dueDate: 'May 22',
        assignees: 1,
        progress: { completed: 0, total: 4 }
      },
      {
        id: 't3',
        title: 'Set up automated testing',
        description: 'Configure CI/CD pipeline for test automation',
        tag: { color: 'blue', label: 'Development' },
        dueDate: 'May 24',
        assignees: 2,
        progress: { completed: 0, total: 6 }
      },
      {
        id: 't4',
        title: 'Create brand style guide',
        description: 'Document colors, typography, and UI components',
        tag: { color: 'purple', label: 'Design' },
        dueDate: 'May 25',
        assignees: 1,
        progress: { completed: 0, total: 3 }
      }
    ]
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: 'blue',
    tasks: [
      {
        id: 't5',
        title: 'API integration with payment gateway',
        description: 'Connect payment processor and test transactions',
        tag: { color: 'blue', label: 'Development' },
        dueDate: 'May 18',
        assignees: 1,
        progress: { completed: 2, total: 3 }
      },
      {
        id: 't6',
        title: 'SEO optimization',
        description: 'Improve meta descriptions and keywords across site',
        tag: { color: 'accent', label: 'Marketing' },
        dueDate: 'May 19',
        assignees: 2,
        progress: { completed: 5, total: 8 }
      },
      {
        id: 't7',
        title: 'Mobile responsive design',
        description: 'Optimize UI for tablets and mobile devices',
        tag: { color: 'purple', label: 'Design' },
        dueDate: 'May 17',
        assignees: 1,
        progress: { completed: 3, total: 4 }
      }
    ]
  },
  {
    id: 'in-review',
    title: 'In Review',
    color: 'amber',
    tasks: [
      {
        id: 't8',
        title: 'Email newsletter content',
        description: 'Review draft and provide feedback',
        tag: { color: 'accent', label: 'Marketing' },
        dueDate: 'May 15',
        assignees: 1,
        progress: { completed: 4, total: 5 }
      },
      {
        id: 't9',
        title: 'User authentication system',
        description: 'Code review for login and registration flows',
        tag: { color: 'blue', label: 'Development' },
        dueDate: 'May 16',
        assignees: 2,
        progress: { completed: 6, total: 6 }
      },
      {
        id: 't10',
        title: 'Icon set redesign',
        description: 'Review updated icon set for consistent branding',
        tag: { color: 'purple', label: 'Design' },
        dueDate: 'May 14',
        assignees: 1,
        progress: { completed: 12, total: 12 }
      }
    ]
  },
  {
    id: 'completed',
    title: 'Completed',
    color: 'accent',
    tasks: [
      {
        id: 't11',
        title: 'Create user flow diagrams',
        description: 'Document onboarding process for new users',
        tag: { color: 'purple', label: 'Design' },
        dueDate: 'May 10',
        assignees: 1,
        progress: { completed: 5, total: 5 }
      },
      {
        id: 't12',
        title: 'Setup analytics tracking',
        description: 'Implement event tracking across main user flows',
        tag: { color: 'blue', label: 'Development' },
        dueDate: 'May 9',
        assignees: 1,
        progress: { completed: 4, total: 4 }
      },
      {
        id: 't13',
        title: 'Competitive analysis report',
        description: 'Research competitors and document findings',
        tag: { color: 'accent', label: 'Marketing' },
        dueDate: 'May 8',
        assignees: 2,
        progress: { completed: 7, total: 7 }
      }
    ]
  }
];

interface TaskBoardProps {
  className?: string;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ className }) => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragSourceColumn, setDragSourceColumn] = useState<string | null>(null);
  const { toast } = useToast();

  const handleTaskDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('taskId', task.id);
    setDraggedTask(task);
    
    // Find source column
    const sourceColumn = columns.find(col => 
      col.tasks.some(t => t.id === task.id)
    );
    
    if (sourceColumn) {
      setDragSourceColumn(sourceColumn.id);
      e.dataTransfer.setData('sourceColumnId', sourceColumn.id);
    }
  };

  const handleTaskDragEnd = () => {
    setDraggedTask(null);
    setDragSourceColumn(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Handle drag leave logic if needed
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    
    const taskId = e.dataTransfer.getData('taskId');
    const sourceColumnId = e.dataTransfer.getData('sourceColumnId');
    
    if (!taskId || !sourceColumnId || sourceColumnId === targetColumnId) {
      return;
    }
    
    // Update columns state
    const newColumns = columns.map(column => {
      // Remove task from source column
      if (column.id === sourceColumnId) {
        return {
          ...column,
          tasks: column.tasks.filter(task => task.id !== taskId)
        };
      }
      
      // Add task to target column
      if (column.id === targetColumnId) {
        const taskToMove = columns.find(col => col.id === sourceColumnId)?.tasks.find(task => task.id === taskId);
        if (taskToMove) {
          return {
            ...column,
            tasks: [...column.tasks, taskToMove]
          };
        }
      }
      
      return column;
    });
    
    setColumns(newColumns);
    
    // Show a toast notification
    const targetColumn = columns.find(col => col.id === targetColumnId);
    if (targetColumn && draggedTask) {
      toast({
        title: "Task moved",
        description: `${draggedTask.title} moved to ${targetColumn.title}`,
      });
    }
  };

  const handleStatusChange = (taskId: string, newStatus: string) => {
    // This function can be used for programmatic status changes (not used in this implementation)
  };

  return (
    <div className={`flex gap-4 overflow-x-auto pb-4 ${className}`}>
      {columns.map(column => (
        <TaskColumn
          key={column.id}
          column={column}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onTaskDragStart={handleTaskDragStart}
          onTaskDragEnd={handleTaskDragEnd}
          onStatusChange={handleStatusChange}
        />
      ))}
    </div>
  );
};

export default TaskBoard;
