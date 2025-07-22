import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { BookOpen, MagnifyingGlass, CheckCircle, Circle, Microphone, PencilSimple, Eye, Headphones } from 'phosphor-react';
import {
  selectFilteredTopics,
  selectFilters,
  selectSearchQuery,
  updateFilters,
  setSearchQuery,
  toggleTopicCompletion,
  resetFilters
} from './librarySlice';
import { Button } from '../../shared/components/layout/ui/button';

const LibraryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const topics = useAppSelector(selectFilteredTopics);
  const filters = useAppSelector(selectFilters);
  const searchQuery = useAppSelector(selectSearchQuery);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'speaking': return <Microphone size={20} className="text-blue-500" />;
      case 'writing': return <PencilSimple size={20} className="text-green-500" />;
      case 'reading': return <Eye size={20} className="text-purple-500" />;
      case 'listening': return <Headphones size={20} className="text-orange-500" />;
      default: return <BookOpen size={20} className="text-gray-500" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Library</h1>
        <p className="text-gray-600">Practice with curated IELTS topics</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlass size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={filters.category}
              onChange={(e) => dispatch(updateFilters({ category: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="all">All Categories</option>
              <option value="speaking">Speaking</option>
              <option value="writing">Writing</option>
              <option value="reading">Reading</option>
              <option value="listening">Listening</option>
            </select>

            <select
              value={filters.difficulty}
              onChange={(e) => dispatch(updateFilters({ difficulty: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="all">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select
              value={filters.completed === null ? 'all' : filters.completed ? 'completed' : 'incomplete'}
              onChange={(e) => {
                const value = e.target.value === 'all' ? null : e.target.value === 'completed';
                dispatch(updateFilters({ completed: value }));
              }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="all">All Topics</option>
              <option value="completed">Completed</option>
              <option value="incomplete">Incomplete</option>
            </select>

            <Button variant="secondary" size="sm" onClick={() => dispatch(resetFilters())}>
              Clear
            </Button>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {topics.length} topic{topics.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <div key={topic.id} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getCategoryIcon(topic.category)}
                <h3 className="font-semibold text-gray-900">{topic.title}</h3>
              </div>
              <button
                onClick={() => dispatch(toggleTopicCompletion(topic.id))}
                className="text-gray-400 hover:text-green-500 transition-colors"
              >
                {topic.completed ? (
                  <CheckCircle size={20} className="text-green-500" />
                ) : (
                  <Circle size={20} />
                )}
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">{topic.description}</p>

            <div className="flex items-center justify-between mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(topic.difficulty)}`}>
                {topic.difficulty}
              </span>
              <span className="text-xs text-gray-500">{topic.estimatedTime}</span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{topic.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${topic.progress}%` }}
                />
              </div>
            </div>

            <Button variant="default" size="sm" className="w-full">

              {topic.completed ? 'Review' : 'Start Practice'}
            </Button>
          </div>
        ))}
      </div>

      {topics.length === 0 && (
        <div className="text-center py-12">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No topics found matching your criteria</p>
          <Button variant="secondary" onClick={() => dispatch(resetFilters())} className="mt-4">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;