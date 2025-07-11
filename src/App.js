import React, { useState, useEffect } from 'react';
import './App.css';
import Chatbot from './components/Chatbot';
import Matches from './components/Matches';
import UserProfile from './components/UserProfile';
import BottomNavBar from './components/BottomNavBar';
import Search from './components/Search';
import Messages from './components/Messages';
import MessagesPage from './components/MessagesPage';
import { TagExtractor } from './utils/tagExtractor';
import { MatchingEngine } from './utils/matchingEngine';
import { MockDataGenerator } from './utils/mockData';

function App() {
  const [currentPhase, setCurrentPhase] = useState('welcome'); // welcome, app
  const [activeTab, setActiveTab] = useState('search'); // profile, matches, search, meetups, settings
  const [userProfile, setUserProfile] = useState({
    id: null,
    name: '',
    matchPreferences: 'both',
    age: '',
    sexuality: '',
    gender: '',
    selfDescription: '',
    lookingFor: '',
    selfTags: [],
    preferenceTags: [],
    completed: false
  });
  const [allUsers, setAllUsers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [mockDataLoaded, setMockDataLoaded] = useState(false);
  const [showMessagesPage, setShowMessagesPage] = useState(false);
  const [selectedChatMatch, setSelectedChatMatch] = useState(null);

  // Load existing users from localStorage on component mount
  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('datingAppUsers') || '[]');
    setAllUsers(savedUsers);
    
    // Check if we have mock data
    const hasMockData = savedUsers.some(user => user.isMock);
    setMockDataLoaded(hasMockData);
  }, []);

  // Save users to localStorage whenever allUsers changes
  useEffect(() => {
    localStorage.setItem('datingAppUsers', JSON.stringify(allUsers));
  }, [allUsers]);

  const handleChatbotComplete = (chatData) => {
    const tagExtractor = new TagExtractor();
    
    // Extract tags from user responses
    const selfTags = tagExtractor.extractTags(chatData.selfDescription);
    const preferenceTags = tagExtractor.extractTags(chatData.lookingFor);
    
    const newProfile = {
      id: Date.now().toString(),
      name: chatData.name,
      matchPreferences: chatData.matchPreferences,
      age: chatData.age,
      sexuality: chatData.sexuality,
      gender: chatData.gender,
      selfDescription: chatData.selfDescription,
      description: chatData.selfDescription, // Add for compatibility
      lookingFor: chatData.lookingFor,
      selfTags: selfTags,
      preferenceTags: preferenceTags,
      profileTags: selfTags, // Add for compatibility
      completed: true,
      isMock: false
    };
    
    // Save match preferences to settings
    const existingSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    const updatedSettings = {
      ...existingSettings,
      matchPreferences: chatData.matchPreferences,
      showMeIn: chatData.matchPreferences
    };
    localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
    
    setUserProfile(newProfile);
    
    // Add to all users
    const updatedUsers = [...allUsers, newProfile];
    setAllUsers(updatedUsers);
    
    // Find matches
    const matchingEngine = new MatchingEngine();
    const userMatches = matchingEngine.findMatches(newProfile, allUsers);
    setMatches(userMatches);
    
    // For testing: check if any mock profiles have already "liked" this user and create mutual matches
    const savedUserLikes = JSON.parse(localStorage.getItem('userLikes') || '{}');
    let newMutualMatches = 0;
    
    Object.keys(savedUserLikes).forEach(mockUserId => {
      const mockUserLikes = savedUserLikes[mockUserId];
      if (mockUserLikes.includes(newProfile.id)) {
        // This mock user has already liked the new user, create a mutual match
        const mutualMatchKey = [newProfile.id, mockUserId].sort().join('_');
        
        // Add to mutual matches
        const savedMutualMatches = JSON.parse(localStorage.getItem('mutualMatches') || '[]');
        if (!savedMutualMatches.includes(mutualMatchKey)) {
          savedMutualMatches.push(mutualMatchKey);
          localStorage.setItem('mutualMatches', JSON.stringify(savedMutualMatches));
          
          // Create initial chat with welcome message
          const savedChatMessages = JSON.parse(localStorage.getItem('chatMessages') || '{}');
          if (!savedChatMessages[mutualMatchKey]) {
            savedChatMessages[mutualMatchKey] = [{
              id: Date.now() + Math.random(),
              text: "Someone you like, likes you too! Send them a message to get things started.",
              sender: 'system',
              timestamp: Date.now(),
              read: false
            }];
            localStorage.setItem('chatMessages', JSON.stringify(savedChatMessages));
          }
          
          newMutualMatches++;
        }
      }
    });
    
    if (newMutualMatches > 0) {
      console.log(`🎉 You already have ${newMutualMatches} mutual matches waiting for you!`);
    }
    
    // Trigger refresh of message counts
    setTimeout(() => {
      window.dispatchEvent(new Event('refreshMessageCounts'));
    }, 100);
    
    setCurrentPhase('app');
    setActiveTab('matches');
  };

  const loadMockData = () => {
    const mockGenerator = new MockDataGenerator();
    const mockProfiles = mockGenerator.getAllMockProfiles();
    
    // Remove existing mock data and add new mock data
    const realUsers = allUsers.filter(user => !user.isMock);
    const updatedUsers = [...realUsers, ...mockProfiles];
    
    setAllUsers(updatedUsers);
    setMockDataLoaded(true);
    
    // Also generate mock likes and mutual matches
    mockGenerator.generateMockLikes();
    
    // Trigger refresh of message counts
    setTimeout(() => {
      window.dispatchEvent(new Event('refreshMessageCounts'));
    }, 100);
  };

  const clearMockData = () => {
    // Remove all mock data
    const realUsers = allUsers.filter(user => !user.isMock);
    setAllUsers(realUsers);
    setMockDataLoaded(false);
    
    // Clear likes and messages too
    const mockGenerator = new MockDataGenerator();
    mockGenerator.clearAllMockData();
    
    // Trigger refresh of message counts
    setTimeout(() => {
      window.dispatchEvent(new Event('refreshMessageCounts'));
    }, 100);
  };

  const loadTestProfiles = () => {
    const mockGenerator = new MockDataGenerator();
    const testProfiles = mockGenerator.getTestMatchProfiles();
    
    // Remove existing mock data and add test profiles
    const realUsers = allUsers.filter(user => !user.isMock);
    const updatedUsers = [...realUsers, ...testProfiles];
    
    setAllUsers(updatedUsers);
    setMockDataLoaded(true);
  };

  const resetApp = () => {
    setCurrentPhase('welcome');
    setUserProfile({
      id: null,
      name: '',
      matchPreferences: 'both',
      age: '',
      sexuality: '',
      gender: '',
      selfDescription: '',
      lookingFor: '',
      selfTags: [],
      preferenceTags: [],
      completed: false
    });
    setMatches([]);
    setActiveTab('search');
  };

  const handleTabChange = (tab) => {
    if (tab === 'search') {
      if (!userProfile.completed) {
        setCurrentPhase('profile');
      } else {
        setActiveTab(tab);
      }
    } else {
      setActiveTab(tab);
    }
  };

  const handleMessageClick = (match = null) => {
    setShowMessagesPage(true);
    setSelectedChatMatch(match);
    // Trigger refresh of message counts when messages page is opened
    setTimeout(() => {
      window.dispatchEvent(new Event('refreshMessageCounts'));
    }, 100);
  };

  const handleBackFromMessages = () => {
    setShowMessagesPage(false);
    setSelectedChatMatch(null);
    // Trigger refresh of message counts when returning from messages page
    setTimeout(() => {
      window.dispatchEvent(new Event('refreshMessageCounts'));
    }, 100);
  };

  const renderWelcomeScreen = () => (
    <div className="welcome-screen">
      <h1>💕 HeartChat</h1>
      <p>The dating app that truly understands you</p>
      
      <div className="welcome-actions">
        <button onClick={() => setCurrentPhase('profile')} className="start-button">
          Start Your Journey
        </button>
        
        <div className="mock-data-controls">
          <h3>🧪 Test the App</h3>
          <p>Load mock profiles to test the matching system</p>
          
          <div className="mock-buttons">
            {!mockDataLoaded ? (
              <>
                <button onClick={loadMockData} className="mock-button">
                  Load All Mock Profiles ({new MockDataGenerator().getAllMockProfiles().length})
                </button>
                <button onClick={loadTestProfiles} className="mock-button secondary">
                  Load Test Profiles (8)
                </button>
              </>
            ) : (
              <button onClick={clearMockData} className="mock-button danger">
                Clear Mock Data
              </button>
            )}
          </div>
          
          {mockDataLoaded && (
            <p className="mock-status">
              ✅ Mock data loaded! ({allUsers.filter(u => u.isMock).length} profiles)
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderMainApp = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <UserProfile 
            profile={userProfile} 
            onEdit={() => setCurrentPhase('profile')}
          />
        );
      case 'matches':
        return (
          <Matches 
            matches={matches} 
            userProfile={userProfile}
            onReset={resetApp}
          />
        );
      case 'search':
        return (
          <Search 
            userProfiles={allUsers}
            currentUser={userProfile}
          />
        );
      default:
        return null;
    }
  };

  const renderCurrentPhase = () => {
    switch (currentPhase) {
      case 'welcome':
        return renderWelcomeScreen();
      case 'profile':
        return (
          <Chatbot onComplete={handleChatbotComplete} />
        );
      case 'app':
        return (
          <div className="app-container">
            {showMessagesPage ? (
              <MessagesPage 
                onBack={handleBackFromMessages} 
                selectedMatch={selectedChatMatch}
                userProfile={userProfile}
                allUsers={allUsers}
              />
            ) : (
              <>
                <div className="main-content">
                  {renderMainApp()}
                </div>
                <Messages 
                  onMessageClick={handleMessageClick}
                />
                <BottomNavBar 
                  activeTab={activeTab} 
                  onTabChange={handleTabChange}
                />
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {renderCurrentPhase()}
      </header>
    </div>
  );
}

export default App;
