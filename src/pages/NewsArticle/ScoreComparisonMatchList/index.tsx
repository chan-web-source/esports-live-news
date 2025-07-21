import { useState } from 'react';
import { useTranslation } from "react-i18next";
import styles from './style.module.css';
import commonStyles from '@/components/common-style.module.css';


interface RecentMatchListProps {
    title?: string;
    match?: Match;
    textArea?: string[];
}

const RecentMatchList = ({ title, match }: RecentMatchListProps) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const { t } = useTranslation();

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
        if (matchDateOnly > todayOnly) return t('common.upcoming');
        if (matchDateOnly.getTime() === todayOnly.getTime()) return t('common.ongoing');
        return t('common.finished');
    };


    const formatTime = (timestamp?: number): string => {
        if (!timestamp) return '';
        const date = new Date(timestamp * 1000);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };


    return (
        <div >
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
            <div>
                <div className={styles.tournamentName}> {match?.tournament?.name}</div>
                <div key={match?.homeTeam?.id} className={styles.matchContent}>
                    <div className={styles.matchInfo}>
                        <div>
                            <span className={styles.matchTime}>{formatTime(match?.startTime ?? 0)}</span>
                            <span className={styles.matchStatus}> {timeSchedule(match?.startTime ?? 0)}</span>
                        </div>
                        <span className={styles.matchTime}>{formatDate(match?.startTime ?? 0)}</span>
                    </div>

                    <div className={styles.teamsContainer}>
                        <div className={styles.teamSection}>
                            <img className={styles.teamLogo} src={match?.homeTeam?.logo} alt="team logo" />
                            <div className={styles.teamInfo}>
                                <div className={styles.teamName}>{match?.homeTeam?.name}</div>
                                <div className={styles.countryName}>{match?.homeTeam?.country?.name}</div>
                            </div>
                            <div className={styles.score}>{match?.homeTeam?.score}</div>
                        </div>

                        <div className={styles.separator}>:</div>

                        <div className={styles.teamSection}>
                            <div className={styles.score}>{match?.awayTeam?.score}</div>
                            <div className={styles.teamInfo}>
                                <div className={styles.teamName}>{match?.awayTeam?.name}</div>
                                <div className={styles.countryName}>{match?.awayTeam?.country?.name}</div>
                            </div>
                            <img className={styles.teamLogo} src={match?.awayTeam?.logo} alt="team logo" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecentMatchList
