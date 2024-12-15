import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import Notifications from './notification';
import './borrowerdash.css'; 
const BorrowerHeader = () => {
    const navigate = useNavigate(); 

    const [isNotificationVisible, setIsNotificationVisible] = useState(false);
    const [isProfileVisible, setIsProfileVisible] = useState(false);

  
    const [loggedIn, setLoggedIn] = useState(true);
  
    const handleLogout = () => {
      // Remove token and other user info from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      setLoggedIn(false); // Update loggedIn state to false
      navigate('/login'); // Redirect to login page after logout
    };
  
  
  
    // Toggle Profile Dropdown
    const toggleProfile = () => {
      setIsProfileVisible(!isProfileVisible);
      setIsNotificationVisible(false);  // Close notifications when profile is toggled
    };
  
  return (
    <header className="headdash">
        <Link to="/">
                 <img src="logo.png" alt="MSU-IIT NMPC Logo"  className="logolan"/>
            </Link>
       
        <h2 className="dashh2">MSU-IIT National Multi-Purpose Cooperative</h2>
        <nav className="iconn">
            <Link to="/">
                <img src="Home.png" alt="MSU-IIT NMPC Logo" className="navicon1"/>
            </Link>
        {/* Notification Button */}

        {/* Profile Button */}
        <div className="notification-container">
            <button onClick={toggleProfile} className="notification-button">
              <img src="User_circle.png" alt="User" className="navicon" />
            </button>

            {/* Profile Dropdown */}
            {isProfileVisible && (
              <div className="prof-dropdown">
                <Link to="/borrowerdash" className="profile-link">My Profile</Link>
                <button onClick={handleLogout} className="logout-button">Logout</button>
              </div>

            )}
          </div>

      </nav>
      <span></span>
    </header>
  );
};

export default BorrowerHeader;