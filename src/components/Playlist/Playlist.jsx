import styles from './Playlist.module.css';
import Tracklist from '../Tracklist/Tracklist';

function Playlist({ tracks, buttonLabel, onButtonClick }) {
    return (
        <div className={styles.playlistWrapper}>
            <Tracklist tracks={tracks} buttonLabel={buttonLabel} onButtonClick={onButtonClick}/>
        </div>
    )
}

export default Playlist;