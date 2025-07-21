import React, { useEffect, useState } from 'react';
import styles from './style.module.css';
import commonStyles from '@/components/common-style.module.css';
import { oddsStore } from '@/store/oddsStore';
import { handleOddsTypeChange } from '@/utils/handleOddsChange';
import EmptyListContainer from '@/components/EmptyListContainer';
import { t } from 'i18next';

interface UpcomingMatchListProps {
  title: string;
  match: Match[];
}

const UpcomingMatchList: React.FC<UpcomingMatchListProps> = ({ title, match }) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [selectedOddsType, setSelectedOddsType] = useState(oddsStore.getSelectedOddsType());
  // const rankId = match?.team.id;

  useEffect(() => {
    const unsubscribe = oddsStore.subscribe(() => {
      setSelectedOddsType(oddsStore.getSelectedOddsType());
    });
    return () => unsubscribe();
  }, []);


  const formatDate = (timestamp?: number): string => {
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
    <div className={commonStyles.block}>
      {title && (
        <div className={`${commonStyles.heading} ${commonStyles.clickableHeading}`}
          onClick={() => setIsExpanded(!isExpanded)}>
          <div className={commonStyles.statItem}>{title}</div>
          <div className={commonStyles.rightGroup}>
            <div className={`${commonStyles.arrow} ${isExpanded ? commonStyles.arrowDown : commonStyles.arrowUp}`} />
          </div>
        </div>
      )}
      <div className={`${commonStyles.container} ${commonStyles.collapsableContainer} 
             ${isExpanded ? commonStyles.expanded : commonStyles.collapsed}`}>
        {match?.length === 0 ? (
          <EmptyListContainer title={t('mainTournamentsList.noMatchesAvailable')} />
        ) : (
          match?.map((matchItem) => (
            <div key={matchItem?.id} className={styles.matchItem}>
              <div className={styles.teams}>
                <div className={styles.team}>
                  <div className={styles.teamInfo}>
                    <img src={matchItem?.homeTeam?.logo} alt={matchItem?.homeTeam?.name} />
                    <span>{matchItem?.homeTeam?.name}</span>
                  </div>
                  <div className={commonStyles.oddsValue}>
                    {handleOddsTypeChange(matchItem?.homeTeam?.homeTeamAsiaOdds, selectedOddsType)}
                  </div>
                </div>
                <div className={styles.team}>
                  <div className={styles.teamInfo}>
                    <img src={matchItem?.awayTeam?.logo} alt={matchItem?.awayTeam?.name} />
                    <span>{matchItem?.awayTeam?.name}</span>
                  </div>
                  <div className={commonStyles.oddsValue}>
                    {handleOddsTypeChange(matchItem?.awayTeam?.awayTeamAsiaOdds, selectedOddsType)}
                  </div>
                </div>
              </div>

              <div className={styles.matchInfo}>
                <div className={styles.tournament}>
                  <img src={matchItem?.tournament?.logo} alt={matchItem?.tournament?.name} />
                  <span>{matchItem?.tournament?.name}</span>
                </div>
                <div className={styles.time}>
                  {formatDate(matchItem?.startTime)} {formatTime(matchItem?.startTime)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UpcomingMatchList
