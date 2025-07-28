import React, { useMemo, useState } from 'react';
import GitHubCalendar from 'react-github-calendar';
import { Card, CardHeader, CardTitle, CardContent } from '../layout/ui/card';
import { PracticeStreak, PracticeActivity } from '../../../store/slices/dashboard/types';
import { Fire } from 'phosphor-react';

interface GitHubCardProps {
  testDate: Date;
  completedDays: Date[];
  practiceActivities?: PracticeActivity[];
  practiceStreak?: PracticeStreak | null;
}

const GitHubCard: React.FC<GitHubCardProps> = ({ 
  testDate,
  completedDays,
  practiceActivities = [],
  practiceStreak
}) => {
  const [tooltip, setTooltip] = useState<{ show: boolean; content: string; x: number; y: number }>({
    show: false,
    content: '',
    x: 0,
    y: 0
  });


  // Transform completedDays into the format expected by react-github-calendar
  const transformData = useMemo(() => (contributions: any[]) => {
    // Show last 5 months of data
    const fiveMonthsAgo = new Date();
    fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);
    
    // Create a map of date strings to practice activity data
    const activityMap = new Map<string, PracticeActivity>();
    practiceActivities.forEach(activity => {
      activityMap.set(activity.date, activity);
    });
    
    return contributions
      .filter(day => new Date(day.date) >= fiveMonthsAgo)
      .map(day => {
        const dateStr = day.date;
        
        // Get practice activity data for this date
        const activity = activityMap.get(dateStr);
        const count = activity ? activity.tasksCompleted : 0;
        
        return {
          ...day,
          count: count,
          level: count > 0 ? Math.min(Math.ceil(count / 3 * 4), 4) : 0 // Scale 0-3 tasks to 0-4 levels
        };
      });
  }, [practiceActivities]);

  // Create CSS styles for legend
  const legendStyles = useMemo(() => {
    return `
      .github-card .react-activity-calendar__legend {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
        font-size: 11px;
      }
    `;
  }, []);

  return (
    <Card className="github-card">
      <style>{legendStyles}</style>
      
      <CardHeader>
        <CardTitle>Practice Activity</CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Custom Legend */}
        <div className="mb-4 flex items-center justify-between gap-4 text-xs text-gray-600 flex-wrap">
          <div className="flex items-center gap-4">
            {practiceStreak && practiceStreak.current > 0 && (
              <div className="flex items-center gap-1 text-orange-600">
                <Fire size={14} weight="fill" />
                <span className="font-medium">{practiceStreak.current} day streak</span>
              </div>
            )}
          </div>
          {practiceStreak && (
            <div className="text-right">
              <span className="text-gray-500">Total days: </span>
              <span className="font-medium">{practiceStreak.totalDays}</span>
            </div>
          )}
        </div>
        
        {/* GitHub Calendar */}
        <div className="overflow-x-auto flex justify-center" style={{ scrollbarWidth: 'thin' }}>
          <style>{`
            .github-card .overflow-x-auto::-webkit-scrollbar {
              height: 4px;
            }
            .github-card .overflow-x-auto::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 2px;
            }
            .github-card .overflow-x-auto::-webkit-scrollbar-thumb {
              background: #c1c1c1;
              border-radius: 2px;
            }
            .github-card .overflow-x-auto::-webkit-scrollbar-thumb:hover {
              background: #a8a8a8;
            }
          `}</style>
          <div className="min-w-fit flex justify-center">
            <GitHubCalendar
                username="any-username" // This won't be used due to transformData
                transformData={transformData}
                theme={{
                  light: ['#ebedf0', '#ffd7b3', '#ffb366', '#ff8f1a', '#ff6b00']
                }}
                colorScheme="light"
                fontSize={8}
                blockSize={10}
                blockMargin={3}
                hideColorLegend={false}
                hideTotalCount={true}
                hideMonthLabels={false}
                showWeekdayLabels={true}
                loading={false}
                labels={{
                  totalCount: '{{count}} activities in {{year}}',
                  legend: {
                    less: 'Less',
                    more: 'More'
                  }
                }}
                renderBlock={(block, activity) => {
                  const date = new Date(activity.date);
                  const dateStr = date.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  });
                  const count = activity.count || 0;
                  const tooltipText = count > 0 
                    ? `${count} ${count === 1 ? 'activity' : 'activities'} on ${dateStr}`
                    : `No activity on ${dateStr}`;
                  
                  return React.cloneElement(block, {
                    onMouseEnter: (event: React.MouseEvent) => {
                      const rect = event.currentTarget.getBoundingClientRect();
                      setTooltip({
                        show: true,
                        content: tooltipText,
                        x: rect.left + rect.width / 2,
                        y: rect.top
                      });
                    },
                    onMouseLeave: () => {
                      setTooltip(prev => ({ ...prev, show: false }));
                    }
                  });
                }}
              />
          </div>
        </div>
      </CardContent>
      
      {/* Custom Tooltip */}
      {tooltip.show && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y - 35,
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '6px 10px',
            borderRadius: '4px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 1000,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          {tooltip.content}
          <div
            style={{
              position: 'absolute',
              bottom: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '4px solid rgba(0, 0, 0, 0.8)'
            }}
          />
        </div>
      )}
    </Card>
  );
};

export default GitHubCard;