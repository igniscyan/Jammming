const clientID = '';
const redirectURI = 'http://localhost:3000/';

let accessToken;

const Spotify = {
    getAccessToken(){
        //do we already have accessToken?
        if(accessToken) return accessToken;
        
        //accessToken empty; look in URL
        const accessTokenMatch = window.location.href.match(/accessToken=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        
        //was it found in URL? If so, store values.
        if(accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch;
            const expiresIn = expiresInMatch;
            window.setTimeout(() => accessToken='', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            //was not found in URL and we did not have it.
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        }
    },
    
    search(term) {
        const accessToken = Spotify.getAccessToken();

        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {headers: {Authorization: `Bearer ${accessToken}`}}).then( response => {
            return Response.json();
        }).then(jsonResponse => {
            if(jsonResponse.tracks) {
                jsonResponse.tracks.items.map(track => {
                    return {
                        id: track.id,
                        name: track.name,
                        artists: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri
                    };
                });
            }
            else return [];
        });
    }
};

export default Spotify;