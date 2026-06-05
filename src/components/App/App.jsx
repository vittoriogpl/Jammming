import { useState, useEffect } from 'react';
import styles from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import { generateCodeVerifier, generateCodeChallenge } from '../../utils/pkce';

// Empty arrays (useState([])) match the app's real initial behavior — 
// nothing shows up until the user does something. But the screen will look mostly blank during this phase, 
// which makes it hard to verify that the rendering logic actually works. 
// Pre-populated arrays (an array of 3-4 mock song objects) let you see the UI come to life immediately —
// you can confirm Tracklist renders, Track displays the right fields, whether styling looks right, etc. 
// But it's "fake" in the sense that real users won't see this initial state.
// For this static phase, pre-populated is a better choice. The goal right now isn't to simulate real app behavior — 
// it's to verify if components render correctly and if props flow through the hierarchy. 
// Mock data gives you something to see. Once we wire up real search later, 
// we'll change the initial state to [] and the search handler will populate it.

const CLIENT_ID = '09b3e6507745423cb33b374bc980f73c';
const REDIRECT_URI = 'http://127.0.0.1:5173/';
const SCOPES = 'user-read-private playlist-modify-public';

// const hash = window.location.hash; "#access_token=BQD..."
// hash is now "#access_token=BQD...&token_type=Bearer&expires_in=3600"
// If the user visits your app without coming from Spotify, window.location.hash is just "" (empty string). 
// That's how you'll detect "no token to extract."
// const stripped = hash.substring(1); "access_token=BQD..."  (removes the #)
// substring(1) returns everything from index 1 onward, effectively chopping off the first character (the #).
// const params = new URLSearchParams(stripped); URLSearchParams expects the string without the leading #. 
// So you have to strip it off first
// const token = params.get('access_token'); "BQD..."
// token is now "BQD123"


function App() {

 // Set up state to hold the search results and playlist tracks
  const [accessToken, setAccessToken] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false); // New state to track if a search has been performed
  const [playlistTracks, setPlaylistTracks] = useState([]);

  useEffect(() => {
	  async function exchangeCodeForToken() {

  // 1. Read the query string from the URL
      const search = window.location.search;
  // 2. Parse it with URLSearchParams and get the 'code' parameter
      const params = new URLSearchParams(search);
      const code = params.get("code");
  // 3. If there's no code, exit early (the user hasn't logged in yet)
      if (!code) return;
  // 4. Retrieve the verifier from sessionStorage
      const verifier = sessionStorage.getItem('spotify_code_verifier');
  // 5. Build the request body using URLSearchParams (same approach for building form-encoded data)
  //    Include all 5 required fields
      const body = new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
      code_verifier: verifier
      });
      

  // 6. Make the POST fetch to <https://accounts.spotify.com/api/token>
  //    Include method, headers, and body
        const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body,
        });
  // 7. Parse the JSON response
        const data = await response.json();
  // 8. Call setAccessToken with the access_token from the response
        setAccessToken(data.access_token);
  // 9. Clean the URL (window.history.replaceState)
        window.history.replaceState(null, '', window.location.pathname);
  // 10. Remove the verifier from sessionStorage
        sessionStorage.removeItem('spotify_code_verifier');
  }

    exchangeCodeForToken();
  }, []);
  
 // Step 3: create the simpler handler functions to add to/remove tracks from the playlist
  function handleAddTrack(track) {
    if (playlistTracks.some(t=> t.id === track.id)) {
      return; // Track is already in the playlist, do nothing.
    }
    setPlaylistTracks([...playlistTracks, track]);
  }

  function handleRemoveTrack(track) {
    setPlaylistTracks(playlistTracks.filter(t => t.id !== track.id));
  }

  function handleSearch(searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = mockLibrary.filter(track =>  
      track.name.toLowerCase().includes(lowerSearchTerm) ||
      track.artist.toLowerCase().includes(lowerSearchTerm) ||
      track.album.toLowerCase().includes(lowerSearchTerm)
    );
    setSearchResults(filtered);
    setHasSearched(true);
    console.log('Searching for:', searchTerm);
    // In a later step, this is where we'd call the Spotify API and update searchResults with the response.
  }

  async function handleLogin() {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    sessionStorage.setItem('spotify_code_verifier', codeVerifier);
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}&code_challenge_method=S256&code_challenge=${codeChallenge}`;
    window.location = authUrl;
  }

  return (
    <div className={styles.appWrapper}>
      <h1 className={styles.appTitle}>Jammming</h1>
      {accessToken ? (
        <>
          <SearchBar onSearch={handleSearch} />
          <SearchResults 
          tracks={searchResults}
          buttonLabel='+'
          onButtonClick={handleAddTrack}
          hasSearched={hasSearched}
          />
          <Playlist
            tracks={playlistTracks}
            buttonLabel='-'
            onButtonClick={handleRemoveTrack} 
            />
          </>) : (
            <button onClick={handleLogin} className={styles.loginBtn}>Log in to Spotify</button>
          )}
    </div>
  );
}

export default App;
