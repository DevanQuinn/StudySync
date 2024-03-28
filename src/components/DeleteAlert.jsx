import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@mui/material';
import React from 'react';

const DeleteAlert = ({ title, description, state, children }) => {
	const [alertOpen, setAlertOpen] = state;
	return (
		<Dialog
			open={alertOpen}
			onClose
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{description}
				</DialogContentText>
			</DialogContent>
			<DialogActions>{children}</DialogActions>
		</Dialog>
	);
};

export default DeleteAlert;
