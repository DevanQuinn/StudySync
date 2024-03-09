import React, { useState, useRef } from 'react';
import "../index.css"
//import React, { useState, useEffect } from 'react';
import { Typography, Button, TextField, Stack, Box, Container, Slide } from '@mui/material';
import RoomPomodoro from '../components/RoomPomodoro';
import { useNavigate } from 'react-router-dom';

const videoUrls = [
  'jfKfPfyJRdk',
  'SllpB3W5f6s?si=TlVtxWVxM3XMkRuP',
  'ZrKPW5d3idY?si=6BVOGZQGwpvv-0MH',
  'UBw8_yfM?si=BqVaGdzPfgrE75GO',
  'HO6cbtdmkIc?si=z1IYtIcPvuO_TLpb',
  'QZTDZFtbrec?si=nbtL0zuNhQwpxSIo',
  'iicfmXFALM8?si=tTyUzAb_U8SB8v26',
  'Hc10febKlX8?si=Ruk1fIk5_tTXjzon',
  'lTRiuFIWV54?si=sJ-NOP5R7hOdR2KF',
  'c3suauAz0zQ?si=1qNiCWJcsjfzkUu5',
  'R-bI0AhSyU0?si=de1G6gGOQpxV6qb1',
  'l-2hOKIrIyI?si=R0qZ4zfe6VQSoeUL',
  '1ex_bNIFR1A?si=41o5t7ErCAjWK6Zz',
  'Jvgx5HHJ0qw?si=J1sTppx9SgjRmehE',
  // Add the rest of your URLs here
];


const RoomDetailsPage = () => {
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef(null);
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const navigate = useNavigate(); 
  const [currentVideoUrl, setCurrentVideoUrl] = useState(videoUrls[0]);

  const togglePomodoro = () => setShowPomodoro(!showPomodoro); // Toggle Pomodoro

  const changeRoom = () => {
    // Select a random video URL
    const randomIndex = Math.floor(Math.random() * videoUrls.length);
    setCurrentVideoUrl(videoUrls[randomIndex]);
  };

  const videoSrc = `https://www.youtube.com/embed/${currentVideoUrl}?playlist=${currentVideoUrl}&autoplay=1&controls=0&loop=1&modestbranding=1&mute=${isMuted ? '1' : '0'}&showinfo=0&rel=0&iv_load_policy=3`;


  const toggleVolume = () => setIsMuted(!isMuted);
  const exitRoom = () =>  navigate('/studyroom');
  const toggleMic = () => {/* Logic to toggle mic */};
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
        <Button variant="contained" onClick={editScreen}>Edit Room</Button>
        <Button variant="contained" onClick={exitRoom}>Exit Room</Button>
      </div>

      {/* Slide-up Pomodoro */}
      <Slide direction="up" in={showPomodoro} mountOnEnter unmountOnExit>
        <Box sx={{ position: 'fixed', bottom: 60, right: 0, zIndex: 1100 }}><RoomPomodoro /></Box>
      </Slide>

      {/* Slide-up Edit Menu */}
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
          <Button onClick={changeRoom}>Change Room</Button>

        </Box>
      </Slide>
    </section>
  );
};

export default RoomDetailsPage;