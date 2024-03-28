import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	getFirestore,
	query,
	serverTimestamp,
	where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import useUser from '../../hooks/useUser';
import app from '../../firebase';
import { IconButton } from '@mui/material';
import { Favorite } from '@mui/icons-material';

const PostLikeButton = ({ postId }) => {
	const [liked, setLiked] = useState(false);
	const user = useUser();
	const db = getFirestore(app);
	const col = collection(db, `posts/${postId}/likes`);
	const [id, setId] = useState('');

	const fetchLike = async () => {
		const docs = await getDocs(
			query(col),
			where('user', '==', user.displayName)
		);
		if (docs.empty) {
			setId('');
			return;
		}
		setLiked(true);
		setId(docs.docs[0].id);
	};

	const updateLike = async () => {
		const likeStatus = !liked;
		if (likeStatus) {
			if (id) return;
			const like = {
				user: user.displayName,
				likedOn: serverTimestamp(),
			};
			const result = await addDoc(col, like);
			setId(result.id);
		} else {
			if (!id) return;
			await deleteDoc(doc(db, `posts/${postId}/likes/${id}`));
			setId('');
		}
	};

	useEffect(() => {
		if (!user) return;
		fetchLike();
	}, [user]);

	return (
		<IconButton
			onClick={() => {
				setLiked(liked => !liked);
				updateLike();
			}}
		>
			<Favorite color={liked ? 'primary' : 'action'} />
		</IconButton>
	);
};

export default PostLikeButton;
