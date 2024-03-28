import React, { useEffect } from 'react';
import {
	Box,
	Typography,
	TextField,
	Button,
	Container,
	CssBaseline,
	CircularProgress,
	IconButton,
} from '@mui/material';
import {
	query,
	getFirestore,
	collection,
	getDocs,
	doc,
	addDoc,
	deleteDoc,
	orderBy
} from 'firebase/firestore';
import app from '../firebase';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import FlashCard from '../components/FlashCard';
import useUser from '../hooks/useUser';
import { v4 as uuid } from 'uuid';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { LinearProgress } from '@mui/material';
import moment from 'moment';

// variable to count number of cards studied (flipped)
let numCardsStudied = 0;


const Flashcards = () => {
	const [flashcardList, setFlashcardList] = React.useState([]);
	const [newQuestion, setNewQuestion] = React.useState('');
	const [newAnswer, setNewAnswer] = React.useState('');
	const [newImage, setNewImage] = React.useState('');
	const [newAudio, setNewAudio] = React.useState(null);
	const [loading, setLoading] = React.useState(true);
	const [currentIndex, setCurrentIndex] = React.useState(0);
	const [studyStartTime, setStudyStartTime] = React.useState(null);
	const [displayDuration, setDisplayDuration] = React.useState(false);
	const [studyDuration, setStudyDuration] = React.useState(0);
	// flag to make a card count as studied when it has been flipped
	const [cardStudied, setCardStudied] = React.useState(false);
	const user = useUser(true);
	const db = getFirestore(app);
	const storage = getStorage();

	const progress = ((currentIndex + 1) / flashcardList.length) * 100;

	const col = user
		? collection(db, `flashcards/${user?.uid}/flashcards`)
		: null;

	const userStatsCol = user
		? collection(db, `userStats/${user?.uid}/studyStats`)
		: null;

	const uploadUserStats = async (startTime, endTime, durationMs, duration, numCardsStudied) => {
		if (!userStatsCol) return;

		const statsData = { startTime, endTime, durationMs, duration, numCardsStudied };

		try {
			await addDoc(userStatsCol, statsData);
		} catch (error) {
			console.error('Error uploading user statistics:', error);
		}
	};

	const fetchCards = async () => {
		if (!col) return;
		//sorting flashcards by time created at (i.e. appending new card to end of the collection)
		const q = query(col, orderBy('createdAt'));
		const snapshot = await getDocs(q);
		const queriedFlashcards = [];
		snapshot.forEach(card => {
			const data = card.data();
			data.id = card.id;
			queriedFlashcards.push(data);
		});
		setFlashcardList(queriedFlashcards);
		setLoading(false);
	};

	useEffect(() => {
		fetchCards();
	}, [user]);

	const uploadCard = async flashcard => {
		//adding created at field to flashcard
		await addDoc(col, {
			...flashcard,
			createdAt: new Date(),
		});
		fetchCards();
	};

	const uploadImage = async imageToUpload => {
		const imageId = uuid();
		const storageRef = ref(storage, `flashcard-images/${imageId}`);
		await uploadBytes(storageRef, imageToUpload);

		return storageRef.fullPath;
	};

	const uploadAudio = async audioToUpload => {
		const audioId = uuid();
		const storageRef = ref(storage, `flashcard-audios/${audioId}`);
		await uploadBytes(storageRef, audioToUpload);

		return storageRef.fullPath;
	};

	const addFlashcard = async event => {
		/* avoids page reload when card submitted */
		event.preventDefault();

		var imagePath = 'unset';
		if (newImage != '') {
			imagePath = await uploadImage(newImage);
		}

		var audioPath = 'unset';
		if (newAudio != null) {
			audioPath = await uploadAudio(newAudio);
		}

		const newFlashcard = {
			question: newQuestion,
			answer: newAnswer,
			image: imagePath,
			audio: audioPath,
		};

		uploadCard(newFlashcard);

		setNewQuestion('');
		setNewAnswer('');
		setNewImage('');
		setNewAudio(null);

		document.getElementById('questionImageSelector').value = null;
		document.getElementById('questionAudioSelector').value = null;
	};

	const deleteFlashcard = id => {
		// delete the document from Firestore
		deleteDoc(doc(db, `flashcards/${user?.uid}/flashcards`, id)).then(() => {
			fetchCards();
			// if we reach the end of the list
			if (currentIndex === flashcardList.length - 1) {
				// we loop back to the beginning
				setCurrentIndex(flashcardList.length - 2);
			}
		});
	};

	const handleNavigation = (direction) => {
		if (cardStudied) {
			if (studyStartTime) {
				numCardsStudied += 1;
			}
			setCardStudied(false);
		}
		if (direction === 'prev') {
			// loop back when list over, else iterate forward or backward
			setCurrentIndex(currentIndex - 1);
		} else if (direction === 'next') {
			setCurrentIndex(currentIndex + 1);
		}
		console.log(cardStudied);
		console.log(numCardsStudied);

	};

	const startStudySession = () => {
		setStudyStartTime(new Date());
	};

	const endStudySession = async () => {
		if (studyStartTime) {
			const studyEndTime = new Date();

			const durationMs = (studyEndTime - studyStartTime);
			// converting milliseconds to a moment duration object
			const duration = moment.duration(durationMs);
			// formatting the duration using moment.js
			const studyDuration = moment.utc(duration.as('milliseconds')).format('HH[h] mm[m] ss[s]');

			setStudyDuration(studyDuration);
			uploadUserStats(studyStartTime, studyEndTime, durationMs, studyDuration, numCardsStudied);
			numCardsStudied = 0;
			setStudyStartTime(null);
			// flag to display time studied
			setDisplayDuration(true);
		}
	};

	const updateCardStudied = (value) => {
		setCardStudied(value);
	};

	return (
		<Container component='main' maxWidth='xs' sx={{ mt: 10 }}>
			<CssBaseline />
			<Box sx={{ maxWidth: 600 }}>
				<Typography component='h1' variant='h5' align='center'>
					Flashcards
				</Typography>

				<Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
					<Button
						variant='contained'
						color='primary'
						onClick={startStudySession}
						//disable if study session in progress (not  null)
						disabled={!!studyStartTime}
					>
						Start Study Session
					</Button>
					<Button
						variant='contained'
						color='secondary'
						onClick={endStudySession}
						//disable if study session not in progress (null)
						disabled={!studyStartTime}
					>
						End Study Session
					</Button>
				</Box>
				{displayDuration && (
					<Typography variant="body2" align="center" sx={{ mt: 2 }}>
						Time studied: {studyDuration}
					</Typography>
				)}
				{loading ? (
					<Box sx={{ mt: 4 }}>
						<CircularProgress />
					</Box>
				) : flashcardList.length === 0 ? (
					// handling case with 0 cards
					<Typography variant='h6' align='center' sx={{ mt: 4 }}>
						No flashcards available. Add one to get started!
					</Typography>
				) : (
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
						{/* displaying all flashcards */}
						{flashcardList.map((card, index) => (
							// ensures only current card is displayed (avoid stacking them up)
							<Box key={card.id} sx={{ display: index === currentIndex ? 'block' : 'none' }}>
								<FlashCard
									data={card}
									deleteFlashcard={deleteFlashcard}
									cardStudied={updateCardStudied}
								/>
							</Box>
						))}
						<Typography variant='body2' align='center' sx={{ mb: -2 }}>
							Card: {currentIndex + 1} / {flashcardList.length}
						</Typography>

						<Typography variant='body2' align='center'>
							Progress: {progress.toFixed(0)}%
						</Typography>

						<LinearProgress
							variant="determinate"
							value={progress}
							sx={{
								height: 20,
								borderRadius: 1, //making it a little curved
								mb: -2
							}}
						/>

						{/* navigation buttons */}
						<Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
							<IconButton onClick={() => handleNavigation('prev')}
								// can't go back from first card
								disabled={currentIndex === 0}
							>
								<ChevronLeft />
							</IconButton>
							<IconButton onClick={() => handleNavigation('next')}
								// can't go forward when on last card
								disabled={currentIndex === flashcardList.length - 1}
							>
								<ChevronRight />
							</IconButton>
						</Box>
					</Box>
				)}

				<Typography component='h1' variant='h5' align='center'>
					Create Flashcards
				</Typography>

				<Box component='form' onSubmit={addFlashcard}  >
					<TextField
						label='Question'
						value={newQuestion}
						onChange={e => setNewQuestion(e.target.value)}
						fullWidth
						margin='normal'
						inputProps={{ maxLength: 50 }}
					/>

					<TextField
						label='Answer'
						multiline
						rows={4}
						value={newAnswer}
						onChange={e => setNewAnswer(e.target.value)}
						fullWidth
						margin='normal'
						inputProps={{ maxLength: 200 }}
					/>

					<label>
						{/* added spacing */}
						Attach Image:&nbsp;
						<input
							id='questionImageSelector'
							type='file'
							accept='image/*'
							onChange={e => setNewImage(e.target.files[0])}
						/>
					</label>

					<br />

					<label>
						{/* added spacing */}
						Attach Audio:&nbsp;
						<input
							id='questionAudioSelector'
							type='file'
							accept='audio/*'
							onChange={e => setNewAudio(e.target.files[0])}
						/>
					</label>

					<Button type='submit' variant='contained' sx={{ mt: 2, mb: 4}}>
						Add Flashcard
					</Button>
				</Box>
			</Box>
		</Container>
	);
};

export default Flashcards;
