import React, { useState } from 'react';
import styles from './style.module.css';
import commonStyles from '@/components/common-style.module.css';
import { handleOddsTypeChange } from "@/utils/handleOddsChange";

interface SideMatchesListProps {
  title: string;
  matches: Match[];
  selectedOddsType?: string;
}

const SideMatchesList: React.FC<SideMatchesListProps> = ({ title, matches, selectedOddsType }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatStartTime = (startTime: number): string =>
    new Date(startTime * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

  // Group matches by tournament
  const matchesByCompetition: Record<string, Match[]> = {};
  matches.forEach(match => {
    const tournament = match.tournament?.name || 'Other Matches';
    if (!matchesByCompetition[tournament]) {
      matchesByCompetition[tournament] = [];
    }
    matchesByCompetition[tournament].push(match);
  });

  return (
    <div className={commonStyles.block}>
      {title &&
        <div
          className={`${commonStyles.heading} ${commonStyles.clickableHeading}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className={commonStyles.title}>{title}</div>
          <div className={`${commonStyles.arrow} ${isExpanded ? commonStyles.arrowUp : commonStyles.arrowDown}`} />
        </div>
      }

      <div className={commonStyles.container}>
        <div className={`${commonStyles.collapsableContainer} ${isExpanded ? commonStyles.expanded : commonStyles.collapsed}`}>
          {Object.entries(matchesByCompetition).map(([tournament, tournamentMatches]) => (
            <div key={tournament} className={styles.tournamentGroup}>
              {tournamentMatches.map((match) => (
                <div key={match.id} className={styles.matchCard}>
                  <div className={styles.matchRow}>
                    <div className={styles.teamInfo}>
                      {match?.homeTeam?.logo && (
                        <img
                          src={match?.homeTeam?.logo}
                          alt={`${match?.homeTeam?.name} logo`}
                          className={styles.teamLogo}
                        />
                      )}
                      <span className={styles.teamName}>{match?.homeTeam?.name}</span>
                    </div>

                    <div className={styles.oddsContainer}>
                      {match.homeTeam?.homeTeamAsiaOddsBooker && (
                        <>
                          <img
                            src={`/img/bookmakers/${match.homeTeam?.homeTeamAsiaOddsBooker}.svg`}
                            alt={"Odds booker"}
                            className={styles.oddsProvider}
                            onError={(e) => {
                              const span = document.createElement('span');
                              span.textContent = e.currentTarget.alt;
                              span.className = styles.oddsProvider;
                              e.currentTarget.parentNode?.replaceChild(span, e.currentTarget);
                            }}
                          />
                          <span className={commonStyles.oddsValue}>
                            {handleOddsTypeChange(match.homeTeam?.homeTeamAsiaOdds, selectedOddsType)}
                          </span>
                        </>
                      )}
                    </div>

                    {match?.homeTeam?.score !== undefined && (
                      <div className={styles.score}>{match?.homeTeam?.score}</div>
                    )}
                  </div>

                  <div className={styles.matchRow}>
                    <div className={styles.teamInfo}>
                      {match?.awayTeam?.logo && (
                        <img
                          src={match?.awayTeam?.logo}
                          alt={`${match?.awayTeam?.name} logo`}
                          className={styles.teamLogo}
                        />
                      )}
                      <span className={styles.teamName}>{match?.awayTeam?.name}</span>
                    </div>

                    <div className={styles.oddsContainer}>
                      {match.awayTeam?.awayTeamAsiaOddsBooker && (
                        <>
                          <img
                            src={`/img/bookmakers/${match.awayTeam?.awayTeamAsiaOddsBooker}.svg`}
                            alt={"Odds booker"}
                            className={styles.oddsProvider}
                            onError={(e) => {
                              const span = document.createElement('span');
                              span.textContent = e.currentTarget.alt;
                              span.className = styles.oddsProvider;
                              e.currentTarget.parentNode?.replaceChild(span, e.currentTarget);
                            }}
                          />

                          <span className={commonStyles.oddsValue}>
                            {handleOddsTypeChange(match.awayTeam?.awayTeamAsiaOdds, selectedOddsType)}
                          </span>

                        </>
                      )}
                    </div>

                    {match?.awayTeam?.score !== undefined && (
                      <div className={styles.score}>{match?.awayTeam?.score}</div>
                    )}
                  </div>

                  {match.tournament && (
                    <div className={styles.tournamentInfo}>
                      <span className={styles.tournamentName}>
                        {match.tournament?.name} {match.season?.name}
                      </span>
                      <span className={styles.matchTime}>{formatStartTime(match.startTime)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideMatchesList;