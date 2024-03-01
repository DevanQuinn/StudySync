import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import emailjs from 'emailjs-com';

const Flashcard = () => {
    const [flashcards, setFlashcards] = React.useState([]);
    const [newQuestion, setNewQuestion] = React.useState('');
    const [newAnswer, setNewAnswer] = React.useState('');
    const [newImage, setNewImage] = React.useState(null);
    const [newAudio, setNewAudio] = React.useState(null);
    const [flipped, setFlipped] = React.useState(false);
    const [shareWithUser, setShareWithUser] = React.useState('');
    const [shareError, setShareError] = React.useState(null);

    const addFlashcard = (event) => {
        event.preventDefault();

        const newFlashcard = {
            question: newQuestion,
            answer: newAnswer,
            image: newImage,
            audio: newAudio,
        };

        setFlashcards([...flashcards, newFlashcard]);

        setNewQuestion('');
        setNewAnswer('');
        setNewImage(null);
        setNewAudio(null);
    };

    const deleteFlashcard = (index) => {
        const updatedFlashcards = [...flashcards];
        updatedFlashcards.splice(index, 1);
        setFlashcards(updatedFlashcards);
    };

    const toggleFlip = () => {
        setFlipped(!flipped);
    };

const shareFlashcards = () => {
    const emailParams = {
        to_email: shareWithUser,
        subject: 'Flashcards',
        body: '',
    };

    const promises = flashcards.map((flashcard, index) => {
        return new Promise((resolve) => {
            // Convert image to base64 data URL
            convertImageToDataUrl(flashcard.image)
                .then((imageDataUrl) => {
                    console.log('Image Data URL:', imageDataUrl);

                    const cardContent = `
                        Question ${index + 1}:
                        ${flashcard.question}
                        
                        Answer ${index + 1}:
                        ${flashcard.answer}
                        
                        ${imageDataUrl ? `![Image ${index + 1}](${imageDataUrl})` : ''}
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==" alt="Red dot">
                    `;
                    console.log(cardContent);
                    emailParams.body += cardContent + '\n\n';
                    resolve();
                })
                .catch((error) => {
                    console.error('Error converting image:', error);
                    resolve(); // Resolve the promise even if there's an error
                });
        });
    });

    Promise.all(promises)
        .then(() => {
            console.log('Email Parameters:', emailParams);

            emailjs.send('service_1t89u4s', 'template_snzuvya', emailParams, 'K-nzp7uN1uBdG-gV9')
                .then((response) => {
                    console.log('Email sent successfully:', response);
                    // Additional success handling if needed
                })
                .catch((error) => {
                    console.error('Error sending email:', error);
                    // Display or log the error message
                });
        });
};

const convertImageToDataUrl = (image) => {
    return new Promise((resolve, reject) => {
        if (!image) {
            resolve(''); // If no image provided, resolve with an empty string
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            const imageDataUrl = event.target.result;
            console.log('Image converted successfully:', imageDataUrl);
            resolve(imageDataUrl);
        };

        reader.onerror = (error) => {
            console.error('Error converting image:', error);
            reject(error);
        };

        reader.readAsDataURL(image);
    });
};


    return (
        <Box sx={{ maxWidth: 600 }}>
            <Typography component="h1" variant="h5" align="center">
                Flashcards
            </Typography>

            <Box component="form" onSubmit={addFlashcard} sx={{ mt: 2 }}>
                <TextField
                    label="Question"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Answer"
                    multiline
                    rows={4}
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    fullWidth
                    margin="normal"
                />

                <label>
                    Image:
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewImage(e.target.files[0])}
                    />
                </label>

                <label>
                    Audio:
                    <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => setNewAudio(e.target.files[0])}
                    />
                </label>

                <TextField
                    label="Share Flashcards With User"
                    value={shareWithUser}
                    onChange={(e) => setShareWithUser(e.target.value)}
                    fullWidth
                    margin="normal"
                />

                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                    Add Flashcard
                </Button>
                <Button variant="contained" sx={{ mt: 2, ml: 2 }} onClick={shareFlashcards}>
                    Share Flashcards
                </Button>
                {shareError && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {shareError}
                    </Typography>
                )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
                {flashcards.map((flashcard, index) => (
                    <Box
                        key={index}
                        onClick={toggleFlip}
                        border={1}
                        borderColor="grey"
                        borderRadius={2}
                        p={2}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                    >
                        {flipped ? (
                            <>
                                <Typography>{flashcard.answer}</Typography>
                                <Button onClick={toggleFlip}>Show Question</Button>
                            </>
                        ) : (
                            <>
                                <Typography variant="h6">{flashcard.question}</Typography>
                                {(() => {
                                    if (flashcard.image) {
                                        return (
                                            <img
                                                src={URL.createObjectURL(flashcard.image)}
                                                alt=""
                                            />
                                        );
                                    }
                                })()}
                                {(() => {
                                    if (flashcard.audio) {
                                        return (
                                            <audio controls>
                                                <source
                                                    src={URL.createObjectURL(flashcard.audio)}
                                                    type="audio/mpeg"
                                                />
                                                Your browser does not support the audio element.
                                            </audio>
                                        );
                                    }
                                })()}
                                <Button onClick={toggleFlip}>Reveal Answer</Button>
                            </>
                        )}
                        <Button onClick={() => deleteFlashcard(index)}>Delete</Button>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default Flashcard;

