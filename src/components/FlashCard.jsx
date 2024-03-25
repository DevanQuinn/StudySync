import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { getBlob, getStorage, ref } from "firebase/storage";

const FlashCard = ({ data, deleteFlashcard }) => {
	const [flipped, setFlipped] = useState(false);

	const toggleFlip = () => setFlipped(!flipped);

	const [imageBlob, setImageBlob] = useState(null);

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
        loadImageBlob();
    }, [data.image]);

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
					<Typography variant='h6'>{data.answer}</Typography>
					<Button onClick={toggleFlip}>Show Question</Button>
				</>
			) : (
				<>
					<Typography variant='h6'>{data.question}</Typography>
					{(() => {
						if (imageBlob) {
							return <img src={URL.createObjectURL(imageBlob)}/>;
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
