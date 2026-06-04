import { useState, useEffect } from 'react';
import styles from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

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

  // Step 1: create mock data while we're not working w/ the Spotify API yet.

  const mockSearchResults = [
  { id: 1, name: 'Heroes', artist: 'David Bowie', album: '"Heroes"' },
  { id: 2, name: 'Life on Mars?', artist: 'David Bowie', album: 'Hunky Dory' },
  ];

  const mockPlaylistTracks = [
  { id: 3, name: 'Wish You Were Here', artist: 'Pink Floyd', album: 'Wish You Were Here' },
  ];

  const mockLibrary = [
    { id: 1, name: 'Heroes', artist: 'David Bowie', album: '"Heroes"' },
    { id: 2, name: 'Life on Mars?', artist: 'David Bowie', album: 'Hunky Dory' },
    { id: 3, name: 'Wish You Were Here', artist: 'Pink Floyd', album: 'Wish You Were Here' },
    { id: 4, name: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera' },
    { id: 5, name: 'Stairway to Heaven', artist: 'Led Zeppelin', album: 'Led Zeppelin IV' },
    { id: 6, name: 'Brick on the Wall', artist: 'Pink Floyd', album: 'The Wall' },
  ];

 // Step 2: set up state to hold the search results and playlist tracks, initialized with the mock data.
  const [accessToken, setAccessToken] = useState(null);
  const [searchResults, setSearchResults] = useState(mockSearchResults);
  const [hasSearched, setHasSearched] = useState(false); // New state to track if a search has been performed
  const [playlistTracks, setPlaylistTracks] = useState(mockPlaylistTracks);

  useEffect(() => {
  // Step 1: Read the hash from the URL
    const hash = window.location.hash;
  
  // Step 2: Check if there's anything to process
  //         (the hash will be an empty string if no token is present)
    if (hash) {
    // Step 3: Strip the leading "#" and parse with URLSearchParams
      const stripped = hash.substring(1);
      const params = new URLSearchParams(stripped);
      
    // Step 4: Get the access token
      const token = params.get('access_token');
    // Step 5: If a token was found, store it in state with setAccessToken
      if (token) {
        setAccessToken(token);
      }
    // Step 6: Clean the URL with window.history.replaceState
      window.history.replaceState(null, '', window.location.pathname);
    }
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
            <a href={authUrl} className={styles.loginLink}>Log in to Spotify</a>
          )}
    </div>
  );
}

export default App;
