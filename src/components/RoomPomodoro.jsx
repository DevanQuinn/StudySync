import * as React from 'react';
import { create } from 'timrjs';
import { useState, useEffect } from 'react';
import { Stack, Button, TextField, Typography, Box, Container, CssBaseline } from '@mui/material';
import Draggable from 'react-draggable';
import TimerBar from './TimerBar.jsx';

export default function RoomPomodoro() {
  const [timer] = useState(create('10m'));
  const [time, setTime] = useState(timer.getFt());
  const [breakTime, setBreakTime] = useState('5m'); // Default break time
  const [startTime, setStartTime] = useState('25m'); // Default study time
  const [study, setStudy] = useState("Study!");
  const [count, setCount] = useState(1);
  const [percentDone, setPercentDone] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const sTime = data.get('start-time') || '25m'; // Fallback to default if empty
    const bTime = data.get('break-time') || '5m'; // Fallback to default if empty
    timer.setStartTime(sTime);
    setTime(sTime);
    setBreakTime(bTime);
    setStartTime(sTime);
    setStudy("Study!");
    setCount(2);
  };

  useEffect(() => {
    timer.ticker(({ formattedTime, percentDone }) => {
      setTime(formattedTime);
      setPercentDone(percentDone);
    }).finish(() => {
      if (count % 2 === 0) {
        setTime(breakTime);
        setStudy("Break!");
        timer.setStartTime(breakTime);
        setCount(1);
      } else {
        setTime(startTime);
        setStudy("Study!");
        timer.setStartTime(startTime);
        setCount(2);
      }
    });

    return () => timer.stop(); // Cleanup timer on component unmount
  }, [timer, count, breakTime, startTime]);

  return (
  <Draggable>
    <Container component="main" maxWidth="xs" sx={{ padding: 1 }}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: '8px', p: 2, // padding
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)'}}>
        <Typography variant="h5" sx={{ fontSize: '1.25rem' }}>
          {study}
        </Typography>
        <Typography variant="h6" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          {time}
        </Typography>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" sx={{ fontSize: '0.75rem', padding: '6px 12px' }} onClick={() => timer.start()}>
              Start
            </Button>
            <Button variant="contained" sx={{ fontSize: '0.75rem', padding: '6px 12px' }} onClick={() => timer.pause()}>
              Pause
            </Button>
          </Stack>
          <TextField
            size="small"
            margin="normal"
            name="start-time"
            label="Study Time"
            type="text"
            id="study-time"
            placeholder='25:00'
            color='primary'
          />
          <TextField
            size="small"
            margin="normal"
            name="break-time"
            label="Break Time"
            type="text"
            id="break-time"
            placeholder='5:00'
            color='primary'
          />
          <Button fullWidth variant="contained" sx={{ mt: 1, mb: 2, fontSize: '0.75rem', padding: '6px 12px' }} type="submit">
            Set
          </Button>
          <TimerBar percentDone={percentDone} studyState={study}/>
        </form>
      </Box>
    </Container>
    </Draggable>
  );
}
