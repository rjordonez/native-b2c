import React from 'react';
import { ArrowRight } from 'phosphor-react';

const TopicLibraryCard: React.FC = () => {
  const topics = [
    { title: 'Environment', color: 'bg-emerald-100 text-emerald-700' },
    { title: 'Technology', color: 'bg-purple-100 text-purple-700' },
    { title: 'Education', color: 'bg-pink-100 text-pink-700' },
    { title: 'Health', color: 'bg-yellow-100 text-yellow-700' },
    { title: 'Society', color: 'bg-blue-100 text-blue-700' },
    { title: 'Culture', color: 'bg-indigo-100 text-indigo-700' },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-black">Topic Library</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        {topics.map((topic, index) => (
          <div
            key={index}
            className={`px-4 py-3 rounded-lg text-sm font-medium ${topic.color} text-center`}
          >
            {topic.title}
          </div>
        ))}
      </div>
      
      <button className="flex items-center justify-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium">
        See more topics
        <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default TopicLibraryCard;