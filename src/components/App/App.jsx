import { useState } from 'react';
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

function App() {
  // Step 1: create mock data while we're not working w/ the Spotify API yet.

  const mockSearchResults = [
  { id: 1, name: 'Heroes', artist: 'David Bowie', album: '"Heroes"' },
  { id: 2, name: 'Life on Mars?', artist: 'David Bowie', album: 'Hunky Dory' },
  ];

  const mockPlaylistTracks = [
  { id: 3, name: 'Wish You Were Here', artist: 'Pink Floyd', album: 'Wish You Were Here' },
  ];

 // Step 2: set up state to hold the search results and playlist tracks, initialized with the mock data.
  const [searchResults, setSearchResults] = useState(mockSearchResults);
  const [playlistTracks, setPlaylistTracks] = useState(mockPlaylistTracks);
  
 // Step 3: create the simpler handler functions to add to/remove tracks from the playlist
  function handleAddTrack(track) {
    if (playlistTracks.some(t=> t.id === track.id)) {
      return; // Track is already in the playlist, do nothing.
    }
    setPlaylistTracks([...playlistTracks, track]);
  }

  function handleRemoveTrack(track) {
    setPlaylistTracks(playlistTracks.filter(track => track.id !== track.id));
  }


  return (
    <div className={styles.appWrapper}>
      <h1 className={styles.appTitle}>Jammming</h1>
        <SearchBar />
        <SearchResults 
        tracks={searchResults} 
        buttonLabel="+" 
        onButtonClick={handleAddTrack}/>
        <Playlist 
        tracks={playlistTracks} 
        buttonLabel="-" 
        onButtonClick={handleRemoveTrack}/>  
    </div>
  );
}

export default App;
