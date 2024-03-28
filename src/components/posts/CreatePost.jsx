import { Box, TextField, Button } from '@mui/material';
import React, { useState } from 'react';
import app from '../../firebase';
import { getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';
import {
	addDoc,
	collection,
	getFirestore,
	serverTimestamp,
} from 'firebase/firestore';
import useUser from '../../hooks/useUser';
import { v4 as uuid } from 'uuid';

const CreatePost = ({ fetchPosts }) => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [image, setImage] = useState();
	const user = useUser(true);
	const db = getFirestore(app);
	const storage = getStorage(app);

	const uploadImage = async imageUpload => {
		const imageId = uuid();
		const imageRef = storageRef(storage, `posts/${imageId}`);
		await uploadBytes(imageRef, imageUpload);
		return imageId;
	};

	const clearInputs = () => {
		setTitle('');
		setDescription('');
		setImage();
	};

	const handleSubmit = async () => {
		if (!user) return;
		const col = collection(db, `posts`);
		const imageId = image ? await uploadImage(image) : null;
		const post = {
			title,
			description,
			image: imageId,
			user: user.displayName.toLowerCase(),
			created: serverTimestamp(),
		};
		await addDoc(col, post);
		alert('Post uploaded!');
		clearInputs();
		fetchPosts();
	};

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<Box noValidate>
				<TextField
					margin='normal'
					required
					fullWidth
					name='title'
					id='title'
					label='Title'
					placeholder='Title'
					value={title}
					onChange={e => setTitle(e.target.value)}
				/>
				<TextField
					margin='normal'
					id='description'
					fullWidth
					label='Description'
					placeholder='Description'
					multiline
					rows={4}
					value={description}
					onChange={e => setDescription(e.target.value)}
				/>
				{image ? (
					<Box>
						<Box
							component='img'
							src={URL.createObjectURL(image)}
							sx={{ maxWidth: 500 }}
						/>
						<Button
							variant='text'
							component='label'
							margin='normal'
							fullWidth
							onClick={() => setImage()}
						>
							Remove Image
						</Button>
					</Box>
				) : (
					<Button variant='text' component='label' margin='normal' fullWidth>
						Add Image
						<input
							type='file'
							hidden
							onChange={e => {
								setImage(e.target.files[0]);
							}}
							accept='image/*'
						/>
					</Button>
				)}

				<Button
					type='submit'
					fullWidth
					variant='contained'
					sx={{ mt: 3, mb: 2 }}
					onClick={handleSubmit}
					disabled={title.length ? false : true}
				>
					Submit Post
				</Button>
			</Box>
		</Box>
	);
};

export default CreatePost;
