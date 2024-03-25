import React, { useEffect } from 'react';
import {
	Box,
	Typography,
	TextField,
	Button,
	Container,
	CssBaseline,
	CircularProgress,
} from '@mui/material';
import {
	query,
	getFirestore,
	collection,
	getDocs,
	doc,
	addDoc,
	deleteDoc,
} from 'firebase/firestore';
import app from '../firebase';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import FlashCard from '../components/FlashCard';
import useUser from '../hooks/useUser';
import { v4 as uuid } from 'uuid';

const Flashcards = () => {
	const [flashcardList, setFlashcardList] = React.useState([]);
	const [newQuestion, setNewQuestion] = React.useState('');
	const [newAnswer, setNewAnswer] = React.useState('');
	const [newImage, setNewImage] = React.useState('');
	const [newAudio, setNewAudio] = React.useState(null);
	const [loading, setLoading] = React.useState(true);
	const user = useUser(true);
	const db = getFirestore(app);
	const storage = getStorage();
	
	const col = user
		? collection(db, `flashcards/${user?.uid}/flashcards`)
		: null;

	const fetchCards = async () => {
		if (!col) return;
		const q = query(col);
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
		await addDoc(col, flashcard);
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
		deleteDoc(doc(db, `flashcards/${user?.uid}/flashcards`, id)).then(() => {
			fetchCards();
		});
	};

	// if (!user) return <div>Not signed in</div>;

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
							id = 'questionImageSelector'
							type='file'
							accept='image/*'
							onChange={e => setNewImage(e.target.files[0])}
						/>
					</label>

					<br/>

					<label>
						Attach Audio:
						<input
							id = 'questionAudioSelector'
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
				) : (
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
						{flashcardList.map(card => (
							<FlashCard
								data={card}
								deleteFlashcard={deleteFlashcard}
								key={card.id}
							/>
						))}
					</Box>
				)}
			</Box>
		</Container>
	);
};

export default Flashcards;
