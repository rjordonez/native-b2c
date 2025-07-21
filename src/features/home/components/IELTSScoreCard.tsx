import React from 'react';
import { ChartLine } from 'phosphor-react';

const IELTSScoreCard: React.FC = () => {
  // Mock data for the graph
  const scores = [6.5, 6.8, 7.0, 7.2, 7.5];
  const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const maxScore = 9;
  const minScore = 5;
  
  // Calculate graph points
  const graphHeight = 180;
  const graphWidth = 280;
  const points = scores.map((score, index) => {
    const x = (index / (scores.length - 1)) * graphWidth;
    const y = graphHeight - ((score - minScore) / (maxScore - minScore)) * graphHeight;
    return { x, y, score };
  });
  
  // Create SVG path
  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-black">IELTS Score Tracking</h3>
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <ChartLine size={20} className="text-blue-500" />
        </div>
      </div>
      
      <div>
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-black">7.5</div>
          <div className="text-sm text-gray-500">Current Score</div>
        </div>
        
        <div className="relative">
          <svg width={graphWidth} height={graphHeight} className="mx-auto">
            {/* Grid lines */}
            {[6, 7, 8].map(score => {
              const y = graphHeight - ((score - minScore) / (maxScore - minScore)) * graphHeight;
              return (
                <g key={score}>
                  <line x1="0" y1={y} x2={graphWidth} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                  <text x="-5" y={y + 4} className="text-xs fill-gray-400" textAnchor="end">{score}</text>
                </g>
              );
            })}
            
            {/* Line graph */}
            <path d={pathData} fill="none" stroke="#3b82f6" strokeWidth="2" />
            
            {/* Data points */}
            {points.map((point, index) => (
              <circle key={index} cx={point.x} cy={point.y} r="4" fill="#3b82f6" />
            ))}
          </svg>
          
          {/* X-axis labels */}
          <div className="flex justify-between mt-2 px-2">
            {months.map((month, index) => (
              <span key={index} className="text-xs text-gray-400">{month}</span>
            ))}
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <div className="text-xs text-gray-400">Target: 8.0 • Improving steadily</div>
        </div>
      </div>
    </div>
  );
};

export default IELTSScoreCard;