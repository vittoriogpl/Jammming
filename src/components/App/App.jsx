import { useState } from 'react';
import styles from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';


function App() {
  return (
    <div className={styles.appWrapper}>
      <h1 className={styles.appTitle}>Jammming</h1>
        <SearchBar />
        <SearchResults />
        <Playlist />  
    </div>
  );
}

export default App;
