import { template } from "@babel/core";

const clientID = "a86855ab357048c484d31496f0ad21b2";
const redirectURI = "http://localhost:3000/";

let accessToken;

const Spotify = {
  getAccessToken() {
    //do we already have accessToken?
    if (accessToken) return accessToken;

    //accessToken empty; look in URL
    const accessTokenMatch = window.location.href.match(/accessToken=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    //was it found in URL? If so, store values.
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch;
      const expiresIn = expiresInMatch;
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");
      return accessToken;
    } else {
      //was not found in URL and we did not have it.
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();

    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => {
        if (jsonResponse.tracks) {
          jsonResponse.tracks.items.map(track => {
            return {
              id: track.id,
              name: track.name,
              artists: track.artists[0].name,
              album: track.album.name,
              uri: track.uri
            };
          });
        } else return [];
      });
  },

  savePlaylist(playlistName, trackURI) {
    if (!playlistName || !trackURI.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let UID;

    UID = fetch(`https://api.spotify.com/v1/me`, {
      headers: headers
    })
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => {
        if (jsonResponse.id) {
          return jsonResponse.id;
        } else return;
      });

    fetch(`https://api.spotify.com/v1/users/${UID}/playlists`, {
      headers: headers,
      method: "POST",
      body: JSON.stringify({ name: playlistName })
    })
      .then(response => response.json())
      .then(jsonResponse => {
        const playlistId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${UID}/playlists/${playlistId}/tracks`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({uris: trackURI })
        })
      });
  }
};

export default Spotify;
