
import React, { useState, useRef } from 'react';

export interface Task {
  id: string;
  title: string;
  description: string;
  tag: {
    color: string;
    label: string;
  };
  dueDate: string;
  assignees: number;
  progress: {
    completed: number;
    total: number;
  };
}

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragEnd: () => void;
  onStatusChange: (taskId: string, newStatus: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart, onDragEnd, onStatusChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    
    // Add ghost image effect
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const ghostImage = cardRef.current.cloneNode(true) as HTMLDivElement;
      ghostImage.style.position = 'absolute';
      ghostImage.style.top = '-1000px';
      ghostImage.style.opacity = '0.8';
      document.body.appendChild(ghostImage);
      e.dataTransfer.setDragImage(ghostImage, rect.width / 2, rect.height / 2);
      
      // Clean up the ghost element after drag
      setTimeout(() => {
        document.body.removeChild(ghostImage);
      }, 0);
    }
    
    onDragStart(e, task);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd();
  };
  
  // Generate tag background class using only grey/white colors
  const getTagClass = () => {
    return 'bg-muted/50 text-muted-foreground border border-border';
  };

  return (
    <div
      ref={cardRef}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`task-card p-4 bg-card rounded-md border border-border shadow-sm hover:shadow-md transition-all duration-200 h-44 flex flex-col ${isDragging ? 'dragging' : ''}`}
    >
      {/* Header with tag and due date */}
      <div className="flex justify-between items-start mb-3 flex-shrink-0">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getTagClass()}`}>
          {task.tag.label}
        </span>
        <span className="text-muted-foreground text-xs">{task.dueDate}</span>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Title and description */}
        <div className="flex-1 mb-3">
          <h5 className="font-medium mb-2 text-foreground text-sm leading-tight line-clamp-2">{task.title}</h5>
          <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{task.description}</p>
        </div>
        
        {/* Footer with assignees and progress */}
        <div className="flex justify-between items-center flex-shrink-0 mt-auto">
          <div className="flex -space-x-1">
            {[...Array(task.assignees)].map((_, i) => (
              <div 
                key={i}
                className="h-6 w-6 rounded-full bg-muted border-2 border-card"
                style={{
                  backgroundColor: `hsl(var(--muted) / ${0.8 - i * 0.1})`
                }}
              ></div>
            ))}
          </div>
          
          {task.progress.completed === task.progress.total ? (
            <span className="flex items-center gap-1 text-accent text-xs font-medium">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12L10 17L19 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {task.progress.completed}/{task.progress.total}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-muted-foreground text-xs">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 12H16M8 16H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {task.progress.completed}/{task.progress.total}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
