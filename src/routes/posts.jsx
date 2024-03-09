import React from 'react';
import CreatePost from '../components/CreatePost';
import {
	Accordion,
	AccordionSummary,
	AccordionDetails,
	CssBaseline,
	Container,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Posts = () => {
	return (
		<Container>
			<CssBaseline />
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					Make a new post
				</AccordionSummary>
				<AccordionDetails>
					<CreatePost />
				</AccordionDetails>
			</Accordion>
		</Container>
	);
};

export default Posts;
