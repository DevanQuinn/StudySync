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

const Leaderboard = () => {
  //hardcoded data before linking to firebase
  const leaderboardData = [
      { username: 'User1', studyTime: '4h 30m', flashcardTime: '0h 45m', pomodoroTime: '0h 10m', studyRoomTime: '1h 30m' },
      { username: 'User2', studyTime: '3h 15m', flashcardTime: '0h 35m', pomodoroTime: '0h 8m', studyRoomTime: '1h 25m' },
      { username: 'User3', studyTime: '2h 45m', flashcardTime: '0h 30m', pomodoroTime: '0h 6m', studyRoomTime: '1h 20m' },
      { username: 'User4', studyTime: '2h 15m', flashcardTime: '0h 25m', pomodoroTime: '0h 4m', studyRoomTime: '1h 15m' },
      { username: 'User5', studyTime: '1h 45m', flashcardTime: '0h 20m', pomodoroTime: '0h 4m', studyRoomTime: '1h 10m' }
  ];

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
    </Container>
  );
};

export default Leaderboard;