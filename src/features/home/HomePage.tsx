import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectWelcomeMessage,
  selectVisitCount,
  incrementVisitCount,
} from './homeSlice';
import HomeButton from './components/HomeButton';
import Button from '../../shared/components/ui/Button';

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const welcomeMessage = useSelector(selectWelcomeMessage);
  const visitCount = useSelector(selectVisitCount);

  useEffect(() => {
    dispatch(incrementVisitCount());
  }, [dispatch]);

  const handleButtonClick = () => {
    dispatch(incrementVisitCount());
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-black">{welcomeMessage}</h1>
      
      <div className="bg-white border border-gray-100 rounded-lg p-6">
        <p className="text-gray-600 mb-6">
          You've visited this page {visitCount} {visitCount === 1 ? 'time' : 'times'}.
        </p>
        
        <div className="flex gap-4">
          <HomeButton
            label="Click Me"
            count={visitCount}
            onClick={handleButtonClick}
          />
          
          <Button variant="secondary" onClick={() => alert('Secondary button clicked!')}>
            Secondary Action
          </Button>
          
          <Button variant="danger" size="small" onClick={() => alert('Danger!')}>
            Danger Button
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-black">Card 1</h3>
          <p className="text-gray-600">This is a sample card component.</p>
        </div>
        
        <div className="bg-white border border-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-black">Card 2</h3>
          <p className="text-gray-600">Redux state management is working!</p>
        </div>
        
        <div className="bg-white border border-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-black">Card 3</h3>
          <p className="text-gray-600">TypeScript provides type safety.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;