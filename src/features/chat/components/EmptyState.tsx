import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlass } from 'phosphor-react';
import { useAppSelector } from '../../../store/hooks';

interface EmptyStateProps {
  onCreateConversation: () => void;
  onTopicSelect: (topic: string) => void;
  isLoading: boolean;
}

const PRACTICE_TOPICS = [
  { id: 'Crime', name: 'Crime', emoji: '🔍' },
  { id: 'Art', name: 'Art', emoji: '🎨' },
  { id: 'Culture', name: 'Culture', emoji: '🌍' }
];

const EmptyState: React.FC<EmptyStateProps> = ({ onCreateConversation, onTopicSelect, isLoading }) => {
  const navigate = useNavigate();
  const user = useAppSelector(state => state.auth.user);
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'there';

  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full px-4">
      {/* Greeting */}
      <h3 className="text-2xl font-medium text-gray-900 mb-8 text-center italic">
        Hi, {firstName}! Ready to Practice IELTS
      </h3>
      
      {/* Pills Layout */}
      <div className="flex flex-col items-center gap-4">
        {/* Top row - 3 pills side by side */}
        <div className="flex gap-4">
          {PRACTICE_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => {
                console.log('Button clicked for topic:', topic.id);
                onTopicSelect(topic.id);
              }}
              disabled={isLoading}
              className="px-6 py-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl transition-colors flex items-center justify-center gap-3 disabled:opacity-50 min-w-[120px]"
            >
              <span className="text-xl">{topic.emoji}</span>
              <span className="font-medium text-gray-900">{topic.name}</span>
            </button>
          ))}
        </div>
        
        {/* Bottom row - 1 pill underneath */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/library')}
            disabled={isLoading}
            className="px-6 py-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-2xl transition-colors flex items-center justify-center gap-3 disabled:opacity-50 min-w-[120px]"
          >
            <MagnifyingGlass size={18} className="text-blue-600" />
            <span className="font-medium text-blue-900">Browse All Topics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;