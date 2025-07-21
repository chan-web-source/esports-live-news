import { useNavigationContext } from "@/context/NavigationContext";
import commonStyles from "../../../components/common-style.module.css";
import styles from "./style.module.css";
import { useTranslation } from "react-i18next";
import { getGameIcon } from '@/constants';

interface TournamentHeaderProps {
  tournamentStats: TournamentStats;
  teamCount?: number;
}

const TournamentHeader = ({ tournamentStats, teamCount }: TournamentHeaderProps) => {
  const { t } = useTranslation();
  const { currentGame } = useNavigationContext();

  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const getDaysLeft = (timestamp: number | undefined) => {
    if (!timestamp) return '';
    const now = new Date();
    const endDate = new Date(timestamp * 1000);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };


  return (
    <div className={commonStyles.block}>
      <div className={`${commonStyles.headingNoBorder} ${styles.sectionHeader}`}>
        {currentGame &&
          <img className={styles.sportsIcon}
            src={getGameIcon(currentGame, true)} />}
        <span className={styles.sectionTitle}>{tournamentStats?.name}</span>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.teamCard}>
          <div className={styles.teamLogo}>
            <img src={tournamentStats?.logo} />
          </div>
          <div className={styles.teamInfo}>
            <h3 className={styles.teamName}>{tournamentStats?.currentSeason}</h3>
            {tournamentStats?.country?.name && <div className={styles.countryInfo}>
              <img
                src={tournamentStats?.country?.logo}
                alt="Flag"
                className={styles.countryFlagImg}
              />
              <span className={styles.countryFlag}>{tournamentStats?.country?.name}</span>
            </div>}
          </div>

          <div className={styles.statItem}>
            <div className={styles.statValue}>{teamCount}</div>
            <div className={styles.statLabel}>
              {t('common.teams')}
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statValue}>
              {tournamentStats?.division}
            </div>
            <div className={styles.statLabel}>{t('mainTournamentsList.division')}</div>
          </div>
        </div>
      </div>

      <div className={styles.matchTimeline}>
        <span className={styles.timelineText}>
          {tournamentStats?.groups?.join(', ')}
        </span>
        <span className={styles.timelineText}>
          {formatDate(tournamentStats?.startTime)} - {formatDate(tournamentStats?.endTime)}. {t('mainTournamentsList.left')} {getDaysLeft(tournamentStats?.endTime)} {t('mainTournamentsList.d')}
        </span>
      </div>
    </div>
  );
}

export default TournamentHeader;
