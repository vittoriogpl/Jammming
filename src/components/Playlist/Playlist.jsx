import styles from './Playlist.module.css';
import Tracklist from '../Tracklist/Tracklist';

function Playlist() {
    return (
        <div className={styles.playlistWrapper}>
            <Tracklist />
        </div>
    )
}

export default Playlist;