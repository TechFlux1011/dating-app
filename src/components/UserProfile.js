import React from 'react';
import './UserProfile.css';

const UserProfile = ({ profile, onEdit }) => {
  // Handle case where profile is not loaded yet
  if (!profile || !profile.completed) {
    return (
      <div className="user-profile-container">
        <div className="profile-header">
          <h2>Your Profile</h2>
          <button onClick={onEdit} className="edit-profile-btn">
            Complete Profile
          </button>
        </div>
        
        <div className="profile-content">
          <div className="profile-section">
            <h3>Profile Not Complete</h3>
            <p>Please complete your profile to view it here.</p>
          </div>
        </div>
      </div>
    );
  }

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
          <h3>Basic Info</h3>
          <div className="basic-info">
            <p><strong>Age:</strong> {profile.age}</p>
            <p><strong>Sexuality:</strong> {profile.sexuality}</p>
            <p><strong>Gender:</strong> {profile.gender}</p>
          </div>
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
            {profile.selfTags && profile.selfTags.map((tag, index) => (
              <span key={index} className="tag profile-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="profile-section">
          <h3>Preference Tags</h3>
          <div className="tags-container">
            {profile.preferenceTags && profile.preferenceTags.map((tag, index) => (
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