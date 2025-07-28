import React from 'react';
import { Card } from '../../../../shared/components/layout/ui/card';
import { Message } from '../../types';
import { formatDate } from './utils';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  return (
    <Card className="p-4">
      <div className="flex items-start space-x-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${
          message.sender === 'user' ? 'bg-blue-500' : 'bg-green-500'
        }`}>
          {message.sender === 'user' ? 'U' : 'A'}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-medium ${
              message.sender === 'user' ? 'text-blue-600' : 'text-green-600'
            }`}>
              {message.sender === 'user' ? 'User' : 'Assistant'}
            </span>
            <span className="text-xs text-gray-500">
              {formatDate(message.created_at)}
            </span>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <p className="text-gray-800">{message.content}</p>
          </div>

          {/* Audio Info */}
          {(message.audio_url || message.audio_data || message.audio_storage_url) && (
            <div className="bg-blue-50 rounded p-2 mb-2">
              <span className="text-xs text-blue-700 font-medium">🎵 Audio Message</span>
              {message.audio_duration && (
                <span className="text-xs text-blue-600 ml-2">
                  ({message.audio_duration}s)
                </span>
              )}
            </div>
          )}

          {/* Transcription */}
          {message.transcriptions && message.transcriptions.length > 0 && (
            <div className="bg-yellow-50 rounded p-3 mb-2">
              <div className="text-xs font-medium text-yellow-700 mb-1">Transcription</div>
              <p className="text-sm text-gray-800">{message.transcriptions[0].text}</p>
              {message.transcriptions[0].confidence && (
                <div className="text-xs text-yellow-600 mt-1">
                  Confidence: {Math.round(message.transcriptions[0].confidence * 100)}%
                </div>
              )}
            </div>
          )}

          {/* Enhanced Transcript */}
          {message.enhanced_transcripts && message.enhanced_transcripts.length > 0 && (
            <div className="bg-green-50 rounded p-3 mb-2">
              <div className="text-xs font-medium text-green-700 mb-1">Enhanced Transcript</div>
              <p className="text-sm text-gray-800">{message.enhanced_transcripts[0].enhanced_text}</p>
            </div>
          )}

          {/* Pronunciation Scores */}
          {message.pronunciation_scores && message.pronunciation_scores.length > 0 && (
            <div className="bg-purple-50 rounded p-3">
              <div className="text-xs font-medium text-purple-700 mb-2">Pronunciation Analysis</div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <div className="text-xs text-gray-600">Overall</div>
                  <div className="font-medium">{Math.round(message.pronunciation_scores[0].overall_score)}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Accuracy</div>
                  <div className="font-medium">{Math.round(message.pronunciation_scores[0].accuracy_score)}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Fluency</div>
                  <div className="font-medium">{Math.round(message.pronunciation_scores[0].fluency_score)}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Complete</div>
                  <div className="font-medium">{Math.round(message.pronunciation_scores[0].completeness_score)}%</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};