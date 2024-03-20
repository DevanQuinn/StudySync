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
import React, { useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SendIcon from '@mui/icons-material/Send';
import CommentIcon from '@mui/icons-material/Comment';
import EditIcon from '@mui/icons-material/Edit';
import EditTags from './EditTags';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import app from '../firebase';

const Post = ({ data }) => {
	const [open, setOpen] = useState(false);
	const [tags, setTags] = useState(data.tags || []);

	const saveTags = async (newTags, cancelled) => {
		if (newTags === tags) return;
		if (cancelled) return setOpen(false);
		setTags(newTags);
		const db = getFirestore(app);
		const docToUpdate = doc(db, 'posts', data.id);
		await updateDoc(docToUpdate, { tags: newTags });
		setOpen(false);
	};

	return (
		<Card sx={{ m: 4, p: 3 }}>
			<Typography variant='h5' align='left'>
				{data.title}
			</Typography>
			<Typography variant='body1' align='left'>
				{data.description}
			</Typography>
			<Divider sx={{ mt: 2, mb: 2 }} />
			{tags?.length ? (
				<Box sx={{ display: 'flex', flexDirection: 'row' }}>
					{tags.map(tag => (
						<Chip label={tag} sx={{ mr: 1 }} />
					))}
					<Typography
						variant='h6'
						component='div'
						sx={{ flexGrow: 1 }}
					></Typography>
					<IconButton onClick={() => setOpen(true)}>
						<EditIcon />
					</IconButton>
				</Box>
			) : (
				<Button onClick={() => setOpen(true)}>Add tags</Button>
			)}
			<Modal
				open={open}
				onClose={() => setOpen(false)}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'
			>
				<EditTags initialTags={tags} saveTags={saveTags} />
			</Modal>

			{/* <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
				<IconButton>
					<FavoriteIcon />
				</IconButton>
				<Typography
					variant='h6'
					component='div'
					sx={{ flexGrow: 1 }}
				></Typography>
				<TextField
					variant='standard'
					label='Comment'
					InputProps={{
						endAdornment: (
							<InputAdornment position='end'>
								<IconButton>
									<SendIcon />
								</IconButton>
							</InputAdornment>
						),
					}}
				/>
			</Box> */}
		</Card>
	);
};

export default Post;
