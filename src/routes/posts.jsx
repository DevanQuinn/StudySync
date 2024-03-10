import React from 'react';
import CreatePost from '../components/CreatePost';
import {
	Accordion,
	AccordionSummary,
	AccordionDetails,
	CssBaseline,
	Container,
	Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Posts = () => {
	return (
		<Container>
			<CssBaseline />
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography variant='h6'>Make a new post</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<CreatePost />
				</AccordionDetails>
			</Accordion>
		</Container>
	);
};

export default Posts;
