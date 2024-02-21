import React from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const Copyright = (props) => {
    return (
      <Typography variant="body2" color="text.primary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="/">
          StudySync
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  };

export default Copyright;