import React, { useState, useEffect } from 'react';
import './Messages.css';

const Messages = ({ onMessageClick }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [newMatchesCount, setNewMatchesCount] = useState(0);

  useEffect(() => {
    const calculateCounts = () => {
      // Get mutual matches and chat messages from localStorage
      const savedMutualMatches = JSON.parse(localStorage.getItem('mutualMatches') || '[]');
      const chatMessages = JSON.parse(localStorage.getItem('chatMessages') || '{}');
      
      let unreadMessages = 0;
      let newMatches = 0;
      
      savedMutualMatches.forEach(mutualMatchKey => {
        const conversation = chatMessages[mutualMatchKey] || [];
        
        if (conversation.length === 0) {
          // No messages at all - this is a bug, should have at least system message
          return;
        }
        
        // Check if this is a new match (only has system message)
        const userMessages = conversation.filter(msg => msg.sender !== 'system');
        if (userMessages.length === 0) {
          newMatches++;
        } else {
          // Count unread user messages (excluding system messages)
          const unreadUserMessages = userMessages.filter(msg => !msg.read);
          unreadMessages += unreadUserMessages.length;
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
      if (e.key === 'chatMessages' || e.key === 'mutualMatches') {
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