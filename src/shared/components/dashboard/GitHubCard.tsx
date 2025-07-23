import React, { useMemo } from 'react';
import GitHubCalendar from 'react-github-calendar';
import { Card, CardHeader, CardTitle, CardContent } from '../layout/ui/card';

interface GitHubCardProps {
  testDate: Date;
  completedDays: Date[]; 
}

const GitHubCard: React.FC<GitHubCardProps> = ({ 
  testDate,
  completedDays
}) => {
  // Calculate days left using useMemo for performance
  const daysLeft = useMemo(() => {
    const today = new Date();
    return Math.max(0, Math.ceil((testDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  }, [testDate]);

  // Transform completedDays into the format expected by react-github-calendar
  const transformData = useMemo(() => (contributions: any[]) => {
    // Filter to show only last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    return contributions
      .filter(day => new Date(day.date) >= sixMonthsAgo)
      .map(day => {
        const dateStr = day.date;
        const testDateStr = testDate.toISOString().split('T')[0];
        
        // Check if this is the test date
        const isTestDate = testDateStr === dateStr;
        
        if (isTestDate) {
          return {
            ...day,
            count: 4, // Max level for test date highlighting
            level: 4
          };
        }
        
        // Count activities for this date
        const activityCount = completedDays.filter(cd => {
          const cdStr = cd.toISOString().split('T')[0];
          return cdStr === dateStr;
        }).length;
        
        return {
          ...day,
          count: activityCount,
          level: Math.min(activityCount, 4)
        };
      });
  }, [testDate, completedDays]);

  // Create CSS styles for test date highlighting
  const testDateStyles = useMemo(() => {
    const testDateStr = testDate.toISOString().split('T')[0];
    return `
      .react-activity-calendar rect[data-date="${testDateStr}"] {
        fill: #ffd700 !important;
        stroke: #ffb700 !important;
        stroke-width: 2px !important;
      }
      .github-card .react-activity-calendar__legend {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
        font-size: 11px;
      }
      .test-date-indicator {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        margin-right: 0.5rem;
      }
      .test-date-box {
        width: 10px;
        height: 10px;
        background: #ffd700;
        border: 1px solid #ffb700;
        border-radius: 2px;
      }
    `;
  }, [testDate]);

  return (
    <Card className="github-card">
      <style>{testDateStyles}</style>
      
      <CardHeader>
        <CardTitle>Practice Activity</CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Custom Legend */}
        <div className="mb-4 flex items-center gap-4 text-xs text-gray-600 flex-wrap">
          <div className="test-date-indicator">
            <span>Test date:</span>
            <div className="test-date-box"></div>
            <span className="font-medium">{daysLeft} days left</span>
          </div>
        </div>
        
        {/* GitHub Calendar */}
        <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
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
          <div className="min-w-fit">
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
              loading={false}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GitHubCard;