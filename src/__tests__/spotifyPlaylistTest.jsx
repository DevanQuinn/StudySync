import { render, screen, fireEvent } from '@testing-library/react';
import SpotifyPlaylists from '../routes/SpotifyPlaylists';
import { MemoryRouter } from 'react-router-dom';
import { Router } from 'react-router-dom';
import React from 'react';

describe('SpotifyPlaylists', () => {
    /*
    test('extracts and sets access token from URL', () => {
      const initialEntries = ['/callback#access_token=test-token'];
      render(
        <MemoryRouter initialEntries={initialEntries}>
          <SpotifyPlaylists />
        </MemoryRouter>
      );
  
      expect(screen.getByText('Access Token: test-token')).toBeInTheDocument();
    });
    */
  });

describe('SpotifyPlaylists Rendering', () => {
    /*
    test('renders login button if no access token', () => {
      render(<SpotifyPlaylists />);
      expect(screen.getByText('Please login to view your playlists.')).toBeInTheDocument();
      expect(screen.getByText('Login with Spotify')).toBeInTheDocument();
    });
  
    test('renders playlist content if access token is present', () => {
      // Mock useState to simulate accessToken presence
      jest.spyOn(React, 'useState').mockReturnValueOnce(['test-token', jest.fn()]);
      render(<SpotifyPlaylists />);
      expect(screen.getByText('Your Playlists')).toBeInTheDocument();
    });
    */
  });
  
