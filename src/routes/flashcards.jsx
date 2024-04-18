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
	MenuItem
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
	const [newQuestionImage, setQuestionNewImage] = React.useState(null);
	const [newQuestionAudio, setQuestionNewAudio] = React.useState(null);
	const [newAnswerImage, setNewAnswerImage] = React.useState(null);
	const [newAnswerAudio, setNewAnswerAudio] = React.useState(null);
	const [loading, setLoading] = React.useState(true);
	const [isUserCards, setIsUserCards] = React.useState(true);
	const [currentIndex, setCurrentIndex] = React.useState(0);
	const [studyStartTime, setStudyStartTime] = React.useState(null);
	const [displayDuration, setDisplayDuration] = React.useState(false);
	const [studyDuration, setStudyDuration] = React.useState(0);
	// flag to make a card count as studied when it has been flipped
	const [cardStudied, setCardStudied] = React.useState(false);
	// track flashcard sets that have been shared with the user
	const [shareEmail, setShareEmail] = React.useState('');
	const [sharedOptions, setSharedOptions] = React.useState([]);
	const [selectedOption, setSelectedOption] = React.useState('');
	const user = useUser(true);
	const db = getFirestore(app);
	const storage = getStorage();

	const progress = ((currentIndex + 1) / flashcardList.length) * 100;

	const col = user
		? collection(db, `flashcards/${user?.email}/card-data`)
		: null;

	const sharedCol = user
		? collection(db, `flashcards/${user?.email}/shared`)
		: null;

	const userStatsCol = user
		? collection(db, `userStats/${user?.uid}/timeStudied`)
		: null;

	useEffect(() => {
		setIsUserCards(true);
		fetchCards('My Flashcards');
		fetchSharedList();
	}, [user]);

	const fetchSharedList = async () => {
		if (!sharedCol) return;

		try {
			const snapshot = await getDocs(sharedCol);
			const sharedList = ['My Flashcards'];
			snapshot.forEach(doc => {
				const data = doc.data();
				sharedList.push(data.email);
			});

			setSharedOptions(sharedList);
			if (sharedList.length > 0) {
				setSelectedOption(sharedList[0]);
			}
		} catch (error) {
			console.error('Error fetching shared options:', error);
		}
	};

	const uploadUserStats = async (startTime, endTime, durationMs, duration, numCardsStudied) => {
		if (!userStatsCol) return;

		if (numCardsStudied > 0) {
			const statsData = {
				startTime,
				endTime,
				durationMs,
				duration,
				numCardsStudied,
				username: user.displayName
			};

			try {
				await addDoc(userStatsCol, statsData);
			} catch (error) {
				console.error('Error uploading user statistics:', error);
			}
		}
	};

	const fetchCards = async (email) => {
		if (!col) return;

		setIsUserCards(false);
		var c = collection(db, `flashcards/${email}/card-data`);
		if (email === 'My Flashcards') {
			setIsUserCards(true);
			c = col;
		}
		//sorting flashcards by time created at (i.e. appending new card to end of the collection)
		const q = query(c, orderBy('createdAt'));
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

	const handleChangedCards = async event => {
		setSelectedOption(event.target.value);
		console.log('selected options:', event.target.value);
		if (event.target.value == 'My Flashcards') {
			setIsUserCards(true);
		} else {
			setIsUserCards(false);
		}
		setCurrentIndex(0);
		fetchCards(event.target.value);
	};

	async function getEmailSharedList(email) {
		const emailCol = user
			? collection(db, `flashcards/${email}/shared`)
			: null;

		if (!emailCol) return;

		try {
			const snapshot = await getDocs(emailCol);
			const sharedList = [];
			snapshot.forEach(doc => {
				const data = doc.data();
				sharedList.push(data.email);
			});

			if (sharedList.length == 0) {
				return false;
			}
			if (sharedList.includes(user.email)) {
				return true;
			}
		} catch (error) {
			console.error('Error fetching shared emails:', error);
		}
		return false;
	};

	const doShareCards = async () => {
		if (!sharedCol) return;

		if (await getEmailSharedList(shareEmail)) {
			setShareEmail('');
			alert('User already has access to these flashcards');
			return;
		}

		const shareData = { email: user.email }

		console.log('shareData uploading:', shareData)

		const addShareCol = user
			? collection(db, `flashcards/${shareEmail}/shared`)
			: null;

		try {
			await addDoc(addShareCol, shareData);
		} catch (error) {
			console.error('Error sharing flashcards:', error);
		}

		fetchSharedList();
		setShareEmail('');
	};

	const uploadCard = async flashcard => {
		//adding created at field to flashcard
		await addDoc(col, {
			...flashcard,
			createdAt: new Date(),
		});
		setIsUserCards(true);
		fetchCards('My Flashcards');
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

		var questionImagePath = 'unset';
		if (newQuestionImage != null) {
			questionImagePath = await uploadImage(newQuestionImage);
		}
		var questionAudioPath = 'unset';
		if (newQuestionAudio != null) {
			questionAudioPath = await uploadAudio(newQuestionAudio);
		}

		var answerImagePath = 'unset';
		if (newAnswerImage != null) {
			answerImagePath = await uploadImage(newAnswerImage);
		}
		var answerAudioPath = 'unset';
		if (newAnswerAudio != null) {
			answerAudioPath = await uploadAudio(newAnswerAudio);
		}

		const newFlashcard = {
			question: newQuestion,
			answer: newAnswer,
			questionImage: questionImagePath,
			questionAudio: questionAudioPath,
			answerImage: answerImagePath,
			answerAudio: answerAudioPath
		};

		uploadCard(newFlashcard);

		setNewQuestion('');
		setNewAnswer('');
		setQuestionNewImage(null);
		setQuestionNewAudio(null);
		setNewAnswerImage(null);
		setNewAnswerAudio(null);

		document.getElementById('questionImageSelector').value = null;
		document.getElementById('questionAudioSelector').value = null;
		document.getElementById('answerImageSelector').value = null;
		document.getElementById('answerAudioSelector').value = null;
	};

	const deleteFlashcard = id => {
		// delete the document from Firestore
		deleteDoc(doc(db, `flashcards/${user?.email}/card-data`, id)).then(() => {
			setIsUserCards(false);
			fetchCards('My Flashcards');
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

	const handleQuestionSetNewImage = (event) => {
		const file = event.target.files[0];
		const limit = 1000000;

		if (file && file.size > limit) {
			alert('Selected file is exceeds limit! (1MB)');
			document.getElementById('questionImageSelector').value = null;
			return;
		}

		setQuestionNewImage(file)
	};

	const handleQuestionSetNewAudio = (event) => {
		const file = event.target.files[0];
		const limit = 1000000;

		if (file && file.size > limit) {
			alert('Selected file is exceeds limit! (1MB)');
			document.getElementById('questionAudioSelector').value = null;
			return;
		}

		setQuestionNewAudio(file)
	};

	const handleAnswerSetNewImage = (event) => {
		const file = event.target.files[0];
		const limit = 1000000;

		if (file && file.size > limit) {
			alert('Selected file is exceeds limit! (1MB)');
			document.getElementById('answerImageSelector').value = null;
			return;
		}

		setNewAnswerImage(file)
	};

	const handleAnswerSetNewAudio = (event) => {
		const file = event.target.files[0];
		const limit = 1000000;

		if (file && file.size > limit) {
			alert('Selected file is exceeds limit! (1MB)');
			document.getElementById('answerAudioSelector').value = null;
			return;
		}

		setNewAnswerAudio(file)
	};

	return (
		<Container component='main' maxWidth='sm' sx={{ mt: 10 }}>
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
						//disable if study session in progress (not null)
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
					<Typography variant='h6' align='center' sx={{ mt: 4, mb: 5 }}>
						No flashcards available.
						<br />
						Add one to get started!
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
									isUserCards={isUserCards}
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

				<TextField sx={{ mb: 6, mt: -1 }}
					select
					label="Load flashcard sets"
					value={selectedOption}
					onChange={handleChangedCards}
					fullWidth
					margin='normal'
				>
					{sharedOptions.map(option => (
						<MenuItem key={option} value={option}>{option}</MenuItem>
					))}
				</TextField>

				<Typography component='h1' variant='h5' align='center'>
					Create Flashcards
				</Typography>

				<Box component='form' onSubmit={addFlashcard}  >
					<TextField
						label='Question'
						multiline
						rows={4}
						value={newQuestion}
						onChange={e => setNewQuestion(e.target.value)}
						fullWidth
						margin='normal'
						inputProps={{ maxLength: 200 }}
					/>

					<label>
						{/* added spacing */}
						Attach question image:&nbsp;
						<input
							id='questionImageSelector'
							type='file'
							accept='image/*'
							onChange={handleQuestionSetNewImage}
						/>
					</label>

					<br />

					<label>
						{/* added spacing */}
						Attach question audio:&nbsp;
						<input
							id='questionAudioSelector'
							type='file'
							accept='audio/*'
							onChange={handleQuestionSetNewAudio}
						/>
					</label>

					<br />

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
						Attach answer image:&nbsp;
						<input
							id='answerImageSelector'
							type='file'
							accept='image/*'
							onChange={handleAnswerSetNewImage}
						/>
					</label>

					<br />

					<label>
						{/* added spacing */}
						Attach answer audio:&nbsp;
						<input
							id='answerAudioSelector'
							type='file'
							accept='audio/*'
							onChange={handleAnswerSetNewAudio}
						/>
					</label>

					<br />

					<Button type='submit' variant='contained' sx={{ mt: 2, mb: 4 }}>
						Add Flashcard
					</Button>
				</Box>

				<TextField
					label='Email address'
					value={shareEmail}
					onChange={e => setShareEmail(e.target.value)}
					fullWidth
					margin='normal'
					inputProps={{ maxLength: 100 }}
				/>

				<Button variant='contained' onClick={doShareCards} sx={{ mt: 2, mb: 5 }}>
					Share flashcards with user
				</Button>

			</Box>
		</Container>
	);
};

export default Flashcards;
