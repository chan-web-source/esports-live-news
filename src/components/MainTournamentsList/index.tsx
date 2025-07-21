import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import styles from './style.module.css';
import commonStyles from '@/components/common-style.module.css';
import { useNavigationContext } from '@/context/NavigationContext';
import Loading from '@/components/Loading';
import EmptyListContainer from '@/components/EmptyListContainer';

interface MainTournamentListProps {
  title?: string;
  isLoading?: boolean;
  showGameTypeIcon: boolean;
  tournaments: Tournament[];
  eventState: EventState;
}

const MainTournamentList: React.FC<MainTournamentListProps> = ({ title, isLoading = false, showGameTypeIcon, tournaments, eventState }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { t } = useTranslation();
  const { currentGame } = useNavigationContext();

  const getGameTypeIcon = (gameType: Tournament['gameType']) => {
    return <img className={styles.gameTypeIcon} src={`/img/games/${gameType || 'football'}-fill.svg`} />
  };

  //left or passed
  const getDaysCount = (timestamp: number) => {
    if (!timestamp) return null;
    const inputDate = new Date(timestamp * 1000).getTime();
    const now = new Date().getTime();
    return Math.ceil(Math.abs(inputDate - now) / (1000 * 60 * 60 * 24));
  };

  const getYear = (timestamp: number) => {
    const inputDate = new Date(timestamp * 1000);
    const year = inputDate.getFullYear();
    return year;
  };

  const formatDate = (timestamp: number): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000);
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  const stageDetailText = (stageType: string, stageDetails?: string, tournamentTeams?: number) => {
    if (stageType === "ONGOING") {
      return t('mainTournamentsList.noOngoingStage');
    }
    if (stageType === "UPCOMING") {
      return `${t('common.teams')}: ${tournamentTeams}`;
    }
    return stageDetails;
  };

  const tournamentSubtext = (eventState: string, tournament: Tournament) => {
    if (eventState === "ONGOING") {
      return t('mainTournamentsList.finals')
    }
    else if (eventState === "UPCOMING") {
      return `${t('common.in')} ${getDaysCount(tournament.startTime)} ${t('mainTournamentsList.d')}`
    }
    else if (eventState === "FINISHED") {
      return `${getYear(tournament.endTime ?? 0)}, ${getDaysCount(tournament.endTime ?? 0)} ${t('mainTournamentsList.d')}`;
    }
    else {
      return `${t('mainTournamentsList.left')} ${getDaysCount(tournament.endTime ?? 0)} ${t('mainTournamentsList.d')}`
    }
  };

  return (
    <div className={commonStyles.block}>
      {isLoading ? (
        <Loading />
      ) : tournaments.length === 0 ? (
        <EmptyListContainer title={t('mainTournamentsList.noTournamentsAvailable')} />
      ) : (
        <div>
          {title && (
            <div
              className={`${commonStyles.heading} ${commonStyles.clickableHeading}`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className={commonStyles.title}>{title}</div>
              <div className={commonStyles.rightGroup}>
                {eventState == new Date().getFullYear().toString() && <div className={commonStyles.count}>{tournaments.length} {t('common.matches')}</div>}
                <div
                  className={`${commonStyles.arrow} 
                    ${isExpanded ? commonStyles.arrowDown : commonStyles.arrowUp}
                  `}
                />
              </div>
            </div>
          )}
          <div className={`${commonStyles.container} ${commonStyles.collapsableContainer} ${isExpanded ? commonStyles.expanded : commonStyles.collapsed}`}>
            {tournaments.map((tournament) => (
              <div key={tournament.id} className={styles.eventItem}
                onClick={() => {
                  window.location.href = `/${currentGame}/tournament/${tournament.id}`;
                }}
              >
                {showGameTypeIcon && getGameTypeIcon(tournament.gameType)}
                <div className={styles.dateInfo}>
                  <div className={styles.dateRange}>
                    {tournament.startTime && formatDate(tournament.startTime)} - {tournament.endTime && formatDate(tournament.endTime)}
                  </div>
                  <div className={styles.daysLeft}>
                    <div>{tournamentSubtext(eventState, tournament)}</div>
                  </div>
                </div>
                <div className={styles.championContainer}>
                  <div className={styles.logoContainer}>
                    {tournament.logo && (
                      <img src={tournament.logo} alt={`${tournament.name} logo`} className={styles.logo} />
                    )}
                  </div>
                  <div className={styles.eventTitle}>
                    {tournament.name}
                  </div>
                </div>
                <div className={styles.country}>
                  {tournament.country && (
                    <>
                      <img className={styles.countryFlag}
                        src={tournament.country.logo} />
                      {tournament.country?.name}
                    </>
                  )}
                </div>
                {(eventState == "ONGOING" || eventState == "UPCOMING") &&
                  <div className={styles.stage}>
                    {stageDetailText(eventState, tournament.stageDetails, tournament.roundCount)}
                  </div>
                }
                {eventState == "FINISHED" && tournament?.currentStage &&
                  <div className={styles.stage}>
                    {tournament?.currentStage}
                  </div>
                }
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainTournamentList;
