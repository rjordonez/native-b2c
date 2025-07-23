import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { startTopicPractice } from '../../features/chat/chatSlice';

export const useTopicPractice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const startPractice = (topicName: string) => {
    console.log('Starting practice for topic:', topicName);
    
    // Check if we're already on the chat page
    const isOnChatPage = location.pathname === '/chat';
    
    if (isOnChatPage) {
      // If already on chat page, just start the practice
      dispatch(startTopicPractice({ topicName }));
    } else {
      // Navigate to chat page with state indicating we want to start practice
      navigate('/chat', { state: { startPractice: topicName } });
    }
  };

  return { startPractice };
};