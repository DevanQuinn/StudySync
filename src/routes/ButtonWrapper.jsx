// ButtonWrapper.js
import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    position: 'fixed',
    bottom: theme.spacing(2),
    left: theme.spacing(2),
    zIndex: 1000,
  },
}));

const ButtonWrapper = ({ children }) => {
  const classes = useStyles();

  const handleToggleChatbot = () => {
    setShowChatbot(prevState => !prevState);
  };

  
  return (
    <div>
      {children}
      <div className={classes.buttonContainer}>
        <Button variant="contained" color="primary" onClick={handleToggleChatbot}>
          Listen to Music :)
        </Button>
      </div>
    </div>
  );
};

export default ButtonWrapper;
