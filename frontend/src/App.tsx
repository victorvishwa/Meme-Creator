import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import AnimatedBackground from './components/AnimatedBackground';
import Home from './pages/Home';
import CreateMeme from './pages/CreateMeme';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AnimatedBackground />
          <Navbar />
          <main style={{ marginTop: 88, padding: '0 16px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create" element={<PrivateRoute><CreateMeme /></PrivateRoute>} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            </Routes>
          </main>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
