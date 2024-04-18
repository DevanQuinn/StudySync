import React, { useEffect, useState } from 'react';
import {
	Container,
	Typography,
	Card,
	Button,
	CircularProgress,
	CssBaseline,
	Box,
	Modal,
	TextField,
} from '@mui/material';
import Editor from '../components/Editor';
import { useParams } from 'react-router-dom';
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	query,
	serverTimestamp,
	updateDoc,
	where,
} from 'firebase/firestore';
import app from '../firebase';
import useUser from '../hooks/useUser';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	height: 500,
	p: 3,
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
};

const Note = () => {
	const { id } = useParams();
	const [data, setData] = useState();
	const [loading, setLoading] = useState(true);
	const [authorized, setAuthorized] = useState(true);
	const [inviteInput, setInviteInput] = useState('');
	const user = useUser();
	const db = getFirestore(app);

	const fetchNote = async () => {
		const noteDoc = doc(db, `notes/${id}`);
		const q = query(
			collection(db, `notes/${id}/access`),
			where('user', '==', user.displayName)
		);
		const data = await getDoc(noteDoc);
		if (!data.exists()) {
			setLoading(false);
			return;
		}
		const access = await getDocs(q);
		if (access.empty) {
			setLoading(false);
			setAuthorized(false);
			return;
		}

		setData(data.data());
		setLoading(false);
	};

	const updateNote = async json => {
		const noteDoc = await doc(db, `notes/${id}`);
		await updateDoc(noteDoc, { content: json });
		alert('Saved!');
	};

	const addCollaborator = async e => {
		e.preventDefault();
		const col = collection(db, `notes/${id}/access`);
		await addDoc(col, {
			user: inviteInput,
			type: 'collaborator',
			added: serverTimestamp(),
		});
		alert('Successful');
		setInviteInput('');
	};

	useEffect(() => {
		if (!user) return;
		fetchNote();
	}, [user]);

	if (loading) return <CircularProgress />;

	if (!authorized)
		return (
			<Box>
				<CssBaseline />
				<Typography variant='h4'>Not Authorized</Typography>
				<Typography>Did the owner add you as a collaborator?</Typography>
			</Box>
		);

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
				<Editor content={data.content} updateNote={updateNote} />
			</Card>
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
		</Container>
	);
};

export default Note;
