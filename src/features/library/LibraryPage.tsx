import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
  fetchTopicsFromDB,
  clearError,
  selectError
} from './librarySlice';
import {
  selectTestDate,
  selectPracticeActivityDates
} from '../../shared/store/dashboardSlice';
import { GitHubCard, ChecklistCard } from '../../shared/components/dashboard';
import { SearchFilters, TopicList, Pagination } from './components';

const LibraryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectError);
  
  // Home data for sidebar components
  const testDate = useAppSelector(selectTestDate);
  const completedDays = useAppSelector(selectPracticeActivityDates);

  // Fetch topics on component mount
  useEffect(() => {
    dispatch(fetchTopicsFromDB());
  }, [dispatch]);

  // Clear errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black mb-2">Dashboard</h1>
        <p className="text-gray-600">Your IELTS preparation hub with practice topics and progress tracking</p>
      </div>
      
      {/* Desktop: Two-column layout */}
      <div className="hidden lg:flex gap-6 flex-1">
        {/* Left Column - Library Content (65%) */}
        <div className="flex-1 flex flex-col" style={{ flex: '0 0 65%' }}>
          <SearchFilters />
          <TopicList />
          <Pagination />
        </div>
        
        {/* Right Column - Sidebar Components (35%) */}
        <div className="flex flex-col gap-4" style={{ flex: '0 0 35%' }}>
          <GitHubCard
            testDate={testDate}
            completedDays={completedDays}
          />
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
        <SearchFilters />
        <TopicList />
        <Pagination />
      </div>
    </div>
  );
};

export default LibraryPage;