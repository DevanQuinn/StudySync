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

// jest.mock('firebase/firestore', () => ({
//   getFirestore: jest.fn().mockReturnValue({
//     collection: jest.fn().mockReturnThis(),
//     doc: jest.fn().mockReturnThis(),
//     get: jest.fn().mockResolvedValue({
//       exists: true,
//       data: jest.fn().mockReturnValue({ creator_id: 'test-user', videoCategory: 'Lofi', videoUrl: 'url' }),
//     }),
//     add: jest.fn().mockResolvedValue({
//       get: jest.fn().mockResolvedValue({
//         exists: true,
//         data: () => ({ creator_id: 'test-user', videoCategory: 'Lofi', videoUrl: 'url' }),
//       }),
//     }),
//     delete: jest.fn().mockResolvedValue({}),
//     update: jest.fn().mockResolvedValue({}),
//     where: jest.fn().mockReturnThis(),
//     // Ensure get() after where() returns a mock QuerySnapshot
//     get: jest.fn().mockResolvedValue({
//       docs: [{
//         data: () => ({ invitedUserDisplayName: 'friend1', roomId: 'mock-room-id', inviterUserId: 'test-user' }),
//         exists: true,
//       }],
//     }),
//   }),
// }));

// Mocking firebase/app for Auth related functionalities
jest.mock('firebase/app', () => {
  const actualFirebaseApp = jest.requireActual('firebase/app');
  return {
    ...actualFirebaseApp,
    getAuth: jest.fn(() => ({
      currentUser: {
        uid: 'test-user-id',
        displayName: 'Test User',
      },
    })),
  };
});

// Mocking firebase/firestore for Firestore database interactions
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    get: jest.fn().mockImplementation(path => {
      if (path === 'studyrooms') {
        return Promise.resolve({
          exists: true,
          data: () => ({ creator_id: 'test-user', videoCategory: 'Lofi', videoUrl: 'url' })
        });
      }
      return Promise.resolve({
        docs: [
          {
            data: () => ({ invitedUserDisplayName: 'friend1', roomId: 'mock-room-id', inviterUserId: 'test-user' }),
            exists: true,
          }
        ]
      });
    }),
    add: jest.fn().mockImplementation(data => Promise.resolve({
      get: jest.fn().mockResolvedValue({
        exists: true,
        data: () => data,
      })
    })),
    delete: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    onSnapshot: jest.fn((callback) => {
      const docs = [{ id: 'doc1', data: () => ({ content: 'Mock data' }) }];
      callback({ docs });
      return { unsubscribe: jest.fn() };
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
    expect(querySnapshot.docs.find(doc => doc.data().invterUserId === 'friend1')).not.toBeUndefined();
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


// Testing that all chats are retrievable from the Firestore database
test('retrieves all chat messages successfully from Firestore', async () => {
  // Setup: Mock chat data
  const mockChatData = [
      { id: 'msg1', sender: 'user1', message: 'Hello!', timestamp: new Date() },
      { id: 'msg2', sender: 'user2', message: 'Hi there!', timestamp: new Date() }
  ];

  // Mock the query and onSnapshot methods to simulate fetching data
  const mockOnSnapshot = jest.fn((callback) => {
      const snapshot = {
          docs: mockChatData.map(data => ({
              id: data.id,
              data: () => data,
              exists: true
          }))
      };
      callback(snapshot);
  });

  // Mocking the collection and query calls
  jest.requireMock('firebase/firestore').getFirestore.mockReturnValue({
      collection: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      onSnapshot: mockOnSnapshot
  });

  // Action: Retrieve chat messages from the mocked Firestore
  const roomId = 'mock-room-id';
  const inviterUid = 'test-user';
  const db = jest.requireMock('firebase/firestore').getFirestore();
  let retrievedMessages = [];
  db.collection('chats').where('roomId', '==', roomId).orderBy('timestamp').onSnapshot(snapshot => {
      retrievedMessages = snapshot.docs.map(doc => doc.data());
  });

  // Assertion: Verify that all messages are retrieved and data matches
  expect(retrievedMessages.length).toBe(mockChatData.length);
  expect(retrievedMessages).toEqual(expect.arrayContaining(mockChatData));
});


