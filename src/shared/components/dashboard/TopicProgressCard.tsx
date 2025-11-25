import React, { useEffect, useState } from 'react';
import { Check, CaretRight } from 'phosphor-react';
import { Card, CardHeader, CardTitle, CardContent } from '../layout/ui/card';
import ProgressBar from '../layout/ui/progress-bar';
import { supabase } from '../../services/supabase';
import { TopicService } from '../../../features/dashboard/services/topicService';
import { useTopicPractice } from '../../hooks/useTopicPractice';

interface TopicStats {
  part: string;
  total: number;
  completed: number;
  percentage: number;
}

export const TopicProgressCard: React.FC = () => {
  const [stats, setStats] = useState<TopicStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const { startPractice } = useTopicPractice();

  useEffect(() => {
    fetchTopicStats();
  }, []);

  const fetchTopicStats = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch all topics grouped by part
      const { data: topics, error: topicsError } = await supabase
        .from('topics')
        .select('id, part');

      if (topicsError) throw topicsError;

      // Fetch user's completed topics
      const { data: progress, error: progressError } = await supabase
        .from('user_topic_progress')
        .select('topic_id, completed')
        .eq('user_id', user.id)
        .eq('completed', true);

      if (progressError) throw progressError;

      // Calculate stats by part
      const completedTopicIds = new Set(progress?.map(p => p.topic_id) || []);
      
      const partGroups = topics?.reduce((acc, topic) => {
        if (!acc[topic.part]) {
          acc[topic.part] = { total: 0, completed: 0 };
        }
        acc[topic.part].total++;
        if (completedTopicIds.has(topic.id)) {
          acc[topic.part].completed++;
        }
        return acc;
      }, {} as Record<string, { total: number; completed: number }>);

      // Transform to array and calculate percentages
      const statsArray: TopicStats[] = Object.entries(partGroups || {})
        .map(([part, data]) => ({
          part,
          total: data.total,
          completed: data.completed,
          percentage: Math.round((data.completed / data.total) * 100)
        }))
        .sort((a, b) => {
          const order = ['part1', 'part2', 'part3'];
          return order.indexOf(a.part) - order.indexOf(b.part);
        });

      setStats(statsArray);
      
    } catch (error) {
      console.error('Error fetching topic stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPartLabel = (part: string) => {
    switch (part) {
      case 'part1': return 'Part 1';
      case 'part2': return 'Part 2';
      case 'part3': return 'Part 3';
      default: return part;
    }
  };

  const handlePartClick = async (part: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Get a random topic for this part
    const randomTopic = await TopicService.getRandomTopicForPart(part);
    if (randomTopic) {
      startPractice(randomTopic.title);
    }
  };



  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Topic Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-12 bg-gray-100 rounded"></div>
            <div className="h-12 bg-gray-100 rounded"></div>
            <div className="h-12 bg-gray-100 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Topic Progress</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {stats.map((stat) => {
            const partNumber = stat.part === 'part1' ? 1 : stat.part === 'part2' ? 2 : 3;
            const isCompleted = stat.percentage === 100;
            
            return (
              <div 
                key={stat.part} 
                className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
                onMouseEnter={() => setHoveredPart(stat.part)}
                onMouseLeave={() => setHoveredPart(null)}
                onClick={(e) => handlePartClick(stat.part, e)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {/* Circle with number or checkmark */}
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                      ${isCompleted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white border-2 border-gray-300 text-gray-600'
                      }
                    `}>
                      {isCompleted ? (
                        <Check size={16} weight="bold" />
                      ) : (
                        partNumber
                      )}
                    </div>
                    
                    {/* Part text */}
                    <div>
                      <span className={`text-sm ${isCompleted ? 'text-gray-500' : 'text-gray-700'}`}>
                        {getPartLabel(stat.part)}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        • {stat.part === 'part1' ? 'Introduction' : stat.part === 'part2' ? 'Long Turn' : 'Discussion'}
                      </span>
                    </div>
                  </div>

                  {/* Count and Action Icon */}
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-700">
                        {stat.completed}/{stat.total}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({stat.percentage}%)
                      </span>
                    </div>
                    <CaretRight 
                      size={18} 
                      className={`text-gray-400 transition-all ${
                        hoveredPart === stat.part ? 'translate-x-1 text-blue-500' : ''
                      }`}
                    />
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="ml-11 mr-8">
                  <ProgressBar 
                    value={stat.completed} 
                    max={stat.total} 
                    className="h-2"
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        <p className="text-xs text-gray-500 mt-4">
          Complete all questions in a topic to mark it as finished
        </p>
      </CardContent>
    </Card>
  );
};