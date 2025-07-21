import styles from './style.module.css';
import { useState } from 'react';
import { useTranslation } from "react-i18next";
import commonStyles from '@/components/common-style.module.css';
import { useNavigationContext } from '@/context/NavigationContext';
import Spacer from '@/components/Spacer';

interface LiveUpdateDetailProps {
    title: string;
    matchStats?: Match;
    matchAnalysis?: MatchAnalysis;
}

const LiveUpdateDetail = ({ matchStats, matchAnalysis, title }: LiveUpdateDetailProps) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const { currentGame } = useNavigationContext();
    const { t, i18n } = useTranslation();

    const formatDate = (timestamp: number): string => {
        if (!timestamp) return '';
        const date = new Date(timestamp * 1000);
        return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    };

    const formatTime = (timestamp?: number): string => {
        if (!timestamp) return '';
        const date = new Date(timestamp * 1000);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    const getStatsItem = () => {
        switch (i18n.language) {
            case 'en':
                return `On Thursday ${formatDate(matchStats?.startTime ?? 0)} at ${formatTime(matchStats?.startTime)}, a match in a FT2 format in ${currentGame} between ${matchStats?.homeTeam?.name}
                            ${matchStats?.homeTeam?.country?.name ? `(${matchStats?.homeTeam?.country?.name})` : ''} and ${matchStats?.awayTeam?.name} ${matchStats?.awayTeam?.country?.name ? `(${matchStats?.awayTeam?.country?.name})` : ''} took place. The game was part of the ${matchStats?.tournament?.currentStage} stage of the ${matchStats?.tournament?.name} ${matchStats?.tournament?.currentSeason} tournament
                            with a score of ${matchStats?.homeTeam?.score} : ${matchStats?.awayTeam?.score}.`
            case 'zh':
                return `在周四 ${formatDate(matchStats?.startTime ?? 0)} 在 ${formatTime(matchStats?.startTime)}，一场在 ${currentGame} 中的 FT2 比赛中，${matchStats?.homeTeam?.name}
                （${matchStats?.homeTeam?.country?.name}）和 ${matchStats?.awayTeam?.name}（${matchStats?.awayTeam?.country?.name}）进行了一场比赛。这场比赛是 ${matchStats?.tournament?.name} ${matchStats?.tournament?.currentSeason} 锦标赛的一部分，属于 ${matchStats?.tournament?.currentStage} 阶段，最终比分是 ${matchStats?.homeTeam?.score} : ${matchStats?.awayTeam?.score}。`
            default:
                return '';
        }


    }


    return (
        <div className={commonStyles.block}>
            {title &&
                (<div
                    className={`${commonStyles.heading} ${commonStyles.clickableHeading}`}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className={commonStyles.statItem}>{title}</div>
                    <div className={commonStyles.rightGroup}>
                        <div className={`${commonStyles.arrow} 
                         ${isExpanded ? commonStyles.arrowDown : commonStyles.arrowUp}
                         `} />
                    </div>
                </div>)}
            <div className={`${commonStyles.itemContainer} ${commonStyles.collapsableContainer} ${isExpanded ? commonStyles.expanded : commonStyles.collapsed}`}>
                <div className={styles.header}>
                    <div className={styles.statItem}>
                        {getStatsItem()}
                    </div>
                </div>
                <div className={styles.statItem}>
                    {t('matchDetail.teamForm')} {matchAnalysis?.homeTeam?.name} {t('matchDetail.and')} {matchAnalysis?.awayTeam?.name}:
                </div>
                <Spacer space={50} />
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.tableHeaderCell}>{t('common.team')}</th>
                            <th className={styles.tableHeaderCell}>{matchAnalysis?.homeTeam?.name}</th>
                            <th className={styles.tableHeaderCell}>{matchAnalysis?.awayTeam?.name}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={styles.tableCell}>{t('matchDetail.rating')}</td>
                            <td className={styles.tableCell}>#{matchAnalysis?.homeTeam?.ranking || 0}</td>
                            <td className={styles.tableCell}>#{matchAnalysis?.awayTeam?.ranking || 0}</td>
                        </tr>
                        <tr>
                            <td className={styles.tableCell}>{t('matchDetail.winLoseStreak')}</td>
                            <td className={styles.tableCell}>
                                {(matchAnalysis?.homeTeam?.streakType || '').toUpperCase()} {t('mainTournamentsList.streak')}: {matchAnalysis?.homeTeam?.streakCount || 0}
                            </td>
                            <td className={styles.tableCell}>
                                {(matchAnalysis?.awayTeam?.streakType || '').toUpperCase()} {t('mainTournamentsList.streak')}: {matchAnalysis?.awayTeam?.streakCount || 0}
                            </td>
                        </tr>
                        <tr>
                            <td className={styles.tableCell}>{t('matchDetail.last6MonthsWinRate')}</td>
                            <td className={styles.tableCell}>{matchAnalysis?.homeTeam?.last6MonthsWinRate || 0}%</td>
                            <td className={styles.tableCell}>{matchAnalysis?.awayTeam?.last6MonthsWinRate || 0}%</td>
                        </tr>
                        <tr>
                            <td className={styles.tableCell}>{t('matchDetail.recentMatchHistory')}</td>
                            <td className={styles.tableCell}>
                                {t('common.win')}: {matchAnalysis?.homeTeam?.totalWins || 0}<br />
                                {t('common.lose')}: {matchAnalysis?.homeTeam?.totalLosses || 0}<br />
                                {t('common.draw')}: {matchAnalysis?.homeTeam?.totalDraws || 0}
                            </td>
                            <td className={styles.tableCell}>
                                {t('common.win')}: {matchAnalysis?.awayTeam?.totalWins || 0}<br />
                                {t('common.lose')}: {matchAnalysis?.awayTeam?.totalLosses || 0}<br />
                                {t('common.draw')}: {matchAnalysis?.awayTeam?.totalDraws || 0}
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </div>
    );
};

export default LiveUpdateDetail;