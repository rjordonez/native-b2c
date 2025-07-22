import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { 
  BookOpen, 
  MagnifyingGlass, 
  CheckCircle, 
  Circle, 
  Microphone, 
  PencilSimple, 
  Eye, 
  Headphones,
  Info,
  Play,
  Gear,
  CaretDown,
  CaretUp
} from 'phosphor-react';
import {
  selectFilteredTopics,
  selectFilters,
  selectSearchQuery,
  updateFilters,
  setSearchQuery,
  toggleTopicCompletion,
  resetFilters,
  toggleTopicExpansion
} from './librarySlice';
import { Button } from '../../shared/components/layout/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../shared/components/layout/ui/card';

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
    <div style={{ backgroundColor: '#F8F9FC' }} className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black mb-2">Library</h1>
          <p className="text-gray-600">Practice with curated IELTS topics</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
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
          </CardContent>
        </Card>

        {/* Header Row */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-2">
          <div className="grid grid-cols-12 items-center gap-4">
            <div className="col-span-5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Topic</span>
                <CaretDown size={12} className="text-gray-400" />
              </div>
            </div>
            <div className="col-span-2">
              <span className="text-sm font-medium text-gray-600">Difficulty</span>
            </div>
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Status</span>
                <CaretUp size={12} className="text-gray-400" />
              </div>
            </div>
            <div className="col-span-3">
              <span className="text-sm font-medium text-gray-600"></span>
            </div>
          </div>
        </div>

        {/* Topic Rows */}
        <div className="space-y-2">
          {topics.map((topic) => (
            <div key={topic.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div 
                className="grid grid-cols-12 items-center gap-4 p-6 cursor-pointer"
                onClick={() => dispatch(toggleTopicExpansion(topic.id))}
              >
                {/* Topic */}
                <div className="col-span-5">
                  <div className="font-semibold text-gray-900">{topic.title}</div>
                </div>

                {/* Difficulty */}
                <div className="col-span-2 flex justify-start">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(topic.difficulty)}`}>
                    {topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${topic.completed ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className={`text-sm font-medium ${topic.completed ? 'text-green-600' : 'text-gray-500'}`}>
                      {topic.completed ? 'Complete' : 'Available'}
                    </span>
                  </div>
                </div>

                {/* Dropdown Arrow */}
                <div className="col-span-3 flex justify-end">
                  <CaretDown 
                    size={24} 
                    className={`text-gray-700 transition-transform duration-300 ease-in-out ${topic.expanded ? 'rotate-180' : ''}`} 
                  />
                </div>
              </div>

              {/* Expanded Questions */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${topic.expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="border-t border-gray-100 p-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Practice Questions</h4>
                  <div className="space-y-3">
                    {topic.questions.map((question, index) => (
                      <div key={question.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg transform transition-all duration-200 hover:bg-gray-100">
                        <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <div className="text-sm text-gray-700">{question.text}</div>
                          <div className="text-xs text-gray-500 mt-1 capitalize">
                            {question.type === 'part1' ? 'Part 1' : question.type === 'part2' ? 'Part 2' : 'Part 3'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Show {topics.length} of {topics.length} topics
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm text-gray-400 cursor-not-allowed">
              {topics.length}-{topics.length}
            </button>
          </div>
        </div>

        {topics.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No topics found matching your criteria</p>
            <Button variant="secondary" onClick={() => dispatch(resetFilters())} className="mt-4">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;