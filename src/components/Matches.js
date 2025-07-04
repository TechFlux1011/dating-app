import React, { useState, useEffect } from 'react';
import './Matches.css';

const Matches = ({ matches, userProfile, onReset, compact = false, onOpenMessages }) => {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [mutualLikes, setMutualLikes] = useState(new Set());

  // Load saved likes from localStorage
  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem('userLikes') || '[]');
    setMutualLikes(new Set(savedLikes));
  }, []);

  // Save to localStorage whenever mutualLikes change
  useEffect(() => {
    localStorage.setItem('userLikes', JSON.stringify([...mutualLikes]));
  }, [mutualLikes]);

  const handleMatchClick = (match) => {
    setSelectedMatch(match);
  };

  const closeModal = () => {
    setSelectedMatch(null);
  };

  const handleLike = (match) => {
    // For now, automatically create mutual like
    const likeKey = `${userProfile.id}_${match.id}`;
    setMutualLikes(prev => new Set([...prev, likeKey]));
    
    // Initialize empty chat for this match
    const savedChatMessages = JSON.parse(localStorage.getItem('chatMessages') || '{}');
    if (!savedChatMessages[likeKey]) {
      savedChatMessages[likeKey] = [];
      localStorage.setItem('chatMessages', JSON.stringify(savedChatMessages));
    }
    
    // Trigger refresh of message counts
    window.dispatchEvent(new Event('refreshMessageCounts'));
  };

  const handlePass = (match) => {
    // If the user had liked this match, remove the like
    if (match && isLiked(match)) {
      const likeKey = `${userProfile.id}_${match.id}`;
      setMutualLikes(prev => {
        const newLikes = new Set(prev);
        newLikes.delete(likeKey);
        return newLikes;
      });
      
      // Also remove the chat messages for this match
      const savedChatMessages = JSON.parse(localStorage.getItem('chatMessages') || '{}');
      delete savedChatMessages[likeKey];
      localStorage.setItem('chatMessages', JSON.stringify(savedChatMessages));
      
      // Trigger refresh of message counts
      window.dispatchEvent(new Event('refreshMessageCounts'));
    }
    
    closeModal();
  };

  const handleStartChat = (match) => {
    // Open messages page with specific match
    if (onOpenMessages) {
      onOpenMessages(match);
    }
    closeModal();
  };

  const isLiked = (match) => {
    const likeKey = `${userProfile.id}_${match.id}`;
    return mutualLikes.has(likeKey);
  };

  const getMatchScore = (match) => {
    if (!match.matchScore) return 0;
    return Math.round(match.matchScore * 100);
  };

  const getSharedTags = (match) => {
    if (!match.sharedTags) return [];
    return match.sharedTags.slice(0, 5); // Show max 5 shared tags
  };

  return (
    <div className={`matches-container ${compact ? 'compact' : ''}`}>
      {!compact && (
        <div className="matches-header">
          <h2>🎯 Your Matches</h2>
          <p>Found {matches.length} people who align with what you're looking for</p>
          <button onClick={onReset} className="reset-button">
            Start Over
          </button>
        </div>
      )}

      {matches.length === 0 ? (
        <div className="no-matches">
          <h3>No matches found yet 😔</h3>
          <p>Don't worry! As more people join HeartChat, you'll find your perfect match.</p>
          <p>Try describing yourself differently or expanding your preferences.</p>
        </div>
      ) : (
        <div className="matches-grid">
          {matches.map((match, index) => (
            <div 
              key={match.id} 
              className="match-card"
              onClick={() => handleMatchClick(match)}
            >
              <div className="match-header">
                <h3>{match.name}</h3>
                <div className="match-score">
                  {getMatchScore(match)}% Match
                </div>
              </div>
              
              <div className="match-preview">
                <p>{match.selfDescription.substring(0, 100)}...</p>
              </div>
              
              <div className="shared-tags">
                <h4>Shared Interests:</h4>
                <div className="tags-container">
                  {getSharedTags(match).map((tag, tagIndex) => (
                    <span key={tagIndex} className="tag shared-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="match-actions">
                <button className="view-profile-btn">
                  View Full Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for detailed match view */}
      {selectedMatch && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>×</button>
            
            <div className="modal-header">
              <h2>{selectedMatch.name}</h2>
              <div className="match-score-large">
                {getMatchScore(selectedMatch)}% Match
              </div>
            </div>
            
            <div className="modal-body">
              <div className="profile-section">
                <h3>About {selectedMatch.name}</h3>
                <p>{selectedMatch.selfDescription}</p>
              </div>
              
              <div className="profile-section">
                <h3>Looking For</h3>
                <p>{selectedMatch.lookingFor}</p>
              </div>
              
              <div className="profile-section">
                <h3>Shared Interests</h3>
                <div className="tags-container">
                  {getSharedTags(selectedMatch).map((tag, tagIndex) => (
                    <span key={tagIndex} className="tag shared-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="profile-section">
                <h3>Their Interests</h3>
                <div className="tags-container">
                  {selectedMatch.selfTags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="tag profile-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              {isLiked(selectedMatch) ? (
                <button 
                  className="message-button"
                  onClick={() => handleStartChat(selectedMatch)}
                >
                  💬 Message
                </button>
              ) : (
                <button 
                  className="like-button"
                  onClick={() => handleLike(selectedMatch)}
                >
                  💕 Like
                </button>
              )}
              <button 
                className="pass-button"
                onClick={() => handlePass(selectedMatch)}
              >
                👎 Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Matches; 