import {
	collection,
	collectionGroup,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	orderBy,
	query,
	where,
} from 'firebase/firestore';
import { Container, CssBaseline, Card, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import app from '../firebase';
import useUser from '../hooks/useUser';
import { Link } from 'react-router-dom';

const MyNotes = ({ variant }) => {
	const [notes, setNotes] = useState([]);
	const user = useUser();
	const db = getFirestore(app);
	const fetchNotes = async () => {
		if (variant === 'visited') {
			const q = query(
				collection(db, `users/${user.displayName}/recentNotes`),
				orderBy('visited', 'desc')
			);
			const data = await getDocs(q);
			const newNotes = [];
			console.log(data.docs.length);
			data.forEach(note => {
				const noteData = note.data();
				noteData.id = noteData.noteId;
				newNotes.push(noteData);
			});
			setNotes(newNotes);
			return;
		}
		const q = query(
			collectionGroup(db, 'access'),
			where('user', '==', user.displayName.toLowerCase()),
			orderBy('added', 'desc')
		);
		const data = await getDocs(q);
		const newNotes = [];
		for (let i = 0; i < data.docs.length; i++) {
			const note = data.docs[i];
			const parent = await getDoc(doc(db, note.ref.parent.parent.path));
			const noteData = parent.data();
			noteData.id = parent.id;
			newNotes.push(noteData);
		}
		setNotes(newNotes);
	};

	useEffect(() => {
		if (!user) return;
		fetchNotes();
	}, [user]);

	if (!notes.length)
		return <Typography>You don't have access to any notes.</Typography>;

	return (
		<Container sx={{}}>
			<CssBaseline />
			{notes.map((note, index) => (
				<Card key={index} sx={{ mb: 2, textAlign: 'left', p: 3 }}>
					<Link to={`/note/${note.id}`}>
						<Typography variant='h6' sx={{ mb: 1 }}>
							{note.title}
						</Typography>
						<Typography variant='body2'>Owned by {note.owner}</Typography>
					</Link>
				</Card>
			))}
		</Container>
	);
};

export default MyNotes;
