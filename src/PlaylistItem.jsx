// PlaylistItem.jsx
import React from 'react';

const PlaylistItem = ({ song }) => { //declares a functional component (takes a single prop called 'song')
  return (
    <li>
      {/* Displaying song title and artist */}
      {song.title} - {song.artist} 
    </li>
  );
};

export default PlaylistItem;