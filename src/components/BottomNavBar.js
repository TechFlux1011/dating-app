import React from 'react';
import './BottomNavBar.css';

const BottomNavBar = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bottom-nav">
      <div className="nav-container">
        <button 
          className={`nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => onTabChange('profile')}
        >
          <div className="nav-icon">👤</div>
          <span className="nav-label">Profile</span>
        </button>
        
        <button 
          className={`nav-tab ${activeTab === 'matches' ? 'active' : ''}`}
          onClick={() => onTabChange('matches')}
        >
          <div className="nav-icon">💕</div>
          <span className="nav-label">Matches</span>
        </button>
        
        <button 
          className="nav-tab search-tab"
          onClick={() => onTabChange('search')}
        >
          <div className="search-icon">🔍</div>
        </button>
        
        <button 
          className={`nav-tab ${activeTab === 'meetups' ? 'active' : ''}`}
          onClick={() => onTabChange('meetups')}
        >
          <div className="nav-icon">📍</div>
          <span className="nav-label">Meetups</span>
        </button>
        
        <button 
          className={`nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => onTabChange('settings')}
        >
          <div className="nav-icon">⚙️</div>
          <span className="nav-label">Settings</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNavBar; 