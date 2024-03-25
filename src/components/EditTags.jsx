import { Button, Card, Chip, List, ListItem, TextField } from '@mui/material';
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
		p: 4,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	};

	const addTag = e => {
		e.preventDefault();
		setTags([...tags, ...input.split(' ')]);
		setInput('');
	};

	const deleteTag = index => {
		const newTags = tags.filter((tag, idx) => idx != index);
		setTags(newTags);
	};

	return (
		<Card sx={style}>
			<TextField
				variant='standard'
				label='Add tag'
				component='form'
				onSubmit={addTag}
				value={input}
				onChange={e => setInput(e.target.value)}
				autoFocus
			/>
			<List>
				{tags.map((tag, index) => (
					<ListItem key={index} disableGutters>
						<Chip label={tag} onDelete={() => deleteTag(index)} />
					</ListItem>
				))}
			</List>
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
