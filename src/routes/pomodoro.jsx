import * as React from 'react';
import { create } from 'timrjs';
import { useState, useEffect } from 'react';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { getFirestore, addDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import app from '../firebase';


export default function Pomodoro() {
  const [timer] = useState(create('3'));
  const [time, setTime] = useState(timer.getFt());
  const [breakTime, setBreakTime] = useState(timer.getFt());
  const [startTime, setStartTime] = useState(timer.getFt());
  const [study, setStudy] = useState("Study!");
  const [count, setCount] = useState(0);
  const [totalStudyTime, setTotalStudyTime] = useState(timer.currentTime);

  let num = 0;
  const auth = getAuth(app);
  const db = getFirestore(app);

  const handleSubmit = event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const sTime = data.get('start-time');
    let bTime = data.get('short-break-time');

    // If break time is empty, set it to 1 second
    if (!bTime) {
      bTime = '00:01';
    }

    //setTotalStudyTime(sTime);
    timer.setStartTime(sTime);
    let t = timer.getCurrentTime()
    setTotalStudyTime(t)
    console.log("set total study time to: ", t)
    setTime(sTime);
    setBreakTime(bTime);
    setStartTime(sTime);
    setStudy("Study!");
    setCount(2);
  }


  useEffect(() => {
    timer
      .ticker(({ formattedTime }) => {
        setTime(formattedTime);
      })
      .onStop(() => {
        setTime(timer.getFt());
      });
  }, [timer]);

  useEffect(() => {
    const uploadData = async () => {
      console.log("calling finish, do upload with time: ", totalStudyTime * 1000)

      const user = auth.currentUser;
      const pomodoroCol = user
        ? collection(db, `userStats/${user?.uid}/pomodoroTimes`)
        : null;

      console.log("uploading to ", user?.uid)

      const statsData = {
        durationMs: totalStudyTime * 1000
      };

      try {
        await addDoc(pomodoroCol, statsData);
      } catch (error) {
        console.error('Error uploading user statistics:', error);
      }
    }
    timer.finish(() => {
      console.log("Count: ", count);
      console.log("Num: ", num);
      if (count % 2 === 0) {
        setTime(breakTime);
        setStudy("Break!");
        num++;
        timer.setStartTime(breakTime);
        setCount(1);
      } else {
        setTime(startTime);
        setStudy("Study!");
        timer.setStartTime(startTime);
        setCount(2);
      }
    });

    if (count % 2 === 1) {
      uploadData()
    }
  }, [timer, breakTime, startTime, count]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
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
            data-testid="start-button"
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
          name='short-break-time'
          label="Short Break Time"
          type="text"
          id="short-break-time"
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
    </Container>
  );
}
