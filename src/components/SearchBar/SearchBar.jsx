import styles from './SearchBar.module.css';
import { useState } from 'react';

function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className={styles.searchBarWrapper}>
            <input 
                type="text"
                placeholder="Enter a song, album, or artist" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        onSearch(searchTerm);
                    }
                }}
            />
            <button onClick={() => onSearch(searchTerm)}>Search</button>
        </div>
    );
}

export default SearchBar;