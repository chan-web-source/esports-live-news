import React, { useState } from 'react';
import styles from './style.module.css';
import commonStyles from '@/components/common-style.module.css';

interface MainNewsProps {
  title?: string;
  newsItems: NewsItem[];
}

const MainNews: React.FC<MainNewsProps> = ({ title, newsItems }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const defaultGameType = 'football';

  return (
    <div className={commonStyles.block}>
      {title &&
        <div
          className={`${commonStyles.heading} ${commonStyles.clickableHeading}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className={commonStyles.title}>{title}</div>
          <div className={`${commonStyles.arrow} ${isExpanded ? commonStyles.arrowUp : commonStyles.arrowDown}`} />
        </div>
      }
      <div className={`${commonStyles.container} ${styles.contentContainer} ${isExpanded ? styles.expanded : styles.collapsed}`}>
        <div className={styles.featuredItem}
          onClick={() => {
            // default game type
            window.location.href = `/${defaultGameType}/news/article/${newsItems[0].id}`;
          }}>
          <div className={styles.imageContainer}>
            <img src={newsItems[0].image} alt={newsItems[0].title} className={styles.featuredImage} />
            <div className={styles.timeStamp}>
              <span className={styles.date}>{newsItems[0].date}</span>
              <span className={styles.time}>{newsItems[0].time}</span>
            </div>
          </div>
          <h3 className={styles.itemTitle}>{newsItems[0].title}</h3>
        </div>

        <div className={styles.newsGrid}>
          {newsItems.slice(1).map(item => (
            <div key={item.id} className={styles.newsItem}
              onClick={() => {
                // default game type
                window.location.href = `/${defaultGameType}/news/article/${item.id}`;
              }}>
              <div className={styles.imageContainer}>
                <img src={item.image} alt={item.title} className={styles.newsImage} />
                <div className={styles.timeStamp}>
                  <span className={styles.date}>{item.date}</span>
                  <span className={styles.time}>{item.time}</span>
                </div>
              </div>
              <h3 className={styles.itemTitle}>{item.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainNews;