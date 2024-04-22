import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import AddFriend from '../routes/AddFriend';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as firestore from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import '@testing-library/jest-dom';

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  getDoc: jest.fn(),
  doc: jest.fn(),
  onSnapshot: jest.fn(() => {
    return () => {}; // returns an empty function for unsubscribing
  })
}));

jest.mock('firebase/auth', () => ({
    getAuth: jest.fn().mockReturnValue({
      currentUser: {
        displayName: 'currentuser',
        uid: '12345'  // Example UID
      }
    }),
    onAuthStateChanged: jest.fn().mockImplementation((callback) => {
      callback({
        displayName: 'currentuser',
        uid: '12345'
      });
    }),
  }));


  
describe('AddFriend', () => {
  /*
    it('loads and displays initial friends and invites', async () => {
      render(
        <MemoryRouter>  // Wrap the component in MemoryRouter
          <AddFriend />
        </MemoryRouter>
      );
      await waitFor(() => {
        expect(screen.getByText('Current Friends')).toBeInTheDocument();
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
      });
    });
  */
    it('displays no friends message if no friends are present', async () => {
      render(
        <MemoryRouter>
          <AddFriend />
        </MemoryRouter>
      );
      await waitFor(() => {
        expect(screen.getByText('No current friends')).toBeInTheDocument();
      });
    });
  
    // Additional tests can be added here
  });