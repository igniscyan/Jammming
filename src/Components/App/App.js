import React from 'react';
import './App.css';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import {Playlist} from '../Playlist/Playlist';


export class App extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      "searchResults": [{
        "name": "bum",
        "artist": "fuckers",
        "album": "R Us",
        "id": 4
      },
      {
        "name": "cheese",
        "artist": "whiz",
        "album": "R gross",
        "id": 5
      }],
      "playlistName": "poop-sock",
      "playlistTracks": [{
        "name": "bum",
        "artist": "fuckers",
        "album": "R Us",
        "id": 4
      },
      {
        "name": "cheese",
        "artist": "whiz",
        "album": "R gross",
        "id": 5
      }]
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    let res = this.state.playlistTracks;
    res.push(track);
    this.setState({
      playlistTracks: res
    });
  }
  removeTrack(track) {
    let res = this.state.playlistTracks; 
    res.filter(savedTrack => track.id !== savedTrack.id);
    this.setState({
      playlistTracks: res
      });
  }



  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults onAdd={this.addTrack} searchResults={this.state.searchResults} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} />
          </div>
        </div>
      </div>
    );
  }
}
