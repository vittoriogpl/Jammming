import styles from './Playlist.module.css';
import Tracklist from '../Tracklist/Tracklist';

function Playlist({ tracks, buttonLabel, onButtonClick, playlistName, onNameChange, onSavePlaylist }) {
    return (
        <div className={styles.playlistWrapper}>
            <h2>My Playlist</h2>
            <Tracklist tracks={tracks} buttonLabel={buttonLabel} onButtonClick={onButtonClick}/>
            <button className={styles.savePlaylistBtn} onClick={onSavePlaylist}>Save to Spotify</button>
        </div>
    )
}

export default Playlist;