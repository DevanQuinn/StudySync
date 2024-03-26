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

const Flashcards = () => {
	const [flashcardList, setFlashcardList] = React.useState([]);
	const [newQuestion, setNewQuestion] = React.useState('');
	const [newAnswer, setNewAnswer] = React.useState('');
	const [newImage, setNewImage] = React.useState('');
	const [newAudio, setNewAudio] = React.useState(null);
	const [loading, setLoading] = React.useState(true);
	const [currentIndex, setCurrentIndex] = React.useState(0);
	const user = useUser(true);
	const db = getFirestore(app);
	const storage = getStorage();

	const col = user
		? collection(db, `flashcards/${user?.uid}/flashcards`)
		: null;

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
				setCurrentIndex(0);
			}
		});
	};
	

	const handleNavigation = (direction) => {
		if (direction === 'prev') {
			// loop back when list over, else iterate forward or backward
			if (currentIndex === 0) {
				setCurrentIndex(flashcardList.length - 1);
			} else {
				setCurrentIndex(currentIndex - 1);
			}
		} else if (direction === 'next') {
			if (currentIndex === flashcardList.length - 1) {
				setCurrentIndex(0);
			} else {
				setCurrentIndex(currentIndex + 1);
			}
		}
	};

	return (
		<Container component='main' maxWidth='xs' sx={{ mt: 10 }}>
			<CssBaseline />
			<Box sx={{ maxWidth: 600 }}>
				<Typography component='h1' variant='h5' align='center'>
					Flashcards
				</Typography>

				<Box component='form' onSubmit={addFlashcard} sx={{ mt: 2 }}>
					<TextField
						label='Question'
						value={newQuestion}
						onChange={e => setNewQuestion(e.target.value)}
						fullWidth
						margin='normal'
					/>

					<TextField
						label='Answer'
						multiline
						rows={4}
						value={newAnswer}
						onChange={e => setNewAnswer(e.target.value)}
						fullWidth
						margin='normal'
					/>

					<label>
						Attach Image:
						<input
							id='questionImageSelector'
							type='file'
							accept='image/*'
							onChange={e => setNewImage(e.target.files[0])}
						/>
					</label>

					<br />

					<label>
						Attach Audio:
						<input
							id='questionAudioSelector'
							type='file'
							accept='audio/*'
							onChange={e => setNewAudio(e.target.files[0])}
						/>
					</label>

					<Button type='submit' variant='contained' sx={{ mt: 2 }}>
						Add Flashcard
					</Button>
				</Box>

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
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
						{/* displaying all flashcards */}
						{flashcardList.map((card, index) => (
							// ensures only current card is displayed (avoid stacking them up)
							<Box key={card.id} sx={{ display: index === currentIndex ? 'block' : 'none' }}>
								<FlashCard
									data={card}
									deleteFlashcard={deleteFlashcard}
								/>
							</Box>
						))}

						{/* navigation buttons */}
						<Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
							<IconButton onClick={() => handleNavigation('prev')}>
								<ChevronLeft />
							</IconButton>
							<IconButton onClick={() => handleNavigation('next')}>
								<ChevronRight />
							</IconButton>
						</Box>
					</Box>
				)}
			</Box>
		</Container>
	);
};

export default Flashcards;
