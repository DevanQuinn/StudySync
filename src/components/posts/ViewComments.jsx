import { AddCircleOutlineOutlined, Delete } from '@mui/icons-material';
import {
	Box,
	Card,
	CircularProgress,
	Divider,
	IconButton,
	InputAdornment,
	List,
	ListItem,
	TextField,
	Typography,
} from '@mui/material';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	getFirestore,
	orderBy,
	query,
	serverTimestamp,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import app from '../../firebase';
import useUser from '../../hooks/useUser';

const ViewComments = ({ postId, editable }) => {
	const [comments, setComments] = useState([]);
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(true);
	const user = useUser();
	const db = getFirestore(app);
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

	const fetchComments = async () => {
		const col = collection(db, `posts/${postId}/comments`);
		const docs = await getDocs(query(col, orderBy('created', 'desc')));
		const newComments = [];
		docs.forEach(doc => {
			const data = doc.data();
			data.id = doc.id;
			if (data.user == user.displayName) data.self = true;
			newComments.push(data);
		});
		setComments(newComments);
		setLoading(false);
	};

	const addComment = async e => {
		if (e) e.preventDefault();
		const col = collection(db, `posts/${postId}/comments`);
		const comment = {
			user: user.displayName,
			content: input,
			created: serverTimestamp(),
		};
		const document = await addDoc(col, comment);
		comment.id = document.id;
		comment.self = true;
		setComments([comment, ...comments]);
		setInput(' ');
	};

	const deleteComment = async (commentId, index) => {
		await deleteDoc(doc(db, 'posts', postId, 'comments', commentId));
		setComments(comments => comments.filter((comment, idx) => idx != index));
	};

	useEffect(() => {
		if (!user) return;
		fetchComments();
	}, [user]);

	if (loading)
		return (
			<Card
				sx={{
					...style,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<CircularProgress />
			</Card>
		);

	return (
		<Card sx={style}>
			<TextField
				variant='outlined'
				label='Add comment'
				component='form'
				onSubmit={addComment}
				value={input}
				onChange={e => setInput(e.target.value)}
				autoFocus
				fullWidth
				InputProps={{
					endAdornment: (
						<InputAdornment position='end'>
							<IconButton onClick={addComment}>
								<AddCircleOutlineOutlined />
							</IconButton>
						</InputAdornment>
					),
				}}
			/>
			<Box overflow='scroll' sx={{ height: 1, width: 1, p: 1 }}>
				{comments.length ? (
					<List>
						{comments.map((comment, index) => (
							<Box key={index}>
								<ListItem
									disableGutters
									sx={{
										display: 'flex',
										flexDirection: 'row',
									}}
								>
									<Box textOverflow={'ellipsis'} width={1}>
										<Typography variant='caption' noWrap>
											{comment.user}
										</Typography>
										<Typography noWrap>{comment.content}</Typography>
									</Box>
									<Typography
										variant='h6'
										component='div'
										sx={{ flexGrow: 1 }}
									></Typography>
									{(comment.self || editable) && (
										<IconButton
											size='small'
											onClick={() => deleteComment(comment.id, index)}
										>
											<Delete size='small' />
										</IconButton>
									)}
								</ListItem>
								{index != comments.length - 1 && <Divider />}
							</Box>
						))}
					</List>
				) : (
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							height: '70%',
							width: 1,
						}}
					>
						<Typography>Add the first comment!</Typography>
					</Box>
				)}
			</Box>
		</Card>
	);
};

export default ViewComments;
