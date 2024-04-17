import React from 'react';
import {
  Box,
  Container,
  CssBaseline,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the necessary chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const Leaderboard = () => {
  //hardcoded data before linking to firebase
  const leaderboardData = [
      { username: 'User1', studyTime: '4h 30m', flashcardTime: '0h 45m', pomodoroTime: '0h 10m', studyRoomTime: '1h 30m' },
      { username: 'User2', studyTime: '3h 15m', flashcardTime: '0h 35m', pomodoroTime: '0h 8m', studyRoomTime: '1h 25m' },
      { username: 'User3', studyTime: '2h 45m', flashcardTime: '0h 30m', pomodoroTime: '0h 6m', studyRoomTime: '1h 20m' },
      { username: 'User4', studyTime: '2h 15m', flashcardTime: '0h 25m', pomodoroTime: '0h 4m', studyRoomTime: '1h 15m' },
      { username: 'User5', studyTime: '1h 45m', flashcardTime: '0h 20m', pomodoroTime: '0h 4m', studyRoomTime: '1h 10m' }
  ];

   // Example for a single user's breakdown; adjust based on your app's state management
   const currentUser = leaderboardData[0]; // Assuming current user is 'User1'

   // Parsing times into hours (assuming the format is always 'Xh Ym')
   const parseTime = timeStr => {
	 const [hours, minutes] = timeStr.split('h').map(part => parseInt(part));
	 return hours + minutes / 60; // Convert minutes into a fraction of an hour
   };
 
   const data = {
	 labels: ['Study Time', 'Flashcards Study Time', 'Pomodoro Study Time', 'Study Room Time'],
	 datasets: [
	   {
		 label: '# of Hours',
		 data: [
		   parseTime(currentUser.studyTime),
		   parseTime(currentUser.flashcardTime),
		   parseTime(currentUser.pomodoroTime),
		   parseTime(currentUser.studyRoomTime),
		 ],
		 backgroundColor: [
		   'rgba(255, 99, 132, 0.2)',
		   'rgba(54, 162, 235, 0.2)',
		   'rgba(255, 206, 86, 0.2)',
		   'rgba(75, 192, 192, 0.2)',
		 ],
		 borderColor: [
		   'rgba(255, 99, 132, 1)',
		   'rgba(54, 162, 235, 1)',
		   'rgba(255, 206, 86, 1)',
		   'rgba(75, 192, 192, 1)',
		 ],
		 borderWidth: 1,
	   },
	 ],
   };
 

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Box sx={{ mb: 3, mt: 11, textAlign: 'center' }}>
        <Typography component="h1" variant="h3">
          Leaderboards
        </Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Username</TableCell>
              <TableCell align="center">Total Time Studied</TableCell>
              <TableCell align="center">Flashcards Study Time</TableCell>
              <TableCell align="center">Pomodoro Study Time</TableCell>
              <TableCell align="center">Study Room Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboardData.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell align="center">{user.studyTime}</TableCell>
                <TableCell align="center">{user.flashcardTime}</TableCell>
                <TableCell align="center">{user.pomodoroTime}</TableCell>
                <TableCell align="center">{user.studyRoomTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="h5" sx = {{mb: 3, mt: 2}}>
          Leaderboards by Category
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
          <Button variant="contained">
            Flashcards
          </Button>
          <Button variant="contained">
            Pomodoro
          </Button>
          <Button variant="contained">
            Study Rooms
          </Button>
        </Box>
      </Box>

	  <Typography component="h1" variant="h4" sx={{ mt: 4 }}>
        Study Time Breakdown
      </Typography>
      <Pie data={data} />
    </Container>
  );
};

export default Leaderboard;