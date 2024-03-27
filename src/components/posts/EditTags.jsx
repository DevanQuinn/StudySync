import {
	Box,
	Button,
	Card,
	Chip,
	List,
	ListItem,
	TextField,
} from '@mui/material';
import React, { useState } from 'react';

const EditTags = ({ initialTags, saveTags }) => {
	const [input, setInput] = useState('');
	const [tags, setTags] = useState(initialTags);
	const style = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 400,
		height: 500,
		p: 3,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	};

	const addTag = e => {
		e.preventDefault();
		const trimmedInput = input.trim();
		if (!trimmedInput.length || trimmedInput == ' ') return;
		setTags([...tags, ...trimmedInput.split(' ')]);
		setInput('');
	};

	const deleteTag = index => {
		setTags(tags => tags.filter((tag, idx) => idx != index));
	};

	return (
		<Card sx={style} overflow='scroll'>
			<Box
				overflow='scroll'
				sx={{
					width: 1,
					height: 1,
					p: 1,
				}}
			>
				<TextField
					variant='standard'
					label='Add tag'
					component='form'
					onSubmit={addTag}
					value={input}
					onChange={e => setInput(e.target.value)}
					autoFocus
					fullWidth
				/>
				<List>
					{tags.map((tag, index) => (
						<ListItem key={index} disableGutters>
							<Chip label={tag} onDelete={() => deleteTag(index)} />
						</ListItem>
					))}
				</List>
			</Box>
			{tags !== initialTags && (
				<Button
					variant='contained'
					onClick={() => saveTags(tags)}
					disabled={tags === initialTags}
					sx={{ mb: 1 }}
				>
					Save and Close
				</Button>
			)}
			<Button onClick={() => saveTags([], true)}>Cancel</Button>
		</Card>
	);
};

export default EditTags;
