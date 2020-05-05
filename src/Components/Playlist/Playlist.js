import React from 'react';

export class Playlist = () => {
    return (
        <div className="Playlist">
            <input defaultValue={'New Playlist'} />
            <!-- Add a TrackList component -->
            <button className="Playlist-save">SAVE TO SPOTIFY</button>
        </div>
    );
}