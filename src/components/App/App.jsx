import { useState, useEffect } from 'react';
import styles from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import { generateCodeVerifier, generateCodeChallenge } from '../../utils/pkce';

const CLIENT_ID = '09b3e6507745423cb33b374bc980f73c';
const REDIRECT_URI = 'http://127.0.0.1:5173/';
const SCOPES = 'user-read-private playlist-modify-public playlist-modify-private';

const MOCK_LIBRARY = [
  { id: 1, name: 'Heroes', artist: 'David Bowie', album: '"Heroes"', uri: 'spotify:track:7Jh1bpe76CNTCgdgAdBw4Z' },
  { id: 2, name: 'Life on Mars?', artist: 'David Bowie', album: 'Hunky Dory', uri: 'spotify:track:3ZE3wv8V3w2T2f7nOCjV0N' },
  { id: 3, name: 'Wish You Were Here', artist: 'Pink Floyd', album: 'Wish You Were Here', uri: 'spotify:track:7aE5WXu5sFeNRh3Z05wwu0' },
  { id: 4, name: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', uri: 'spotify:track:3z8h0TU7ReDPLIbEnYhWZb' },
  { id: 5, name: 'Stairway to Heaven', artist: 'Led Zeppelin', album: 'Led Zeppelin IV', uri: 'spotify:track:5CQ30WqJwcep0pYcV4AMNc' },
  { id: 6, name: 'Smells Like Teen Spirit', artist: 'Nirvana', album: 'Nevermind', uri: 'spotify:track:5ghIJDpPoe3CfHMGu71E6T' },
  { id: 7, name: 'Imagine', artist: 'John Lennon', album: 'Imagine', uri: 'spotify:track:7pKfPomDEeI4TPT6EOYjn9' },];

function App() {

 // Set up state to hold the search results and playlist tracks
  const [accessToken, setAccessToken] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false); // New state to track if a search has been performed
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [userId, setUserId] = useState(null);
  const [playlistName, setPlaylistName] = useState('');
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
	  async function exchangeCodeForToken() {

  // 1. Read the query string from the URL

      const search = window.location.search;
  // 2. Parse it with URLSearchParams and get the 'code' parameter

      const params = new URLSearchParams(search);
      const code = params.get("code");
  // 3. If there's no code, exit early (the user hasn't logged in yet)

      if (!code) return;

  // 4. Guard against double-execution from Strict Mode

      const verifier = sessionStorage.getItem('spotify_code_verifier');
      if (!verifier) return;

      // Remove the verifier IMMEDIATELY so the second run finds nothing
      sessionStorage.removeItem('spotify_code_verifier');

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

  // 9. Fetch user's Spotify ID with a GET /me fetch
        const meResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: { 'Authorization': `Bearer ${data.access_token}` }
        });
        const meData = await meResponse.json();
        if (meResponse.ok) {
          setUserId(meData.id);
        }
        
  // 10. Clean the URL (window.history.replaceState)
        window.history.replaceState(null, '', window.location.pathname);
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

  async function handleSearch(query) {
    const lowerQuery = query.toLowerCase();
    const filtered = MOCK_LIBRARY.filter(track =>
      track.name.toLowerCase().includes(lowerQuery) ||
      track.artist.toLowerCase().includes(lowerQuery) ||
      track.album.toLowerCase().includes(lowerQuery)
    );
    setSearchResults(filtered);
    setHasSearched(true);
  }

  async function handleLogin() {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    sessionStorage.setItem('spotify_code_verifier', codeVerifier);
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}&code_challenge_method=S256&code_challenge=${codeChallenge}`;
    window.location = authUrl;
  }

  async function handleSavePlaylist() {
    // 1. Guard: don't save if there's no playlist name or no tracks
    if (!playlistName.trim() || playlistTracks.length === 0) {
      return;
    }

    setSaveStatus(null); // clear any previous message before trying again

    try {
      // 2. Build the array of URIs from playlistTracks
      const uris = playlistTracks.map(track => track.uri);

      // 3. First API call: POST /v1/me/playlists to create the playlist
      const createResponse = await fetch('https://api.spotify.com/v1/me/playlists', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: playlistName,
        public: false,
      }),
    });

      if (!createResponse.ok) {
      throw new Error(`Failed to create playlist (status ${createResponse.status})`);
      }

      const createData = await createResponse.json();
      const playlistId = createData.id;

      // 4. Second API call: POST /v1/playlists/{playlistId}/tracks to add the URIs

      const addResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: uris
        }),
      });

      if (!addResponse.ok) {
        throw new Error(`Failed to add tracks (status ${addResponse.status})`);
      }

      // 5. Local cleanup: empty playlistTracks state, clear playlistName state, success message
      setPlaylistTracks([]);
      setPlaylistName('');
      setSaveStatus('Playlist saved to Spotify!');
      
    } catch (error) {
      console.error(error);
      setSaveStatus('Could not save playlist. Please try again.');
    }
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
            playlistName={playlistName}
            onNameChange={setPlaylistName}
            onSavePlaylist={handleSavePlaylist}
            saveStatus={saveStatus} 
            />
          </>) : (
            <button onClick={handleLogin} className={styles.loginBtn}>Log in to Spotify</button>
          )}
    </div>
  );
}

export default App;
