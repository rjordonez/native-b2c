import React from 'react';
import { Microphone } from 'phosphor-react';
import { useAppDispatch } from '../../store/hooks';
import { openModal } from './pronunciationSlice';
import { PronunciationModal } from './components/PronunciationModal';
import { Button } from '../../shared/components/layout/ui/button';

export const PronunciationPage: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Pronunciation Practice</h1>
        
        <div className="bg-gray-800 rounded-lg p-12 text-center space-y-6">
          <Microphone size={64} className="text-blue-500 mx-auto" />
          
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Practice Your Pronunciation</h2>
            <p className="text-gray-400">
              Improve your English pronunciation with AI-powered feedback
            </p>
          </div>
          
          <Button 
            onClick={() => dispatch(openModal())} 
            size="lg"
            className="mt-6"
          >
            Start Practice Session
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Real-time Feedback</h3>
            <p className="text-sm text-gray-400">
              Get instant feedback on your pronunciation
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Word-by-Word Practice</h3>
            <p className="text-sm text-gray-400">
              Focus on words that need improvement
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
            <p className="text-sm text-gray-400">
              Monitor your improvement over time
            </p>
          </div>
        </div>
      </div>

      <PronunciationModal />
    </div>
  );
};