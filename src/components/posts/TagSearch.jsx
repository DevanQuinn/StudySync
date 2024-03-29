import {
	Box,
	Chip,
	Divider,
	InputAdornment,
	TextField,
	Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import {
	collection,
	getDocs,
	getFirestore,
	query,
	where,
} from 'firebase/firestore';
import Post from './Post';

const TagSearch = () => {
	const [tags, setTags] = useState([]);
	const [input, setInput] = useState('');
	const [posts, setPosts] = useState([]);

	const db = getFirestore();
	const col = collection(db, 'posts');

	const handleSubmit = e => {
		e.preventDefault();
		const trimmedInput = input.trim();
		if (!trimmedInput.length || trimmedInput == ' ') return;
		setTags([...tags, ...trimmedInput.split(' ')]);
		setInput('');
	};

	const deleteTag = index => {
		setTags(tags => tags.filter((tag, idx) => idx != index));
	};

	const updatePosts = async () => {
		if (!tags?.length) {
			setPosts([]);
			return;
		}
		const q = query(col, where('tags', 'array-contains-any', tags));

		const docs = await getDocs(q);
		const newPosts = [];
		docs.forEach(doc => {
			const data = doc.data();
			data.id = doc.id;
			newPosts.push(data);
		});
		setPosts(newPosts);
	};

	useEffect(() => {
		updatePosts();
	}, [tags]);

	return (
		<Box>
			<TextField
				InputProps={{
					startAdornment: (
						<InputAdornment position='start'>
							<SearchIcon />
						</InputAdornment>
					),
				}}
				fullWidth
				placeholder='Filter public posts by tag'
				component='form'
				onSubmit={handleSubmit}
				value={input}
				onChange={e => setInput(e.target.value)}
			/>
			<Divider />
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					mt: 1,
				}}
			>
				{tags.map((tag, index) => (
					<Chip
						label={tag}
						onDelete={() => deleteTag(index)}
						key={tag}
						sx={{ mr: 1 }}
						color='secondary'
					/>
				))}
			</Box>
			{posts && (
				<Box>
					{posts.map(post => (
						<Post data={post} />
					))}
				</Box>
			)}
			{tags.length && !posts.length ? (
				<Typography>No results found.</Typography>
			) : null}
		</Box>
	);
};

export default TagSearch;
