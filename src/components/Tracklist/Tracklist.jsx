import styles from './Tracklist.module.css';
import Track from '../Track/Track';

function Tracklist() {
    return (
        <div className={styles.tracklistWrapper}>
            <Track />
        </div>
    )

}

export default Tracklist;