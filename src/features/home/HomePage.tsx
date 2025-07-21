import React from 'react';
import StreaksCard from './components/StreaksCard';
import SpeakingTestCard from './components/SpeakingTestCard';
import PracticeCard from './components/PracticeCard';
import ChecklistCard from './components/ChecklistCard';
import TopicLibraryCard from './components/TopicLibraryCard';

const HomePage: React.FC = () => {
  const testDate = new Date('2025-03-15');
  const completedDays = [
    // December 2024
    new Date('2024-12-01'),
    new Date('2024-12-03'),
    new Date('2024-12-05'),
    new Date('2024-12-07'),
    new Date('2024-12-10'),
    new Date('2024-12-12'),
    new Date('2024-12-14'),
    new Date('2024-12-16'),
    new Date('2024-12-18'),
    new Date('2024-12-20'),
    new Date('2024-12-22'),
    new Date('2024-12-24'),
    new Date('2024-12-26'),
    new Date('2024-12-28'),
    new Date('2024-12-30'),
    // January 2025 - varied intensity
    new Date('2025-01-02'),
    new Date('2025-01-03'), // repeat for higher intensity
    new Date('2025-01-03'),
    new Date('2025-01-05'),
    new Date('2025-01-06'),
    new Date('2025-01-06'), // repeat
    new Date('2025-01-06'), // repeat
    new Date('2025-01-07'),
    new Date('2025-01-09'),
    new Date('2025-01-10'),
    new Date('2025-01-10'), // repeat
    new Date('2025-01-12'),
    new Date('2025-01-13'),
    new Date('2025-01-13'), // repeat
    new Date('2025-01-14'),
    new Date('2025-01-15'),
    new Date('2025-01-16'),
    new Date('2025-01-18'),
    new Date('2025-01-20'),
    new Date('2025-01-20'), // repeat
    new Date('2025-01-21'),
    new Date('2025-01-23'),
    new Date('2025-01-25'),
    new Date('2025-01-25'), // repeat
    new Date('2025-01-25'), // repeat
    new Date('2025-01-26'),
    new Date('2025-01-27'),
    new Date('2025-01-28'),
    new Date('2025-01-30'),
    // February 2025 - more activity
    new Date('2025-02-01'),
    new Date('2025-02-01'), // repeat
    new Date('2025-02-02'),
    new Date('2025-02-03'),
    new Date('2025-02-04'),
    new Date('2025-02-06'),
    new Date('2025-02-07'),
    new Date('2025-02-08'),
    new Date('2025-02-08'), // repeat
    new Date('2025-02-09'),
    new Date('2025-02-10'),
    new Date('2025-02-10'), // repeat
    new Date('2025-02-11'),
    new Date('2025-02-13'),
    new Date('2025-02-14'),
    new Date('2025-02-15'),
    new Date('2025-02-15'), // repeat
    new Date('2025-02-16'),
    new Date('2025-02-17'),
    new Date('2025-02-18'),
    new Date('2025-02-20'),
    new Date('2025-02-21'),
    new Date('2025-02-22'),
    new Date('2025-02-22'), // repeat
    new Date('2025-02-23'),
    new Date('2025-02-24'),
    new Date('2025-02-25'),
    new Date('2025-02-25'), // repeat
    new Date('2025-02-26'),
    new Date('2025-02-27'),
    new Date('2025-02-28'),
    // March 2025 (leading up to test) - intense activity
    new Date('2025-03-01'),
    new Date('2025-03-01'), // repeat
    new Date('2025-03-02'),
    new Date('2025-03-03'),
    new Date('2025-03-03'), // repeat
    new Date('2025-03-04'),
    new Date('2025-03-05'),
    new Date('2025-03-05'), // repeat
    new Date('2025-03-06'),
    new Date('2025-03-07'),
    new Date('2025-03-08'),
    new Date('2025-03-08'), // repeat
    new Date('2025-03-08'), // repeat
    new Date('2025-03-09'),
    new Date('2025-03-10'),
    new Date('2025-03-10'), // repeat
    new Date('2025-03-11'),
    new Date('2025-03-12'),
    new Date('2025-03-12'), // repeat
    // Gap before test - no activity on 13th and 14th
  ];
  const frequency = completedDays.length; // Number of days completed this month

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