import React from 'react';
import { ArrowRight } from 'phosphor-react';

const PracticeCard: React.FC = () => {
  const practices = [
    { type: 'Part 1: Introduction', time: '5 min', difficulty: 'Easy' },
    { type: 'Part 2: Cue Card', time: '5 min', difficulty: 'Easy' },
    { type: 'Part 3: Discussion', time: '0 min', difficulty: 'Easy' },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-black">Speaking Practice</h3>
      </div>
      
      <div className="space-y-3">
        {practices.map((practice, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="flex-1">
              <div className="font-medium text-gray-700">{practice.type}</div>
              <div className="text-xs text-gray-500">{practice.time} • {practice.difficulty}</div>
            </div>
            <ArrowRight size={16} className="text-gray-400" />
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium">
          View all speaking practices →
        </button>
      </div>
    </div>
  );
};

export default PracticeCard;