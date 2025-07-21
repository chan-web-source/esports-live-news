import React from 'react';
import styles from './style.module.css';
import commonStyles from '@/components/common-style.module.css';

interface SideNewsProps {
  title: string;
  news: NewsItem[];
}

const SideNews: React.FC<SideNewsProps> = ({ title, news }) => {
  return (
    <div className={commonStyles.block}>
      <div className={`${commonStyles.heading}`}>
        <div className={commonStyles.title}>{title}</div>
      </div>
      <div className={`${commonStyles.collapsableContainer} ${commonStyles.expanded} ${styles.container}`}>
      {news.map((newsItem) => (
        <div key={newsItem.id} className={styles.row}>
          <div className={styles.info}>
            <div className={styles.date}>{newsItem.date}</div>
            <div className={styles.time}>{newsItem.time}</div>
          </div>
          <div className={styles.article}>
            {newsItem.title}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default SideNews;