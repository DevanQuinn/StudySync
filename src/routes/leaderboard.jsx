import React, { useState, useEffect } from 'react';
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
import {
  getDocs,
  getFirestore,
  collectionGroup,
} from 'firebase/firestore';
import app from '../firebase';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// Register the necessary chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const Leaderboard = () => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [boardData, setBoardData] = useState([])

  const db = getFirestore(app);

  const timeStringToMilliseconds = (timeStr) => {
    const regex = /(?:(\d+)h)? ?(?:(\d+)m)? ?(?:(\d+)s)?/;
    const match = timeStr.match(regex);

    if (!match) {
      throw new Error('Invalid time string format. Expected format: XXh XXm XXs');
    }

    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;

    const milliseconds = hours * 3600000 + minutes * 60000 + seconds * 1000;

    return milliseconds;
  };

  // Function to handle sorting
  const handleSort = (key) => {
    let direction = 'desc'; // Start with descending order
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc'; // Toggle to ascending order if already descending
    }
    console.log('Sorting key:', key);
    console.log('Sorting direction:', direction);
    const sortedData = [...boardData].sort((a, b) => {
      const valueA = timeStringToMilliseconds(a[key]);
      const valueB = timeStringToMilliseconds(b[key]);
      if (direction === 'asc') {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });
    setSortConfig({ key, direction });
    setBoardData(sortedData);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const usersFlashcardTimesMap = await getDataMap('flashcardsStudied');
    //console.log("got the usersFlashcardTimesMap: ", usersFlashcardTimesMap)

    const usersPomodoroTimesMap = await getDataMap('pomodoroTimes');
    //console.log("got the usersPomodoroTimesMap: ", usersPomodoroTimesMap)

    const usersStudyRoomTimesMap = await getDataMap('studyRoomTimes');
    //console.log("got the usersStudyRoomTimesMap: ", usersStudyRoomTimesMap)

    const statsMap = calculateStatistics(usersFlashcardTimesMap, usersPomodoroTimesMap, usersStudyRoomTimesMap);
    console.log("created statsMap from calculateStatistics: ", statsMap)
    setBoardData(convertStatsMapToJsonArray(statsMap));
  };

  const convertStatsMapToJsonArray = (statsMap) => {
    const jsonArray = [];

    // Iterate over each entry in the statsMap
    Object.entries(statsMap).forEach(([username, userData], index) => {

      // Create an object with the required fields
      if (!userData) {
        userData = {}
        userData.totalDuration = 0
        userData.totalCount = 0
      }
      if (!userData.flashcard) {
        userData.flashcard = {}
        userData.flashcard.countEach = 0
        userData.flashcard.totalDurationEach = 0
      }
      if (!userData.pomodoro) {
        userData.pomodoro = {}
        userData.pomodoro.countEach = 0
        userData.pomodoro.totalDurationEach = 0
      }
      if (!userData.studyRoom) {
        userData.studyRoom = {}
        userData.studyRoom.countEach = 0
        userData.studyRoom.totalDurationEach = 0
      }

      const userStats = {
        username,
        studyTime: formatDuration(userData.totalDuration),
        flashcardTime: formatDuration(userData.flashcard.totalDurationEach),
        pomodoroTime: formatDuration(userData.pomodoro.totalDurationEach),
        studyRoomTime: formatDuration(userData.studyRoom.totalDurationEach),
      };

      // Push the created object into the jsonArray
      jsonArray.push(userStats);
    });

    return jsonArray;
  };

  const getDataMap = async (path) => {
    let dataMap = {};

    try {
      const times = await getDocs(collectionGroup(db, path));

      times.forEach(doc => {
        const userData = doc.data();

        const username = userData.username;
        if (!dataMap[username]) {
          dataMap[username] = [];
        }

        dataMap[username].push(userData);
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }

    return dataMap;
  };

  const calculateStatistics = (usersFlashcardTimesMap, usersPomodoroTimesMap, usersStudyRoomTimesMap) => {
    let statisticsMap = {};

    // Helper function to sum up durations and count occurrences for each username
    const calcUserStatsEach = (map, mapType) => {
      Object.keys(map).forEach(username => {
        const userData = map[username];
        const totalDurationEach = userData.reduce((acc, curr) => acc + curr.durationMs, 0);
        const countEach = userData.length;
        if (!statisticsMap[username]) {
          statisticsMap[username] = {};
        }
        // Set totalDuration and totalCount for each map type
        statisticsMap[username][mapType] = {
          totalDurationEach,
          countEach
        };
      });
    };

    // Calculate stats for each type of map
    calcUserStatsEach(usersFlashcardTimesMap, 'flashcard');
    calcUserStatsEach(usersPomodoroTimesMap, 'pomodoro');
    calcUserStatsEach(usersStudyRoomTimesMap, 'studyRoom');

    // Calculate totalDuration and totalCount across all maps for each user
    Object.keys(statisticsMap).forEach(username => {
      const userData = statisticsMap[username];
      userData.totalDuration = Object.values(userData).reduce((acc, curr) => {
        if (typeof curr === 'object' && curr.totalDurationEach) {
          return acc + curr.totalDurationEach;
        }
        return acc;
      }, 0);
      userData.totalCount = Object.values(userData).reduce((acc, curr) => {
        if (typeof curr === 'object' && curr.countEach) {
          return acc + curr.countEach;
        }
        return acc;
      }, 0);
    });

    return statisticsMap
  };

  const formatDuration = (milliseconds) => {
    // Convert milliseconds to seconds
    const seconds = Math.floor(milliseconds / 1000);

    // Calculate hours, minutes, and remaining seconds
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    // Format the time string
    const formattedHours = hours > 0 ? `${hours}h ` : '';
    const formattedMinutes = minutes > 0 ? `${minutes}m ` : '';
    const formattedSeconds = remainingSeconds > 0 || (hours === 0 && minutes === 0) ? `${remainingSeconds}s` : '';

    // Combine the formatted parts
    return formattedHours + formattedMinutes + formattedSeconds;
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
            {boardData.map((user, index) => (
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
    </Container>
  );
};


export default Leaderboard;

