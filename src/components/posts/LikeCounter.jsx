import { Typography } from '@mui/material';
import {
	collection,
	getFirestore,
	onSnapshot,
	query,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import app from '../../firebase';

const LikeCounter = ({ postId }) => {
	const [count, setCount] = useState(null);
	const db = getFirestore(app);

	const fetchLikeCount = () => {
		const col = collection(db, 'posts', postId, 'likes');
		const unsubscribe = onSnapshot(query(col), snapshot => {
			setCount(snapshot.size);
		});
		return unsubscribe;
	};

	useEffect(() => {
		const unsubscribe = fetchLikeCount();
		return () => unsubscribe();
	}, []);

	if (count == null) return <></>;
	return (
		<Typography variant='subtitle2'>
			{count} {count != 1 ? 'likes' : 'like'}
		</Typography>
	);
};

export default LikeCounter;
