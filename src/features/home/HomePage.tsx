import React from 'react';
import GitHubCard from './components/GitHubCard';
import PracticeCard from './components/PracticeCard';
import ChecklistCard from './components/ChecklistCard';
import { useAppSelector } from '../../store/hooks';
import { 
  selectTestDate, 
  selectPracticeActivityDates
} from './homeSlice';

const HomePage: React.FC = () => {
  // Use Redux selectors for all data
  const testDate = useAppSelector(selectTestDate);
  const completedDays = useAppSelector(selectPracticeActivityDates);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black mb-2">Dashboard</h1>
      </div>
      
      {/* Desktop: Asymmetric two-column layout */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-4">
        {/* Left Column - Takes 2 columns (wider) */}
        <div className="col-span-2 flex flex-col gap-4">
          <PracticeCard />
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
        <GitHubCard
          testDate={testDate}
          completedDays={completedDays}
        />
        <ChecklistCard />
        <PracticeCard />
      </div>
    </div>
  );
};

export default HomePage;