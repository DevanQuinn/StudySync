import { Box, Typography, TextField, Button } from '@mui/material';
import React, { useState } from 'react';

const CreatePost = () => {
	const [image, setImage] = useState();
	const handleSubmit = () => {};

	return (
		// <Container component='main' maxWidth='xs'>
		// <CssBaseline />
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<Typography component='h1' variant='h5'>
				Create Post
			</Typography>
			<Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
				<TextField
					margin='normal'
					required
					fullWidth
					name='title'
					id='title'
					label='Title'
					placeholder='Title'
				/>
				<TextField
					margin='normal'
					id='description'
					fullWidth
					label='Description'
					placeholder='Description'
					multiline
					rows={4}
					variant='filled'
				/>
				{image ? (
					<Box>
						<Box>
							<img src={URL.createObjectURL(image)} />
						</Box>
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
						Add File
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
				>
					Submit Post
				</Button>
			</Box>
		</Box>
		// </Container>
	);
};

export default CreatePost;
