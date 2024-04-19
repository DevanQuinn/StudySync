import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Divider, Container, CssBaseline, Button, TextField } from '@mui/material';

const Quiz = () => {
    const location = useLocation();
    const flashcards = location.state?.flashcardList || [];
    const [userAnswers, setUserAnswers] = useState(Array(flashcards.length).fill(''));
    const [percentage, setPercentage] = useState(null);
    const [showAnswers, setShowAnswers] = useState(false);

    const handleUserAnswerChange = (index, value) => {
        setUserAnswers(prevAnswers => {
            const updatedAnswers = [...prevAnswers];
            updatedAnswers[index] = value;
            return updatedAnswers;
        });
    };

    if (!flashcards || flashcards.length === 0) {
        return <Typography>No flashcards available.</Typography>;
    }

    const calculateCorrectPercentage = () => {
        let correctCount = 0;
        for (let i = 0; i < flashcards.length; i++) {
            const lowercaseAnswer = flashcards[i].answer.toLowerCase();
            const lowercaseUserAnswer = userAnswers[i].toLowerCase();
            if (lowercaseAnswer === lowercaseUserAnswer) {
                correctCount++;
            }
        }
        const percentage = (correctCount / flashcards.length) * 100;
        setPercentage(Math.round(percentage));
    };

    const revealAnswers = () => {
        setShowAnswers(true);
    };

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
                                {showAnswers && (
                                    <Typography variant="body1" gutterBottom>
                                        Answer: {flashcard.answer}
                                    </Typography>
                                )}
                                <TextField
                                    id={`answer-${index}`}
                                    label="Your Answer"
                                    variant="outlined"
                                    value={userAnswers[index]}
                                    onChange={(e) => handleUserAnswerChange(index, e.target.value)}
                                />
                                {index !== flashcards.length - 1 && <Divider sx={{ my: 2 }} />}
                            </Box>
                        ))}
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, marginBottom: 6 }}>
                        <Button variant="contained" color="primary" onClick={calculateCorrectPercentage}>
                            Calculate Grade
                        </Button>
                        {percentage !== null && (
                            <Button variant="contained" color="secondary" onClick={revealAnswers}>
                                Reveal Answers
                            </Button>
                        )}
                    </Box>
                    {percentage !== null && (
                        <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: 6 }}>
                            Grade: {percentage}%
                        </Typography>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default Quiz;
