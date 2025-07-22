import React from 'react';
import StreaksCard from './components/StreaksCard';
import GitHubCard from './components/GitHubCard';
import SpeakingTestCard from './components/SpeakingTestCard';
import PracticeCard from './components/PracticeCard';
import ChecklistCard from './components/ChecklistCard';
import { useAppSelector } from '../../store/hooks';
import { 
  selectTestDate, 
  selectPracticeActivityDates, 
  selectPracticeFrequency 
} from './homeSlice';

const HomePage: React.FC = () => {
  // Use Redux selectors for all data
  const testDate = useAppSelector(selectTestDate);
  const completedDays = useAppSelector(selectPracticeActivityDates);
  const frequency = useAppSelector(selectPracticeFrequency);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black mb-2">Dashboard</h1>
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
          
          {/* 2x1 Grid for Speaking Practice and Test */}
          <div className="grid grid-cols-2 gap-4">
            <PracticeCard />
            <SpeakingTestCard />
          </div>
        </div>
        
        {/* Right Column - Takes 1 column (narrower) */}
        <div className="col-span-1 flex flex-col gap-4">
          {/* GitHub Activity - Above checklist */}
          <GitHubCard
            testDate={testDate}
            completedDays={completedDays}
          />
          
          {/* Checklist - Natural height */}
          <ChecklistCard />
        </div>
      </div>
      
      {/* Mobile: Stacked layout */}
      <div className="lg:hidden space-y-6">
        <StreaksCard 
          testDate={testDate}
          completedDays={completedDays}
          frequency={frequency}
        />
        <GitHubCard
          testDate={testDate}
          completedDays={completedDays}
        />
        <ChecklistCard />
        <PracticeCard />
        <SpeakingTestCard />
      </div>
    </div>
  );
};

export default HomePage;