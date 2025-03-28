import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './LoginForm';
import Admin from './Admin';
import App from './App';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Rota inicial para LoginForm */}
        <Route path="/" element={<LoginForm />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/app" element={<App />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
