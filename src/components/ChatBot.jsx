import * as React from 'react';
import { useState } from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import { Fab, Box, Slide } from '@mui/material';
import Button from '@mui/material/Button';

export default function Chatbot() {
    const theme = {
        background: '#f5f8fb',
        headerBgColor: '#B0DCCD',
        headerFontColor: '#000000',
        botBubbleColor: '#B0DCCD',
        botFontColor: '#000000',
        userBubbleColor: "#d3d3d3",
        userFontColor: '#000000',
      };
    return (
            <ThemeProvider theme = {theme}>
                <ChatBot
                style={{width: '350px' }}
                steps={[
                    {
                        id: '1',
                        message: 'Welcome to the Chat Bot!',
                        trigger: '2',
                    },
                    {
                        id: '2',
                        message: "What would you like to learn more about?",
                        trigger: '3',
                    },
                    {
                        id: '3',
                        options: [
                        { value: 1, label: 'Navigation', trigger: '4' },
                        { value: 2, label: 'Study Methods', trigger: '7' },
                        { value: 3, label: 'Nothing', trigger: '10' },
                        ],
                    },
                    {
                        id: '4',
                        message: "Where would you like to navigate?",
                        trigger: '5',
                    },
                    {
                        id: '5',
                        options: [
                            { value: 1, label: 'Posts', trigger: '6' },
                        ],
                    },
                    {
                        id: '6',
                        message: "To navigate to your posts page, once you sign-in click on your username on the Navbar!",
                        trigger: '2'
                    },  
                    {
                        id: '7',
                        options: [
                            { value: 1, label: 'Pomodoro', trigger: '8' },
                            { value: 2, label: 'Flashcards', trigger: '9'}
                        ],
                    },
                    {
                        id: '8',
                        message: "The pomodoro method is time-management study technique where there are work intervals and break intervals. During these work intervals"
                        + " there should be no distractions and focus must be maintained. Then a break will occur which will allow the user to relax and be ready to focus for another session",
                        trigger: '2'
                    },
                    {
                        id: '9',
                        message: "Flashcards are used to promote active recall, where you are forced to retrieve a part of your memory to get the answer. This promotes moving information"
                        + " from your short-term to long-term memory. This is best for memorization and trying to retain information in a short amount of time",
                        trigger: '2'
                    },
                    {
                        id: '10',
                        message: 'To restart my prompting, close and open the bot. Goodbye!',
                        end: true,
                    },  
                ]}
                />
            </ThemeProvider>
    );
}