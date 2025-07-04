import React, { useState, useEffect } from 'react';
import './Settings.css';

const Settings = ({ currentUser, onUpdateUser }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    locationSharing: true,
    matchPreferences: 'both', // dating, friends, both
    ageRange: { min: 18, max: 35 },
    maxDistance: 30,
    showMeIn: 'both' // dating, friends, both
  });

  // Load settings from localStorage when component mounts
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    if (Object.keys(savedSettings).length > 0) {
      setSettings(prev => ({
        ...prev,
        ...savedSettings
      }));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  const handleClearData = () => {
    const confirmClear = window.confirm(
      'Are you sure you want to clear all your data? This action cannot be undone.'
    );
    
    if (confirmClear) {
      localStorage.clear();
      alert('All data has been cleared. Please refresh the page.');
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Settings</h2>
        <p>Customize your HeartChat experience</p>
      </div>
      
      <div className="settings-content">
        <div className="settings-section">
          <h3>Privacy & Notifications</h3>
          
          <div className="setting-item">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: e.target.checked
                })}
              />
              <span className="checkmark"></span>
              Enable notifications
            </label>
            <p className="setting-description">
              Get notified about new matches and meetup requests
            </p>
          </div>
          
          <div className="setting-item">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.locationSharing}
                onChange={(e) => setSettings({
                  ...settings,
                  locationSharing: e.target.checked
                })}
              />
              <span className="checkmark"></span>
              Share location for meetups
            </label>
            <p className="setting-description">
              Allow location sharing for meetup recommendations
            </p>
          </div>
        </div>
        
        <div className="settings-section">
          <h3>Match Preferences</h3>
          
          <div className="setting-item">
            <label className="setting-label">Looking for:</label>
            <select
              value={settings.matchPreferences}
              onChange={(e) => setSettings({
                ...settings,
                matchPreferences: e.target.value
              })}
              className="setting-select"
            >
              <option value="dating">Dating only</option>
              <option value="friends">Friends only</option>
              <option value="both">Both dating and friends</option>
            </select>
          </div>
          
          <div className="setting-item">
            <label className="setting-label">Show me in:</label>
            <select
              value={settings.showMeIn}
              onChange={(e) => setSettings({
                ...settings,
                showMeIn: e.target.value
              })}
              className="setting-select"
            >
              <option value="dating">Dating only</option>
              <option value="friends">Friends only</option>
              <option value="both">Both dating and friends</option>
            </select>
          </div>
          
          <div className="setting-item">
            <label className="setting-label">Age range:</label>
            <div className="age-range-container">
              <div className="range-input">
                <label className="range-label">Min Age:</label>
                <input
                  type="range"
                  min="18"
                  max="99"
                  value={settings.ageRange.min}
                  onChange={(e) => {
                    const newMin = parseInt(e.target.value);
                    setSettings({
                      ...settings,
                      ageRange: { 
                        min: newMin,
                        max: Math.max(newMin, settings.ageRange.max)
                      }
                    });
                  }}
                  className="range-slider"
                />
                <span className="range-value">{settings.ageRange.min}</span>
              </div>
              <div className="range-input">
                <label className="range-label">Max Age:</label>
                <input
                  type="range"
                  min="18"
                  max="99"
                  value={settings.ageRange.max}
                  onChange={(e) => {
                    const newMax = parseInt(e.target.value);
                    setSettings({
                      ...settings,
                      ageRange: { 
                        min: Math.min(settings.ageRange.min, newMax),
                        max: newMax
                      }
                    });
                  }}
                  className="range-slider"
                />
                <span className="range-value">{settings.ageRange.max}</span>
              </div>
              <div className="age-range-display">
                <span className="age-range-text">Range: {settings.ageRange.min} - {settings.ageRange.max} years</span>
              </div>
            </div>
          </div>
          
          <div className="setting-item">
            <label className="setting-label">Maximum distance:</label>
            <div className="range-input">
              <input
                type="range"
                min="1"
                max="60"
                value={settings.maxDistance}
                onChange={(e) => setSettings({
                  ...settings,
                  maxDistance: parseInt(e.target.value)
                })}
                className="range-slider"
              />
              <span className="range-value">{settings.maxDistance} miles</span>
            </div>
          </div>
        </div>
        
        <div className="settings-section">
          <h3>Account</h3>
          
          <div className="setting-item">
            <button className="save-btn" onClick={handleSave}>
              💾 Save Settings
            </button>
          </div>
          
          <div className="setting-item">
            <button className="clear-data-btn" onClick={handleClearData}>
              🗑️ Clear All Data
            </button>
            <p className="setting-description">
              This will remove all your profiles, matches, and meetup data
            </p>
          </div>
        </div>
        
        <div className="settings-section">
          <h3>About</h3>
          
          <div className="about-info">
            <h4>HeartChat v1.0.0</h4>
            <p>A unique dating app where meaningful connections begin with conversation.</p>
            <p>Built with React and lots of ❤️</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 