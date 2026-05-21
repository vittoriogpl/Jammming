import styles from './Tracklist.module.css';
import Track from '../Track/Track';

function Tracklist( { tracks, buttonLabel, onButtonClick }) {
    return (
        <div className={styles.tracklistWrapper}>
            {tracks.map((track) => (
                <Track
                    key={track.id}
                    track={track}
                    buttonLabel={buttonLabel}
                    onButtonClick={onButtonClick}
                />
            ))}
        </div>
    )

}

export default Tracklist;