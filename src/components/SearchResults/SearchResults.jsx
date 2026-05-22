import styles from './SearchResults.module.css';
import Tracklist from '../Tracklist/Tracklist';

function SearchResults({ tracks, buttonLabel, onButtonClick, hasSearched }) {
    return (
        <div className={styles.resultsWrapper}>
            <h2>Results</h2>
            { hasSearched && tracks.length === 0 ? 
            <p>No matches for your search.</p>
            : tracks.length > 0 && <Tracklist 
            tracks={tracks} 
            buttonLabel={buttonLabel} 
            onButtonClick={onButtonClick}/>
            }
        </div>
    );
}

export default SearchResults;