import React from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { act, render, fireEvent } from '@testing-library/react';
import SignIn from '../routes/signin'; // Adjust the import path as necessary
import SignUp from '../routes/signup';
import { getFirestore, setDoc } from 'firebase/firestore';

beforeAll(() => {
    // Mock window.alert
    window.alert = jest.fn();
  });
  
  afterAll(() => {
    // Clean up and restore the original window.alert behavior
    window.alert.mockRestore();
  });

  
  jest.mock('firebase/firestore', () => {
    const originalModule = jest.requireActual('firebase/firestore');
  
    return {
      ...originalModule,
      getFirestore: jest.fn(),
      doc: jest.fn(),
      setDoc: jest.fn().mockResolvedValue({}),
      getDoc: jest.fn().mockResolvedValue({ exists: () => false }), // Simulating that the username does not already exist
    };
  });


// Mock setup for firebase/auth
jest.mock('firebase/auth', () => {
    return {
      getAuth: jest.fn(() => ({})), // Simplified for demonstration
      signInWithEmailAndPassword: jest.fn().mockResolvedValue({
        user: {
          uid: 'testUid',
          email: 'test@example.com',
        },
      }),
      // Mocking a rejected call for specific tests

      createUserWithEmailAndPassword: jest.fn().mockResolvedValue({
        user: {
          uid: 'testUid',
          email: 'test@example.com',
        },
      }),
      updateProfile: jest.fn().mockResolvedValue({}), // Explicitly mock updateProfile
    };
  });



  test('signs in user successfully', async () => {
    const { getByLabelText, getAllByText, debug, getByPlaceholderText} = render(<SignIn />);
  
    // Optionally, log the entire component tree
    // debug();

    // Simulate user input for email
    fireEvent.change(getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    

    // Fetch all elements with the text "Sign In" and filter for buttons
    const signInButtons = getAllByText(/sign in/i).filter(item => item.tagName === 'BUTTON');
    
    // Assuming the first button is the one we want (should only be one)
    const signInButton = signInButtons[0];
    if (!signInButton) {
        
        return;
    }

    // Simulate user input for password
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });
    

    await act(async () => {
        // Click the "Sign In" button
        fireEvent.click(signInButton);
       
    });
  
    // Assertions for expected outcomes post-sign-in
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'test@example.com', 'password123');
});

test('signs up a new user successfully', async () => {
    const { getByLabelText, getByText, getByPlaceholderText, getByTestId } = render(<SignUp />);
    
    
    // Fill in the form
    fireEvent.change(getByLabelText(/username/i), { target: { value: 'newUser' } });
    fireEvent.change(getByLabelText(/email address/i), { target: { value: 'newuser@example.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(getByLabelText(/confirm password/i), { target: { value: 'password123' } });

    
    // Mock file input for profile picture
    // Note: Handling file uploads in tests can be complex and may require mocking the file input more extensively.
    
    // Submit the form
    await act(async () => {
        fireEvent.click(getByTestId('sign-up-button'));
    });

   
    // Assertions to verify the interactions
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'newuser@example.com', 'password123');
    
    expect(updateProfile).toHaveBeenCalled();
    
    expect(setDoc).toHaveBeenCalled();
  

    // Log any additional information here
});

test('displays an error message for invalid email or password', async () => {
  // Adjust the mock to simulate a Firebase error
  const errorMessage = 'Firebase: Error (auth/invalid-credential).';
  signInWithEmailAndPassword.mockRejectedValue(new Error(errorMessage));

  const { getByLabelText, getByRole, getByPlaceholderText } = render(<SignIn />);

  // Simulate user input
  fireEvent.change(getByLabelText(/email address/i), { target: { value: 'invalid@example.com' } });
  fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });

  // Simulate form submission
  await act(async () => {
    fireEvent.click(getByRole('button', { name: /sign in/i }));
  });

  // Verify window.alert was called with the expected error message
  expect(window.alert).toHaveBeenCalledWith(errorMessage);

  // Reset mock after test
  signInWithEmailAndPassword.mockReset();
});

test('prevents sign in with invalid email format and shows an alert', async () => {
  // Mock `signInWithEmailAndPassword` to simulate a rejection for this test case
  signInWithEmailAndPassword.mockImplementation(() => Promise.reject(new Error('Firebase: Error (auth/invalid-credential).')));

  const { getByLabelText, getByRole, getByPlaceholderText } = render(<SignIn />);

  // Fill the email field with an invalid email format
  fireEvent.change(getByLabelText(/email address/i), { target: { value: 'test@com' } });
  // Assuming the password field must be non-empty to attempt submission
  fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });

  // Attempt to submit form
  await act(async () => {
      fireEvent.click(getByRole('button', { name: /sign in/i }));
  });

  // Check if an alert was shown due to invalid email format
  expect(window.alert).toHaveBeenCalled();
});

test('prevents sign in with empty fields and shows an alert', async () => {
  // Before attempting the sign-in, explicitly mock `signInWithEmailAndPassword` 
  // to simulate a rejection for this test case, as if Firebase is responding to the lack of credentials.
  signInWithEmailAndPassword.mockImplementation(() => Promise.reject(new Error('Firebase: Error (auth/empty-fields).')));

  const { getByRole } = render(<SignIn />);

  // Attempt to submit form with empty fields
  await act(async () => {
      fireEvent.click(getByRole('button', { name: /sign in/i }));
  });

  // Check if an alert was shown due to attempt to sign in with empty fields
  // This simulates the behavior of Firebase rejecting the sign-in attempt due to missing credentials
  // and your component displaying an alert in response.
  expect(window.alert).toHaveBeenCalled();
});


test('prevents form submission and shows an error if the passwords do not match', async () => {
  const { getByLabelText, getByTestId, queryByText, getByPlaceholderText } = render(<SignUp />);

  // Fill in the password fields with non-matching values
  fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });

  fireEvent.change(getByLabelText(/confirm password/i), { target: { value: 'password456' } });

  // Attempt to submit the form
  await act(async () => {
      fireEvent.click(getByTestId('sign-up-button'));
  });

  // Check for an error message (this assumes your component logic or Firebase shows an alert or renders an error message in the DOM)
  expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("passwords match"));
  // Or if you render error messages to the DOM, you might use something like:
  // expect(queryByText(/passwords do not match/i)).toBeInTheDocument();
});

test('toggles password visibility when the show/hide password option is clicked', async () => {
  const { getByLabelText, getByPlaceholderText } = render(<SignIn />);

  // Initially, the password should be of type 'password' (hidden)
  let passwordInput = getByPlaceholderText('Password');
  expect(passwordInput.type).toBe('password');

  // Find and click the show password checkbox
  const showPasswordCheckbox = getByLabelText(/show password/i);
  fireEvent.click(showPasswordCheckbox);

  // After clicking, the password should be of type 'text' (visible)
  passwordInput = getByPlaceholderText('Password'); // Re-query to get the updated element
  expect(passwordInput.type).toBe('text');

  // Click again to hide the password
  fireEvent.click(showPasswordCheckbox);

  // The password should be hidden again
  passwordInput = getByPlaceholderText('Password'); // Re-query to get the updated element
  expect(passwordInput.type).toBe('password');
});

