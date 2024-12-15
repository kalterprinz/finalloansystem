import React, { useState, useEffect } from 'react';
import './notification.css';

const Notifications = () => {
  const [isVisible, setIsVisible] = useState(false);

  const notifications = [
    { message: "You only have 3 weeks before your due date.", time: "2 days ago"},
    { message: "The funds have been deposited in your account. Congratulations!", time: "3 weeks ago"},
    { message: "Your application is now being reviewed.", time: "1 month ago"},
    { message: "Your application has been approved!", time: "1 month ago" },
  ];

  const handleNotificationClick = (e) => {
    e.stopPropagation(); // Prevent click from affecting other components
    setIsVisible(!isVisible); // Toggle notification visibility
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close the notification dropdown if clicked outside
      if (!e.target.closest('.notification-container')) {
        setIsVisible(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="notification-container">
      <button onClick={handleNotificationClick} className="notification-button">
      </button>

      {isVisible && (
        <div className="notifications-dropdown">
          <h3>Notifications</h3>
          <ul className="notification-list">
            {notifications.map((notif, index) => (
              <li key={index} className="notification-item">
                <div className="notification-message">
                  <p>{notif.message}</p>
                  <span className="notification-time">{notif.time}</span>
                </div>
              </li>
            ))}
          </ul>
          <a href="/notifications" className="see-all">See all Notifications</a>
        </div>
      )}
    </div>
  );
};

export default Notifications;
