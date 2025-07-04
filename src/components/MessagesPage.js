import React, { useState, useEffect, useCallback } from 'react';
import './MessagesPage.css';

const MessagesPage = ({ onBack, selectedMatch, userProfile, allUsers }) => {
  const [messages, setMessages] = useState([]);
  
  // Chat interface state variables (these were missing and causing the errors)
  const [showChat, setShowChat] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const loadMessages = useCallback(() => {
    if (!userProfile) return;

    // Load mutual matches from localStorage
    const savedMutualMatches = JSON.parse(localStorage.getItem('mutualMatches') || '[]');
    const savedChatMessages = JSON.parse(localStorage.getItem('chatMessages') || '{}');

    console.log(`📱 MessagesPage: Loading messages for user ${userProfile.id}`);
    console.log(`📋 Found ${savedMutualMatches.length} mutual matches:`, savedMutualMatches);
    console.log(`💬 Chat messages data:`, savedChatMessages);

    // Create messages list from mutual matches
    const messagesList = savedMutualMatches.map(mutualMatchKey => {
      const [userId1, userId2] = mutualMatchKey.split('_');
      const matchUserId = userId1 === userProfile.id ? userId2 : userId1;
      
      // Find the match user
      const matchUser = allUsers?.find(user => user.id === matchUserId);
      const matchName = matchUser ? matchUser.name : `Match ${matchUserId}`;
      
      // Get chat history for this match
      const chatHistory = savedChatMessages[mutualMatchKey] || [];
      
      // Find the latest message
      const latestMessage = chatHistory.length > 0 
        ? chatHistory[chatHistory.length - 1] 
        : { text: "Someone you like, likes you too! Send them a message to get things started.", timestamp: Date.now() };
      
      // Check if there are unread messages (excluding system messages)
      const unreadMessages = chatHistory.filter(msg => msg.sender !== 'system' && msg.sender !== userProfile.id && !msg.read);
      const hasUnreadMessages = unreadMessages.length > 0;
      
      // Check if this is a new match (no user messages sent yet)
      const userMessages = chatHistory.filter(msg => msg.sender !== 'system');
      const isNewMatch = userMessages.length === 0;
      
      return {
        id: mutualMatchKey,
        matchUser,
        matchName,
        lastMessage: latestMessage.text,
        timestamp: latestMessage.timestamp,
        hasUnreadMessages,
        isNewMatch,
        read: !hasUnreadMessages && !isNewMatch
      };
    });

    // Sort by timestamp (newest first)
    messagesList.sort((a, b) => b.timestamp - a.timestamp);
    console.log(`📝 MessagesPage: Setting ${messagesList.length} messages:`, messagesList);
    setMessages(messagesList);
  }, [userProfile, allUsers]);

  useEffect(() => {
    loadMessages();
  }, [selectedMatch, userProfile, allUsers]);

  // Listen for real-time updates when new mutual matches are created
  useEffect(() => {
    const handleRefresh = () => {
      console.log('📱 MessagesPage: Refreshing messages due to new match');
      loadMessages();
    };

    window.addEventListener('refreshMessageCounts', handleRefresh);
    return () => {
      window.removeEventListener('refreshMessageCounts', handleRefresh);
    };
  }, [userProfile, allUsers]);

  const formatTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 1000 * 60 * 60) {
      return `${Math.floor(diff / (1000 * 60))}m ago`;
    } else if (diff < 1000 * 60 * 60 * 24) {
      return `${Math.floor(diff / (1000 * 60 * 60))}h ago`;
    } else {
      return `${Math.floor(diff / (1000 * 60 * 60 * 24))}d ago`;
    }
  };

  const handleMessageClick = (messageId) => {
    // Mark all user messages in this conversation as read (exclude system messages)
    const savedChatMessages = JSON.parse(localStorage.getItem('chatMessages') || '{}');
    const conversation = savedChatMessages[messageId] || [];
    
    // Update read status for all user messages in this conversation
    const updatedConversation = conversation.map(msg => ({
      ...msg,
      read: msg.sender === 'system' ? msg.read : true
    }));
    
    // Save back to localStorage
    savedChatMessages[messageId] = updatedConversation;
    localStorage.setItem('chatMessages', JSON.stringify(savedChatMessages));
    
    // Update the messages display to remove badges
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, read: true, hasUnreadMessages: false, isNewMatch: false } : msg
    ));
    
    // Trigger a storage event to update the badge count
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'chatMessages',
      newValue: JSON.stringify(savedChatMessages)
    }));
    
    // Also trigger custom refresh event
    window.dispatchEvent(new Event('refreshMessageCounts'));
    
    // Load the chat interface
    const messageData = messages.find(msg => msg.id === messageId);
    if (messageData) {
      setCurrentMatch(messageData);
      setChatMessages(updatedConversation);
      setShowChat(true);
    }
  };

  const handleBackFromChat = () => {
    setShowChat(false);
    setCurrentMatch(null);
    setChatMessages([]);
    setNewMessage('');
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentMatch) return;

    const messageData = {
      id: Date.now() + Math.random(),
      text: newMessage.trim(),
      sender: userProfile.id,
      timestamp: Date.now(),
      read: false
    };

    // Add to chat messages
    const updatedChatMessages = [...chatMessages, messageData];
    setChatMessages(updatedChatMessages);
    
    // Save to localStorage
    const savedChatMessages = JSON.parse(localStorage.getItem('chatMessages') || '{}');
    savedChatMessages[currentMatch.id] = updatedChatMessages;
    localStorage.setItem('chatMessages', JSON.stringify(savedChatMessages));
    
    // Clear input
    setNewMessage('');
    
    // Trigger refresh of message counts
    window.dispatchEvent(new Event('refreshMessageCounts'));
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // If chat is open, show the chat interface
  if (showChat && currentMatch) {
    return (
      <div className="messages-page">
        <div className="chat-header">
          <button onClick={handleBackFromChat} className="back-button">
            ←
          </button>
          <div className="chat-user-info">
            <span className="chat-user-name">{currentMatch.matchName}</span>
          </div>
        </div>

        <div className="chat-messages">
          {chatMessages.map(msg => (
            <div 
              key={msg.id} 
              className={`chat-message ${msg.sender === userProfile.id ? 'sent' : 'received'} ${msg.sender === 'system' ? 'system' : ''}`}
            >
              <div className="message-bubble">
                <div className="message-text">{msg.text}</div>
                <div className="message-time">{formatMessageTime(msg.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="chat-input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="chat-input"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            onClick={handleSendMessage}
            className="send-button"
            disabled={!newMessage.trim()}
          >
            Send
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-page">
      <div className="messages-header">
        <button onClick={onBack} className="back-button">
          ←
        </button>
        <h2>💬 Messages</h2>
      </div>

      <div className="messages-content">
        {messages.length === 0 ? (
          <div className="no-messages">
            <div className="no-messages-icon">💬</div>
            <h3>No matches yet</h3>
            <p>When you and someone else like each other, you'll be able to chat here!</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`message-item ${(message.hasUnreadMessages || message.isNewMatch || !message.read) ? 'unread' : ''}`}
                onClick={() => handleMessageClick(message.id)}
              >
                <div className="message-avatar">
                  👤
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-name">{message.matchName}</span>
                    <span className="message-time">{formatTime(message.timestamp)}</span>
                  </div>
                  <div className="message-preview">
                    {message.lastMessage}
                  </div>
                </div>
                {(message.hasUnreadMessages || message.isNewMatch) && (
                  <div className="message-badge">
                    {message.isNewMatch ? 'New' : 'Unread'}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage; 