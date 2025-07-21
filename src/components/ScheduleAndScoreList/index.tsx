import React, { useState } from 'react';
import styles from './style.module.css';
import commonStyles from '@/components/common-style.module.css';
import { handleOddsTypeChange } from "@/utils/handleOddsChange";
import { useTranslation } from "react-i18next";
import { t } from 'i18next';
import Loading from '../Loading';
import EmptyListContainer from '../EmptyListContainer';

interface ScheduleListProps {
  title: string;
  isLoading?: boolean;
  match: Tournament[];
  stats?: Stats;
  isScore?: boolean;
  selectedOddsType?: string;
}


const ScheduleAndScoreList: React.FC<ScheduleListProps> = ({ title, isLoading = false, match, stats, isScore, selectedOddsType }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);

  const formatStartTime = (startTime: number): string =>
    new Date(startTime * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

  const formatStartDate = (startTime: number): string => {
    const date = new Date(startTime * 1000);
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
  };


  return (
    <div className={commonStyles.block}>
      <div
        className={`${commonStyles.heading} ${commonStyles.clickableHeading}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={commonStyles.title}>{title}</div>
        <div className={commonStyles.rightGroup}>
          {!isScore && <div className={commonStyles.count}>{match?.length}场次</div>}
          <div className={`${commonStyles.arrow} ${isExpanded ? commonStyles.arrowUp : commonStyles.arrowDown}`} />
        </div>
      </div>
      <div className={`${commonStyles.container} ${commonStyles.collapsableContainer} ${isExpanded ? commonStyles.expanded : commonStyles.collapsed}`}>
        {isScore && <ScoreOveview stats={stats} />}
        {isLoading ? (
          <Loading />
        ) : (!isScore && match.length === 0) ? (
          <EmptyListContainer title={t('mainTournamentsList.noMatchesAvailable')} />
        ) : (
          match.map((match) => (
            <div key={match.id} className={styles.matchCard}>
              <div className={styles.matchHeader}>
                <div className={styles.timeDate}>
                  <div className={styles.time}>{formatStartTime(match.startTime)}</div>
                  <div className={styles.date}>{formatStartDate(match.startTime)}</div>
                </div>
              </div>

              <div className={styles.matchContent}>
                <div className={styles.teamArrow}>
                  <div className={styles.arrowIcon}>
                    <img src="/img/compare.svg" width={25} />
                  </div>
                </div>

                <div className={styles.teamsContainer}>
                  <div className={styles.teamRow}>
                    {match.homeTeam?.logo &&
                      <img src={match.homeTeam?.logo} width={15} />
                    }
                    <div className={styles.teamName}>{match.homeTeam?.name}</div>
                  </div>
                  <div className={styles.teamRow}>
                    <div className={styles.teamName}>{match.awayTeam?.name}</div>
                    {match?.awayTeam?.logo &&
                      <img src={match.awayTeam?.logo} width={15} />
                    }
                    <div className={styles.teamName}>{match.awayTeam?.name}</div>
                  </div>
                </div>
                <OddsContainer homeTeam={match?.homeTeam} awayTeam={match?.awayTeam} selectedOddsType={selectedOddsType} />


                <OddsScoreContainer homeTeam={match?.homeTeam} awayTeam={match?.awayTeam} />


              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const ScoreOveview = ({ stats }: { stats?: Stats }) => {
  return (<div className={styles.statsContainer}>
    <div className={styles.statItem}>
      <div className={styles.statValue}>{stats?.totalMatches}</div>
      <div className={styles.statLabel}>{t('common.allMatches')}</div>
    </div>
    <div className={styles.statItem}>
      <div className={styles.statValue}>{stats?.totalWins}</div>
      <div className={styles.statLabel}>{t('common.win')}</div>
    </div>
    <div className={styles.statItem}>
      <div className={styles.statValue}>{stats?.totalLosses}</div>
      <div className={styles.statLabel}>{t('common.lose')}</div>
    </div>
    <div className={styles.statItem}>
      <div className={styles.statValue}>{stats?.totalDraws}</div>
      <div className={styles.statLabel}>{t('common.draw')}</div>
    </div>
  </div>)
}


const OddsContainer = ({ awayTeam, homeTeam, selectedOddsType }: { awayTeam?: Team, homeTeam?: Team, selectedOddsType?: string }) => {
  return (<div className={styles.oddsContainer}>
    <div className={styles.oddsRow}>
      <img className={styles.countryFlag}
        src={homeTeam?.logo} />
      <div className={commonStyles.oddsValue}>{handleOddsTypeChange(homeTeam?.homeTeamAsiaOdds, selectedOddsType)}</div>
    </div>
    <div className={styles.oddsRow}>
      <img className={styles.countryFlag}
        src={awayTeam?.logo} />
      <div className={commonStyles.oddsValue}>{handleOddsTypeChange(awayTeam?.awayTeamAsiaOdds, selectedOddsType)}</div>
    </div>
  </div>)
}


const OddsScoreContainer = ({ awayTeam, homeTeam }: { awayTeam?: Team, homeTeam?: Team }) => {
  return (<div className={styles.scoreOddsContainer}>
    <div className={styles.oddsRow}>
      <div className={styles.scoreOddsValue}>{homeTeam?.score}</div>
    </div>
    <div className={styles.oddsRow}>
      <div className={`${styles.scoreOddsValue} ${styles.highlight}`}>{awayTeam?.score}</div>
    </div>
  </div>)
}

export default ScheduleAndScoreList;
