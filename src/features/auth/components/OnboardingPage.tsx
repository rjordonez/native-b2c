import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { updateOnboardingData, completeOnboarding } from '../authSlice';
import { Button } from '../../../shared/components/layout/ui/button';
import AuthLogo from './AuthLogo';

const OnboardingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { onboardingData, isLoading } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(completeOnboarding(onboardingData)).unwrap();
    } catch (err) {
      console.error('Onboarding failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <AuthLogo />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Native Speaking!
          </h1>
    
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={onboardingData.fullName}
              onChange={(e) => dispatch(updateOnboardingData({ fullName: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target IELTS Band Score
              </label>
              <select
                value={onboardingData.targetScore}
                onChange={(e) => dispatch(updateOnboardingData({ targetScore: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              >
                <option value="">Select target score</option>
                <option value="6.0">6.0</option>
                <option value="6.5">6.5</option>
                <option value="7.0">7.0</option>
                <option value="7.5">7.5</option>
                <option value="8.0">8.0</option>
                <option value="8.5">8.5</option>
                <option value="9.0">9.0</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current English Level
              </label>
              <select
                value={onboardingData.currentLevel}
                onChange={(e) => dispatch(updateOnboardingData({ currentLevel: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              >
                <option value="">Select current level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IELTS Test Date (Optional)
            </label>
            <input
              type="date"
              value={onboardingData.testDate}
              onChange={(e) => dispatch(updateOnboardingData({ testDate: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How did you hear about us?
            </label>
            <input
              type="text"
              value={onboardingData.howDidYouHear}
              onChange={(e) => dispatch(updateOnboardingData({ howDidYouHear: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="e.g., Google search, friend recommendation, social media..."
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              variant="default"
              disabled={isLoading}
              className="w-full py-4 text-lg"
            >
              {isLoading ? 'Setting up your account...' : 'Complete Setup'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;