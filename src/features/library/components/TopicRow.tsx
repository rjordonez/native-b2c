import React from 'react';
import { CaretDown, CheckCircle } from 'phosphor-react';
import { useAppDispatch } from '../../../store/hooks';
import { toggleTopicExpansion } from '../librarySlice';
import { Button } from '../../../shared/components/layout/ui/button';
import { useTopicPractice } from '../../../shared/hooks/useTopicPractice';

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
  const { startPractice } = useTopicPractice();

  const getPartColor = (part: string) => {
    switch (part) {
      case 'part1': return 'bg-blue-100 text-blue-700';
      case 'part2': return 'bg-green-100 text-green-700';
      case 'part3': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handlePracticeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    startPractice(topic.title);
  };

  return (
    <div>
      {/* Desktop Layout */}
      <div 
        className={`hidden lg:grid grid-cols-12 items-center gap-4 px-3 py-2 border-b text-sm cursor-pointer transition-all duration-200 ease-out ${
          topic.completed
            ? 'bg-gradient-to-r from-green-50 to-transparent border-green-200'
            : 'border-gray-100'
        } ${
          topic.expanded
            ? 'bg-gray-100 text-black shadow-sm'
            : topic.completed 
              ? 'text-gray-700 hover:from-green-100'
              : 'text-gray-600 hover:bg-gray-50 hover:text-black'
        }`}
        onClick={() => dispatch(toggleTopicExpansion(topic.id))}
      >
        {/* Topic */}
        <div className="col-span-4">
          <div className="flex items-center gap-2">
            <div className="truncate font-medium">{topic.title}</div>
          </div>
        </div>

        {/* Part */}
        <div className="col-span-2 flex justify-start">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPartColor(topic.part)}`}>
            {topic.part === 'part1' ? 'Part 1' : topic.part === 'part2' ? 'Part 2' : 'Part 3'}
          </span>
        </div>

        {/* Empty space */}
        <div className="col-span-1">
        </div>

        {/* Completion indicator */}
        <div className="col-span-2 flex justify-center items-center">
          {topic.completed ? (
            <div className="flex items-center gap-1">
              <CheckCircle 
                size={20} 
                weight="fill" 
                className="text-green-600" 
                title="Topic completed"
              />
              <span className="text-xs font-semibold text-green-600">Completed</span>
            </div>
          ) : null}
        </div>

        {/* Practice Button */}
        <div className="col-span-2 flex justify-end">
          <Button 
            size="sm" 
            variant={topic.completed ? "outline" : "secondary"}
            className={`text-xs px-3 py-1 ${
              topic.completed 
                ? 'border-green-500 text-green-600 hover:bg-green-50' 
                : ''
            }`}
            onClick={handlePracticeClick}
          >
            {topic.completed ? 'Review' : 'Practice'}
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

      {/* Mobile Layout */}
      <div 
        className={`lg:hidden flex flex-col gap-2 p-3 border-b cursor-pointer transition-all duration-200 ease-out ${
          topic.completed
            ? 'bg-gradient-to-r from-green-50 to-transparent border-green-200'
            : 'border-gray-100'
        } ${
          topic.expanded
            ? 'bg-gray-100 text-black shadow-sm'
            : topic.completed
              ? 'text-gray-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-black'
        }`}
        onClick={() => dispatch(toggleTopicExpansion(topic.id))}
      >
        <div className="flex items-center justify-between gap-2">
          {/* Topic */}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{topic.title}</div>
          </div>

          {/* Part Pill */}
          <span className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium ${getPartColor(topic.part)}`}>
            {topic.part === 'part1' ? 'Part 1' : topic.part === 'part2' ? 'Part 2' : 'Part 3'}
          </span>

          {/* Dropdown Arrow */}
          <CaretDown 
            size={20} 
            className={`text-gray-700 transition-transform duration-300 ease-in-out flex-shrink-0 ${topic.expanded ? 'rotate-180' : ''}`} 
          />
        </div>

        {/* Practice Button with completion indicator */}
        <div className="flex items-center gap-2 w-full">
          {topic.completed && (
            <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
              <CheckCircle 
                size={16} 
                weight="fill" 
                className="text-green-600" 
                title="Topic completed"
              />
              <span className="text-xs font-semibold text-green-600">Completed</span>
            </div>
          )}
          <Button 
            size="sm" 
            variant={topic.completed ? "outline" : "secondary"}
            className={`flex-1 text-xs ${
              topic.completed 
                ? 'border-green-500 text-green-600 hover:bg-green-50' 
                : ''
            }`}
            onClick={handlePracticeClick}
          >
            {topic.completed ? 'Review' : 'Practice'}
          </Button>
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
                  {question.type === 'part2' ? (
                    <div className="text-sm text-gray-700">
                      {/* Parse and format Part 2 questions */}
                      {(() => {
                        const lines = topic.questions.split('\n').filter(line => line.trim());
                        const youShouldSayIndex = lines.findIndex(line => line.includes('You should say:'));
                        
                        // If "You should say:" is present, use it to split
                        if (youShouldSayIndex !== -1) {
                          const mainQuestion = lines.slice(0, youShouldSayIndex).join(' ').trim();
                          const bulletPoints = lines.slice(youShouldSayIndex + 1);
                          
                          return (
                            <div className="space-y-2">
                              <div className="font-medium">{mainQuestion}</div>
                              <div>
                                <div className="font-medium text-gray-600 mb-1">You should say:</div>
                                <ul className="space-y-1 list-none ml-2">
                                  {bulletPoints.map((point, idx) => {
                                    const cleanedPoint = point.trim().replace(/^[•\-\*]\s*/, '');
                                    return cleanedPoint ? (
                                      <li key={idx} className="flex items-start">
                                        <span className="mr-2 mt-0.5 text-gray-400">•</span>
                                        <span className="text-gray-600">{cleanedPoint}</span>
                                      </li>
                                    ) : null;
                                  })}
                                </ul>
                              </div>
                            </div>
                          );
                        }
                        
                        // If no "You should say:", assume first line is question, rest are bullet points
                        const mainQuestion = lines[0];
                        const bulletPoints = lines.slice(1);

                        return (
                          <div className="space-y-2">
                            <div className="font-medium">{mainQuestion}</div>
                            <div>
                              <div className="font-medium text-gray-600 mb-1">You should say:</div>
                              <ul className="space-y-1 list-none ml-2">
                                {bulletPoints.map((point, idx) => {
                                  const cleanedPoint = point.trim().replace(/^[•\-\*]\s*/, '');
                                  return cleanedPoint ? (
                                    <li key={idx} className="flex items-start">
                                      <span className="mr-2 mt-0.5 text-gray-400">•</span>
                                      <span className="text-gray-600">{cleanedPoint}</span>
                                    </li>
                                  ) : null;
                                })}
                              </ul>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-700">{question.text}</div>
                  )}
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