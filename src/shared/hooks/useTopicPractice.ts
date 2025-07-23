import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { startTopicPractice } from '../../features/chat/chatSlice';

export const useTopicPractice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const startPractice = async (topicName: string) => {
    console.log('Starting practice for topic:', topicName);
    
    // Check if we're already on the chat page
    const isOnChatPage = location.pathname === '/chat';
    
    if (isOnChatPage) {
      // If already on chat page, just start the practice
      dispatch(startTopicPractice({ topicName }));
    } else {
      // Start the practice session first
      const result = await dispatch(startTopicPractice({ topicName }));
      
      // If successful, navigate to chat
      if (startTopicPractice.fulfilled.match(result)) {
        navigate('/chat');
      }
    }
  };

  return { startPractice };
};