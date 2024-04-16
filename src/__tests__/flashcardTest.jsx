import { render, screen } from '@testing-library/react';
import FlashCard from '../routes/flashcards';
import React from 'react';
import { fireEvent } from '@testing-library/react';

// Mock Firebase Storage
jest.mock("firebase/storage", () => ({
    getStorage: jest.fn(),
    ref: jest.fn(),
    getBlob: jest.fn().mockImplementation(() => Promise.resolve(new Blob(["test"], { type: 'audio/mpeg' })))
  }));
  
  // Mock ReactPlayer indirectly by just ensuring it renders without actual functionality
  jest.mock('react-player', () => () => "ReactPlayer");
  
  // Prepare test data
  const testData = {
    id: '1',
    question: 'What is the capital of France?',
    answer: 'Paris',
    questionImage: 'path/to/questionImage.jpg',
    questionAudio: 'path/to/questionAudio.mp3',
    answerImage: 'path/to/answerImage.jpg',
    answerAudio: 'path/to/answerAudio.mp3'
  };
  
  describe('FlashCard Component', () => {
    /*
    it('renders correctly with initial question and button text', async () => {
        render(<FlashCard data={testData} deleteFlashcard={() => {}} cardStudied={() => {}} isUserCards={true} />);
        expect(screen.getByText((content, node) => {
            const hasText = (node) => node.textContent === "What is the capital of France?";
            const nodeHasText = hasText(node);
            const childrenDontHaveText = Array.from(node.children).every(child => !hasText(child));
          
            return nodeHasText && childrenDontHaveText;
          })).toBeInTheDocument();
          
        expect(await screen.findByText('Reveal Answer')).toBeInTheDocument();
      });
      */

      /*
      it('toggles flip state on button click', () => {
        render(<FlashCard data={testData} deleteFlashcard={() => {}} cardStudied={() => {}} isUserCards={true} />);
        const flipButton = screen.getByText('Reveal Answer');
        fireEvent.click(flipButton);
        expect(flipButton.textContent).toBe('Show Question');
        expect(screen.getByText('Paris')).toBeInTheDocument(); // Should show the answer
      });
      */

      /*
      it('calls deleteFlashcard on delete button click', () => {
        const mockDelete = jest.fn();
        render(<FlashCard data={testData} deleteFlashcard={mockDelete} cardStudied={() => {}} isUserCards={true} />);
        const deleteButton = screen.getByText('Delete');
        fireEvent.click(deleteButton);
        expect(mockDelete).toHaveBeenCalledWith('1'); // Ensure it's called with the correct ID
      });
      */
  });