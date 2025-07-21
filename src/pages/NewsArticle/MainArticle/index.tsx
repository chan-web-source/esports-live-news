import ScoreComparisonMatchList from '../ScoreComparisonMatchList';
import styles from './style.module.css';
import commonStyle from '@/components/common-style.module.css';

interface MainArticleProps {
    article?: Article;
}

const MainArticle = ({ article }: MainArticleProps) => {

    const RenderSection = (section: ArticleSection, index: number) => {
        switch (section?.name) {
            case 'title':
                return (
                    <h2 key={index} className={styles.title}>
                        {section?.value}
                    </h2>
                );

            case 'content':
                return (
                    <p key={index} className={styles.content}>
                        {section?.value}
                    </p>
                );

            case 'bulletPoints':
                return (
                    <ul key={index} className={styles.bulletPointContainer}>
                        {section?.value?.map((point: string, pointIndex: number) => (
                            <li key={pointIndex} className={styles.bulletPoint}>
                                • {point}
                            </li>
                        ))}
                    </ul>
                );

            case 'match':
                // Ignore match object as requested
                return <ScoreComparisonMatchList
                    match={section.value as Match}
                />;
            default:
                return null;
        }
    };

    const formatDate = (timestamp: number): string => {
        if (!timestamp) return '';
        const date = new Date(timestamp * 1000);
        return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    };

    const formatTime = (timestamp?: number): string => {
        if (!timestamp) return '';
        const date = new Date(timestamp * 1000);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    return (
        <div className={commonStyle.container}>
            <div className={styles.imageContainer}>
                <img src={article?.image} alt="Article" className={styles.image} />
                <div className={styles.imageOverlay}>
                    <span className={styles.authorName}>{article?.author}</span>
                    <span className={styles.overlayDate}>{formatDate(article?.created_at ?? 0)}, {formatTime(article?.created_at ?? 0)}</span>
                </div>
            </div>
            {article?.section?.map((section, index) => RenderSection(section, index))}
        </div>
    );
};


export default MainArticle;