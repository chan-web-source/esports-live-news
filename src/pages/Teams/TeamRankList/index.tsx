import React, { useState } from 'react';
import styles from './style.module.css';
import commonStyles from '@/components/common-style.module.css';
import { useTranslation } from "react-i18next";
import Loading from '@/components/Loading';
import EmptyListContainer from '@/components/EmptyListContainer';

interface TeamRankListProps {
  showGameTypeIcon: boolean;
  teams: Team[];
  gameType?: string;
  isLoading: boolean;
  title: string;
  eventState?: string;
}

const TeamRankList: React.FC<TeamRankListProps> = ({ title, showGameTypeIcon, teams, eventState, gameType, isLoading }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);

  const getGameTypeIcon = (gameType: Tournament['gameType']) => {
    return <img className={styles.gameTypeIcon} src={`/img/games/${gameType || 'football'}-fill.svg`} />;
  };

  return (
    <div className={commonStyles.block}>
      {isLoading ? (
        <Loading />
      ) : teams.length === 0 ? (
        <EmptyListContainer title={t('teamDetail.noMatchesAvailable')} />
      ) : (
        <div>
          {title && (
            <div
              className={`${commonStyles.heading} ${commonStyles.clickableHeading}`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className={commonStyles.title}>{title}</div>
              <div className={commonStyles.rightGroup}>
                {eventState === new Date().getFullYear().toString() && (
                  <div className={commonStyles.count}>{teams.length} {t('common.matches')}</div>
                )}
                <div
                  className={`${commonStyles.arrow} 
                      ${isExpanded ? commonStyles.arrowDown : commonStyles.arrowUp}
                    `}
                />
              </div>
            </div>
          )}
          <div className={`${commonStyles.container} ${commonStyles.collapsableContainer} ${isExpanded ? commonStyles.expanded : commonStyles.collapsed}`}>
            {teams.map((team) => (
              <div key={team.id} className={styles.eventItem} onClick={() => {
                window.location.href = `/${gameType}/team/${team.id}`;
              }}>
                {showGameTypeIcon && getGameTypeIcon(gameType)}
                <div className={styles.rankInfo}>
                  <div className={styles.headText}>
                    #{team.ranking}
                  </div>
                  <div className={styles.daysLeft}>
                    <div>{team?.points}</div>
                  </div>
                </div>

                <div className={styles.championContainer}>
                  <div className={styles.logoContainer}>
                    <img src={team.logo} alt={`${team.name} logo`} className={styles.logo} />
                  </div>
                  <div className={styles.eventTitle}>
                    {team.name}
                  </div>
                </div>

                <div className={styles.country}>
                  {team.country && (
                    <>
                      <img className={styles.countryFlag}
                        src={team.country.logo} />
                      {team.country?.name}
                    </>
                  )}
                </div>

                <div className={styles.stage}>
                  <div className={styles.streakCount}>{team?.streakCount}</div>
                  <div>{team?.streakType}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamRankList;
