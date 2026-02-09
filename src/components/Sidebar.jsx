import React, { useState } from 'react';
import { ROOMS } from '../data/mockData';
import { IoChevronForward, IoLogOutOutline, IoLogoGoogle, IoMoonOutline, IoSunnyOutline } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ selectedRoom, onSelectRoom, className = '' }) => {
  const [selectedBlock, setSelectedBlock] = useState('Block E');
  const { user, login, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 transition-colors duration-200 ${className}`}>
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent flex items-center gap-2">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="ClassClaim Logo" className="h-8 w-auto" />
          ClassClaim
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Central University</p>
      </div>

      <div className="flex p-4 gap-2 border-b border-gray-50 dark:border-gray-700">
        {Object.keys(ROOMS).map(block => (
          <button
            key={block}
            onClick={() => setSelectedBlock(block)}
            className={`
              flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all
              ${selectedBlock === block 
                ? 'bg-red-50 text-red-700 shadow-sm dark:bg-red-900/20 dark:text-red-400' 
                : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
              }
            `}
          >
            {block}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-2">
          {selectedBlock} Rooms
        </h3>
        {ROOMS[selectedBlock].map(room => (
          <button
            key={room}
            onClick={() => onSelectRoom(room)}
            className={`
              w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all
              ${selectedRoom === room 
                ? 'bg-gray-900 text-white shadow-lg shadow-gray-200 dark:bg-black dark:shadow-gray-900' 
                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
              }
            `}
          >
            {room}
            {selectedRoom === room && <IoChevronForward />}
          </button>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-50 dark:border-gray-700 space-y-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between p-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="flex items-center gap-2">
            {theme === 'dark' ? <IoMoonOutline /> : <IoSunnyOutline />}
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
          <div className={`
            w-10 h-5 rounded-full relative transition-colors duration-200
            ${theme === 'dark' ? 'bg-red-600' : 'bg-gray-200'}
          `}>
            <div className={`
              absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform duration-200
              ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}
            `} />
          </div>
        </button>

        {user ? (
          <div className="flex items-center gap-3 pt-2 border-t border-gray-50 dark:border-gray-700">
            <img 
              src={user.photoURL} 
              alt={user.displayName} 
              className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-600"
            />
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.displayName}</p>
              <button 
                onClick={handleLogout}
                className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1"
              >
                <IoLogOutOutline /> Sign Out
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="w-full py-2.5 px-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
          >
            <IoLogoGoogle className="text-red-600 text-lg" />
            Sign in with Google
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
