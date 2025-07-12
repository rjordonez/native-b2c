import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Layout from './shared/components/layout/Layout';
import HomePage from './features/home/HomePage';
import AboutPage from './features/about/AboutPage';
import DashboardPage from './features/dashboard/DashboardPage';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
};

export default App;