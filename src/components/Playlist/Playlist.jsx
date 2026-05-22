import styles from './Playlist.module.css';
import Tracklist from '../Tracklist/Tracklist';

function Playlist({ tracks, buttonLabel, onButtonClick }) {
    return (
        <div className={styles.playlistWrapper}>
            <h2>My Playlist</h2>
            <Tracklist tracks={tracks} buttonLabel={buttonLabel} onButtonClick={onButtonClick}/>
        </div>
    )
}

export default Playlist;