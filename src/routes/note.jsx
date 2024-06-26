import '../App.css';

import React, { useEffect, useState } from 'react';
import {
	Container,
	Typography,
	Card,
	Button,
	CircularProgress,
	CssBaseline,
	Box,
	TextField,
} from '@mui/material';
import Editor from '../components/Editor';
import { useParams } from 'react-router-dom';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	orderBy,
	query,
	serverTimestamp,
	updateDoc,
	where,
} from 'firebase/firestore';
import app from '../firebase';
import useUser from '../hooks/useUser';

const Note = () => {
	const { id } = useParams();
	const [data, setData] = useState();
	const [loading, setLoading] = useState(true);
	const [authorized, setAuthorized] = useState(false);
	const [inviteInput, setInviteInput] = useState('');
	const user = useUser();
	const db = getFirestore(app);

	const fetchNote = async () => {
		const noteDoc = doc(db, `notes/${id}`);
		const q = query(
			collection(db, `notes/${id}/access`),
			where('user', '==', user.displayName.toLowerCase())
		);
		const data = await getDoc(noteDoc);
		if (!data.exists()) {
			setLoading(false);
			return;
		}
		const access = await getDocs(q);
		if (!access.empty) setAuthorized(true);

		setData(data.data());
		setLoading(false);
	};

	const addToRecents = async () => {
		const col = collection(db, `users/${user.displayName}/recentNotes`);
		const q = query(col, orderBy('visited', 'desc'));
		const docs = await getDocs(q);
		for (let i = 0; i < docs.docs.length; i++) {
			const noteData = docs.docs[i].data();
			if (noteData.noteId === id) {
				await updateDoc(
					doc(db, `users/${user.displayName}/recentNotes/${docs.docs[i].id}`),
					{ visited: serverTimestamp() }
				);
				return;
			}
			if (i >= 4) {
				await deleteDoc(
					doc(db, `users/${user.displayName}/recentNotes/${docs.docs[i].id}`)
				);
			}
		}
		await addDoc(col, {
			noteId: id,
			owner: data.owner,
			title: data.title,
			visited: serverTimestamp(),
		});
	};

	const addCollaborator = async e => {
		e.preventDefault();
		const col = collection(db, `notes/${id}/access`);
		await addDoc(col, {
			user: inviteInput.toLowerCase(),
			type: 'collaborator',
			added: serverTimestamp(),
		});
		alert(`Successfully added ${inviteInput} as a collaborator!`);
		setInviteInput('');
	};

	useEffect(() => {
		if (!user) return;
		fetchNote();
	}, [user]);

	useEffect(() => {
		if (!data) return;
		addToRecents();
	}, [data]);

	if (loading) return <CircularProgress />;

	if (!data)
		return (
			<Box>
				<CssBaseline />
				<Typography variant='h4'>Not Found</Typography>
				<Typography>Did you use the correct note ID?</Typography>
			</Box>
		);

	return (
		<Container sx={{ mt: 10, mb: 10, width: 1 }}>
			<Typography variant='h4' sx={{ mb: 3 }}>
				{data.title}
			</Typography>
			<Card sx={{ width: 1, pb: 3, mb: 5, p: 1 }}>
				<Editor
					content={data.content}
					authorized={authorized}
					id={id}
					user={user.displayName}
				/>
			</Card>
			{authorized ? (
				<Card component={'form'} sx={{ p: 2 }} noValidate>
					<TextField
						// variant='standard'
						label='User to invite'
						value={inviteInput}
						onChange={e => setInviteInput(e.target.value)}
						fullWidth
					/>
					<Button type='submit' onClick={addCollaborator}>
						Invite Collaborator
					</Button>
				</Card>
			) : (
				<Card sx={{ p: 3 }}>
					<Typography variant='h6' sx={{ mb: 2, fontWeight: 'bold' }}>
						Want to edit this note?
					</Typography>
					<Typography>
						Ask {data.owner} to add you as a collaborator.
					</Typography>
				</Card>
			)}
		</Container>
	);
};

export default Note;
