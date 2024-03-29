import React from 'react';

const PrivacySettings = ({ isPublic, setIsPublic }) => {
  const togglePrivacy = () => {
    setIsPublic(!isPublic);
  };

  return (
    <div>
      <h2>Privacy Settings</h2>
      <label>
        <input type="checkbox" checked={isPublic} onChange={togglePrivacy} />
        Public Profile
      </label>
    </div>
  );
};

export default PrivacySettings;
