import React, { useState, useEffect } from 'react';
import './MessagesPage.css';

const MessagesPage = ({ onBack, selectedMatch, userProfile, allUsers }) => {
  const [messages, setMessages] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem('userLikes') || '[]');
    const savedChatMessages = JSON.parse(localStorage.getItem('chatMessages') || '{}');
    
    // Create messages preview from actual chats
    const messagesList = savedLikes.map(likeKey => {
      const chatHistory = savedChatMessages[likeKey] || [];
      const lastMessage = chatHistory[chatHistory.length - 1];
      const [, matchId] = likeKey.split('_');
      
      // Find the actual match user
      const matchUser = allUsers?.find(user => user.id === matchId);
      const matchName = matchUser ? matchUser.name : `Match ${matchId}`;
      
      // Check if this conversation has unread messages
      const hasUnreadMessages = chatHistory.some(msg => !msg.read);
      
      if (lastMessage) {
        return {
          id: likeKey,
          sender: matchName,
          message: lastMessage.text,
          timestamp: lastMessage.timestamp,
          read: lastMessage.read,
          avatar: "💕",
          matchUser: matchUser,
          hasUnreadMessages: hasUnreadMessages
        };
      }
      
      return {
        id: likeKey,
        sender: matchName,
        message: "You matched! Start the conversation.",
        timestamp: Date.now(),
        read: false, // New matches should be marked as unread
        avatar: "💕",
        matchUser: matchUser,
        hasUnreadMessages: false,
        isNewMatch: true
      };
    });
    
    setMessages(messagesList);
    
    // If a specific match was selected, open that chat
    if (selectedMatch && userProfile) {
      const likeKey = `${userProfile.id}_${selectedMatch.id}`;
      const chatHistory = savedChatMessages[likeKey] || [];
      setCurrentMatch(selectedMatch);
      setChatMessages(chatHistory);
      setShowChat(true);
    } else {
      // Make sure we're showing the messages list
      setShowChat(false);
      setCurrentMatch(null);
      setChatMessages([]);
    }
  }, [selectedMatch, userProfile, allUsers]);

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
    // Mark all messages in this conversation as read
    const savedChatMessages = JSON.parse(localStorage.getItem('chatMessages') || '{}');
    const conversation = savedChatMessages[messageId] || [];
    
    // Update read status for all messages in this conversation
    const updatedConversation = conversation.map(msg => ({
      ...msg,
      read: true
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
    
    // Open the chat for this conversation
    const message = messages.find(msg => msg.id === messageId);
    if (message && message.matchUser) {
      setCurrentMatch(message.matchUser);
      setChatMessages(updatedConversation);
      setShowChat(true);
    }
  };

  const handleBackToMessages = () => {
    setShowChat(false);
    setCurrentMatch(null);
    setChatMessages([]);
    setNewMessage('');
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentMatch || !userProfile) return;
    
    const likeKey = `${userProfile.id}_${currentMatch.id}`;
    const message = {
      id: Date.now(),
      text: newMessage.trim(),
      sender: userProfile.id,
      timestamp: Date.now(),
      read: false
    };

    const savedChatMessages = JSON.parse(localStorage.getItem('chatMessages') || '{}');
    const updatedConversation = [...(savedChatMessages[likeKey] || []), message];
    savedChatMessages[likeKey] = updatedConversation;
    localStorage.setItem('chatMessages', JSON.stringify(savedChatMessages));

    setChatMessages(updatedConversation);
    setNewMessage('');
    
    // Trigger refresh of message counts
    window.dispatchEvent(new Event('refreshMessageCounts'));
  };

  // If we're showing a specific chat
  if (showChat && currentMatch) {
    return (
      <div className="messages-page">
        <div className="messages-header">
          <button onClick={handleBackToMessages} className="back-button">
            ←
          </button>
          <h2>💬 {currentMatch.name}</h2>
        </div>

        <div className="chat-content">
          <div className="chat-messages">
            {chatMessages.length === 0 ? (
              <div className="no-chat-messages">
                <div className="no-messages-icon">🎉</div>
                <h3>You matched with {currentMatch.name}!</h3>
                <p>Start the conversation and get to know each other.</p>
              </div>
            ) : (
              chatMessages.map(message => (
                <div 
                  key={message.id} 
                  className={`chat-message ${message.sender === userProfile.id ? 'sent' : 'received'}`}
                >
                  <div className="message-bubble">
                    {message.text}
                  </div>
                  <div className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="chat-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="message-input"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <button 
              className="send-message-btn"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, show the messages list
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
            <h3>No messages yet</h3>
            <p>Start chatting with your matches to see messages here!</p>
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
                  {message.avatar}
                </div>
                <div className="message-info">
                  <div className="message-sender">
                    {message.sender}
                    {(message.hasUnreadMessages || message.isNewMatch || !message.read) && (
                      <span className="red-badge">
                        {message.isNewMatch ? 'New' : 'Unread'}
                      </span>
                    )}
                  </div>
                  <div className="message-preview">
                    {message.message}
                  </div>
                  <div className="message-time">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage; 