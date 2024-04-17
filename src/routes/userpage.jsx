import * as React from 'react';
import { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Copyright from '../components/Copyright.jsx';
import app from '../firebase';
import CardContent from '@mui/material/CardContent';
import {
	getDownloadURL,
	getStorage,
	ref,
} from 'firebase/storage';
import { useParams } from 'react-router-dom';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import CardMedia from '@mui/material/CardMedia';
import {
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Paper,
  Card,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function ProfilePage() {
  const [data, setData] = useState({aboutMe: '', studyGoals: ''});
  const [image, setImage] = useState();
  const { username } = useParams();
  const storage = getStorage(app);
  const db = getFirestore(app);
  
  const fetchData = async () => {
    const docRef = doc(db, "users", username);
    const q = await getDoc(docRef);
    const data = q.data();
    const pathReference = ref(storage, `profile-pictures/${data.pfpID}`);
    const url = await getDownloadURL(pathReference);
    setData(data);
    setImage(url);
  };

  useEffect(() => {
      fetchData();
    }, [username]);


  return (
      <Container component="main" maxWidth="xs">
      <Box>
        <Card>
          <CardMedia
            component="img"
            height="140"
            src={image}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {username}
            </Typography>
          </CardContent>
          </Card>
      </Box>
      <TableContainer
				component={Paper}
				sx={{
					mb: 5,
					maxWidth: 400,
					marginLeft: 'auto',
					marginRight: 'auto',
					mt: 2,
					borderTop: '1px solid lightgrey',
				}}
			>
				<Table sx={{ minWidth: 400 }}>
					<TableHead>
							<TableCell
								sx={{
									fontWeight: 'bold',
									textAlign: 'center',
									borderBottom: '2px solid lightgrey',
									borderRight: '1px solid lightgrey',
								}}
							>
								About Me
							</TableCell>
              <TableRow
              	sx={{
									borderBottom: '1px solid lightgrey',
									borderRight: '1px solid lightgrey',
                  minWidth: 500
								}}
							>
								{data.aboutMe}
							</TableRow>
					</TableHead>
				</Table>
			</TableContainer>
      <TableContainer
				component={Paper}
				sx={{
					mb: 5,
					maxWidth: 400,
					marginLeft: 'auto',
					marginRight: 'auto',
					mt: 2,
					borderTop: '1px solid lightgrey',
				}}
			>
				<Table sx={{ minWidth: 400 }}>
					<TableHead>
							<TableCell
								sx={{
									fontWeight: 'bold',
									textAlign: 'center',
									borderBottom: '2px solid lightgrey',
									borderRight: '1px solid lightgrey',
								}}
							>
                Study Goals
							</TableCell>
              <TableRow
              	sx={{
									borderBottom: '1px solid lightgrey',
									borderRight: '1px solid lightgrey',
                  minWidth: 500
								}}
							>
								{data.studyGoals}
							</TableRow>
					</TableHead>
				</Table>
			</TableContainer>
      <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
  );
}
