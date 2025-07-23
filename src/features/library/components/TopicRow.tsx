import React from 'react';
import { CaretDown } from 'phosphor-react';
import { useAppDispatch } from '../../../store/hooks';
import { toggleTopicExpansion } from '../librarySlice';
import { Button } from '../../../shared/components/layout/ui/button';

interface Topic {
  id: string;
  title: string;
  part: string;
  completed: boolean;
  expanded: boolean;
  questionsList: Array<{
    id: string;
    text: string;
    type: string;
  }>;
}

interface TopicRowProps {
  topic: Topic;
}

const TopicRow: React.FC<TopicRowProps> = ({ topic }) => {
  const dispatch = useAppDispatch();

  const getPartColor = (part: string) => {
    switch (part) {
      case 'part1': return 'bg-blue-100 text-blue-700';
      case 'part3': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handlePracticeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Add practice functionality
  };

  return (
    <div className="transform transition-all duration-200 ease-out">
      <div 
        className={`grid grid-cols-12 items-center gap-4 px-3 py-2 rounded-lg text-sm cursor-pointer transition-all duration-200 ease-out ${
          topic.expanded
            ? 'bg-gray-100 text-black shadow-sm'
            : 'text-gray-600 hover:bg-gray-50 hover:text-black'
        }`}
        onClick={() => dispatch(toggleTopicExpansion(topic.id))}
      >
        {/* Topic */}
        <div className="col-span-6">
          <div className="truncate font-medium">{topic.title}</div>
        </div>

        {/* Part */}
        <div className="col-span-2 flex justify-start">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPartColor(topic.part)}`}>
            {topic.part === 'part1' ? 'Part 1' : 'Part 3'}
          </span>
        </div>

        {/* Empty space to push right elements to the right */}
        <div className="col-span-2">
        </div>

        {/* Practice Button */}
        <div className="col-span-1 flex justify-end">
          <Button 
            size="sm" 
            variant="secondary"
            className="text-xs px-3 py-1"
            onClick={handlePracticeClick}
          >
            Practice
          </Button>
        </div>

        {/* Dropdown Arrow */}
        <div className="col-span-1 flex justify-end">
          <CaretDown 
            size={20} 
            className={`text-gray-700 transition-transform duration-300 ease-in-out ${topic.expanded ? 'rotate-180' : ''}`} 
          />
        </div>
      </div>

      {/* Expanded Questions */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${topic.expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-gray-100 p-3 bg-gray-50 rounded-b-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Practice Questions</h4>
          <div className="space-y-3">
            {topic.questionsList.map((question, index) => (
              <div key={question.id} className="flex items-start gap-3 p-3 bg-white rounded-lg transform transition-all duration-200 hover:bg-gray-100">
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
  );
};

export default TopicRow;