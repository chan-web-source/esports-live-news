import { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next"
import styles from './style.module.css'
import commonStyles from '@/components/common-style.module.css'
import { useNavigationContext } from '@/context/NavigationContext'
import { useNavigate } from "react-router-dom"
import { handleOddsTypeChange } from '@/utils/handleOddsChange'
import { oddsStore } from '@/store/oddsStore'
import Loading from '@/components/Loading'
import EmptyListContainer from '@/components/EmptyListContainer'

export interface TournamentGroup {
  id: string
  name: string
  flag?: string
  matches: Match[]
}

interface TournamentMatchesListProps {
  tournaments: TournamentGroup[];
  isLoading: boolean;
}

const TournamentMatchesList: React.FC<TournamentMatchesListProps> = ({ tournaments, isLoading }) => {
  const [expandedTournaments, setExpandedTournaments] = useState<Set<string>>(new Set());
  const { currentGame } = useNavigationContext();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedOddsType, setSelectedOddsType] = useState(oddsStore.getSelectedOddsType());

  useEffect(() => {
    const unsubscribe = oddsStore.subscribe(() => {
      setSelectedOddsType(oddsStore.getSelectedOddsType());
    });
    return () => unsubscribe();
  }, []);

  const toggleTournament = (tournamentId: string) => {
    setExpandedTournaments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tournamentId)) {
        newSet.delete(tournamentId);
      } else {
        newSet.add(tournamentId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    // If tournaments change, by default expand all
    setExpandedTournaments(new Set(tournaments.map(tournament => tournament.id)));
  }, [tournaments]);

  const formatStartTime = (startTime: number): string =>
    new Date(startTime * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

  const formatStartTimeDesc = (startTime: number) => {
    const matchTime = new Date(startTime * 1000);
    const now = new Date();

    // Check if matchTime is valid. Invalid time display 'today' by default.
    if (isNaN(matchTime.getTime())) {
      return undefined;
    }

    // Check if the match is today by comparing year, month, and day
    const isToday = matchTime.getFullYear() === now.getFullYear() &&
      matchTime.getMonth() === now.getMonth() &&
      matchTime.getDate() === now.getDate();

    if (isToday) {
      return t('tournamentMatchesList.today');
    } else if (matchTime < now) {
      return `${matchTime.getDate().toString().padStart(2, '0')}/${(matchTime.getMonth() + 1).toString().padStart(2, '0')}`;
    } else {
      const diffHours = Math.ceil((matchTime.getTime() - now.getTime()) / (1000 * 60 * 60));
      if (diffHours >= 24) {
        const days = Math.floor(diffHours / 24);
        const remainingHours = diffHours % 24;
        return `${t('tournamentMatchesList.in')} ${days} ${t('tournamentMatchesList.day')}${days > 1 ? t('tournamentMatchesList.days') : ''} ${remainingHours} ${t('tournamentMatchesList.hrs')}`;
      }
      return `${t('tournamentMatchesList.in')} ${diffHours} ${t('tournamentMatchesList.hrs')}`;
    }
  }

  return (
    <div className={`${commonStyles.block} ${styles.tournamentList}`}>
      {isLoading ? (
        <Loading />
      ) : tournaments.length === 0 ? (
        <EmptyListContainer title={t('mainTournamentsList.noTournamentsAvailable')} />
      ) : (
        tournaments.map(tournament => (
          <div key={tournament.id} className={`${styles.block}`}>
            <div
              className={`${commonStyles.heading} ${commonStyles.clickableHeading} ${styles.heading}`}
              onClick={() => toggleTournament(tournament.id)}
            >
              <div className={commonStyles.title}>
                {tournament.flag && (
                  <img
                    src={tournament.flag}
                    className={styles.tournamentFlag}
                    width={20}
                  />
                )}
                <span>{tournament.name}</span>
              </div>
              <div className={commonStyles.rightGroup}>
                <div className={commonStyles.count}>{tournament.matches.length} {t('tournamentMatchesList.matches')}</div>
                <div className={`${commonStyles.arrow} ${expandedTournaments.has(tournament.id) ? commonStyles.arrowUp : commonStyles.arrowDown}`} />
              </div>
            </div>

            {expandedTournaments.has(tournament.id) && (
              <div className={styles.matchesList}>
                {tournament.matches.map(match => (
                  <div key={match.id} className={styles.matchCard}
                    onClick={() => {
                      navigate(`/${currentGame}/matches/${match.id}`);
                    }}>

                    <div className={styles.timeRow}>
                      <span className={styles.matchTime}>
                        {formatStartTime(match.startTime)}
                      </span>
                      <span className={styles.matchTimeDesc}>
                        {formatStartTimeDesc(match.startTime)}
                      </span>

                      {match.tips !== undefined && match.tips > 0 && (
                        <span className={styles.tips}>
                          {match.tips}
                        </span>
                      )}
                    </div>

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
                            <span className={commonStyles.oddsValue}>{handleOddsTypeChange(match?.homeTeam?.homeTeamAsiaOdds, selectedOddsType)}</span>
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
                            <span className={commonStyles.oddsValue}>{handleOddsTypeChange(match?.awayTeam?.awayTeamAsiaOdds, selectedOddsType)}</span>
                          </>
                        )}
                      </div>

                      {match?.awayTeam?.score !== undefined && (
                        <div className={styles.score}>{match?.awayTeam?.score}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )))}
    </div>
  )
}

export default TournamentMatchesList