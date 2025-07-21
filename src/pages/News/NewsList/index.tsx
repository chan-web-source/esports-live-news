import styles from './style.module.css'
import commonStyles from '@/components/common-style.module.css'
import Loading from '@/components/Loading'
import EmptyListContainer from '@/components/EmptyListContainer'
import { t } from 'i18next'

interface NewsListProps {
  showGameTypeIcon: boolean;
  gameType?: string;
  groupedNewsList: DateGroupNewsItem[];
  isLoading: boolean;
}

const NewsList: React.FC<NewsListProps> = ({ showGameTypeIcon, gameType, groupedNewsList, isLoading }) => {
  const getGameTypeIcon = (gameType: Tournament['gameType']) => {
    return <img src={`/img/games/${gameType || 'football'}-fill.svg`} />
  };

  const formatStartTime = (startTime?: number | string): string | null => {
    if (typeof startTime === 'number' && !isNaN(startTime)) {
      return new Date(startTime * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }
    return null;
  };

  return (
    <div className={`${commonStyles.block} ${styles.tournamentList}`}>
      <div className={`${styles.block}`}>
        {isLoading ? (
          <Loading />
        ) :
          groupedNewsList.length === 0 ? (
            <EmptyListContainer title={t('mainTournamentsList.noTournamentsAvailable')} />
          ) : (
            groupedNewsList.map((item) => (
              <div key={item.date}>
                <div
                  className={`${commonStyles.headingNoBorder}`}
                >
                  <div className={commonStyles.title}>
                    {item.date}
                  </div>
                </div>
                <div className={commonStyles.container}>
                  {item.newsItems?.map(item => (
                    <div key={item.id} className={styles.itemContainer} onClick={() => {
                      window.location.href = `/${gameType}/news/article/${item.id}`;
                    }}>
                      <div className={styles.newsTime}>{formatStartTime(item?.time ?? 0)}</div>
                      <div className={styles.newsTitle}>
                        {item.title}
                      </div>
                      <div className={styles.sportIcon}>
                        {showGameTypeIcon && getGameTypeIcon(gameType)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
      </div>
    </div>
  )
}

export default NewsList;