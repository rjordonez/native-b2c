import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import AuthProvider from './features/auth/AuthProvider';
import { useAppSelector } from './store/hooks';
import Layout from './shared/components/layout/Layout';
import LibraryPage from './features/library/LibraryPage';
import ChatPage from './features/chat/ChatPage';
import SettingsPage from './features/settings/SettingsPage';
import AuthPage from './features/auth/AuthPage';
import OnboardingPage from './features/auth/components/OnboardingPage';
import { PronunciationPage } from './features/pronunciation/PronunciationPage';
import './styles/App.css';
import BlockSpinner from './shared/components/layout/BlockSpinner';

const AppRoutes: React.FC = () => {
  const { user, isLoading, needsOnboarding } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BlockSpinner className="mx-auto mb-4" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  if (user && needsOnboarding) {
    return <OnboardingPage />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LibraryPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/pronunciation" element={<PronunciationPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </Provider>
  );
};

export default App;