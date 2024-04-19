import React, { useEffect, useState } from 'react';
import CreatePost from '../components/posts/CreatePost';
import { Pie } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Tooltip,
	Legend,
	ArcElement,
} from 'chart.js';
//import UserStudyChart from '../routes/UserStudyChart';
import {
	Accordion,
	AccordionSummary,
	AccordionDetails,
	CssBaseline,
	Container,
	Typography,
	Box,
	CircularProgress,
	TextField,
	Button,
	Card,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AddCircleOutline } from '@mui/icons-material';
import {
	collection,
	collectionGroup,
	getDocs,
	getFirestore,
	orderBy,
	query,
	where,
	addDoc,
	serverTimestamp,
} from 'firebase/firestore';
import app from '../firebase';
import useUser from '../hooks/useUser';
import {
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Paper,
} from '@mui/material';
import moment from 'moment';
import Post from '../components/posts/Post';
import TagSearch from '../components/posts/TagSearch';
import MyNotes from '../components/MyNotes';
import TreeDisplayBanner from '../components/treeDisplayBanner';

ChartJS.register(
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	BarElement
);

const Posts = () => {
	const [posts, setPosts] = useState([]);
	const user = useUser();
	const [loading, setLoading] = useState(true);
	const [totalTimeStudied, setTotalTimeStudied] = useState([]);
	const [totalFlashcardsStudied, setTotalFlashcardsStudied] = useState([]);
	const [avgTimeStudied, setAvgTimeStudied] = useState([]);
	//const [stats, setStats] = useState({ labels: [], datasets: [] });
	const [data, setData] = useState([]);
	const [chartData, setChartData] = useState({});
	const db = getFirestore(app);

	const getDataMap = async path => {
		let dataMap = {};
		try {
			const times = await getDocs(collectionGroup(db, path));
			times.forEach(doc => {
				const userData = doc.data();
				const username = userData.username || 'unknown';

				if (!dataMap[username]) {
					dataMap[username] = [];
				}
				if (username === user.displayName.toLowerCase()) {
					dataMap[username].push({
						durationMs: Math.round(userData.durationMs / 1000) || 0,
					});
				}
			});
		} catch (error) {
			console.error('Error fetching data:', error);
		}

		console.log('made data map: ', dataMap);
		return dataMap;
	};

	const fetchData = async () => {
		console.log('Starting data fetch...');
		setLoading(true);
		try {
			const flashcardData = await getDataMap('flashcardsStudied');
			const pomodoroData = await getDataMap('pomodoroTimes');
			const studyRoomData = await getDataMap('studyRoomTimes');

			const combinedData = {
				flashcards: Object.values(flashcardData).flat(),
				pomodoro: Object.values(pomodoroData).flat(),
				studyRoom: Object.values(studyRoomData).flat(),
			};

			console.log('Combined data prepared for chart:', combinedData);
			updateChartData(combinedData);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
		setLoading(false);
	};

	const updateChartData = data => {
		console.log('Updating chart data with:', data);
		const labels = ['Flashcards', 'Pomodoro', 'Study Room'];
		const times = [
			calculateTotalTime(data.flashcards),
			calculateTotalTime(data.pomodoro),
			calculateTotalTime(data.studyRoom),
		];
		console.log('Calculated times for chart:', times);

		const totalTime = times.reduce((acc, curr) => acc + curr, 0);

		// Calculate percentages
		const percentages = times.map(time =>
			((time / totalTime) * 100).toFixed(0)
		);

		// Check if any of the times are NaN (which indicates missing data)
		if (times.some(isNaN)) {
			console.error('Some time data is missing.');
			return;
		}

		setChartData({
			labels,
			datasets: [
				{
					data: percentages,
					backgroundColor: ['#FFD8D8', '#D8FFD8', '#D8D8FF'], // Pastel colors
					hoverBackgroundColor: ['#FFB8B8', '#B8FFB8', '#B8B8FF'],
					percent: true,
				},
			],
		});
	};

	const calculateTotalTime = data => {
		if (!Array.isArray(data)) {
			console.error('Data is not an array:', data);
			return 0;
		}
		const total = data.reduce((acc, curr) => acc + (curr.durationMs || 0), 0);
		console.log('Total time calculated from data:', total);
		return total;
	};

	useEffect(() => {
		fetchData();
	}, [user]);

	const userStatsCol = user
		? collection(db, `userStats/${user?.uid}/flashcardsStudied`)
		: null;

	const fetchPosts = async () => {
		if (!user) return;
		const col = collection(db, 'posts');
		const q = query(
			col,
			where('user', '==', user.displayName.toLowerCase()),
			orderBy('created', 'desc')
		);
		const docs = await getDocs(q);
		const newPosts = [];
		docs.forEach(doc => {
			const data = doc.data();
			data.id = doc.id;
			newPosts.push(data);
		});
		setPosts(newPosts);
		setLoading(false);
	};

	const fetchUserStats = async () => {
		if (!userStatsCol) return;

		const snapshot = await getDocs(userStatsCol);
		var totalCards = 0;
		var totalTime = 0;

		snapshot.forEach(userStat => {
			const data = userStat.data();
			totalCards += data.numCardsStudied;
			totalTime += data.durationMs;
		});

		var averageTimePerCard = totalTime / (totalCards + 1);
		const totalDuration = moment.duration(totalTime);
		const totalDurationFormat = moment
			.utc(totalDuration.as('milliseconds'))
			.format('HH[h] mm[m] ss[s]');
		const avgDuration = moment.duration(averageTimePerCard);
		const avgDurationFormat = moment
			.utc(avgDuration.as('milliseconds'))
			.format('HH[h] mm[m] ss[s]');

		setTotalTimeStudied(totalDurationFormat);
		setTotalFlashcardsStudied(totalCards);
		setAvgTimeStudied(avgDurationFormat);

		console.log('numCardsStudied:', totalCards);
	};

	const createNote = async e => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		const title = data.get('title');
		if (!user) return;
		let col = collection(db, `notes`);
		const note = {
			title,
			content: '',
			owner: user.displayName,
			created: serverTimestamp(),
		};
		const res = await addDoc(col, note);
		col = collection(db, `notes/${res.id}/access`);
		await addDoc(col, {
			user: user.displayName.toLowerCase(),
			type: 'owner',
			added: serverTimestamp(),
		});
		window.location = `/note/${res.id}`;
	};

	useEffect(() => {
		fetchPosts();
		fetchUserStats();
	}, [user]);

	if (loading)
		return (
			<Box>
				<CssBaseline />
				<Typography variant='h4' sx={{ mb: 5 }}>
					Fetching posts...
				</Typography>
				<CircularProgress />
			</Box>
		);

	return (
		<Container component='main' maxWidth='lg' sx={{ mt: 14, mb: 10 }}>
			<CssBaseline />

			<Typography variant='h4' sx={{ mb: 2 }}>
				User's Tree Garden
			</Typography>

			<TreeDisplayBanner />

			<Box
				sx={{
					width: '80%',
					maxWidth: 400,
					margin: 'auto',
					paddingBottom: '20px',
				}}
			>
				<Typography variant='h4' sx={{ mb: 2, mt: 6 }}>
					Time Studied by Percentage
				</Typography>

				{chartData.labels && chartData.datasets && <Pie data={chartData} />}
			</Box>

			<Typography variant='h4' sx={{ mb: 2 }}>
				Notes
			</Typography>
			<Accordion sx={{ mt: 3 }}>
				<AccordionSummary expandIcon={<AddCircleOutline />}>
					<Typography variant='h6'>Make a new note</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Card
						sx={{ display: 'flex', flexDirection: 'column', width: 1, p: 5 }}
						component={'form'}
						onSubmit={createNote}
					>
						<TextField label='Title' name='title' sx={{ mb: 2 }} required />
						<Button variant='contained' type='submit'>
							Make a new note
						</Button>
					</Card>
				</AccordionDetails>
			</Accordion>

			<Accordion sx={{ mt: 3 }}>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography variant='h6'>Your notes</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<MyNotes variant='owned' />
				</AccordionDetails>
			</Accordion>

			<Accordion sx={{ mt: 3, mb: 5 }}>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography variant='h6'>Recently viewed notes</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<MyNotes variant='visited' />
				</AccordionDetails>
			</Accordion>

			<Typography variant='h4' sx={{ mb: 2, mt: 2 }}>
				Posts
			</Typography>

			<TagSearch />
			<Accordion sx={{ mt: 3 }}>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography variant='h6'>Make a new post</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<CreatePost fetchPosts={fetchPosts} />
				</AccordionDetails>
			</Accordion>
			<Accordion sx={{ mt: 3 }}>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography variant='h6'>{`Your posts (${posts.length})`}</Typography>
				</AccordionSummary>
				<AccordionDetails>
					{posts && (
						<Box>
							{posts.map(post => (
								<Post
									data={post}
									editable
									key={post.created}
									fetchPosts={fetchPosts}
								/>
							))}
						</Box>
					)}
				</AccordionDetails>
			</Accordion>
		</Container>
	);
};

export default Posts;
