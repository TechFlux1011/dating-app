import React from 'react';
import './UserProfile.css';

const UserProfile = ({ profile, onEdit }) => {
  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <h2>Your Profile</h2>
        <button onClick={onEdit} className="edit-profile-btn">
          Edit Profile
        </button>
      </div>
      
      <div className="profile-content">
        <div className="profile-section">
          <h3>Name</h3>
          <p>{profile.name}</p>
        </div>
        
        <div className="profile-section">
          <h3>About Me</h3>
          <p>{profile.selfDescription}</p>
        </div>
        
        <div className="profile-section">
          <h3>Looking For</h3>
          <p>{profile.lookingFor}</p>
        </div>
        
        <div className="profile-section">
          <h3>My Tags</h3>
          <div className="tags-container">
            {profile.selfTags.map((tag, index) => (
              <span key={index} className="tag profile-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="profile-section">
          <h3>Preference Tags</h3>
          <div className="tags-container">
            {profile.preferenceTags.map((tag, index) => (
              <span key={index} className="tag preference-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 