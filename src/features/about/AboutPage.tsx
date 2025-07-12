import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectTitle,
  selectDescription,
  selectFeatures,
} from './aboutSlice';
import Button from '../../shared/components/ui/Button';

const AboutPage: React.FC = () => {
  const title = useSelector(selectTitle);
  const description = useSelector(selectDescription);
  const features = useSelector(selectFeatures);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-lg text-gray-700 mb-6">{description}</p>
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Features</h2>
        
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-700">
              <span className="text-green-500 mr-2">✓</span>
              {feature}
            </li>
          ))}
        </ul>
        
        <div className="flex space-x-4">
          <Button variant="primary" onClick={() => alert('Learn more clicked!')}>
            Learn More
          </Button>
          
          <Button variant="secondary" onClick={() => window.open('https://github.com', '_blank')}>
            View on GitHub
          </Button>
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-blue-900 mb-2">Get Started</h3>
        <p className="text-blue-700 mb-4">
          Ready to build something amazing? Check out our documentation and start creating your own features.
        </p>
        <Button variant="primary" size="small">
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default AboutPage;