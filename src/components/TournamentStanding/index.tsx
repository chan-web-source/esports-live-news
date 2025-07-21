import styles from './style.module.css';
import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import commonStyles from '@/components/common-style.module.css';

interface TournamentStandingScoreProps {
    title: string;
    tournamentStanding?: TournamentStanding;
    currentStageSubTitle?: string;
}

const TournamentStandingScore = ({ tournamentStanding, title, currentStageSubTitle }: TournamentStandingScoreProps) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [teamLength, setTeamLength] = useState(0);
    const { t } = useTranslation();

    useEffect(() => {
        if (tournamentStanding) {
            const totalRows = tournamentStanding.tables.reduce((acc, table) => {
                return acc + (table.rows?.length || 0);
            }, 0);
            setTeamLength(totalRows);
        }
    }, [tournamentStanding]);

    return (
        <div className={commonStyles.block}>
            {title &&
                (<div
                    className={`${commonStyles.heading} ${commonStyles.clickableHeading}`}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className={commonStyles.statItem}>{title}</div>
                    <div className={commonStyles.rightGroup}>
                        <div className={styles.stage}>{t('common.teams')}: {teamLength}</div>
                        <div
                            className={`${commonStyles.arrow} 
        ${isExpanded ? commonStyles.arrowDown : commonStyles.arrowUp}
        `} />
                    </div>
                </div>)}
            <div className={`${commonStyles.container} ${commonStyles.collapsableContainer} ${isExpanded ? commonStyles.expanded : commonStyles.collapsed}`}>
                <div className={styles.statsContainer}>
                    <div className={styles.header}>
                        <div className={styles.teamColumn}>{t('common.team')}</div>
                        <div className={styles.statColumn}>{t('common.win')}</div>
                        <div className={styles.statColumn}>{t('common.lose')}</div>
                        <div className={styles.statColumn}>{t('common.draw')}</div>
                        <div className={styles.mapsColumn}>{t('common.maps')}</div>
                    </div>
                    <div className={styles.scoreRows}>
                        {tournamentStanding?.tables?.map((table, tableIndex) =>
                            table.rows?.map((row) => (
                                <div key={`${table.stage?.id || tableIndex}-${row.team?.id}`} className={styles.scoreRow}>
                                    <div className={styles.teamInfo}>
                                        <img
                                            src={row.team?.logo}
                                            alt={row.team?.name}
                                            className={styles.teamLogo}
                                        />
                                        <span className={styles.teamName}>{row.team?.name}</span>
                                    </div>
                                    <div className={styles.statValue}>{row.won}</div>
                                    <div className={styles.statValue}>{row.loss}</div>
                                    <div className={styles.statValue}>{row.draw}</div>
                                    <div className={styles.goalsScore}>
                                        {row.goals} - {row.goalsAgainst}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                {currentStageSubTitle &&
                    <div className={styles.statValue}>
                        {currentStageSubTitle}
                    </div>}
            </div>
        </div>
    );
};

export default TournamentStandingScore;