// Import necessary utilities from React Testing Library and Jest
import { render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import UserPosts from '../routes/userposts';
import { waitFor, addDoc } from '@testing-library/react';
import { act } from 'react-dom/test-utils'; // Import act
import CreatePost from '../components/posts/CreatePost'
import EditTags from '../components/posts/EditTags'
import LikeCounter from '../components/posts/LikeCounter';
import Post from '../components/posts/Post';
import PostLikeButton from '../components/posts/PostLikeButton';
import TagSearch from '../components/posts/TagSearch'
import ViewComments from '../components/posts/ViewComments';
import userEvent from '@testing-library/user-event';  


// Mock useParams from 'react-router-dom'
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // import and retain the original functionalities
  useParams: () => ({
    username: 'testUser', // Mock username parameter
  }),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  uploadBytes: jest.fn().mockResolvedValue({
    metadata: { name: 'test-image-file-name' }
  }),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  deleteDoc: jest.fn().mockResolvedValue(),
  addDoc: jest.fn().mockResolvedValue({ id: 'new-post-id' }), // Mock for document addition
  serverTimestamp: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({
    // This should mimic the structure of a Firestore QuerySnapshot
    docs: [
        {
            id: 'post1', 
            data: () => ({ id: 'post1', title: 'Post 1', user: 'testUser', created: '2021-01-01' }),
            // Make sure to include metadata that the component might rely on, such as 'created'
        },
        {
            id: 'post2', 
            data: () => ({ id: 'post2', title: 'Post 2', user: 'testUser', created: '2021-01-02' }),
        },
    ],
    // Adding forEach directly on the returned object to mimic the real Firestore response
    forEach(callback) {
        this.docs.forEach(doc => callback(doc));
    }
  })),
  onSnapshot: jest.fn((query, callback) => {
    // Mimic onSnapshot for real-time updates
    const docs = {
        size: 2, // Assume there are 2 likes
        docs: [
            { id: 'like1', data: () => ({ user: 'user1' }) },
            { id: 'like2', data: () => ({ user: 'user2' }) },
        ],
        forEach: function(callback) {
            this.docs.forEach(doc => callback(doc));
        }
    };
    callback(docs);
    return jest.fn(); // Mock unsubscribe function
  }),
}));



  
describe('UserPosts Initial Render and Loading State', () => {
  test('displays loading indicator and message correctly', async () => {
    // Render the UserPosts component
    render(<UserPosts />);

    // Expect to find the loading indicator (CircularProgress) by its role
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    // Expect to find the specific loading message
    expect(screen.getByText('Fetching posts...')).toBeInTheDocument();
  });
});


describe('LikeCounter', () => {
  test('displays correct like count', async () => {
      render(<LikeCounter postId="testPostId" />);

      // Wait for the like count text to appear
      await waitFor(() => {
          expect(screen.getByText('2 likes')).toBeInTheDocument();
      });
  });
});



/*
describe('CreatePost Component', () => {
  let mockFetchPosts;

  beforeEach(() => {
    mockFetchPosts = jest.fn();
    jest.clearAllMocks();
  });

  test('submits form and resets input fields correctly', async () => {
    render(<CreatePost fetchPosts={mockFetchPosts} />);
    
    const titleInput = screen.getByTestId('title-input');
    const descriptionInput = screen.getByTestId('description-input');

    // Simulate user input
    await userEvent.type(titleInput, 'New Post Title');
    await userEvent.type(descriptionInput, 'New post description');

    const submitButton = screen.getByRole('button', { name: /submit post/i });

    // Check if the submit button is enabled after state updates
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    // Trigger the submit action
    await userEvent.click(submitButton);

    // Verify the form submission was handled
    await waitFor(() => {
      expect(mockFetchPosts).toHaveBeenCalled();
      expect(titleInput).toHaveValue(''); // Check if the input field is cleared
      expect(descriptionInput).toHaveValue(''); // Check if the input field is cleared
    });
  });
});
*/

/*
describe('PostLikeButton Component', () => {
  const mockUser = {
    displayName: 'testUser'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('toggles like state correctly', async () => {
    const { getByRole, getByTestId } = render(<PostLikeButton postId="testPostId" />);

    // Initially, the icon should be in its "action" color
    const likeIcon = getByTestId('like-icon');
    expect(likeIcon).toHaveClass('MuiSvgIcon-colorAction');

    // Simulate clicking the like button
    await userEvent.click(getByRole('button'));

    // Check if the icon color changes to "primary" after the click
    await waitFor(() => {
      expect(likeIcon).toHaveClass('MuiSvgIcon-colorPrimary');
    });

    // Check if addDoc was called
    expect(addDoc).toHaveBeenCalledWith(expect.anything(), {
      user: mockUser.displayName,
      likedOn: expect.anything(),
    });

    // Simulate clicking the like button again to unlike
    await userEvent.click(getByRole('button'));

    // Check if deleteDoc was called
    expect(deleteDoc).toHaveBeenCalled();
  });
});
*/

/*
describe('ViewComments Component', () => {
  const mockPostId = 'testPostId';
  const editable = true;

  test('renders comments and allows adding and deleting comments', async () => {
    render(<ViewComments postId={mockPostId} editable={editable} />);

    // Check for loading indicator
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Wait for comments to be loaded
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).toBeNull();
    });

    // Check if the initial comment is rendered
    expect(screen.getByText('Test comment')).toBeInTheDocument();

    // Simulate adding a comment
    const inputElement = screen.getByLabelText('Add comment');
    const submitButton = screen.getByRole('button', { name: 'Add comment' });

    // Change input and submit
    userEvent.type(inputElement, 'New comment');
    userEvent.click(submitButton);

    // Check if addDoc was called
    await waitFor(() => {
      expect(addDoc).toHaveBeenCalled();
    });

    // Simulate deleting a comment if editable
    if (editable) {
      const deleteButton = screen.getByRole('button', { name: 'Delete comment' });
      userEvent.click(deleteButton);

      // Check if deleteDoc was called
      await waitFor(() => {
        expect(deleteDoc).toHaveBeenCalled();
      });
    }
  });
});
*/