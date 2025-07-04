import React, { useState, useEffect } from 'react';
import './Meetups.css';

const Meetups = ({ currentUser, userProfiles, matches }) => {
  const [activeTab, setActiveTab] = useState('map');
  const [meetupPins, setMeetupPins] = useState([]);
  const [showPinForm, setShowPinForm] = useState(false);
  const [newPin, setNewPin] = useState({
    title: '',
    description: '',
    category: 'restaurant',
    location: '',
    latitude: null,
    longitude: null
  });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedMeetups, setAcceptedMeetups] = useState([]);

  // Load saved data from localStorage
  useEffect(() => {
    const savedPins = localStorage.getItem('meetupPins');
    const savedRequests = localStorage.getItem('pendingRequests');
    const savedAccepted = localStorage.getItem('acceptedMeetups');
    
    if (savedPins) setMeetupPins(JSON.parse(savedPins));
    if (savedRequests) setPendingRequests(JSON.parse(savedRequests));
    if (savedAccepted) setAcceptedMeetups(JSON.parse(savedAccepted));
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('meetupPins', JSON.stringify(meetupPins));
  }, [meetupPins]);

  useEffect(() => {
    localStorage.setItem('pendingRequests', JSON.stringify(pendingRequests));
  }, [pendingRequests]);

  useEffect(() => {
    localStorage.setItem('acceptedMeetups', JSON.stringify(acceptedMeetups));
  }, [acceptedMeetups]);

  const handleCreatePin = () => {
    if (!newPin.title || !newPin.location) return;
    
    const pin = {
      id: Date.now(),
      ...newPin,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    setMeetupPins([...meetupPins, pin]);
    setNewPin({
      title: '',
      description: '',
      category: 'restaurant',
      location: '',
      latitude: null,
      longitude: null
    });
    setShowPinForm(false);
  };

  const handleRequestMeetup = (pin, targetUserId) => {
    const request = {
      id: Date.now(),
      pinId: pin.id,
      fromUserId: currentUser.id,
      toUserId: targetUserId,
      pinTitle: pin.title,
      pinLocation: pin.location,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    setPendingRequests([...pendingRequests, request]);
  };

  const handleAcceptMeetup = (request) => {
    const acceptedMeetup = {
      ...request,
      status: 'accepted',
      acceptedAt: new Date().toISOString()
    };
    
    setAcceptedMeetups([...acceptedMeetups, acceptedMeetup]);
    setPendingRequests(pendingRequests.filter(r => r.id !== request.id));
  };

  const handleRejectMeetup = (request) => {
    setPendingRequests(pendingRequests.filter(r => r.id !== request.id));
  };

  const getMeetupCategories = () => [
    { id: 'restaurant', name: 'Restaurant', icon: '🍽️' },
    { id: 'coffee', name: 'Coffee Shop', icon: '☕' },
    { id: 'park', name: 'Park', icon: '🌳' },
    { id: 'museum', name: 'Museum', icon: '🏛️' },
    { id: 'bar', name: 'Bar', icon: '🍺' },
    { id: 'activity', name: 'Activity', icon: '🎯' },
    { id: 'other', name: 'Other', icon: '📍' }
  ];

  const getCategoryIcon = (category) => {
    const cat = getMeetupCategories().find(c => c.id === category);
    return cat ? cat.icon : '📍';
  };

  // Helper function to get matched users (for future use)
  // const getMatchedUsers = () => {
  //   return matches.map(match => 
  //     userProfiles.find(user => user.id === match.userId)
  //   ).filter(Boolean);
  // };

  const isUserMatched = (userId) => {
    return matches.some(match => match.userId === userId);
  };

  const renderMap = () => (
    <div className="map-container">
      <div className="map-header">
        <h3>Meetup Locations</h3>
        <button 
          className="create-pin-btn"
          onClick={() => setShowPinForm(true)}
        >
          📍 Create Pin
        </button>
      </div>
      
      <div className="map-placeholder">
        <div className="map-info">
          <h4>🗺️ Interactive Map</h4>
          <p>Map integration coming soon! For now, browse pins below.</p>
        </div>
      </div>
      
      <div className="pins-grid">
        {meetupPins.map(pin => (
          <div key={pin.id} className="pin-card">
            <div className="pin-header">
              <span className="pin-category">{getCategoryIcon(pin.category)}</span>
              <h4>{pin.title}</h4>
            </div>
            <p className="pin-location">📍 {pin.location}</p>
            <p className="pin-description">{pin.description}</p>
            
            {pin.createdBy === currentUser.id ? (
              <div className="pin-owner">
                <span className="owner-badge">Your Pin</span>
              </div>
            ) : (
              <div className="pin-actions">
                {isUserMatched(pin.createdBy) ? (
                  <button 
                    className="request-meetup-btn"
                    onClick={() => handleRequestMeetup(pin, pin.createdBy)}
                  >
                    Request Meetup
                  </button>
                ) : (
                  <div className="match-required">
                    <span>🔒 Match required to request meetup</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {meetupPins.length === 0 && (
        <div className="empty-state">
          <h3>No meetup pins yet</h3>
          <p>Be the first to create a meetup location!</p>
          <button 
            className="create-first-pin-btn"
            onClick={() => setShowPinForm(true)}
          >
            📍 Create Your First Pin
          </button>
        </div>
      )}
    </div>
  );

  const renderRequests = () => (
    <div className="requests-container">
      <h3>Meetup Requests</h3>
      
      {pendingRequests.filter(r => r.toUserId === currentUser.id).length === 0 ? (
        <div className="empty-state">
          <h4>No pending requests</h4>
          <p>When someone requests to meet at your pinned locations, they'll appear here.</p>
        </div>
      ) : (
        <div className="requests-list">
          {pendingRequests
            .filter(r => r.toUserId === currentUser.id)
            .map(request => {
              const requester = userProfiles.find(u => u.id === request.fromUserId);
              return (
                <div key={request.id} className="request-card">
                  <div className="request-header">
                    <div className="requester-info">
                      <h4>{requester?.name || 'Unknown User'}</h4>
                      <span className="request-time">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="request-details">
                    <p><strong>Wants to meet at:</strong> {request.pinTitle}</p>
                    <p><strong>Location:</strong> {request.pinLocation}</p>
                  </div>
                  <div className="request-actions">
                    <button 
                      className="accept-btn"
                      onClick={() => handleAcceptMeetup(request)}
                    >
                      ✅ Accept
                    </button>
                    <button 
                      className="reject-btn"
                      onClick={() => handleRejectMeetup(request)}
                    >
                      ❌ Decline
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );

  const renderAccepted = () => (
    <div className="accepted-container">
      <h3>Confirmed Meetups</h3>
      
      {acceptedMeetups.length === 0 ? (
        <div className="empty-state">
          <h4>No confirmed meetups</h4>
          <p>Your accepted meetup requests will appear here.</p>
        </div>
      ) : (
        <div className="accepted-list">
          {acceptedMeetups.map(meetup => {
            const otherUser = userProfiles.find(u => 
              u.id === (meetup.fromUserId === currentUser.id ? meetup.toUserId : meetup.fromUserId)
            );
            return (
              <div key={meetup.id} className="accepted-card">
                <div className="meetup-info">
                  <h4>📍 {meetup.pinTitle}</h4>
                  <p><strong>With:</strong> {otherUser?.name || 'Unknown User'}</p>
                  <p><strong>Location:</strong> {meetup.pinLocation}</p>
                  <p><strong>Confirmed:</strong> {new Date(meetup.acceptedAt).toLocaleDateString()}</p>
                </div>
                <div className="meetup-actions">
                  <button className="contact-btn">💬 Message</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="meetups-container">
      <div className="meetups-header">
        <h2>Meetups</h2>
        <p>Find people to meet in real life</p>
      </div>
      
      <div className="meetups-tabs">
        <button 
          className={`tab-btn ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          🗺️ Map
        </button>
        <button 
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          📥 Requests
        </button>
        <button 
          className={`tab-btn ${activeTab === 'accepted' ? 'active' : ''}`}
          onClick={() => setActiveTab('accepted')}
        >
          ✅ Confirmed
        </button>
      </div>
      
      <div className="meetups-content">
        {activeTab === 'map' && renderMap()}
        {activeTab === 'requests' && renderRequests()}
        {activeTab === 'accepted' && renderAccepted()}
      </div>
      
      {showPinForm && (
        <div className="pin-form-overlay">
          <div className="pin-form">
            <div className="form-header">
              <h3>Create New Pin</h3>
              <button 
                className="close-btn"
                onClick={() => setShowPinForm(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="form-content">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newPin.title}
                  onChange={(e) => setNewPin({...newPin, title: e.target.value})}
                  placeholder="e.g., Coffee meetup at Starbucks"
                />
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newPin.category}
                  onChange={(e) => setNewPin({...newPin, category: e.target.value})}
                >
                  {getMeetupCategories().map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={newPin.location}
                  onChange={(e) => setNewPin({...newPin, location: e.target.value})}
                  placeholder="e.g., 123 Main St, Downtown"
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newPin.description}
                  onChange={(e) => setNewPin({...newPin, description: e.target.value})}
                  placeholder="Tell people what makes this place special..."
                  rows="3"
                />
              </div>
              
              <div className="form-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowPinForm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="create-btn"
                  onClick={handleCreatePin}
                  disabled={!newPin.title || !newPin.location}
                >
                  Create Pin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Meetups; 