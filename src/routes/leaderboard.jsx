import React, { useState } from 'react';
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
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// Register the necessary chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const Leaderboard = () => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  //hardcoded data before linking to firebase
  const leaderboardData = [
    { username: 'User1', studyTime: '4h 30m', flashcardTime: '0h 45m', pomodoroTime: '0h 10m', studyRoomTime: '1h 30m' },
    { username: 'User2', studyTime: '3h 15m', flashcardTime: '0h 35m', pomodoroTime: '0h 8m', studyRoomTime: '1h 25m' },
    { username: 'User3', studyTime: '2h 45m', flashcardTime: '0h 30m', pomodoroTime: '0h 6m', studyRoomTime: '1h 20m' },
    { username: 'User4', studyTime: '2h 15m', flashcardTime: '0h 25m', pomodoroTime: '0h 4m', studyRoomTime: '1h 15m' },
    { username: 'User5', studyTime: '1h 45m', flashcardTime: '0h 20m', pomodoroTime: '0h 4m', studyRoomTime: '1h 10m' }
  ];

  // Function to handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Example for a single user's breakdown; adjust based on your app's state management
  const currentUser = leaderboardData[0]; // Assuming current user is 'User1'

  // Parsing times into hours (assuming the format is always 'Xh Ym')
  const parseTime = timeStr => {
    const [hours, minutes] = timeStr.split('h').map(part => parseInt(part));
    return hours + minutes / 60; // Convert minutes into a fraction of an hour
  };

  const data = {
    labels: ['Other Study Time', 'Flashcards Study Time', 'Pomodoro Study Time', 'Study Room Time'],
    datasets: [{
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
    }],
  };

  const options = {
    maintainAspectRatio: true, // This can also be false to ignore container size
    aspectRatio: 1.5, // Default is 2 (wider), lower for more square
    plugins: {
      legend: {
        position: 'top',
      }
    },
    responsive: true,
  };

  // Sorting function
  const sortedData = [...leaderboardData].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    } else {
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    }
  });

  const SortableHeader = ({ label, sortKey, currentSortKey, currentSortDirection, onClick }) => {
    const isCurrentSortKey = currentSortKey === sortKey;
    const isAscending = currentSortDirection === 'asc';

    return (
      <TableCell onClick={() => onClick(sortKey)} sx={{ cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>{label}</span>
          {isCurrentSortKey && (
            isAscending ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />
          )}
        </div>
      </TableCell>
    );
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
              <SortableHeader
                label="Total Time Studied"
                sortKey="studyTime"
                currentSortKey={sortConfig.key}
                currentSortDirection={sortConfig.direction}
                onClick={handleSort}
              />
              <SortableHeader
                label="Flashcards Study Time"
                sortKey="flashcardTime"
                currentSortKey={sortConfig.key}
                currentSortDirection={sortConfig.direction}
                onClick={handleSort}
              />
              <SortableHeader
                label="Pomodoro Study Time"
                sortKey="pomodoroTime"
                currentSortKey={sortConfig.key}
                currentSortDirection={sortConfig.direction}
                onClick={handleSort}
              />
              <SortableHeader
                label="Study Room Time"
                sortKey="studyRoomTime"
                currentSortKey={sortConfig.key}
                currentSortDirection={sortConfig.direction}
                onClick={handleSort}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((user, index) => (
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
        <Typography variant="h5" sx={{ mb: 3, mt: 2 }}>
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
      <Typography variant="h4" sx={{ mt: 4, textAlign: 'center' }}>
        Time Spent Studying
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3 }}>
        <Box sx={{ width: 400, height: 400 }}>
          <Pie data={data} />
        </Box>
      </Box>
    </Container>
  );
};


export default Leaderboard;