import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './LoginForm';
import App from './App';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/app" element={<App />} />
        <Route path="*" element={<LoginForm />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
