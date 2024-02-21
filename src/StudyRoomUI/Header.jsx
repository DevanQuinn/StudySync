import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField'; // For multiline input

const Header = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <header className="hero">
      <div className="heroInner">
        <h1>Study Room</h1>
        <button className="btn" onClick={handleClickOpen}>
          Create Study Room
        </button>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Create a New Study Room</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="room-name">Room Name</InputLabel>
              <Input id="room-name" />
              <FormHelperText>Name your study room.</FormHelperText>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <TextField
                id="room-description"
                label="Description"
                multiline
                rows={4}
                variant="outlined"
                placeholder="Describe your study room"
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="time-limit">Time Limit (Minutes)</InputLabel>
              <Input id="time-limit" type="number" />
              <FormHelperText>Set a time limit for the study session.</FormHelperText>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="invite-friends">Invite Friends</InputLabel>
              <Input id="invite-friends" placeholder="Enter emails separated by commas" />
              <FormHelperText>Invite friends by email.</FormHelperText>
            </FormControl>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Create</Button>
          </DialogActions>
        </Dialog>
      </div>
    </header>
  );
};

export default Header;
