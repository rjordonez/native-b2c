import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { startTopicPractice } from '../../features/chat/store/topicPracticeThunks';

export const useTopicPractice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const startPractice = async (topicName: string) => {
    // Check if we're already on the chat page
    const isOnChatPage = location.pathname === '/chat';
    
    if (isOnChatPage) {
      // If already on chat page, just start the practice
      dispatch(startTopicPractice({ topicName }));
    } else {
      // Navigate to chat page immediately
      navigate('/chat');
      
      // Start the practice session in the background
      dispatch(startTopicPractice({ topicName }));
    }
  };

  return { startPractice };
};