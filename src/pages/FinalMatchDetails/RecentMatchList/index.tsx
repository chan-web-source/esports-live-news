import { useState } from 'react';
import { useTranslation } from "react-i18next";
import styles from './style.module.css';
import commonStyles from '@/components/common-style.module.css';

interface RecentMatchListProps {
    title: string;
    matchStats?: Match;
}

const RecentMatchList = ({ title, matchStats }: RecentMatchListProps) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const { t } = useTranslation();
    // const rankId = matchStats?.team.id;

    const formatDate = (timestamp?: number): string => {
        if (!timestamp) return '';
        const date = new Date(timestamp * 1000);
        return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    };


    const timeSchedule = (timestamp?: number): string => {
        if (!timestamp) return '';
        const matchDate = new Date(timestamp * 1000);
        const today = new Date();
        // Reset time part for date comparison
        const matchDateOnly = new Date(matchDate.getFullYear(), matchDate.getMonth(), matchDate.getDate());
        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        if (matchDateOnly > todayOnly) return t('recentMatchList.upcoming');
        if (matchDateOnly.getTime() === todayOnly.getTime()) return t('recentMatchList.ongoing');
        return t('recentMatchList.finished');
    };


    const formatTime = (timestamp?: number): string => {
        if (!timestamp) return '';
        const date = new Date(timestamp * 1000);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    return (
        <div className={styles.headerContainer}>
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
                {/* home team */}
                <div className={styles.teamLabel}>{t('recentMatchList.homeTeam')}</div>
                <div key={matchStats?.homeTeam?.id} className={styles.matchContent}>
                    <div className={styles.matchInfo}>
                        <div>
                            <span className={styles.matchTime}>{formatTime(matchStats?.startTime ?? 0)}</span>
                            <span className={styles.matchStatus}> {timeSchedule(matchStats?.startTime ?? 0)}</span>
                            <span className={styles.tipCount}>21 {t('recentMatchList.tips')}</span>
                        </div>
                        {/* <span className={styles.matchTime}>{formatDate(matchStats?.homeTeam?.startTime)}</span> */}
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

                {/* away team */}
                <div className={styles.teamLabel}>{t('recentMatchList.awayTeam')}</div>
                <div key={matchStats?.homeTeam?.id} className={styles.matchContent}>
                    <div className={styles.matchInfo}>
                        <div>
                            <span className={styles.matchTime}>{formatTime(matchStats?.startTime ?? 0)}</span>
                            <span className={styles.matchStatus}> {t('recentMatchList.finished')}</span>
                            <span className={styles.tipCount}>21 {t('recentMatchList.tips')}</span>
                        </div>
                        <span className={styles.matchTime}>{formatDate(matchStats?.startTime ?? 0)}</span>
                    </div>

                    <div className={styles.teamsContainer}>
                        <div className={styles.teamSection}>
                            <img className={styles.teamLogo} src={matchStats?.awayTeam?.logo} alt="team logo" />
                            <div className={styles.teamInfo}>
                                <div className={styles.teamName}>{matchStats?.awayTeam?.name}</div>
                                <div className={styles.countryName}>{matchStats?.homeTeam?.country?.name}</div>
                            </div>
                            <div className={styles.score}>{matchStats?.awayTeam?.score}</div>
                        </div>

                        <div className={styles.separator}>:</div>

                        <div className={styles.teamSection}>
                            <div className={styles.score}>{matchStats?.homeTeam?.score}</div>
                            <div className={styles.teamInfo}>
                                <div className={styles.teamName}>{matchStats?.homeTeam?.name}</div>
                                <div className={styles.countryName}>{matchStats?.homeTeam?.country?.name}</div>
                            </div>
                            <img className={styles.teamLogo} src={matchStats?.homeTeam?.logo} alt="team logo" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecentMatchList
