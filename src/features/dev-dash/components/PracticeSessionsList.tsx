import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, ChatCircle, CheckCircle, XCircle, ArrowLeft, ArrowRight } from 'phosphor-react';
import { supabase } from '../../../shared/services/supabase';
import { formatDistanceToNow } from '../../../utils/dateUtils';
import { useAppDispatch } from '../../../store/hooks';
import { openUserDetailModal } from '../devDashSlice';
import { ChatViewModal } from './ChatViewModal';

interface PracticeSession {
  id: string;
  user_id: string;
  topic_id: string;
  topic_title: string;
  created_at: string;
  updated_at: string;
  is_completed: boolean;
  message_count: number;
  user_email?: string;
}

interface PracticeSessionsListProps {
  limit?: number;
}

export const PracticeSessionsList: React.FC<PracticeSessionsListProps> = ({ limit = 20 }) => {
  const dispatch = useAppDispatch();
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<PracticeSession | null>(null);

  useEffect(() => {
    fetchSessions();
  }, [limit]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      
      // Query conversations that have topic data
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('conversations')
        .select(`
          id,
          user_id,
          created_at,
          updated_at,
          conversation_type,
          current_topic,
          current_question_index,
          topic_questions
        `)
        .not('current_topic', 'is', null)  // Get conversations that have topic data
        .order('created_at', { ascending: false })
        .limit(limit);

      if (sessionsError) throw sessionsError;

      if (!sessionsData || sessionsData.length === 0) {
        setSessions([]);
        return;
      }

      // Transform the data to match our interface
      const sessionsWithDetails = await Promise.all(
        sessionsData.map(async (session) => {
          // Extract topic info from JSONB fields
          const topicTitle = session.current_topic?.topic_title || 
                           session.current_topic?.title || 
                           'Unknown Topic';
          
          const topicId = session.current_topic?.id || 'unknown';
          
          // Check if all questions are completed
          const questions = session.topic_questions || [];
          const currentIndex = session.current_question_index || 0;
          const isCompleted = questions.length > 0 && currentIndex >= questions.length - 1;

          // Get user email
          const { data: userData } = await supabase
            .from('user_profiles')
            .select('email')
            .eq('auth_user_id', session.user_id)
            .single();

          // Get message count
          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', session.id);

          return {
            id: session.id,
            user_id: session.user_id,
            topic_id: topicId,
            topic_title: topicTitle,
            created_at: session.created_at,
            updated_at: session.updated_at,
            is_completed: isCompleted,
            user_email: userData?.email || 'Unknown User',
            message_count: count || 0
          };
        })
      );

      setSessions(sessionsWithDetails);
    } catch (error) {
      // Error fetching practice sessions
    } finally {
      setLoading(false);
    }
  };

  const handleSessionClick = (session: PracticeSession) => {
    // Open the chat view modal
    setSelectedSession(session);
  };

  const handleCloseModal = () => {
    setSelectedSession(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Practice Sessions</h3>
          <p className="text-sm text-gray-600 mt-1">Click on a session to view the conversation</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {sessions.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No practice sessions found
            </div>
          ) : (
            sessions.map(session => (
              <div
                key={session.id}
                onClick={() => handleSessionClick(session)}
                className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{session.topic_title}</h4>
                      {session.is_completed ? (
                        <CheckCircle size={16} className="text-green-500" weight="fill" />
                      ) : (
                        <XCircle size={16} className="text-gray-400" weight="fill" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{session.user_email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ChatCircle size={14} />
                        <span>{session.message_count} messages</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{formatDistanceToNow(new Date(session.created_at))} ago</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xs text-gray-500">
                      {new Date(session.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat View Modal */}
      {selectedSession && (
        <ChatViewModal
          conversationId={selectedSession.id}
          conversationTitle={selectedSession.topic_title}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};