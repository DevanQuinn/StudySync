import * as React from 'react';
import { create } from 'timrjs';
import { useState, useEffect } from 'react';
import { Stack } from '@mui/material';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Copyright from '../components/Copyright.jsx';
import { grey } from '@mui/material/colors';
export default function Pomodoro() {
  const [timer] = useState(create('10m'))
  const [time, setTime] = useState(timer.getFt())
  const [breakTime, setBreakTime] = useState(timer.getFt())
  const [startTime, setStartTime] = useState(timer.getFt())  
  const [study, setStudy] = useState("Study!")
  const [count, setCount] = useState(1)
  const handleSubmit = event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const sTime = data.get('start-time');
    const bTime = data.get('break-time');
    timer.setStartTime(sTime);
    setTime(sTime);
    setBreakTime(bTime);
    setStartTime(sTime);
    setStudy("Study!")
    setCount(2)
  }
  useEffect(() => {
    timer
       .ticker(({ formattedTime }) => {
          setTime(formattedTime)
       })
       .onStop(() => {
          setTime(timer.getFt())
       })
      .finish(() =>{
        console.log(count)
        if(count % 2 === 0) {
          setTime(breakTime)
          setStudy("Break!")
          timer.setStartTime(breakTime)
          setCount(1)
        }
        else {
          setTime(startTime)
          setStudy("Study!")
          timer.setStartTime(startTime)
          setCount(2)
        }
      })
 }, [breakTime, startTime, time])
  return (
    <Container component="main" maxWidth="xs">
        <CssBaseline />
    <Box>
      <Box
        component={"form"}
        flexDirection={"row"}
        justifyContent={"center"}
        gap={"20px"}
        onSubmit={handleSubmit}
      >
      <Typography variant="h2">
        {study}
      </Typography>
      <Typography variant="h1">
        {time}
      </Typography>
      <Stack spacing={5} direction="row" justifyContent={"center"}>
      <Button
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={() => timer.start()}
      >
        Start
        </Button>
      <Button
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={() => timer.pause()}
      >
        Pause
      </Button>
      </Stack>
      <TextField
        margin="normal"
        name='start-time'
        label="Study Time"
        type="text"
        id="study-time"
        placeholder='10:00'
        color='primary'
      />
       <TextField
        margin='normal'
        name='break-time'
        label="Break Time"
        type="text"
        id="break-time"
        placeholder='10:00'
        color='primary'
      />
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        type='submit'
      >
        Set
        </Button>
      </Box>
    </Box>
    </Container>
  );
  }