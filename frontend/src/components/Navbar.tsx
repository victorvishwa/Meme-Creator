import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Meme Creator</Link>
        <div className="space-x-4 flex items-center">
          {user ? (
            <>
              <Link 
                to="/create" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
              >
                Create Meme
              </Link>
              <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
              <button onClick={handleLogout} className="hover:text-gray-300">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/register" className="hover:text-gray-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 