import React, { useState } from 'react';
import styles from './style.module.css';
import commonStyles from '@/components/common-style.module.css';
import { handleOddsTypeChange } from "@/utils/handleOddsChange";
import Loading from '@/components/Loading';
import EmptyListContainer from '@/components/EmptyListContainer';
import { t } from 'i18next';

interface MainMatchesListProps {
  title: string;
  matches: Match[];
  isLoading?: boolean;
  selectedOddsType?: string;
}

const MainMatchesList: React.FC<MainMatchesListProps> = ({ title, isLoading = false, matches, selectedOddsType }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatStartTime = (startTime: number): string =>
    new Date(startTime * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

  const calculateTimeRemaining = (startTime: number): string => {
    const now = Date.now();
    const diff = startTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}小时${minutes > 0 ? minutes + '分钟' : ''}后`;
    } else if (minutes > 0) {
      return `${minutes}分钟后`;
    } else {
      return '即将开始';
    }
  };

  return (
    <div className={commonStyles.block}>
      <div
        className={`${commonStyles.heading} ${commonStyles.clickableHeading}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={commonStyles.title}>{title}</div>
        <div className={commonStyles.rightGroup}>
          <div className={commonStyles.count}>{matches.length}场次</div>
          <div className={`${commonStyles.arrow} ${isExpanded ? commonStyles.arrowUp : commonStyles.arrowDown}`} />
        </div>
      </div>
      <div className={`${commonStyles.container} ${commonStyles.collapsableContainer} ${isExpanded ? commonStyles.expanded : commonStyles.collapsed}`}>
        {isLoading ? (
          <Loading />
        ) : matches.length === 0 ? (
          <EmptyListContainer title={t('mainTournamentsList.noMatchesAvailable')} />
        ) : (
          matches.map((match) => (
            <div key={match.id} className={styles.matchCard}>
              <div className={styles.matchInfo}>
                <div className={styles.timeInfo}>
                  <div className={styles.matchTime}>{formatStartTime(match.startTime)}</div>
                  <div className={styles.timeRemaining}>{calculateTimeRemaining(match.startTime)}</div>
                  {match.tips !== undefined && match.tips > 0 && (
                    <div className={styles.tipsBox}>
                      <span className={styles.tipsCount}>{match.tips}</span> tips
                    </div>
                  )}
                </div>
                <div className={styles.tournament}>{match.tournament?.name} {match.season?.name}</div>
              </div>

              <div className={styles.teamsContainer}>
                <div className={styles.teamInfo}>
                  {match?.homeTeam?.logo && (
                    <div className={styles.teamLogo}>
                      <img
                        src={match?.homeTeam?.logo}
                        alt={`${match?.homeTeam?.name} logo`}
                        className={styles.logoImg}
                      />
                    </div>
                  )}
                  <div className={styles.teamName}>
                    {match?.homeTeam?.name}
                    <div className={styles.vsText}>vs {match?.awayTeam?.name}</div>
                  </div>
                </div>

                <div className={commonStyles.flexContainer}>
                  <div className={styles.oddsBox}>
                    {match?.homeTeam?.score}
                  </div>
                  <div className={styles.oddsContainer}>
                    <div className={commonStyles.oddsValue}>
                      {handleOddsTypeChange(match?.homeTeam?.homeTeamAsiaOdds, selectedOddsType)}
                    </div>
                    <div className={commonStyles.oddsValue}>
                      {handleOddsTypeChange(match?.awayTeam?.awayTeamAsiaOdds, selectedOddsType)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )))
        }
      </div>
    </div>
  );
};

export default MainMatchesList;