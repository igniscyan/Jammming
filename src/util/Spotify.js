const clientID = 'a86855ab357048c484d31496f0ad21b2';
const redirectURI = 'http://localhost:8888/';

//global variables
let accessToken;
let expiresIn;

const Spotify = {
  //This is the most important function in the Spotify class
  getAccessToken() {
    //if the accessToken has already been acquired then we can just return it
    if (accessToken) {
      return accessToken;
    }
    //window.location.href provides the URL of the current page
    const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
    const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
    //once we get the information required from the URL we may proceed.
    if (urlAccessToken && urlExpiresIn) {
      accessToken = urlAccessToken[1];
      expiresIn = urlExpiresIn[1];
      //expiresIn gives the number of seconds we have with the current accessToken, so we clear our accessToken after that time.
      //once accessToken is empty again, we may look to the URL for the new one and if necessary, have the user re-authorize
      window.setTimeout(() => (accessToken = ''), expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    }
    //if we didn't have the accessToken and an expiresIn available in our URL, then the user needs to authorize first.
    else {
      window.location = `https://accounts.spotify.com/authorize?response_type=token&scope=playlist-modify-public&client_id=${clientID}&redirect_uri=${redirectURI}`;
    }
  },

  async search(term) {
    //fetch() returns a promise of a query for the track we want.
    let response = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=${term.replace(
        ' ',
        '%20'
      )}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    //json() returns a promise with the original response formatted as a json object
    let jsonResponse = await response.json();
    //parse the json response using map() and return the formatted results
    if (!jsonResponse.tracks) return [];
    return jsonResponse.tracks.items.map((track) => {
      return {
        id: track.id,
        name: track.name,
        artists: track.artists[0].name,
        album: track.album.name,
        uri: track.uri,
      };
    });
  },

  async savePlaylist(playlistName, trackURI) {
    //reject this function call if the playlist has no name, or if there are no tracks
    if (!playlistName || !trackURI.length || !trackURI) {
      return;
    }

    //accessToken is required to make requests to the Spotify server
    const accessToken = Spotify.getAccessToken();
    //We will provide the accessToken within the header of each request, including it in the Authorization field
    const headers = { Authorization: `Bearer ${accessToken}` };
    //Some variables to be filled in later
    //UID: user id for the person using the app, to be used for making playlists in their own name
    //playlistId: will be the id for the playlist that's created, so songs may be added to it
    let UID;
    let playlistId;

    //fetch() returns a promise of a query response
    let response = await fetch(`https://api.spotify.com/v1/me`, {
      headers: headers,
    });
    //json() returns a promise of the response formatted as a json object
    let jsonResponse = await response.json();
    UID = jsonResponse.id;

    //fetch() is being used to make a POST request for a new playlist
    let response2 = await fetch(
      `https://api.spotify.com/v1/users/${UID}/playlists`,
      {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({ name: playlistName }),
      }
    );
    let jsonResponse2 = await response2.json();
    playlistId = jsonResponse2.id;

    //fetch() is being used to make a POST request for the tracks within the new playlist
    let response3 = await fetch(
      `https://api.spotify.com/v1/users/${UID}/playlists/${playlistId}/tracks`,
      {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({ uris: trackURI }),
      }
    );
  },
};

export default Spotify;
