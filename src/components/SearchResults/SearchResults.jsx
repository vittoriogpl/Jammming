import styles from './SearchResults.module.css';
import Tracklist from '../Tracklist/Tracklist';

function SearchResults({ tracks, buttonLabel, onButtonClick }) {
    return (
        <div className={styles.resultsWrapper}>
            <h2>Results</h2>
            <Tracklist tracks={tracks} buttonLabel={buttonLabel} onButtonClick={onButtonClick}/>
        </div>
    );
}

export default SearchResults;