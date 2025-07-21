import React, { useEffect } from 'react';
import GitHubCalendar from 'react-github-calendar';

interface StreaksCardProps {
  testDate: Date;
  completedDays: Date[]; // Dates when user completed a streak
  frequency: number; // Number of days completed this month
}

const StreaksCard: React.FC<StreaksCardProps> = ({ 
  testDate,
  completedDays
}) => {
  // Calculate days left
  const today = new Date();
  const daysLeft = Math.max(0, Math.ceil((testDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Add test date customizations
  useEffect(() => {
    const testDateStr = testDate.toISOString().split('T')[0];
    
    const addCustomizations = () => {
      // Make test date gold
      const calendarCells = document.querySelectorAll('rect[data-date]');
      calendarCells.forEach((cell) => {
        if (cell.getAttribute('data-date') === testDateStr) {
          cell.setAttribute('fill', '#ffd700');
          cell.setAttribute('stroke', '#ffb700');
          cell.setAttribute('stroke-width', '2');
        }
      });
      
      // Add test date indicator to existing legend
      const legendColors = document.querySelector('.react-activity-calendar__legend-colors');
      if (legendColors && !legendColors.querySelector('.test-date-legend')) {
        // Create test date indicator elements
        const testDateLegend = document.createElement('div');
        testDateLegend.className = 'test-date-legend';
        testDateLegend.style.cssText = 'display: flex; align-items: center; margin-right: 0.4em;';
        
        const goldSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        goldSvg.setAttribute('width', '10');
        goldSvg.setAttribute('height', '10');
        
        const goldRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        goldRect.setAttribute('width', '10');
        goldRect.setAttribute('height', '10');
        goldRect.setAttribute('fill', '#ffd700');
        goldRect.setAttribute('rx', '2');
        goldRect.setAttribute('ry', '2');
        goldRect.setAttribute('style', 'stroke: #ffb700; stroke-width: 1px;');
        
        goldSvg.appendChild(goldRect);
        
        const testLabel = document.createElement('span');
        testLabel.textContent = 'Test date';
        testLabel.style.cssText = 'margin-right: 0.4em; margin-left: 0.3em;';
        
        const daysLabel = document.createElement('span');
        daysLabel.textContent = `${daysLeft} days left`;
        daysLabel.style.cssText = 'margin-right: 0.4em; margin-left: 0.8em;';
        
        testDateLegend.appendChild(testLabel);
        testDateLegend.appendChild(goldSvg);
        testDateLegend.appendChild(daysLabel);
        
        // Insert before the "Less" span
        const lessSpan = legendColors.querySelector('span');
        legendColors.insertBefore(testDateLegend, lessSpan);
      }
    };

    // Try multiple times to ensure calendar is loaded
    const intervals = [100, 300, 500, 1000];
    const timers = intervals.map(delay => 
      setTimeout(addCustomizations, delay)
    );
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [testDate, daysLeft]);

  // Transform completedDays into the format expected by react-github-calendar
  const transformData = (contributions: any[]) => {
    return contributions.map(day => {
      const dateStr = day.date;
      
      // Check if this is the test date
      const isTestDate = testDate.toISOString().split('T')[0] === dateStr;
      
      
      if (isTestDate) {
        return {
          ...day,
          count: 4, // Max level for darkest orange (we'll override with CSS)
          level: 4
        };
      }
      
      // Vary intensity based on how many times this date appears
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
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      {/* GitHub Calendar */}
      <div className="overflow-x-auto">
        <style>{`
          .react-activity-calendar rect[data-date="${testDate.toISOString().split('T')[0]}"] {
            fill: #ffd700 !important;
            stroke: #ffb700 !important;
            stroke-width: 2px !important;
          }
        `}</style>
        <GitHubCalendar
          username="any-username" // This won't be used due to transformData
          transformData={transformData}
          theme={{
            light: ['#ebedf0', '#ffd7b3', '#ffb366', '#ff8f1a', '#ff6b00']
          }}
          colorScheme="light"
          fontSize={9}
          blockSize={10}
          blockMargin={3}
          hideColorLegend={false}
          hideTotalCount={true}
          hideMonthLabels={false}
          loading={false}
        />
      </div>
    </div>
  );
};

export default StreaksCard;