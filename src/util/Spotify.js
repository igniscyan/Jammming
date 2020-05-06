const clientID = "a86855ab357048c484d31496f0ad21b2";
const redirectURI = "http://localhost:3000/";

let accessToken;
let expiresIn;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
        return accessToken;
      }
      const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
      const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
      if (urlAccessToken && urlExpiresIn) {
        accessToken = urlAccessToken[1];
        expiresIn = urlExpiresIn[1];
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
      } else {
        window.location = `https://accounts.spotify.com/authorize?response_type=token&scope=playlist-modify-public&client_id=${clientID}&redirect_uri=${redirectURI}`;
      }
  },

  search(term) {
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term.replace(' ', '%20')}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => {
        if (!jsonResponse.tracks) {
            return []
        }
        return jsonResponse.tracks.items.map(track => {
            return {
                id: track.id,
                name: track.name,
                artists: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            };
          });
        }
      );
  },

  savePlaylist(playlistName, trackURI) {
    if (!playlistName || !trackURI.length || !trackURI) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let UID;
    let playlistId;

    fetch(`https://api.spotify.com/v1/me`, {
      headers: headers
    })
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => UID = jsonResponse.id).then(() => {
          fetch(`https://api.spotify.com/v1/users/${UID}/playlists`, {
              headers: headers,
              method: 'POST',
              body: JSON.stringify({ name: playlistName })
          }).then(response => response.json()).then(jsonResponse => {
              playlistId = jsonResponse.id;
          }).then(() => {
              fetch(`https://api.spotify.com/v1/users/${UID}/playlists/${playlistId}/tracks`, {
                  headers: headers,
                  method: 'POST',
                  body: JSON.stringify({uris: trackURI})
              })
          });
      });
    }
};

export default Spotify;
