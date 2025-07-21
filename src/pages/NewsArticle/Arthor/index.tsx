import styles from './style.module.css';
import commonStyles from '@/components/common-style.module.css';

interface ArthorProps {
    arthor?: string;
    description?: string;
}

const Arthor = ({ arthor, description }: ArthorProps) => {

    return (
        <div className={commonStyles.block}>
            <div className={`${commonStyles.container} ${styles.contentContainer}`}>
                <div className={styles.author}>
                    <div className={styles.authorName}>{arthor}</div>
                </div>
            </div>
            <div className={commonStyles.itemContainer}>
                <div className={styles.authorDescription}>{description}</div>
            </div>
        </div>
    );
};


export default Arthor;