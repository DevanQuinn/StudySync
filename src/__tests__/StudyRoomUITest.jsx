/*
This class will handle the testing of the Study Rooms UI to ensure
that all elements function as expected and are responsive.
*/
import React from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { BrowserRouter } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';
import RoomDetailsPage from '../routes/RoomDetailsPage';
import { videoCategories } from '../constants/videoCategories';
// Mock the Firestore directly within the jest.mock() call

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue({
      exists: true,
      data: jest.fn().mockReturnValue({ creator_id: 'test-user', videoCategory: 'Lofi', videoUrl: 'url' }),
    }),
    add: jest.fn().mockResolvedValue({
      get: jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({ creator_id: 'test-user', videoCategory: 'Lofi', videoUrl: 'url' }),
      }),
    }),
    delete: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    where: jest.fn().mockReturnThis(),
    // Ensure get() after where() returns a mock QuerySnapshot
    get: jest.fn().mockResolvedValue({
      docs: [{
        data: () => ({ invitedUserDisplayName: 'friend1', roomId: 'mock-room-id', inviterUserId: 'test-user' }),
        exists: true,
      }],
    }),
  }),
}));



// Directly using the mocked Firestore instance provided by the jest mock.
const db = jest.requireMock('firebase/firestore').getFirestore();



//1) testing room creation
test('creates a study room successfully in Firestore', async () => {
    // Setup: Create a mock study room object
    const studyRoom = { creator_id: 'test-user', videoCategory: 'Lofi', videoUrl: 'url' };
  
    // Action: Attempt to add a study room to the mock Firestore
    const docRef = await db.collection('studyrooms').add(studyRoom);
  
    // Assertion: Verify the document was created with the correct data
    const doc = await docRef.get();
    expect(doc.exists).toBeTruthy();
    expect(doc.data()).toEqual(studyRoom);
  });


//testing room deletion
  test('deletes a study room successfully from Firestore', async () => {
    // Setup: Assume a room exists; mock its ID
    const roomId = 'mock-room-id';
  
    // Action: Attempt to delete the room
    await db.collection('studyrooms').doc(roomId).delete();
  
    // Assertion: Verify the document no longer exists
    const doc = await db.collection('studyrooms').doc(roomId).get();
    expect(doc.exists).toBeFalsy();
  });

//Testing single invitation addition
test('adds a invitation to the database successfully', async () => {
    // Setup: Define mock invitation details
    const invitation = {
      invitedUserDisplayName: 'friend1',
      roomId: 'mock-room-id',
      inviterUserId: 'test-user',
    };
  
    // Action: Simulate adding an invitation to the database
    await db.collection('invitations').add(invitation);
  
    // Assertion: Verify the invitation exists in the database
    const querySnapshot = await db.collection('invitations').where('roomId', '==', 'mock-room-id').get();
    expect(querySnapshot.docs.find(doc => doc.data().invitedUserDisplayName === 'friend1')).not.toBeUndefined();
  });
  
 //Testing single invitation deletion
test('deletes an invitation from the db successfully', async () => {
  // Setup: Define mock invitation details
  const invitation = {
    invitedUserDisplayName: 'friend1',
    roomId: 'mock-room-id',
    inviterUserId: 'test-user',
  };

  // Action: Simulate adding an invitation to the database
  await db.collection('invitations').add(invitation);

  // Delete the doc
  await db.collection('invitations').where('roomId', '==', 'mock-room-id').delete();

  //verification
  const deletedDoc = await db.collection('invitations').where('roomId', '==', 'mock-room-id').get();

  expect(deletedDoc.exists).toBeFalsy();
});
