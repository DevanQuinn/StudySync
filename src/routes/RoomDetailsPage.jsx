import React, { useState, useRef } from 'react';
import "../index.css"
import { Typography, Button, Stack, Box, Slide, Menu, MenuItem } from '@mui/material';
import RoomPomodoro from '../components/RoomPomodoro';
import { useNavigate } from 'react-router-dom';

// Categories and their associated video URLs
const videoCategories = {
  Lofi: [
    'jfKfPfyJRdk', 'SllpB3W5f6s', 'ZrKPW5d3idY',
  ],
  Nature: [
    'UBw8_yfM', 'HO6cbtdmkIc', 'QZTDZFtbrec',
  ],
  StudyWithMe: [
    'iicfmXFALM8', 'Hc10febKlX8', 'lTRiuFIWV54',
  ],
  // Add more categories and videos as needed
};

const RoomDetailsPage = () => {
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef(null);
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // For category menu
  const navigate = useNavigate(); 
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');

  const togglePomodoro = () => setShowPomodoro(!showPomodoro);

  const handleCategoryClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeRoom = (category) => {
    // Select a random video URL from the specified category
    const videos = videoCategories[category];
    const randomIndex = Math.floor(Math.random() * videos.length);
    setCurrentVideoUrl(videos[randomIndex]);
    handleClose(); // Close the category menu
  };

  const videoSrc = `https://www.youtube.com/embed/${currentVideoUrl}?playlist=${currentVideoUrl}&autoplay=1&controls=0&loop=1&modestbranding=1&mute=${isMuted ? '1' : '0'}&showinfo=0&rel=0&iv_load_policy=3`;

  const toggleVolume = () => setIsMuted(!isMuted);
  const exitRoom = () => navigate('/studyroom');
  const editScreen = () => setShowEditMenu(!showEditMenu);

  return (
    <section className="layout">
      <div className="leftSide">
        <Typography variant="h5" component="h2" className="font-bold">
          Profiles & Hours
        </Typography>
      </div>

      <div className="body">
        <iframe ref={iframeRef} src={videoSrc} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} frameBorder="0" allowFullScreen></iframe>
      </div>

      <div className="footer">
        <Button variant="contained" onClick={() => setIsMuted(!isMuted)}>{isMuted ? 'Unmute' : 'Mute'}</Button>
        <Button variant="contained" onClick={togglePomodoro}>{showPomodoro ? 'Hide Timer' : 'Show Timer'}</Button>
        <Button variant="contained" > Invite Friends</Button>
        <Button variant="contained" onClick={exitRoom}>Exit Room</Button>
        <Button variant="contained" onClick={handleCategoryClick}>Change Room</Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {Object.keys(videoCategories).map((category) => (
            <MenuItem key={category} onClick={() => changeRoom(category)}>{category}</MenuItem>
          ))}
        </Menu>
      </div>

      <Slide direction="up" in={showPomodoro} mountOnEnter unmountOnExit>
        <Box sx={{ position: 'fixed', bottom: 60, right: 0, zIndex: 1100 }}><RoomPomodoro /></Box>
      </Slide>

      <Slide direction="up" in={showEditMenu} mountOnEnter unmountOnExit>
        <Box sx={{
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '8px',
          padding: '16px',
          position: 'fixed',
          bottom: '100px',
          left: '20px',
          zIndex: '1200',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}>
          <Button onClick={() => {/* Logic to invite friends */}}>Invite Friends</Button>
          {/* Removed the direct Change Room button as it's now part of the menu */}
        </Box>
      </Slide>
    </section>
  );
};

export default RoomDetailsPage;
