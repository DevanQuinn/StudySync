import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

const FlashCard = ({ data, deleteFlashcard }) => {
	const [flipped, setFlipped] = useState(false);

	const toggleFlip = () => setFlipped(!flipped);

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
		>
			{flipped ? (
				<>
					<Typography>{data.answer}</Typography>
					<Button onClick={toggleFlip}>Show Question</Button>
				</>
			) : (
				<>
					<Typography variant='h6'>{data.question}</Typography>
					{(() => {
						if (data.image) {
							return <img src={URL.createObjectURL(data.image)} alt='' />;
						}
					})()}
					{(() => {
						if (data.audio) {
							return (
								<audio controls>
									<source
										src={URL.createObjectURL(data.audio)}
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
			<Button onClick={() => deleteFlashcard(data.id)}>Delete</Button>
		</Box>
	);
};

export default FlashCard;
