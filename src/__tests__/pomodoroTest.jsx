import { render, screen, fireEvent, getByTestId } from '@testing-library/react';
import Pomodoro from '../routes/pomodoro';
import '@testing-library/jest-dom';
import React from 'react';


/*
// Mock timrjs since it handles the actual timing logic
jest.mock('timrjs', () => {
    return {
        create: jest.fn().mockImplementation(() => {
            const mockChain = {
                onStop: jest.fn(() => mockChain), // returns itself for chaining
                finish: jest.fn(() => mockChain)  // returns itself for chaining
            };
            return {
                start: jest.fn(),
                pause: jest.fn(),
                setStartTime: jest.fn(),
                getFt: jest.fn(() => "10:00"),
                ticker: jest.fn(callback => {
                    callback({ formattedTime: "10:00" });
                    return mockChain;  // return the chainable object
                }),
            };
        }),
    };
});
*/

jest.mock('timrjs', () => ({
  create: jest.fn().mockImplementation(() => {
      return {
          start: jest.fn(),
          pause: jest.fn(),
          setStartTime: jest.fn(),
          getFt: jest.fn(() => "10:00"),
          ticker: jest.fn(callback => {
              callback({ formattedTime: "10:00" });
              return {
                  onStop: jest.fn().mockReturnThis(),
                  finish: jest.fn().mockReturnThis()
              };
          }),
      };
  }),
}));



describe('Pomodoro Component', () => {
  let timer;

  beforeEach(() => {
    //jest.resetModules();
    //timer = require('timrjs').create();
    //render(<Pomodoro timerProp={timer} />);
    render(<Pomodoro />);
  });

  test('renders with default time', () => {
    expect(screen.getByText("Study!")).toBeInTheDocument();
    expect(screen.getByText("10:00")).toBeInTheDocument();
  });


  /*
  test('starts timer when start button is clicked', () => {
    const startButton = getByTestId('start-button');

    // Mock function to simulate timer behavior
    const timer = create();
    timer.start.mockClear(); // Clear any mocks if necessary

    fireEvent.click(startButton);
    expect(timer.start).toHaveBeenCalled();
  });
  */

/*
  test('starts timer when start button is clicked', () => {
    fireEvent.click(screen.getByText('Start'));
    expect(timer.start).toHaveBeenCalled();
  });
*/
/*
  test('pauses timer when pause button is clicked', () => {
    fireEvent.click(screen.getByText('Pause'));
    expect(timer.pause).toHaveBeenCalled();
  });


  test('updates timer settings on form submission', () => {
    fireEvent.input(screen.getByLabelText('Study Time'), {
      target: { value: '25:00' }
    });

    fireEvent.input(screen.getByLabelText('Short Break Time'), {
      target: { value: '5:00' }
    });
    fireEvent.submit(screen.getByText('Set'));
    
    expect(timer.setStartTime).toHaveBeenCalledTimes(2); // Called twice, once for study time, once for break time
  });



  test('switches between study and break times', () => {
    // Assuming that the `finish` method calls change the mode from study to break and vice versa
    // This would need actual implementation details to be more accurate
    timer.finish.mock.calls[0][0](); // Simulate finishing the study time
    expect(screen.getByText("Break!")).toBeInTheDocument();
    expect(screen.getByText("5:00")).toBeInTheDocument(); // Assume break time was set to 5:00
  });

  */

});
