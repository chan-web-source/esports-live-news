import styles from './style.module.css';
import commonStyles from '@/components/common-style.module.css';
import { useTranslation } from "react-i18next";

interface MatchHeaderProps {
  matchStats?: Match;
}

const MatchHeader = ({ matchStats }: MatchHeaderProps) => {
  const { t } = useTranslation();

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

  const timeSchedule = (timestamp?: number): string => {
    if (!timestamp) return '';
    const matchDate = new Date(timestamp * 1000);
    const today = new Date();
    // Reset time part for date comparison
    const matchDateOnly = new Date(matchDate.getFullYear(), matchDate.getMonth(), matchDate.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (matchDateOnly > todayOnly) return t('common.upcoming');
    if (matchDateOnly.getTime() === todayOnly.getTime()) return t('common.ongoing');
    return t('common.finished');
  };

  return (
    <div className={commonStyles.block}>
      <div className={styles.sectionHeader}>
        <button className={styles.overviewButton}>{t('matchDetail.overview')}</button>
      </div>
      <div className={styles.matchContent}>
        <div className={styles.matchInfo}>
          <div>
            <span className={styles.matchTime}>{formatTime(matchStats?.startTime ?? 0)}</span>
            <span className={styles.matchStatus}> {timeSchedule(matchStats?.startTime ?? 0)}</span>
            {/* <span className={styles.tipCount}>21 {t('matchDetail.matchHeader.tips')}</span> */}
          </div>
          <span className={styles.matchDate}>{formatDate(matchStats?.startTime ?? 0)}</span>
        </div>

        <div className={styles.teamsContainer}>
          <div className={styles.teamSection}>
            <img className={styles.teamLogo} src={matchStats?.homeTeam?.logo} alt="team logo" />
            <div className={styles.teamInfo}>
              <div className={styles.teamName}>{matchStats?.homeTeam?.name}</div>
              <div className={styles.countryName}>{matchStats?.homeTeam?.country?.name}</div>
            </div>
            <div className={styles.score}>{matchStats?.homeTeam?.score}</div>
          </div>

          <div className={styles.separator}>:</div>

          <div className={styles.teamSection}>
            <div className={styles.score}>{matchStats?.awayTeam?.score}</div>

            <div className={styles.teamInfo}>
              <div className={styles.teamName}>{matchStats?.awayTeam?.name}</div>
              <div className={styles.countryName}>{matchStats?.awayTeam?.country?.name}</div>
            </div>
            <img className={styles.teamLogo} src={matchStats?.awayTeam?.logo} alt="team logo" />
          </div>
        </div>
      </div>
      <div className={styles.matchBottomDetails}>{matchStats?.tournament?.name}, {matchStats?.tournament?.currentSeason} {matchStats?.tournament?.currentStage} {matchStats?.tournament?.roundCount}</div>
    </div>
  );
}

export default MatchHeader
