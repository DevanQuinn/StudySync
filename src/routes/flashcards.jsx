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
import FlashCard from '../components/FlashCard';
import useUser from '../hooks/useUser';

const Flashcards = () => {
	const [flashcardList, setFlashcardList] = React.useState([]);
	const [newQuestion, setNewQuestion] = React.useState('');
	const [newAnswer, setNewAnswer] = React.useState('');
	const [newImage, setNewImage] = React.useState(null);
	const [newAudio, setNewAudio] = React.useState(null);
	const [loading, setLoading] = React.useState(true);
	const user = useUser(true);

	const db = getFirestore(app);
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
	const addFlashcard = event => {
		/* avoids page reload when card submitted */
		event.preventDefault();

		const newFlashcard = {
			question: newQuestion,
			answer: newAnswer,
			image: newImage,
			audio: newAudio,
		};

		uploadCard(newFlashcard);

		setNewQuestion('');
		setNewAnswer('');
		setNewImage(null);
		setNewAudio(null);
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

					{/* <label>
						Image:
						<input
							type='file'
							accept='image/*'
							onChange={e => setNewImage(e.target.files[0])}
						/>
					</label>

					<label>
						Audio:
						<input
							type='file'
							accept='audio/*'
							onChange={e => setNewAudio(e.target.files[0])}
						/>
					</label> */}

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
