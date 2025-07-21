import React from 'react';
import styles from './style.module.css';
import commonStyles from '@/components/common-style.module.css';
import EmptyListContainer from '@/components/EmptyListContainer';
import { t } from 'i18next';

interface ListRankingProps {
  title: string;
  list: Team[];
  currentGame: string;
  listType: string;
}

const ListRanking: React.FC<ListRankingProps> = ({ title, list, currentGame, listType }) => {

  const getListNavigatePath = () => {
    switch (listType) {
      case 'team':
        return `/${currentGame}/team`;
      case 'tournament':
        return `/${currentGame}/tournament`;
      default:
        return `/${currentGame}/team`;
    }
  }

  return (
    <div className={commonStyles.block}>
      <div className={`${commonStyles.heading}`}>
        <div className={commonStyles.title}>{title}</div>
      </div>
      <div className={`${commonStyles.collapsableContainer} ${commonStyles.expanded} ${styles.container}`}>
        {list.length === 0 ? (
          <EmptyListContainer title={t('teams.noRankingDataAvailable')} />
        ) : (
          list.map((item) => (
            <div key={item.name} className={styles.row} onClick={() => {
              window.location.href = getListNavigatePath() + `/${item.id}`;
            }}>
              <img
                className={styles.teamLogo}
                src={item.logo}
                alt={`${item.name} logo`}
              />
              <div className={styles.teamName}>
                {item.name}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListRanking;
