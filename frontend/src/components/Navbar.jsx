import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md transition-colors duration-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-500 dark:text-blue-400">
          📅 EventHub
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400">Home</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/my-events" className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400">My Events</Link>
              <Link to="/create-event" className="btn btn-primary">Create Event</Link>
              <div className="flex items-center gap-4">
                <span className="text-gray-700 dark:text-gray-200">Hi, {user?.first_name || user?.username}</span>
                <button onClick={handleLogout} className="btn btn-secondary dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button
            className="text-2xl text-gray-700 dark:text-gray-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-50 dark:bg-gray-700 px-4 py-4 space-y-2 border-t dark:border-gray-600">
          <Link to="/" className="block text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 py-2">Home</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/my-events" className="block text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 py-2">My Events</Link>
              <Link to="/create-event" className="block btn btn-primary w-full text-center">Create Event</Link>
              <div className="py-2 text-gray-700 dark:text-gray-200">Hi, {user?.first_name || user?.username}</div>
              <button onClick={handleLogout} className="block btn btn-secondary w-full dark:bg-gray-600 dark:text-gray-200">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block btn btn-secondary w-full text-center py-2 dark:bg-gray-600 dark:text-gray-200">Login</Link>
              <Link to="/register" className="block btn btn-primary w-full text-center py-2">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
