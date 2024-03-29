import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { getBlob, getStorage, ref } from "firebase/storage";

const FlashCard = ({ data, deleteFlashcard, cardStudied, isUserCards }) => {
	const [flipped, setFlipped] = useState(false);
	const [flipText, setFlipText] = useState('Reveal Answer');
	const [imageBlob, setImageBlob] = useState(null);
	const [audioBlob, setAudioBlob] = useState(null);

	const toggleFlip = () => {
		setFlipped(!flipped);
		if (flipped) {
			setFlipText('Reveal Answer');
		} else {
			setFlipText('Show Question');
		}

		cardStudied(true);
	}

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
			//onClick={toggleFlip}
			border={1}
			borderColor='grey'
			borderRadius={2}
			p={3}
			display='flex'
			flexDirection='column'
			alignItems='center'
			alignSelf='center'
			justifyContent='space-between'
			sx={{
				width: '100%',
				height: '300px',
				overflow: 'auto',
			}}
		>
			{flipped ? (
				<>
					<Typography variant='h6'>{data.answer}</Typography>
				</>
			) : (
				<>
					<Typography variant='h6'>{data.question}</Typography>
					{(() => {
						if (imageBlob) {
							return (
								<img
									src={URL.createObjectURL(imageBlob)}
									style={{ maxWidth: '60%', maxHeight: '60%', height: 'auto', width: 'auto' }}
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
				</>
			)}

			<div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
				<Button
					onClick={toggleFlip}
					sx={{ mb: -1, ml: -1, border: 1 }}
					style={{ alignSelf: 'flex-start' }} // Anchor to bottom-left
				>
					{flipText}
				</Button>
				{isUserCards && (
					<Button
						sx={{ mb: -1, mr: -1, border: 1 }}
						onClick={(event) => {
							event.stopPropagation(); //stops clicking delete from flipping the card before deleting
							deleteFlashcard(data.id);
						}}
						style={{ alignSelf: 'flex-end' }} // Anchor to bottom-right
					>
						Delete
					</Button>
				)}
			</div>
		</Box>
	);
};

export default FlashCard;
