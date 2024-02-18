// PlaylistItem.jsx
import React from 'react';

const PlaylistItem = ({ song }) => {
  return (
    <li>
      {song.title} - {song.artist}
    </li>
  );
};

export default PlaylistItem;
