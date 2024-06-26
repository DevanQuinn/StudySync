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

ChartJS.register(ArcElement, Tooltip, Legend);

const Leaderboard = () => {
  const [sortConfig, setSortConfig] = useState({ key: 'studyTime', direction: 'desc' });
  const [boardData, setBoardData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [isInitialSortDone, setIsInitialSortDone] = useState(false);

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

  const handleSortTime = (key) => {
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

  const handleSortCount = (key) => {
    let direction = 'desc'; // Start with descending order
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc'; // Toggle to ascending order if already descending
    }
    console.log('Sorting key:', key);
    console.log('Sorting direction:', direction);
    const sortedData = [...boardData].sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];
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

  useEffect(() => {
    if (!isInitialSortDone && boardData.length > 0) {
      // Sort the boardData by "Total Time Studied" in descending order
      handleSortTime("studyTime");
      setIsInitialSortDone(true); // Set the flag to true after the initial sorting
    }
  }, [boardData, isInitialSortDone]);

  useEffect(() => {
    if (selectedCategory === "General") {
      handleSortTime("studyTime");
    }

    if (selectedCategory === "Flashcards") {
      handleSortCount("numCardsStudied");
    }

    if (selectedCategory === "Pomodoro") {
      handleSortTime("longestSessionDuration");
    }

    if (selectedCategory === "StudyRoom") {
      handleSortCount("engagement");
    }

  }, [selectedCategory]);

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
        userData.flashcard.totalNumCards = 0
      }
      if (!userData.pomodoro) {
        userData.pomodoro = {}
        userData.pomodoro.countEach = 0
        userData.pomodoro.totalDurationEach = 0
        userData.pomodoro.longestSessionDuration = 0
      }
      if (!userData.studyRoom) {
        userData.studyRoom = {}
        userData.studyRoom.countEach = 0
        userData.studyRoom.totalDurationEach = 0
        userData.studyRoom.totalChatCount = 0
        userData.studyRoom.engagement = 0;
      }

      const userStats = {
        username,
        studyTime: formatDuration(userData.totalDuration),
        flashcardTime: formatDuration(userData.flashcard.totalDurationEach),
        pomodoroTime: formatDuration(userData.pomodoro.totalDurationEach),
        studyRoomTime: formatDuration(userData.studyRoom.totalDurationEach),
        avgTimePerCard: formatDuration(userData.flashcard.totalDurationEach / (userData.flashcard.totalNumCards + 1)),
        numCardsStudied: userData.flashcard.totalNumCards,
        numPomodoroSessions: userData.pomodoro.countEach,
        longestSessionDuration: formatDuration(userData.pomodoro.longestSessionDuration),
        avgRoomTime: formatDuration(userData.studyRoom.totalDurationEach / (userData.studyRoom.countEach + 1)),
        engagement: userData.studyRoom.totalChatCount
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
      //console.log("mapType: ", mapType);
      //console.log("map: ", map);

      Object.keys(map).forEach((username) => {
        const userData = map[username];
        //console.log(`userData for user ${username}: `, userData);

        const totalDurationEach = userData.reduce((acc, curr) => acc + curr.durationMs, 0);
        const countEach = userData.length;
        const longestSessionDuration = Math.max(...userData.map((session) => session.durationMs));

        if (!statisticsMap[username]) {
          statisticsMap[username] = {};
        }
        // Set totalDuration and totalCount for each map type
        statisticsMap[username][mapType] = {
          totalDurationEach,
          countEach,
          longestSessionDuration
        };

        if (mapType === "flashcard") {
          statisticsMap[username][mapType].totalNumCards = userData.reduce((acc, curr) => acc + curr.numCardsStudied, 0);
        }

        if (mapType === "studyRoom") {
          statisticsMap[username][mapType].totalChatCount = userData.reduce((acc, curr) => acc + curr.chatCount, 0);
        }
      });
    };

    // Calculate stats for each type of map
    calcUserStatsEach(usersFlashcardTimesMap, "flashcard");
    calcUserStatsEach(usersPomodoroTimesMap, "pomodoro");
    calcUserStatsEach(usersStudyRoomTimesMap, "studyRoom");

    // Calculate totalDuration and totalCount across all maps for each user
    Object.keys(statisticsMap).forEach((username) => {
      const userData = statisticsMap[username];
      userData.totalDuration = Object.values(userData).reduce((acc, curr) => {
        if (typeof curr === "object" && curr.totalDurationEach) {
          return acc + curr.totalDurationEach;
        }
        return acc;
      }, 0);
      userData.totalCount = Object.values(userData).reduce((acc, curr) => {
        if (typeof curr === "object" && curr.countEach) {
          return acc + curr.countEach;
        }
        return acc;
      }, 0);
    });

    return statisticsMap;
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
    maintainAspectRatio: true,
    aspectRatio: 1.5,
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
      <TableCell onClick={() => onClick(sortKey)} sx={{
        cursor: 'pointer', borderBottom: '2px solid lightgrey'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
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
        <Typography component="h1" variant="h3" sx={{ mt: 1, mb: 1 }}>
          Leaderboards
        </Typography>
      </Box>
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
          <Button variant="contained" onClick={() => setSelectedCategory('General')}>
            General
          </Button>
          <Button variant="contained" onClick={() => setSelectedCategory('Flashcards')}>
            Flashcards
          </Button>
          <Button variant="contained" onClick={() => setSelectedCategory('Pomodoro')}>
            Pomodoro
          </Button>
          <Button variant="contained" onClick={() => setSelectedCategory('StudyRoom')}>
            Study Rooms
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 1, mb: 10 }}>
        {selectedCategory === 'General' &&
          <Table sx={{ borderTop: '1px solid lightgrey' }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    borderBottom: '2px solid lightgrey',
                  }}
                >Rank</TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    borderBottom: '2px solid lightgrey',
                  }}
                >Username</TableCell>
                <SortableHeader
                  label="Total Time Studied"
                  sortKey="studyTime"
                  currentSortKey={sortConfig.key}
                  currentSortDirection={sortConfig.direction}
                  onClick={handleSortTime}
                />
                <SortableHeader
                  label="Total Flashcards Time"
                  sortKey="flashcardTime"
                  currentSortKey={sortConfig.key}
                  currentSortDirection={sortConfig.direction}
                  onClick={handleSortTime}
                />
                <SortableHeader
                  label="Total Pomodoro Time"
                  sortKey="pomodoroTime"
                  currentSortKey={sortConfig.key}
                  currentSortDirection={sortConfig.direction}
                  onClick={handleSortTime}
                />
                <SortableHeader
                  label="Total Study Room Time"
                  sortKey="studyRoomTime"
                  currentSortKey={sortConfig.key}
                  currentSortDirection={sortConfig.direction}
                  onClick={handleSortTime}
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
        }

        {selectedCategory === 'Flashcards' &&
          <Table sx={{ borderTop: '1px solid lightgrey' }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    borderBottom: '2px solid lightgrey',
                  }}
                >Rank</TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    borderBottom: '2px solid lightgrey',
                  }}
                >Username</TableCell>
                <SortableHeader
                  label="Total Number of Cards Studied"
                  sortKey="numCardsStudied"
                  currentSortKey={sortConfig.key}
                  currentSortDirection={sortConfig.direction}
                  onClick={handleSortCount}
                />
                <SortableHeader
                  label="Avgerage Study Time Per Card"
                  sortKey="avgTimePerCard"
                  currentSortKey={sortConfig.key}
                  currentSortDirection={sortConfig.direction}
                  onClick={handleSortTime}
                />
              </TableRow>
            </TableHead>
            <TableBody>
              {boardData.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell align="center">{user.numCardsStudied}</TableCell>
                  <TableCell align="center">{user.avgTimePerCard}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        }

        {selectedCategory === 'Pomodoro' &&
          <Table sx={{ borderTop: '1px solid lightgrey' }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    borderBottom: '2px solid lightgrey',
                  }}
                >Rank</TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    borderBottom: '2px solid lightgrey',
                  }}
                >Username</TableCell>
                <SortableHeader
                  label="Longest Duration of Pomodoro Sessions"
                  sortKey="longestSessionDuration"
                  currentSortKey={sortConfig.key}
                  currentSortDirection={sortConfig.direction}
                  onClick={handleSortTime}
                />
                <SortableHeader
                  label="Total Number of Pomodoro Sessions"
                  sortKey="numPomodoroSessions"
                  currentSortKey={sortConfig.key}
                  currentSortDirection={sortConfig.direction}
                  onClick={handleSortCount}
                />
              </TableRow>
            </TableHead>
            <TableBody>
              {boardData.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell align="center">{user.longestSessionDuration}</TableCell>
                  <TableCell align="center">{user.numPomodoroSessions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        }

        {selectedCategory === 'StudyRoom' &&
          <Table sx={{ borderTop: '1px solid lightgrey' }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    borderBottom: '2px solid lightgrey',
                  }}
                >Rank</TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    borderBottom: '2px solid lightgrey',
                  }}
                >Username</TableCell>
                <SortableHeader
                  label="Total Engagement in Study Room Chats"
                  sortKey="engagement"
                  currentSortKey={sortConfig.key}
                  currentSortDirection={sortConfig.direction}
                  onClick={handleSortCount}
                />
                <SortableHeader
                  label="Average Time Spent in Study Rooms"
                  sortKey="avgRoomTime"
                  currentSortKey={sortConfig.key}
                  currentSortDirection={sortConfig.direction}
                  onClick={handleSortTime}
                />
              </TableRow>
            </TableHead>
            <TableBody>
              {boardData.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell align="center">{user.engagement}</TableCell>
                  <TableCell align="center">{user.avgRoomTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        }

      </TableContainer>
    </Container>
  );
};


export default Leaderboard;

