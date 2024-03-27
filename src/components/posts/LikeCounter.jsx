import { Typography } from '@mui/material';
import { collection, doc, getDocs, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import app from '../../firebase';

const LikeCounter = ({ postId }) => {
	const [count, setCount] = useState(null);
	const db = getFirestore(app);

	const fetchLikeCount = async () => {
		const col = collection(db, 'posts', postId, 'likes');
		const docs = await getDocs(col);
		setCount(docs.size);
	};

	useEffect(() => {
		fetchLikeCount();
	}, []);

	if (count == null) return <></>;
	return (
		<Typography variant='subtitle2'>
			{count} {count != 1 ? 'likes' : 'like'}
		</Typography>
	);
};

export default LikeCounter;
