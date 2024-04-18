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
  collection,
  getDocs,
  getFirestore,
  collectionGroup,
  orderBy,
  query,
  where,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import app from '../firebase';
import { Pie } from 'react-chartjs-2';
import useUser from '../hooks/useUser';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// Register the necessary chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const Leaderboard = () => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [totalTimeStudied, setTotalTimeStudied] = useState([]);
  const [totalFlashcardsStudied, setTotalFlashcardsStudied] = useState([]);
  const [avgTimeStudied, setAvgTimeStudied] = useState([]);
  const [boardData, setBoardData] = useState([])

  const user = useUser();
  const db = getFirestore(app);

  //hardcoded data before linking to firebase
  const leaderboardData = [
    { username: 'User1', studyTime: '4h 30m', flashcardTime: '0h 45m', pomodoroTime: '0h 10m', studyRoomTime: '1h 30m' },
    { username: 'User2', studyTime: '3h 15m', flashcardTime: '0h 35m', pomodoroTime: '0h 8m', studyRoomTime: '1h 25m' },
    { username: 'User3', studyTime: '2h 45m', flashcardTime: '0h 30m', pomodoroTime: '0h 6m', studyRoomTime: '1h 20m' },
    { username: 'User4', studyTime: '2h 15m', flashcardTime: '0h 25m', pomodoroTime: '0h 4m', studyRoomTime: '1h 15m' },
    { username: 'User5', studyTime: '1h 45m', flashcardTime: '0h 20m', pomodoroTime: '0h 4m', studyRoomTime: '1h 10m' }
  ];

  const timeStringToMilliseconds = (timeStr) => {
    const [hours, minutes] = timeStr.split('h').map(part => parseInt(part));
    return hours * 3600000 + minutes * 60000; // Convert hours to milliseconds and add to minutes in milliseconds
  };

  // Function to handle sorting
  const handleSort = (key) => {
    let direction = 'desc'; // Start with descending order
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc'; // Toggle to ascending order if already descending
    }
    // Convert the time string key to milliseconds
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
    //console.log("inside convertStatsMaptoJson")
    // Initialize an empty array to store the converted data
    const jsonArray = [];

    //console.log("  statsMap to convert is: ", statsMap)

    // Iterate over each entry in the statsMap
    Object.entries(statsMap).forEach(([username, userData], index) => {
      //console.log("username:", username);
      //console.log("userData:", userData);


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

      console.log("made userStats: ", userStats)

      // Push the created object into the jsonArray
      jsonArray.push(userStats);
    });

    return jsonArray;
  };

  const getDataMap = async (path) => {
    let dataMap = {};

    try {
      const times = await getDocs(collectionGroup(db, path));
      console.log("got collection size: ", times.size); // Log the number of documents in the snapshot

      times.forEach(doc => {
        const userData = doc.data();
        //console.log("data:", userData);

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

    console.log("statisticsMap:", statisticsMap);
    return statisticsMap
  };


  // Parsing times into hours (assuming the format is always 'Xh Ym')
  const parseTime = timeStr => {
    const [hours, minutes] = timeStr.split('h').map(part => parseInt(part));
    return hours + minutes / 60; // Convert minutes into a fraction of an hour
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


  // const data = {
  //   labels: ['Other Study Time', 'Flashcards Study Time', 'Pomodoro Study Time', 'Study Room Time'],
  //   datasets: [{
  //     label: '# of Hours',
  //     data: [
  //       parseTime(currentUser.studyTime),
  //       parseTime(currentUser.flashcardTime),
  //       parseTime(currentUser.pomodoroTime),
  //       parseTime(currentUser.studyRoomTime),
  //     ],
  //     backgroundColor: [
  //       'rgba(255, 99, 132, 0.2)',
  //       'rgba(54, 162, 235, 0.2)',
  //       'rgba(255, 206, 86, 0.2)',
  //       'rgba(75, 192, 192, 0.2)',
  //     ],
  //     borderColor: [
  //       'rgba(255, 99, 132, 1)',
  //       'rgba(54, 162, 235, 1)',
  //       'rgba(255, 206, 86, 1)',
  //       'rgba(75, 192, 192, 1)',
  //     ],
  //     borderWidth: 1,
  //   }],
  // };

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
  const sortedData = [...boardData].sort((a, b) => {
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
          {/* <Pie data={data} /> */}
        </Box>
      </Box>
    </Container>
  );
};


export default Leaderboard;