import { getGameIcon } from '@/constants';
import styles from './style.module.css';
import commonStyles from '@/components/common-style.module.css';
import { useNavigationContext } from "@/context/NavigationContext"
import { useTranslation } from "react-i18next";

interface TeamHeaderProps {
  teamStats?: TeamStats;
  winRate?: number;
  winRateLast30d?: number;
}

const TeamHeader = ({ teamStats, winRate, winRateLast30d }: TeamHeaderProps) => {
  const { t } = useTranslation();
  const { currentGame, currentGameName } = useNavigationContext();
  // left or passed
  const getDaysCount = (timestamp: number | undefined, matchType: string) => {
    if (!timestamp) return t('mainTournamentsList.NA');
    const inputDate = new Date(timestamp * 1000).getTime();
    let diffDays;
    const now = new Date().getTime();
    if (matchType == "upcoming") {
      diffDays = Math.ceil((inputDate - now) / (1000 * 60 * 60 * 24));
    } else {
      diffDays = Math.ceil((now - inputDate) / (1000 * 60 * 60 * 24));
    }
    return Math.abs(diffDays);

  };

  return (
    <div className={commonStyles.block}>
      <div className={`${commonStyles.headingNoBorder} ${styles.sectionHeader}`}>
        {currentGame &&
          <img className={styles.sportsIcon}
            src={getGameIcon(currentGame, true)} />}
        <span className={styles.sectionTitle}>{currentGameName}</span>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.teamCard}>
          <div className={styles.teamLogo}>
            <img src={teamStats?.team.logo} />
          </div>
          <div className={styles.teamInfo}>
            <h3 className={styles.teamName}>{teamStats?.team.name}</h3>
            <div className={styles.countryInfo}>
              <img
                src={teamStats?.team?.country?.logo}
                alt="Flag"
                className={styles.countryFlagImg}
              />
              <span className={styles.countryFlag}>{teamStats?.team?.country?.name}</span>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statValue}>{teamStats?.stats?.streakCount}</div>
            <div className={styles.statLabel}>
              {teamStats?.stats?.streakType?.toLowerCase()} {t('mainTournamentsList.streak')}
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statValue}>
              {winRateLast30d ?? "N/A"}%
            </div>
            <div className={styles.statLabel}>{t('mainTournamentsList.t30dWinrate')}</div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statValue}>
              {winRate ?? "N/A"}%
            </div>
            <div className={styles.statLabel}>{t('mainTournamentsList.winrate')}</div>
          </div>
        </div>
      </div>

      <div className={styles.matchTimeline}>
        <div className={styles.timelineItem}>
          <span className={styles.timelineText}>
            {t('mainTournamentsList.lastMatch')} {getDaysCount(teamStats?.lastMatchTime, 'lastMatch')} {t('mainTournamentsList.dAgo')}
          </span>
        </div>
        <div className={styles.timelineItem}>
          <span className={styles.timelineText}>{t('mainTournamentsList.nearestMatch')} {getDaysCount(teamStats?.nextMatchTime, 'upcoming')} {t('mainTournamentsList.d')}</span>
        </div>
      </div>
    </div>
  );
}

export default TeamHeader
