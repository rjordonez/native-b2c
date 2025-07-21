import React, { useMemo } from 'react';
import StreaksCard from './components/StreaksCard';
import SpeakingTestCard from './components/SpeakingTestCard';
import PracticeCard from './components/PracticeCard';
import ChecklistCard from './components/ChecklistCard';
import TopicLibraryCard from './components/TopicLibraryCard';
import { DASHBOARD_CONFIG, PRACTICE_ACTIVITY_DATES } from './constants/dashboardData';

const HomePage: React.FC = () => {
  // Use constants for data configuration
  const testDate = DASHBOARD_CONFIG.testDate;
  const completedDays = PRACTICE_ACTIVITY_DATES;
  
  // Calculate frequency using useMemo for performance
  const frequency = useMemo(() => {
    return completedDays.length;
  }, [completedDays]);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black mb-2">Dashboard</h1>
        <p className="text-gray-600">Track your IELTS preparation progress</p>
      </div>
      
      {/* Desktop: Asymmetric two-column layout */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-4">
        {/* Left Column - Takes 2 columns (wider) */}
        <div className="col-span-2 flex flex-col gap-4">
          {/* Streaks - Auto height for calendar */}
          <StreaksCard
            testDate={testDate}
            completedDays={completedDays}
            frequency={frequency}
          />
          
          {/* 2x1 Grid for Speaking Test and Practice */}
          <div className="grid grid-cols-2 gap-4">
            <SpeakingTestCard />
            <PracticeCard />
          </div>
        </div>
        
        {/* Right Column - Takes 1 column (narrower) */}
        <div className="col-span-1 flex flex-col gap-4">
          {/* Checklist - Natural height */}
          <ChecklistCard />
          
          {/* Topic Library - Natural height */}
          <TopicLibraryCard />
        </div>
      </div>
      
      {/* Mobile: Stacked layout */}
      <div className="lg:hidden space-y-6">
        <StreaksCard 
          testDate={testDate}
          completedDays={completedDays}
          frequency={frequency}
        />
        <ChecklistCard />
        <SpeakingTestCard />
        <PracticeCard />
        <TopicLibraryCard />
      </div>
    </div>
  );
};

export default HomePage;