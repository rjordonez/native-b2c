import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import AuthProvider from './features/auth/AuthProvider';
import { useAppSelector } from './store/hooks';
import Layout from './shared/components/layout/Layout';
import HomePage from './features/home/HomePage';
import LibraryPage from './features/library/LibraryPage';
import LiveKitPage from './features/livekit/LiveKitPage';
import SettingsPage from './features/settings/SettingsPage';
import AuthPage from './features/auth/AuthPage';
import './styles/App.css';

const AppRoutes: React.FC = () => {
  const { user, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/voice-practice" element={<LiveKitPage />} />
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