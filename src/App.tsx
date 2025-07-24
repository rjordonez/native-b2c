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
import LandingPage from './features/landing/LandingPage';
import PrivacyPage from './features/landing/PrivacyPage';
import { LanguageProvider } from './features/landing/contexts/LanguageContext';
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

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/landing" element={
        <LanguageProvider>
          <LandingPage />
        </LanguageProvider>
      } />
      <Route path="/privacy" element={<PrivacyPage />} />
      
      {/* Protected routes */}
      {!user ? (
        <Route path="*" element={<AuthPage />} />
      ) : needsOnboarding ? (
        <Route path="*" element={<OnboardingPage />} />
      ) : (
        <>
          <Route path="/" element={
            <Layout>
              <LibraryPage />
            </Layout>
          } />
          <Route path="/chat" element={
            <Layout>
              <ChatPage />
            </Layout>
          } />
          <Route path="/settings" element={
            <Layout>
              <SettingsPage />
            </Layout>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
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