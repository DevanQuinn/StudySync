// PlaylistEmbed.jsx
import React from 'react';

const PlaylistEmbed = ({ playlist }) => {
  return (
    <div className="playlist-item">
      <h3>{playlist.name}</h3>
      <iframe
        title={`Spotify Embed: Playlist - ${playlist.name}`}
        src={`https://open.spotify.com/embed/playlist/${playlist.id}`}
        width="300"
        height="380"
        frameBorder="0"
        allowtransparency="true"
        allow="encrypted-media"
      ></iframe>
    </div>
  );
};

export default PlaylistEmbed;
