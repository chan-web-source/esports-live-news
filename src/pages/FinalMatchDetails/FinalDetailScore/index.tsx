import styles from './style.module.css';
import { useState } from 'react';
import { useTranslation } from "react-i18next";
import commonStyles from '@/components/common-style.module.css';

interface FinalDetailScoreProps {
    title: string;
    matchStats?: MatchStats;
    match?: Tournament[];
}

const FinalDetailScore = ({ matchStats, title }: FinalDetailScoreProps) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const { t } = useTranslation();

    // const formatDate = (timestamp: number): string => {
    //     if (!timestamp) return '';
    //     const date = new Date(timestamp * 1000);
    //     return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    // };

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
                        <div className={styles.teamColumn}>{t('finalDetailScore.team')}</div>
                        <div className={styles.statColumn}>{t('finalDetailScore.win')}</div>
                        <div className={styles.statColumn}>{t('finalDetailScore.lose')}</div>
                        <div className={styles.statColumn}>{t('finalDetailScore.draw')}</div>
                        <div className={styles.mapsColumn}>{t('finalDetailScore.maps')}</div>
                    </div>

                    <div className={styles.scoreRows}>
                        <div className={styles.scoreRow}>
                            <div className={styles.teamName}>{matchStats?.homeTeam?.name}</div>
                            <div className={styles.statValue}>{matchStats?.homeTeam?.totalWins}</div>
                            <div className={styles.statValue}>{matchStats?.homeTeam?.totalLosses}</div>
                            <div className={styles.statValue}>{matchStats?.homeTeam?.totalDraws || 0}</div>
                            <div className={styles.mapsScore}>{matchStats?.homeTeam?.score}</div>
                        </div>
                        <div className={styles.scoreRow}>
                            <div className={styles.teamName}>{matchStats?.awayTeam?.name}</div>
                            <div className={styles.statValue}>{matchStats?.awayTeam?.totalWins}</div>
                            <div className={styles.statValue}>{matchStats?.awayTeam?.totalLosses}</div>
                            <div className={styles.statValue}>{matchStats?.awayTeam?.totalDraws || 0}</div>
                            <div className={styles.mapsScore}>{matchStats?.awayTeam?.score}</div>
                        </div>
                    </div>
                </div>
                <div className={styles.statValue}>
                    NBA 2024/2025
                </div>
            </div>
        </div>
    );
};

export default FinalDetailScore;