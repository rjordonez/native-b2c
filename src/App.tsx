import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Layout from './shared/components/layout/Layout';
import HomePage from './features/home/HomePage';
import LibraryPage from './features/library/LibraryPage';
import LiveKitPage from './features/livekit/LiveKitPage';
import SettingsPage from './features/settings/SettingsPage';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/voice-practice" element={<LiveKitPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
};

export default App;