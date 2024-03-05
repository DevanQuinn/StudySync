import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

const Flashcard = () => {

    const [flashcards, setFlashcards] = React.useState([]);
    const [newQuestion, setNewQuestion] = React.useState('');
    const [newAnswer, setNewAnswer] = React.useState('');
    const [newImage, setNewImage] = React.useState(null);
    const [newAudio, setNewAudio] = React.useState(null);
    const [flipped, setFlipped] = React.useState(false);

    const addFlashcard = (event) => {
        /* avoids page reload when card submitted */
        event.preventDefault();

        const newFlashcard = {
            question: newQuestion,
            answer: newAnswer,
            image: newImage,
            audio: newAudio
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
    }

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

                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                    Add Flashcard
                </Button>
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
                                <Typography variant="h6">
                                    {flashcard.question}
                                </Typography>
                                {(() => {
                                    if (flashcard.image) {
                                        return <img src={URL.createObjectURL(flashcard.image)} alt="" />;
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
                        <Button onClick={() => deleteFlashcard(index)}>
                            Delete
                        </Button>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default Flashcard;