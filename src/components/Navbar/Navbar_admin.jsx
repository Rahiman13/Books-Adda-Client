import React, { useState, useContext, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { FavoritesContext } from '../pages/Favourite/FavoritesContext';
import links from '../NavLinks/links_admin';
import { FaBars } from 'react-icons/fa';

const Navbar_admin = () => {
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [username, setUsername] = useState('');
  const { isLoggedIn, logout } = useContext(AuthContext);
  const { favorites } = useContext(FavoritesContext);
  const userId = localStorage.getItem('userId');
  
  useEffect(() => {
    if (isLoggedIn && userId) {
      fetchUsername(userId);
    }
  }, [isLoggedIn, userId]);

  const fetchUsername = async (userId) => {
    try {
      const response = await fetch(`https://books-adda-backend.onrender.com/username/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const data = await response.json();
      setUsername(data.username);
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      const response = await fetch('https://books-adda-backend.onrender.com/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        localStorage.removeItem('authToken');
        logout();
        setShowLogoutModal(false);
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <button onClick={toggleSidebar} className="lg:hidden p-4">
        <FaBars className="text-white" size={24} />
      </button>
      <nav className={`bg-white dark:bg-[#000080] lg:w-1/6 px-4 flex flex-col items-start justify-between fixed h-full border-r border-gray-200 dark:border-gray-600 z-10 w-full md:w-1/3 sm:w-1/2 transform ${open ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0`}>
        <div className="flex flex-col items-center w-full">
          <div className="p-4 w-full">
            {/* <h1 className="text-3xl font-cursive text-white font-bold">Admin</h1> */}
            {isLoggedIn && (
              <p className="text-2xl font-semibold text-white mt-2">Welcome, <span className='font-cursive text-3xl'>{username}</span></p>
            )}
          </div>
          <ul className="w-full mt-4 space-y-4">
            {links.map((link, index) => (
              <li key={index} className="w-full">
                <NavLink
                  to={link.path}
                  className={({ isActive }) => 
                    `flex items-center pl-2 text-center justify-center lg:justify-start py-2 font-semibold w-full text-gray-900 rounded text-lg ${
                      isActive
                        ? "bg-gray-700 text-blue-700 dark:bg-white dark:text-[#000080]"
                        : "hover:bg-gray-700 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-white dark:hover:text-[#000080]"
                    }`
                  }
                  
                >
                  {link.icon}
                  <span className="ml-2">{link.name}</span>
                  {link.name === 'Favourites' && (
                    <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                      {favorites.length}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full p-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full text-blue-700 bg-transparent hover:bg-[#000] focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-lg px-4 py-2 text-center dark:bg-white dark:hover:text-white dark:hover:bg-[#000] dark:hover:border border-white dark:focus:ring-blue-800"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className="w-full text-blue-700 bg-transparent hover:bg-[#000] focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-lg px-4 py-2 text-center dark:bg-white dark:hover:text-white dark:hover:bg-[#000] dark:hover:border border-white dark:focus:ring-blue-800"
            >
              Login
            </NavLink>
          )}
        </div>
      </nav>
      <div className="flex-1 lg:ml-64 pt-20 lg:pt-0">
        {/* Main content goes here */}
      </div>
      {showLogoutModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="text-lg font-semibold mb-4">Are you sure you want to logout, {username}?</p>
            <div className="flex justify-end">
              <NavLink to="/login">
                <button
                  onClick={handleLogoutConfirm}
                  className="mr-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Yes
                </button>
              </NavLink>
              <button
                onClick={handleLogoutCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar_admin;
