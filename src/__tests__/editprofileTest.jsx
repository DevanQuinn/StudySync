import React from 'react';
import { render, waitFor } from '@testing-library/react';
//import '@testing-library/jest-dom/extend-expect';
import EditProfile from '../routes/editprofile'; // Update this path to the correct location of your component

// Mock Firestore and other Firebase services as needed
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve({
    exists: () => true,
    data: () => ({
      studyGoals: 'Complete all assignments on time',
      favorites: ['Study Room', 'Timer'],
      profilePicture: 'path/to/image.jpg'
    })
  })),
  doc: jest.fn(),
}));

// Assuming useUser is a hook you've written to access user data, mock it accordingly
jest.mock('../hooks/useUser', () => () => ({
  uid: 'testUid',
  email: 'user@example.com',
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  getBlob: jest.fn(),
}));

/*
test('fetches and displays existing user profile data on initialization', async () => {
    const { findByDisplayValue, findByLabelText } = render(<EditProfile />);
  
    const studyGoalsInput = await findByDisplayValue('Complete all assignments on time');
    expect(studyGoalsInput).toBeInTheDocument();
  
    const studyRoomCheckbox = await findByLabelText('Study Room');
    expect(studyRoomCheckbox).toBeChecked();
  
    const timerCheckbox = await findByLabelText('Timer');
    expect(timerCheckbox).toBeChecked();
  });
  */