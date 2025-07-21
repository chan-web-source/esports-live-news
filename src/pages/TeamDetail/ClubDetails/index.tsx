import styles from './style.module.css';
import { useState, useEffect } from 'react';
import commonStyles from '@/components/common-style.module.css';
import { useNavigationContext } from "@/context/NavigationContext"
import { handleOddsTypeChange } from '@/utils/handleOddsChange';
import { useTranslation } from "react-i18next";
import Spacer from '@/components/Spacer';


interface ClubDetailProps {
  title: string;
  teamStats?: TeamStats;
  match?: Tournament[];
  winRate?: number;
  selectedOddsType?: string;
}

const ClubDetail = ({ teamStats, match, winRate, title, selectedOddsType }: ClubDetailProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { currentGame } = useNavigationContext();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  useEffect(() => {
    if (selectedOddsType) {
      // Trigger a re-render of odds when the type changes
      console.log('ClubDetails - Odds type changed:', selectedOddsType);
    }
  }, [selectedOddsType]);

  const getStatItem = () => {
    switch (currentLang) {
      case 'en':
        return `${teamStats?.team.name} football team from ${teamStats?.team.country?.name}
              ${teamStats?.team.name} ranked in place`;
      case 'zh':
        return `${teamStats?.team.name} 足球团队来自 ${teamStats?.team.country?.name}
              ${teamStats?.team.name}`;
      default:
        return '';
    }
    return '';
  };

  const getClubStats = () => {
    if (currentLang === 'en') {
      return [
        `${currentGame} club ${teamStats?.team.name} played ${match?.length} fixtures in ${new Date().getFullYear()}.`,
        `Over the course of the last 30 days, ${teamStats?.stats?.totalMatches} matches have been played by the team. ${teamStats?.team.name} claimed victory in 4 games.`,
        `Over the last 30 days, ${teamStats?.team.name} win rate was ${winRate ?? "N/A"}%.`,
        `Current Streak: Win streak of ${teamStats?.stats?.totalMatches ?? "N/A"} matches. `,
        // `${teamStats?.team.name} are currently playing in the following Football series: UEFA Champions League 2024/25.`,
        // `Tipsters have voted 196 times on ${teamStats?.team.name} matches, with 166 (84.69%) correct predictions.`
      ];
    } else if (currentLang === 'zh') {
      // Chinese translations
      return [
        `${currentGame} 俱乐部 ${teamStats?.team.name} 在 ${new Date().getFullYear()} 年进行了 ${match?.length} 场比赛。`,
        `在过去30天里，该队进行了 ${teamStats?.stats?.totalMatches} 场比赛。${teamStats?.team.name} 赢得了4场比赛。`,
        `在过去30天里，${teamStats?.team.name} 的胜率为 ${winRate ?? "N/A"}%。`,
        `当前连胜：连胜 ${teamStats?.stats?.totalMatches ?? "N/A"} 场比赛。`,
      ];
    }
    return [];
  };

  const clubStats = getClubStats();

  const formatDate = (timestamp: number): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000);
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  return (
    <div className={commonStyles.block}>
      {title &&
        (<div
          className={`${commonStyles.heading} ${commonStyles.clickableHeading}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className={commonStyles.statItem}>{title}</div>
          <div className={commonStyles.rightGroup}>
            <div
              className={`${commonStyles.arrow} 
        ${isExpanded ? commonStyles.arrowDown : commonStyles.arrowUp}
        `} />
          </div>
        </div>)}
      <div className={`${commonStyles.container} ${commonStyles.collapsableContainer} ${isExpanded ? commonStyles.expanded : commonStyles.collapsed}`}>
        <div className={styles.statsContainer}>
          <div className={styles.header}>
            <div className={styles.statItem}>
              {getStatItem()}
            </div>
            <Spacer space={30} />
          </div>

          <div >
            <div className={styles.statItem}>{teamStats?.team.name} {t('matchDetail.stats')}</div>
            <ul className={styles.statsList}>
              {clubStats.map((stat, index) => (
                <li key={index} className={styles.statItem}>
                  <span>• {stat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.scoresSection}>
            <div className={styles.statItem}>{teamStats?.team.name} {t('teamDetail.scoresAndOutcomes')}</div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.tableHeaderCell}>{t('teamDetail.date')}</th>
                  <th className={styles.tableHeaderCell}>{t('teamDetail.opponent')}</th>
                  <th className={styles.tableHeaderCell}>{t('teamDetail.score')}</th>
                  <th className={styles.tableHeaderCell}>{t('teamDetail.odds')}</th>
                </tr>
              </thead>
              <tbody>
                {match?.map((match, index) => (
                  <tr key={index} className={styles.tableRow}>
                    <td className={styles.tableCell}>{formatDate(match.startTime)}</td>
                    <td className={styles.tableCell}>{match?.awayTeam?.name}</td>
                    <td className={styles.tableCell}>
                      {match?.homeTeam?.score} : {match?.awayTeam?.score ?? t('mainTournamentsList.NA')}
                    </td>
                    <td className={styles.tableCell}>
                      {handleOddsTypeChange(match?.homeTeam?.homeTeamAsiaOdds)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetail;