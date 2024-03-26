import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { getBlob, getStorage, ref } from "firebase/storage";

const FlashCard = ({ data, deleteFlashcard }) => {
	const [flipped, setFlipped] = useState(false);

	const toggleFlip = () => setFlipped(!flipped);

	const [imageBlob, setImageBlob] = useState(null);
	const [audioBlob, setAudioBlob] = useState(null);

	useEffect(() => {
		// loading the image's StorageReference from the flashcard
		const loadImageBlob = async () => {
			if (data.image && data.image != 'unset') {
				const storage = getStorage();
				const pathReference = ref(storage, data.image);
				try {
					// getting the binary data from the StorageReference path
					const blob = await getBlob(pathReference);
					setImageBlob(blob);
				} catch (error) {
					console.error('Error loading image blob:', error);
				}
			}
		};

		// loading the audio's StorageReference from the flashcard
		const loadAudioBlob = async () => {
			if (data.audio && data.audio !== 'unset') {
				const storage = getStorage();
				const pathReference = ref(storage, data.audio);
				try {
					const blob = await getBlob(pathReference);
					setAudioBlob(blob);
				} catch (error) {
					console.error('Error loading audio blob:', error);
				}
			}
		};
		loadImageBlob();
		loadAudioBlob();
	}, [data.image, data.audio]);


	return (
		<Box
			onClick={toggleFlip}
			border={1}
			borderColor='grey'
			borderRadius={2}
			p={2}
			display='flex'
			flexDirection='column'
			alignItems='center'
			alignSelf='center'
			sx={{
				width: '100%',
				height: '300px',
			  }}
		>
			{flipped ? (
				<>
					<Typography variant='h6'>{data.answer}</Typography>
					<Button onClick={toggleFlip}>Show Question</Button>
				</>
			) : (
				<>
					<Typography variant='h6'>{data.question}</Typography>
					{(() => {
						if (imageBlob) {
							return (
								<img
									src={URL.createObjectURL(imageBlob)}
									style={{ maxWidth: '60%', maxHeight: '60%', height: 'auto', width: 'auto'}}
								/>
							);
						}
					})()}
					{(() => {
						if (audioBlob) {
							return (
								<audio controls>
									<source
										src={URL.createObjectURL(audioBlob)}
										type='audio/mpeg'
									/>
									Your browser does not support the audio element.
								</audio>
							);
						}
					})()}

					<Button onClick={toggleFlip}>Reveal Answer</Button>
				</>
			)}
			{ /* stopping delete click from flipping the card before deleting itself */}
			<Button onClick={(event) => {
				event.stopPropagation();
				deleteFlashcard(data.id);
			}}>Delete</Button>
		</Box>
	);
};

export default FlashCard;
