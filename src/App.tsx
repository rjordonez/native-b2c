import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Layout from './shared/components/layout/Layout';
import HomePage from './features/home/HomePage';
import PracticePage from './features/practice/PracticePage';
import TopicLibraryPage from './features/topic-library/TopicLibraryPage';
import SettingsPage from './features/settings/SettingsPage';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/topic-library" element={<TopicLibraryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
};

export default App;