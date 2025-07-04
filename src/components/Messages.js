import React, { useState, useEffect } from 'react';
import './Messages.css';

const Messages = ({ onMessageClick }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [newMatchesCount, setNewMatchesCount] = useState(0);

  useEffect(() => {
    const calculateCounts = () => {
      // Get chat messages from localStorage
      const chatMessages = JSON.parse(localStorage.getItem('chatMessages') || '{}');
      
      // Count unread messages
      let unreadMessages = 0;
      Object.values(chatMessages).forEach(conversation => {
        if (Array.isArray(conversation)) {
          unreadMessages += conversation.filter(msg => !msg.read).length;
        }
      });
      
      // Get mutual likes (matches available for conversation)
      const userLikes = JSON.parse(localStorage.getItem('userLikes') || '[]');
      
      // Count matches that have no messages yet (new matches to start conversations)
      let newMatches = 0;
      userLikes.forEach(likeKey => {
        const conversation = chatMessages[likeKey];
        if (!conversation || conversation.length === 0) {
          newMatches++;
        }
      });
      
      setUnreadCount(unreadMessages);
      setNewMatchesCount(newMatches);
    };

    // Calculate counts on component mount
    calculateCounts();

    // Set up interval to check for updates every few seconds
    const interval = setInterval(calculateCounts, 3000);

    // Listen for storage changes (when user actions occur in other components)
    const handleStorageChange = (e) => {
      if (e.key === 'chatMessages' || e.key === 'userLikes') {
        calculateCounts();
      }
    };
    
    // Listen for custom refresh events
    const handleRefresh = () => {
      calculateCounts();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('refreshMessageCounts', handleRefresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('refreshMessageCounts', handleRefresh);
    };
  }, []);

  const totalCount = unreadCount + newMatchesCount;

  const handleClick = () => {
    if (onMessageClick) {
      onMessageClick();
    }
  };

  return (
    <div className="floating-messages visible">
      <button className="messages-button" onClick={handleClick}>
        <div className="messages-icon">
          💬
        </div>
        {totalCount > 0 && (
          <div className="notification-badge">
            {totalCount > 99 ? '99+' : totalCount}
          </div>
        )}
      </button>
    </div>
  );
};

export default Messages; 