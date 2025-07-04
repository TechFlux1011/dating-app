import React, { useState, useEffect } from 'react';
import './Matches.css';

const Matches = ({ matches, userProfile, onReset, compact = false }) => {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [userLikes, setUserLikes] = useState(new Set()); // Likes given by current user
  const [mutualMatches, setMutualMatches] = useState(new Set()); // Mutual matches

  // Load saved likes from localStorage
  useEffect(() => {
    const savedUserLikes = JSON.parse(localStorage.getItem('userLikes') || '{}');
    const currentUserLikes = savedUserLikes[userProfile.id] || [];
    setUserLikes(new Set(currentUserLikes));
    
    // Calculate mutual matches
    const savedMutualMatches = JSON.parse(localStorage.getItem('mutualMatches') || '[]');
    setMutualMatches(new Set(savedMutualMatches));
  }, [userProfile.id]);

  // Save likes to localStorage whenever userLikes change
  useEffect(() => {
    if (userProfile.id) {
      const savedUserLikes = JSON.parse(localStorage.getItem('userLikes') || '{}');
      savedUserLikes[userProfile.id] = Array.from(userLikes);
      localStorage.setItem('userLikes', JSON.stringify(savedUserLikes));
    }
  }, [userLikes, userProfile.id]);

  const handleMatchClick = (match) => {
    setSelectedMatch(match);
  };

  const closeModal = () => {
    setSelectedMatch(null);
  };

  const checkForMutualMatch = (userId, likedUserId) => {
    console.log(`🔍 checkForMutualMatch called: ${userId} → ${likedUserId}`);
    
    // Check if the liked user has also liked the current user
    const savedUserLikes = JSON.parse(localStorage.getItem('userLikes') || '{}');
    const likedUserLikes = savedUserLikes[likedUserId] || [];
    
    console.log(`📋 ${likedUserId}'s likes:`, likedUserLikes);
    console.log(`❓ Does ${likedUserId} like ${userId}?`, likedUserLikes.includes(userId));
    
    if (likedUserLikes.includes(userId)) {
      // It's a mutual match! Create the chat
      const mutualMatchKey = [userId, likedUserId].sort().join('_');
      console.log(`🔗 Creating mutual match key: ${mutualMatchKey}`);
      
      // Add to mutual matches
      const savedMutualMatches = JSON.parse(localStorage.getItem('mutualMatches') || '[]');
      if (!savedMutualMatches.includes(mutualMatchKey)) {
        console.log(`✅ Creating new mutual match: ${mutualMatchKey}`);
        savedMutualMatches.push(mutualMatchKey);
        localStorage.setItem('mutualMatches', JSON.stringify(savedMutualMatches));
        setMutualMatches(new Set(savedMutualMatches));
        
        // Create initial chat with welcome message
        const savedChatMessages = JSON.parse(localStorage.getItem('chatMessages') || '{}');
        if (!savedChatMessages[mutualMatchKey]) {
          console.log(`💬 Creating initial chat message for ${mutualMatchKey}`);
          savedChatMessages[mutualMatchKey] = [{
            id: Date.now(),
            text: "Someone you like, likes you too! Send them a message to get things started.",
            sender: 'system',
            timestamp: Date.now(),
            read: false
          }];
          localStorage.setItem('chatMessages', JSON.stringify(savedChatMessages));
        } else {
          console.log(`💬 Chat already exists for ${mutualMatchKey}`);
        }
        
        // Trigger refresh of message counts
        window.dispatchEvent(new Event('refreshMessageCounts'));
        
        return true; // It's a new mutual match
      } else {
        console.log(`⚠️ Mutual match already exists: ${mutualMatchKey}`);
        return true; // It's already a mutual match
      }
    }
    
    return false; // Not a mutual match yet
  };

  const handleLike = (match) => {
    if (isLiked(match)) {
      // User is trying to unlike
      setUserLikes(prev => {
        const newLikes = new Set(prev);
        newLikes.delete(match.id);
        return newLikes;
      });
      
      // Remove from mutual matches if it exists
      const mutualMatchKey = [userProfile.id, match.id].sort().join('_');
      if (mutualMatches.has(mutualMatchKey)) {
        setMutualMatches(prev => {
          const newMatches = new Set(prev);
          newMatches.delete(mutualMatchKey);
          return newMatches;
        });
        
        // Remove from localStorage
        const savedMutualMatches = JSON.parse(localStorage.getItem('mutualMatches') || '[]');
        const updatedMatches = savedMutualMatches.filter(key => key !== mutualMatchKey);
        localStorage.setItem('mutualMatches', JSON.stringify(updatedMatches));
        
        // Remove chat messages
        const savedChatMessages = JSON.parse(localStorage.getItem('chatMessages') || '{}');
        delete savedChatMessages[mutualMatchKey];
        localStorage.setItem('chatMessages', JSON.stringify(savedChatMessages));
        
        // Also remove the automatic like back from the mock profile
        if (match.isMock) {
          const savedUserLikes = JSON.parse(localStorage.getItem('userLikes') || '{}');
          if (savedUserLikes[match.id]) {
            savedUserLikes[match.id] = savedUserLikes[match.id].filter(id => id !== userProfile.id);
            localStorage.setItem('userLikes', JSON.stringify(savedUserLikes));
          }
        }
        
        // Trigger refresh of message counts
        window.dispatchEvent(new Event('refreshMessageCounts'));
      }
    } else {
      // User is liking
      console.log(`👍 User is liking ${match.name} (ID: ${match.id})`);
      setUserLikes(prev => new Set([...prev, match.id]));
      
      // For testing purposes: if this is a mock profile, automatically make them like the user back
      if (match.isMock) {
        console.log(`🤖 ${match.name} is a mock profile, automatically liking back...`);
        const savedUserLikes = JSON.parse(localStorage.getItem('userLikes') || '{}');
        
        // Initialize the mock profile's likes if they don't exist
        if (!savedUserLikes[match.id]) {
          savedUserLikes[match.id] = [];
        }
        
        // Add the current user to the mock profile's likes (if not already there)
        if (!savedUserLikes[match.id].includes(userProfile.id)) {
          savedUserLikes[match.id].push(userProfile.id);
          localStorage.setItem('userLikes', JSON.stringify(savedUserLikes));
          console.log(`💾 Saved ${match.name}'s like for user ${userProfile.id}`);
        } else {
          console.log(`⚠️ ${match.name} already liked user ${userProfile.id}`);
        }
      } else {
        console.log(`👤 ${match.name} is not a mock profile, no automatic like-back`);
      }
      
      // Check for mutual match (this will now always be true for mock profiles)
      console.log(`🔍 Checking for mutual match between ${userProfile.id} and ${match.id}...`);
      const isMutualMatch = checkForMutualMatch(userProfile.id, match.id);
      
      if (isMutualMatch) {
        // Show a celebration or notification that it's a match
        console.log(`🎉 It's a match with ${match.name}!`);
        console.log(`💬 Chat should now be created in Messages`);
        
        // Show a brief toast notification
        if (match.isMock) {
          console.log('💡 Mock profiles automatically like you back for testing purposes!');
        }
      } else {
        console.log(`❌ No mutual match yet with ${match.name}`);
      }
    }
  };

  const handlePass = (match) => {
    // Remove like if it exists
    if (isLiked(match)) {
      handleLike(match); // This will unlike the user
    }
    closeModal();
  };

  const isLiked = (match) => {
    return userLikes.has(match.id);
  };

  const isMutualMatch = (match) => {
    const mutualMatchKey = [userProfile.id, match.id].sort().join('_');
    return mutualMatches.has(mutualMatchKey);
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
              className={`match-card ${isMutualMatch(match) ? 'mutual-match' : ''}`}
              onClick={() => handleMatchClick(match)}
            >
              <div className="match-header">
                <h3>{match.name}</h3>
                <div className="match-score">
                  {getMatchScore(match)}% Match
                  {isMutualMatch(match) && <span className="mutual-badge">💕 Match!</span>}
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
                {isMutualMatch(selectedMatch) && <span className="mutual-badge-large">💕 It's a Match!</span>}
              </div>
            </div>
            
            <div className="modal-body">
              <div className="profile-section">
                <h3>Basic Info</h3>
                <div className="basic-info">
                  <p><strong>Age:</strong> {selectedMatch.age}</p>
                  <p><strong>Gender:</strong> {selectedMatch.gender}</p>
                  <p><strong>Sexuality:</strong> {selectedMatch.sexuality}</p>
                  <p><strong>Looking for:</strong> {selectedMatch.matchPreferences}</p>
                </div>
              </div>
              
              <div className="profile-section">
                <h3>About {selectedMatch.name}</h3>
                <p>{selectedMatch.selfDescription}</p>
              </div>
              
              <div className="profile-section">
                <h3>What They're Looking For</h3>
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
              <button 
                className={`like-button ${isLiked(selectedMatch) ? 'liked' : ''}`}
                onClick={() => handleLike(selectedMatch)}
              >
                {isLiked(selectedMatch) ? '💕 Liked' : '💕 Like'}
              </button>
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