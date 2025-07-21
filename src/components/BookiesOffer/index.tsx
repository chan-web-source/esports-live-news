import React from 'react';
import styles from './style.module.css';
import commonStyles from '@/components/common-style.module.css';

interface BookiesRankingProps {
  title: string;
  bookies: BookiesCompany[];
}

const BookiesRanking: React.FC<BookiesRankingProps> = ({ title, bookies }) => {
  return (
    <div className={commonStyles.block}>
      <div className={commonStyles.heading}>
        <div className={commonStyles.title}>{title}</div>
      </div>
      <div className={`${commonStyles.collapsableContainer} ${commonStyles.expanded} ${styles.container}`}>
        {bookies.map((bookie) => (
          <div key={bookie.name} className={styles.row}>
            <div className={styles.logoWrapper}>
              <img className={styles.bookiesLogo} src={bookie.logo} alt={`${bookie.name} logo`} />
            </div>
            <div className={styles.bookiesOdds}>{bookie.odds}</div>
            {bookie.code ? (
              <div className={styles.bookiesCode}>{bookie.code}</div>
            ) : (
              <div className={styles.bookiesLabel}>{bookie.label}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookiesRanking;