import styles from './Playlist.module.css';
import Tracklist from '../Tracklist/Tracklist';

function Playlist({ tracks, buttonLabel, onButtonClick, playlistName, onNameChange, onSavePlaylist }) {
    return (
        <div className={styles.playlistWrapper}>
            <input
                className={styles.playlistNameInput}
                type="text"
                placeholder="Enter playlist name"
                value={playlistName}
                onChange={onNameChange}
            />
            <Tracklist tracks={tracks} buttonLabel={buttonLabel} onButtonClick={onButtonClick}/>
            <button className={styles.savePlaylistBtn} onClick={onSavePlaylist}>Save to Spotify</button>
        </div>
    )
}

export default Playlist;