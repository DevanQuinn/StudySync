import {
	Box,
	Button,
	Card,
	Chip,
	Divider,
	IconButton,
	Modal,
	Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import CommentIcon from '@mui/icons-material/Comment';
import EditIcon from '@mui/icons-material/Edit';
import EditTags from './EditTags';
import { deleteDoc, doc, getFirestore, updateDoc } from 'firebase/firestore';
import app from '../../firebase';
import {
	deleteObject,
	getDownloadURL,
	getStorage,
	ref,
} from 'firebase/storage';
import { Delete } from '@mui/icons-material';
import DeleteAlert from '../DeleteAlert';
import ViewComments from './ViewComments';
import PostLikeButton from './PostLikeButton';
import LikeCounter from './LikeCounter';

const Post = ({ data, editable, fetchPosts }) => {
	const [tagsOpen, setTagsOpen] = useState(false);
	const [commentsOpen, setCommentsOpen] = useState(false);
	const [alertOpen, setAlertOpen] = useState(false);
	const [tags, setTags] = useState(data.tags || []);
	const [image, setImage] = useState();
	const db = getFirestore(app);
	const storage = getStorage(app);

	const saveTags = async (newTags, cancelled) => {
		if (newTags === tags) return;
		if (cancelled) return setTagsOpen(false);
		setTags(newTags);
		const docToUpdate = doc(db, 'posts', data.id);
		await updateDoc(docToUpdate, { tags: newTags });
		setTagsOpen(false);
	};

	const fetchImage = async () => {
		if (!data.image) return;
		const pathReference = ref(storage, `posts/${data.image}`);
		const url = await getDownloadURL(pathReference);
		setImage(url);
	};

	const deleteTag = async () => {
		await deleteDoc(doc(db, 'posts', data.id));
		const imageRef = ref(storage, `posts/${data.image}`);
		await deleteObject(imageRef);
		setAlertOpen(false);
		if (fetchPosts) fetchPosts();
	};

	useEffect(() => {
		fetchImage();
	}, []);

	return (
		<Card sx={{ m: 4, p: 3, width: 500, position: 'relative' }}>
			<Typography variant='h5' align='left'>
				{data.title}
			</Typography>
			<Typography variant='body1' align='left'>
				{data.description}
			</Typography>
			{image && <Box component='img' src={image} sx={{ maxWidth: 1, mt: 2 }} />}
			<Divider sx={{ mt: 2, mb: 2 }} />
			{tags?.length ? (
				<Box sx={{ display: 'flex', flexDirection: 'row' }}>
					{tags.map((tag, index) => (
						<Chip label={tag} sx={{ mr: 1 }} key={index} />
					))}
					<Typography
						variant='h6'
						component='div'
						sx={{ flexGrow: 1 }}
					></Typography>
					{editable && (
						<IconButton onClick={() => setTagsOpen(true)}>
							<EditIcon />
						</IconButton>
					)}
				</Box>
			) : editable ? (
				<Button onClick={() => setTagsOpen(true)}>Add tags</Button>
			) : (
				<Typography variant='caption'>No tags</Typography>
			)}
			<Modal open={tagsOpen} onClose={() => setTagsOpen(false)}>
				<>
					<EditTags initialTags={tags} saveTags={saveTags} />
				</>
			</Modal>
			<Modal open={commentsOpen} onClose={() => setCommentsOpen(false)}>
				<>
					<ViewComments postId={data.id} />
				</>
			</Modal>
			{editable && (
				<IconButton
					aria-label='delete'
					sx={{ position: 'absolute', top: 20, right: 25 }}
					onClick={() => setAlertOpen(true)}
				>
					<Delete />
				</IconButton>
			)}
			<DeleteAlert
				title='Are you sure you want to delete this post?'
				description='This action cannot be undone.'
				state={[alertOpen, setAlertOpen]}
			>
				<Button onClick={() => setAlertOpen(false)}>Cancel</Button>
				<Button
					onClick={() => {
						deleteTag();
					}}
					autoFocus
				>
					Yes
				</Button>
			</DeleteAlert>

			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
				}}
			>
				<PostLikeButton postId={data.id} />
				<IconButton onClick={() => setCommentsOpen(true)}>
					<CommentIcon />
				</IconButton>
				<Typography
					variant='h6'
					component='div'
					sx={{ flexGrow: 1 }}
				></Typography>
				<LikeCounter postId={data.id} />
			</Box>
		</Card>
	);
};

export default Post;
