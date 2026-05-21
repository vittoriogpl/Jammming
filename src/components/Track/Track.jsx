import styles from './Track.module.css';

function Track( { track, buttonLabel, onButtonClick }) {
    return (
        <div className={styles.trackWrapper}>
           <h3>{track.name}</h3>
           <p>{track.artist}</p>
           <p>{track.album}</p>
           <button onClick={() => onButtonClick(track)}>{buttonLabel}</button>
        </div>
    )
}

export default Track;