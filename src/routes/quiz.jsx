import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Divider, Container, CssBaseline, Button } from '@mui/material';

const Quiz = () => {
    const location = useLocation();
    const flashcards = location.state?.flashcardList || [];

    if (!flashcards || flashcards.length === 0) {
        return <Typography>No flashcards available.</Typography>;
    }

    return (
        <Box p={3}>
            <Container component='main' maxWidth='sm' sx={{ mt: 2 }}>
                <CssBaseline />
                <Box sx={{ maxWidth: 600, textAlign: 'left', margin: '0 auto' }}>
                    <Typography variant="h4" gutterBottom align="center">
                        Generated Quiz
                    </Typography>
                    <Box>
                        {flashcards.map((flashcard, index) => (
                            <Box key={flashcard.id}>
                                <Typography variant="h6" gutterBottom>
                                    Question {index + 1}:
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {flashcard.question}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <RevealAnswerButton answer={flashcard.answer} />
                                </Box>
                                {index !== flashcards.length - 1 && <Divider sx={{ my: 2 }} />}
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

const RevealAnswerButton = ({ answer }) => {
    const [revealed, setRevealed] = useState(false);

    const handleRevealAnswer = () => {
        setRevealed(true);
    };

    return (
        <Button variant="outlined" onClick={handleRevealAnswer}>
            {revealed ? 'Answer: ' + answer : 'Reveal Answer'}
        </Button>
    );
};

export default Quiz;
