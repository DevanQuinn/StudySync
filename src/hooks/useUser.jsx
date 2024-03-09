import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const useUser = (redirectUser, notLoggedIn) => {
	const [user, setUser] = useState();

	useEffect(() => {
		const auth = getAuth();
		onAuthStateChanged(auth, user => {
			if (user) {
				setUser(user);
				return;
			}
			if (notLoggedIn) notLoggedIn();
			if (redirectUser) window.location = '/signin';
		});
	}, []);

	return user;
};

export default useUser;
