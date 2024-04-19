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
import Copyright from '../components/Copyright.jsx';
import { grey } from '@mui/material/colors';
import TimerBar from '../components/TimerBar.jsx';
import useUser from '../hooks/useUser.jsx';
import {
	query,
	where,
	getFirestore,
	collection,
	getDocs,
	getDoc,
	setDoc,
	doc,
	addDoc,
	deleteDoc,
} from 'firebase/firestore';
import app from '../firebase.js';
import { getAuth } from 'firebase/auth';

export default function Pomodoro() {
  const [timer] = useState(create('10m'))
  const [time, setTime] = useState(timer.getFt())
  const [breakTime, setBreakTime] = useState(timer.getFt())
  const [startTime, setStartTime] = useState(timer.getFt())
  const [study, setStudy] = useState("Study!")
  const [count, setCount] = useState(1)
  const [percentDone, setPercentDone] = useState(0);
  const [treeSelection, updateTreeSelection] = useState(0);
  const [disableStartButton, updateDisableStartButton] = useState(false);
  const [totalStudyTime, setTotalStudyTime] = useState(timer.currentTime);
  const user = useUser(false);
  const db = getFirestore(app);
  const auth = getAuth(app);

  let num = 0

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
        setPercentDone(percentDone);
      })
      .onStop(() => {
        setTime(timer.getFt());
      });
  }, [timer]);

   const addTreeToGarden = (treeType, quantity, studySeconds) => {
    if (user) {
      var username;
      if (user) { //if logged in
        const q = query(collection(db, "users"), where("userID", "==", user.uid)); //set up username query
        getDocs(q).then(userssnapshot => { //get username
          userssnapshot.forEach(user => { //should only run once if userIDs are unique
            username = user.data().username; //save username
            console.log(username);
            console.log(user.uid);
          })
        }).then(() => { //with username
          getDoc(doc(db, "users", username)).then(usersnapshot => {
            console.log(usersnapshot);
            if (usersnapshot.data().trees == undefined || usersnapshot.data().trees[treeType] == undefined) {
              setDoc(doc(db, "users", username), 
                {trees : {[treeType] : Number(quantity)},
                },
                {merge:true}
              )
            } else {
              setDoc(doc(db, "users", username), 
                {trees : 
                  {[treeType] : (Number(usersnapshot.data().trees[treeType]) + Number(quantity))}},
                {merge:true}
              )
            }
            if (usersnapshot.data().totalStudySeconds == undefined ) {
              setDoc(doc(db, "users", username), {totalStudySeconds : {studySeconds}}, {merge:true});
            } else {
              setDoc(doc(db, "users", username), {totalStudySeconds : usersnapshot.data().totalStudySeconds + studySeconds}, {merge:true})
            }
          })
        })
      }
    }
  }
  
  useEffect(() => {
    const uploadData = async () => {
      console.log("calling finish, do upload with time: ", totalStudyTime * 1000)

      const user = auth.currentUser;
      const pomodoroCol = user
        ? collection(db, `userStats/${user?.uid}/pomodoroTimes`)
        : null;

      console.log("uploading to ", user?.uid)

      const statsData = {
        durationMs: totalStudyTime * 1000,
        username: user.displayName
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
        <TimerBar 
            percentDone={percentDone} 
            studyState={study} 
            treeSelection={treeSelection} 
            updateTreeSelection={updateTreeSelection} 
            addTreeToGarden={addTreeToGarden} 
            studyTime={timer.getStartTime()}
            disableStartButtonFunc={(val) => updateDisableStartButton(val)}  
          />
      </Box>
    </Container>
  );
}
