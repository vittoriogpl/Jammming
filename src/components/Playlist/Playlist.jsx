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
                onChange={(e) => onNameChange(e.target.value)}
            />
            <Tracklist tracks={tracks} buttonLabel={buttonLabel} onButtonClick={onButtonClick}/>
            <button className={styles.savePlaylistBtn}
             onClick={onSavePlaylist} 
             disabled={!playlistName.trim() || tracks.length === 0}>Save to Spotify</button>
             {saveStatus && (
                <p className={saveStatus.type === 'success' ? styles.saveSuccess : styles.saveError}>
                    {saveStatus.message}
                </p>
             )}
        </div>
    )
}

export default Playlist;