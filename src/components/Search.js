import React, { useState, useEffect, useRef } from 'react';
import { TagExtractor } from '../utils/tagExtractor';
import { findMatches } from '../utils/matchingEngine';
import './Search.css';

const Search = ({ userProfiles, currentUser }) => {
  const [searchPhase, setSearchPhase] = useState('input'); // input, results
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchTags, setSearchTags] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const messagesEndRef = useRef(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      const welcomeMessage = {
        id: 1,
        text: "Hi! I'm here to help you find exactly who you're looking for. Tell me about your ideal person - their personality, interests, values, or what kind of connection you want. Be as detailed as you'd like!",
        sender: 'bot',
        timestamp: Date.now()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue.trim(),
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Extract tags from search query
    const tagExtractor = new TagExtractor();
    const extractedTags = tagExtractor.extractTags(inputValue.trim());
    setSearchTags(extractedTags.map(tag => ({ name: tag, weight: 1 })));
    

    // Find matches based on search criteria
    const matches = findMatches(currentUser, userProfiles, extractedTags);
    setSearchResults(matches);

    // Simulate bot thinking time
    setTimeout(() => {
      setIsTyping(false);
      const botResponse = {
        id: messages.length + 2,
        text: `Perfect! I found ${matches.length} people who match what you're looking for. I extracted these key preferences: ${extractedTags.map(tag => `#${tag.name}`).join(', ')}. Let me show you the results!`,
        sender: 'bot',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botResponse]);
      
      // Switch to results after short delay
      setTimeout(() => {
        setSearchPhase('results');
      }, 1000);
    }, 1500);
  };

  const resetSearch = () => {
    setSearchPhase('input');
    setMessages([{
      id: 1,
      text: "Hi! I'm here to help you find exactly who you're looking for. Tell me about your ideal person - their personality, interests, values, or what kind of connection you want. Be as detailed as you'd like!",
      sender: 'bot',
      timestamp: Date.now()
    }]);
    setInputValue('');
    setSearchTags([]);
    setSearchResults([]);
    setSelectedProfile(null);
    hasInitialized.current = false;
  };

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
  };

  const closeModal = () => {
    setSelectedProfile(null);
  };

  if (searchPhase === 'input') {
    return (
      <div className="search-container">
        <div className="search-header">
          <h2>🔍 Smart Search</h2>
          <p>Describe who you're looking for and I'll find them!</p>
        </div>

        <div className="search-chat">
          <div className="search-messages">
            {messages.map(message => (
              <div key={message.id} className={`search-message ${message.sender}`}>
                <div className="search-message-content">
                  <p>{message.text}</p>
                  <span className="search-message-time">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="search-message bot">
                <div className="search-message-content">
                  <div className="search-typing-indicator">
                    <div className="search-typing-dots">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    <span>Finding matches...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="search-input-form">
            <div className="search-input-container">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Describe your ideal person..."
                className="search-input"
                disabled={isTyping}
              />
              <button type="submit" disabled={!inputValue.trim() || isTyping} className="search-submit-btn">
                <span>🔍</span>
              </button>
            </div>
          </form>
        </div>

        <div className="search-examples">
          <h3>💡 Try something like:</h3>
          <div className="search-example-chips">
            <button onClick={() => setInputValue("Looking for someone creative and artistic who loves hiking and outdoor adventures")}>
              Creative & Outdoorsy
            </button>
            <button onClick={() => setInputValue("Want to meet someone ambitious and career-focused who enjoys traveling and trying new foods")}>
              Ambitious & Adventurous
            </button>
            <button onClick={() => setInputValue("Seeking someone kind and family-oriented who values honesty and enjoys cozy nights in")}>
              Kind & Family-Oriented
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <div className="search-results-header">
        <button onClick={resetSearch} className="search-back-btn">
          ← New Search
        </button>
        <div className="search-results-info">
          <h2>Search Results ({searchResults.length})</h2>
          <div className="search-tags">
            {searchTags.map(tag => (
              <span key={tag.name} className="search-tag">#{tag.name}</span>
            ))}
          </div>
        </div>
      </div>

      {searchResults.length === 0 ? (
        <div className="search-no-results">
          <h3>😔 No matches found</h3>
          <p>Try adjusting your search criteria or being more specific about what you're looking for.</p>
          <button onClick={resetSearch} className="search-retry-btn">Try Another Search</button>
        </div>
      ) : (
        <div className="search-results-grid">
          {searchResults.map(result => (
            <div key={result.user.id} className="search-result-card" onClick={() => handleProfileClick(result.user)}>
              <div className="search-result-avatar">
                <div className="search-avatar-circle">
                  {result.user.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="search-result-info">
                <h3>{result.user.name}</h3>
                <div className="search-compatibility">
                  <span className="search-compatibility-score">{result.compatibility}% match</span>
                </div>
                <div className="search-shared-tags">
                  {result.sharedTags.slice(0, 3).map(tag => (
                    <span key={tag} className="search-shared-tag">#{tag}</span>
                  ))}
                  {result.sharedTags.length > 3 && (
                    <span className="search-more-tags">+{result.sharedTags.length - 3} more</span>
                  )}
                </div>
                <p className="search-preview">{result.user.description?.substring(0, 100)}...</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProfile && (
        <div className="search-modal-overlay" onClick={closeModal}>
          <div className="search-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="search-modal-header">
              <h2>{selectedProfile.name}</h2>
              <button onClick={closeModal} className="search-modal-close">×</button>
            </div>
            <div className="search-modal-body">
              <div className="search-profile-section">
                <h3>About</h3>
                <p>{selectedProfile.description}</p>
              </div>
              <div className="search-profile-section">
                <h3>Looking For</h3>
                <p>{selectedProfile.lookingFor}</p>
              </div>
              <div className="search-profile-section">
                <h3>Interests & Traits</h3>
                <div className="search-profile-tags">
                  {selectedProfile.profileTags?.map(tag => (
                    <span key={tag} className="search-profile-tag">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="search-modal-footer">
              <button className="search-like-btn">💖 Like</button>
              <button className="search-pass-btn">👋 Pass</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search; 