import React from 'react';
import { Button, Typography } from '@mui/material';

const ChangeColor = ({ changeColor }) => {
  return (
    <div>
      <Typography variant='h4'>Change NavBar Color</Typography>
      <Button variant='contained' color='primary' onClick={changeColor}>
        Change NavBar Color
      </Button>
    </div>
  );
};

export default ChangeColor;
