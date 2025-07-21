import React, { useEffect, useState } from 'react';
import styles from './style.module.css';
import commonStyles from '@/components/common-style.module.css';
import { useTranslation } from "react-i18next";
import Loading from '@/components/Loading';
import EmptyListContainer from '@/components/EmptyListContainer';

interface ParticipateMatchProps {
  title: string;
  isLoading?: boolean;
  showGameTypeIcon?: boolean;
  matches: Tournament[];
  selectedOddsType?: string;
}

const ParticipateMatch: React.FC<ParticipateMatchProps> = ({ title, isLoading = false, matches }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);
  const [eventState, setEventState] = useState(title);

  const getTitleMap = (): Record<string, string> => {
    return {
      [t('teamDetail.participateMatchTitle')]: 'participateMatch',
      [t('teamDetail.upcomingParticipateMatchTitle')]: 'upcomingParticipateMatch',
      [t('teamDetail.achievementMatchTitle')]: 'achievementMatch',
    };
  };

  const titleMap = getTitleMap();

  useEffect(() => {
    if (title && titleMap[title]) {
      setEventState(titleMap[title]);
    }
  }, [title]);

  //left or passed
  const getDaysCount = (timestamp: number) => {
    if (!timestamp) return null;
    const inputDate = new Date(timestamp * 1000).getTime();

    let diffDays;
    const now = new Date().getTime();
    if (eventState == "achievementMatch") {
      diffDays = Math.ceil((inputDate - now) / (1000 * 60 * 60 * 24));
    } else {
      diffDays = Math.ceil((now - inputDate) / (1000 * 60 * 60 * 24));
    }
    return Math.abs(diffDays);
  };


  const formatDate = (timestamp: number): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000);
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };


  const getMatchStatus = (match: Tournament) => {
    const now = Math.floor(Date.now() / 1000);
    const matchTime = match.startTime || 0;

    if (matchTime > now) {
      return `${t('common.left')} ${match.endTime && getDaysCount(match.endTime)} ${t('common.d')}.`
    } else if (matchTime === now) {
      return `${t('common.in')} ${getDaysCount(match.startTime || 0)} ${t('common.d')}.`
    } else {
      return `${getDaysCount(match.startTime)} ${t('common.days')}`;
    }
  };

  const getMatchStage = (match: Tournament) => {
    if (match.currentStage === 'Quarterfinals') {
      return `${t('teamDetail.quarterfinals')}  ${getDaysCount(match?.startTime)} ${t('common.d')}. ${t('teamDetail.ago')}`
    }
    return `${t('common.teams')}:  ${match?.teams}`
  };

  const matchEndText = (title: string, match: Tournament) => {
    if (eventState === "participateMatch") {
      return `${t('teamDetail.quarterfinals')}  ${getDaysCount(match?.startTime)} ${t('teamDetail.d')}. ${t('teamDetail.ago')}`
    }
    else if (eventState === "upcomingParticipateMatch") {
      return `${t('teamDetail.teams')}:  ${match?.teams}`
    }
    return title;
  };



  return (
    <div className={commonStyles.block}>
      {title &&
        (<div
          className={`${commonStyles.heading} ${commonStyles.clickableHeading}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className={commonStyles.title}>{title}</div>
          <div className={commonStyles.rightGroup}>
            <div
              className={`${commonStyles.arrow} 
        ${isExpanded ? commonStyles.arrowDown : commonStyles.arrowUp}
        `} />
          </div>
        </div>)}
      <div className={`${commonStyles.container} ${commonStyles.collapsableContainer} ${isExpanded ? commonStyles.expanded : commonStyles.collapsed}`}>
        {isLoading ? (
          <Loading />
        ) : matches.length === 0 ? (
          <EmptyListContainer title={t('teamDetail.noMatchesAvailable')} />
        ) : (matches?.map((match) => (
          <div key={match?.id} className={styles.eventItem}>
            <div className={styles.dateInfo}>

              <div className={styles.dateRange}>
                {match?.startTime && formatDate(match?.startTime)} - {match?.endTime && formatDate(match?.endTime)}
              </div>
              <div className={styles.daysLeft}>
                <div>{getMatchStatus(match)}</div>
              </div>
            </div>

            <div className={styles.championContainer}>
              <div className={styles.logoContainer}>
                <img src={match?.logo} alt={`${match?.name} logo`} className={styles.logo} />
                <div className={styles.eventTitle}>
                  {match?.name}
                </div>
              </div>
            </div>

            <div className={styles.country}>
              <div className={styles.prizePool}>${match?.prizePool}</div>
              {match.country?.logo && <div className={styles.countryInfo}>
                <img className={styles.countryFlag}
                  src={match.country?.logo} />
                {match?.country?.name}
              </div>}
            </div>

            {(title != "赛事成绩") &&
              <div className={styles.endText}>
                {getMatchStage(match)}
              </div>
            }

            <div> {matchEndText(title, match)}</div>
          </div>
        ))
        )}
      </div>
    </div >
  );
};

export default ParticipateMatch;
