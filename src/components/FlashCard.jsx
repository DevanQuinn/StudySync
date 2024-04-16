import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { getBlob, getStorage, ref } from "firebase/storage";
import ReactPlayer from 'react-player';

const FlashCard = ({ data, deleteFlashcard, cardStudied, isUserCards }) => {
	const [flipped, setFlipped] = useState(false);
	const [flipText, setFlipText] = useState('Reveal Answer');
	const [questionImageBlob, setQuestionImageBlob] = useState(null);
	const [questionAudioBlob, setQuestionAudioBlob] = useState(null);
	const [answerImageBlob, setAnswerImageBlob] = useState(null);
	const [answerAudioBlob, setAnswerAudioBlob] = useState(null);

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
		const loadQuestionImageBlob = async () => {
			if (data.questionImage && data.questionImage != 'unset') {
				const storage = getStorage();
				const pathReference = ref(storage, data.questionImage);
				try {
					// getting the binary data from the StorageReference path
					const blob = await getBlob(pathReference);
					setQuestionImageBlob(blob);
				} catch (error) {
					console.error('Error loading questionImage blob:', error);
				}
			}
		};

		// loading the audio's StorageReference from the flashcard
		const loadQuestionAudioBlob = async () => {
			if (data.questionAudio && data.questionAudio !== 'unset') {
				const storage = getStorage();
				const pathReference = ref(storage, data.questionAudio);
				try {
					const blob = await getBlob(pathReference);
					setQuestionAudioBlob(blob);
				} catch (error) {
					console.error('Error loading questionAudio blob:', error);
				}
			}
		};

		const loadAnswerImageBlob = async () => {
			if (data.answerImage && data.answerImage != 'unset') {
				const storage = getStorage();
				const pathReference = ref(storage, data.answerImage);
				try {
					// getting the binary data from the StorageReference path
					const blob = await getBlob(pathReference);
					setAnswerImageBlob(blob);
				} catch (error) {
					console.error('Error loading answerImage blob:', error);
				}
			}
		};

		// loading the audio's StorageReference from the flashcard
		const loadAnswerAudioBlob = async () => {
			if (data.answerAudio && data.answerAudio !== 'unset') {
				const storage = getStorage();
				const pathReference = ref(storage, data.answerAudio);
				try {
					const blob = await getBlob(pathReference);
					setAnswerAudioBlob(blob);
				} catch (error) {
					console.error('Error loading answerAudio blob:', error);
				}
			}
		};

		loadQuestionImageBlob();
		loadQuestionAudioBlob();
		loadAnswerImageBlob();
		loadAnswerAudioBlob();
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
				//minHeight: '300px',
				height: '300px',
				overflow: 'auto',
			}}
		>
			{flipped ? (
				<>
					<Typography variant='h6'>{data.answer}</Typography>
					{(() => {
						if (answerImageBlob) {
							return (
								<img
									src={URL.createObjectURL(answerImageBlob)}
									style={{ maxWidth: '50%', maxHeight: '50%', height: 'auto', width: 'auto' }}
								/>
							);
						}
					})()}
					{(() => {
						if (answerAudioBlob) {
							return (
								<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
									{/* <ReactPlayer
										url={URL.createObjectURL(answerAudioBlob)}
										type='audio/mpeg'
										controls
										width="320px"
										height="30px"
									/> */}
								</Box>
							);
						}
					})()}
				</>
			) : (
				<>
					<Typography variant='h6'>{data.question}</Typography>
					{(() => {
						if (questionImageBlob) {
							return (
								<img
									src={URL.createObjectURL(questionImageBlob)}
									style={{ maxWidth: '50%', maxHeight: '50%', height: 'auto', width: 'auto' }}
								/>
							);
						}
					})()}
					{(() => {
						if (questionAudioBlob) {
							return (
								<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
									{ <ReactPlayer
										url={URL.createObjectURL(questionAudioBlob)}
										type='audio/mpeg'
										controls
										width="320px"
										height="30px"
									/> }
								</Box>
							);
						}
					})()}
				</>
			)}

			<div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
				<Button
					onClick={toggleFlip}
					sx={{ mb: -1, ml: -1, border: 1 }}
					style={{ alignSelf: 'flex-start' }}
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
						style={{ alignSelf: 'flex-end' }}
					>
						Delete
					</Button>
				)}
			</div>
		</Box>
	);
};

export default FlashCard;
