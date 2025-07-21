import { apiOpen } from '@/utils/api';
import { BOOKMAKER_MAP } from '@/constants';

// -- Homepage Matches --

export const getMatches = async (
  date: string, // YYYYMMDD
  timezoneOffset: number,
  gameType?: GameType
): Promise<Match[]> => {
  try {
    const response = await apiOpen.get<RestResponse<API.Match[]>>(`/matches`, {
      params: {
        date: date,
        timezoneOffset: timezoneOffset,
        sportType: gameType
      }
    });
    return transformMatches(response.data.data);
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
};

export const getTodayMatches = async (
  timezoneOffset: number,
  limit: number
): Promise<Match[]> => {
  try {
    const response = await apiOpen.get<RestResponse<API.Match[]>>(`/matches/today`, {
      params: { timezoneOffset, limit }
    });
    return transformMatches(response.data.data);
  } catch (error) {
    console.error('Error fetching today matches:', error);
    throw error;
  }
};

export const getTomorrowMatches = async (
  timezoneOffset: number,
  limit: number
): Promise<Match[]> => {
  try {
    const response = await apiOpen.get<RestResponse<API.Match[]>>(`/matches/tomorrow`, {
      params: { timezoneOffset, limit }
    });
    return transformMatches(response.data.data);
  } catch (error) {
    console.error('Error fetching tomorrow matches:', error);
    throw error;
  }
};

export const getMainMatches = async (
  timezoneOffset: number,
  limit: number
): Promise<Match[]> => {
  try {
    const response = await apiOpen.get<RestResponse<API.Match[]>>(`/matches/main`, {
      params: { timezoneOffset, limit }
    });
    return transformMatches(response.data.data);
  } catch (error) {
    console.error('Error fetching main matches:', error);
    throw error;
  }
};

export const getLiveMatches = async (
  limit: number
): Promise<Match[]> => {
  try {
    const response = await apiOpen.get<RestResponse<API.Match[]>>(`/matches/live`, {
      params: { limit }
    });
    return transformMatches(response.data.data);
  } catch (error) {
    console.error('Error fetching live matches:', error);
    throw error;
  }
};

// This temporarily query ongoing tournaments
export const getMainTournaments = async (
  timezoneOffset: number,
  limit: number,
  sportType?: GameType,
): Promise<Tournament[]> => {
  try {
    const response = await apiOpen.get<RestResponse<API.Tournament[]>>(`/tournaments/ongoing`, {
      params: { timezoneOffset, sportType, page: 1, size: limit }
    });
    return transformTournaments(response.data.data);
  } catch (error) {
    console.error('Error fetching main tournaments:', error);
    throw error;
  }
};

export const getOngoingTournaments = async (
  timezoneOffset: number,
  limit: number,
  sportType?: GameType,
  countryId?: string
): Promise<Tournament[]> => {
  try {
    const response = await apiOpen.get<RestResponse<API.Tournament[]>>(`/tournaments/ongoing`, {
      params: { timezoneOffset, sportType, countryId, page: 1, size: limit }
    });
    return transformTournaments(response.data.data);
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
};

export const getUpcomingTournaments = async (
  timezoneOffset: number,
  limit: number,
  sportType?: GameType,
  countryId?: string
): Promise<Tournament[]> => {
  try {
    const response = await apiOpen.get<RestResponse<API.Tournament[]>>(`/tournaments/upcoming`, {
      params: { timezoneOffset, sportType, countryId, page: 1, size: limit }
    });
    return transformTournaments(response.data.data);
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
};

export const getFinishedTournaments = async (
  timezoneOffset: number,
  limit: number,
  sportType?: GameType,
  countryId?: string
): Promise<Tournament[]> => {
  try {
    const response = await apiOpen.get<RestResponse<API.Tournament[]>>(`/tournaments/finished`, {
      params: { timezoneOffset, sportType, countryId, page: 1, size: limit }
    });
    return transformTournaments(response.data.data);
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
};

export const getCurrentYearTournaments = async (
  timezoneOffset: number,
  sportType?: GameType
): Promise<Tournament[]> => {
  try {
    const response = await apiOpen.get<RestResponse<Record<string, API.Tournament[]>>>(`/tournaments/current-year/v2`, {
      params: { timezoneOffset, sportType }
    });

    // Extract tournaments from the year object (e.g., "202401")
    const yearKey = Object.keys(response.data.data)[0]; // Get first year key
    const tournaments = response.data.data[yearKey] || [];

    return transformTournaments(tournaments);
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
};

// -- Data processing --
/**
 * Performs mapping from API data to local data structure
 * 
 * @param apiMatches Matches data from API
 * @returns Matches data defined in types.d.ts
 */
export const transformMatches = (
  apiMatches: API.Match[]
): Match[] => {

  return apiMatches.map(match => {
    // Find highest odds for each team across all bookmakers
    let homeTeamOdds = {
      bookmaker: '',
      value: 0
    };
    let awayTeamOdds = {
      bookmaker: '',
      value: 0
    };

    if (match.odds) {
      Object.entries(match.odds).forEach(([bookmakerId, odds]) => {
        if (odds.asia) {
          const bookmakerName = BOOKMAKER_MAP[Number(bookmakerId)] || bookmakerId;

          // Update home team odds if higher
          if (!homeTeamOdds.value || odds.asia.homeWinOdd > homeTeamOdds.value) {
            homeTeamOdds = {
              bookmaker: bookmakerName,
              value: odds.asia.homeWinOdd
            };
          }
          // Update away team odds if higher
          if (!awayTeamOdds.value || odds.asia.awayWinOdd > awayTeamOdds.value) {
            awayTeamOdds = {
              bookmaker: bookmakerName,
              value: odds.asia.awayWinOdd
            };
          }
        }
      });
    }

    return {
      id: match.id,
      startTime: match.startTime,
      tips: 0,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      tournament: match.tournament,
      season: { id: '', name: match.tournament.currentSeason },
      stage: { id: '', name: match.tournament.currentStage },
      homeTeamOdds: homeTeamOdds.value > 0 ? homeTeamOdds : undefined,
      awayTeamOdds: awayTeamOdds.value > 0 ? awayTeamOdds : undefined
    } as unknown as Match;
  });
};

export const transformTournaments = (
  apiTournaments: API.Tournament[]
): Tournament[] => {
  return apiTournaments.map(tournament => ({
    id: tournament.id,
    gameType: tournament.sportType,
    name: tournament.name,
    logo: tournament.logo,
    type: tournament.type,
    startTime: tournament.startTime,
    endTime: tournament.endTime,
    currentSeason: tournament.currentSeason,
    currentStage: tournament.currentStage,
    currentRound: tournament.currentRound,
    roundCount: tournament.roundCount,
    country: tournament.country
  }));
};

// -- Teams  --


/**
 * Get detailed statistics for a specific team
 * 
 * @param teamId The unique identifier of the team
 * @returns Promise with team statistics data
 */
export const getTeamStats = async (teamId: string, timezoneOffset: number,): Promise<API.TeamStats> => {
  try {
    const response = await apiOpen.get<RestResponse<API.TeamStats>>(`/teams/details`, {
      params: { teamId, timezoneOffset }
    });
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching team stats:', error);
    throw error;
  }
};


export const getTeamScheduleMatch = async (
  teamId: string,
  timezoneOffset: number,
  page: number = 1,
  size: number = 20
): Promise<Tournament[]> => {
  try {
    const response = await apiOpen.get<RestResponse<Tournament[]>>(`/teams/matches/upcoming`, {
      params: { teamId, timezoneOffset, page, size }
    });
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching team schedule:', error);
    throw error;
  }
};

export const getParticipateMatch = async (
  teamId: string,
  timezoneOffset: number
): Promise<Tournament[]> => {
  try {
    const response = await apiOpen.get<RestResponse<Tournament[]>>(`/teams/tournaments/upcoming`, {
      params: { teamId, timezoneOffset }
    });
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching participate matches:', error);
    throw error;
  }
};

export const getUpcomingParticipateMatch = async (
  teamId: string,
  timezoneOffset: number
): Promise<Tournament[]> => {
  try {
    const response = await apiOpen.get<RestResponse<Tournament[]>>(`/teams/tournaments/upcoming`, {
      params: { teamId, timezoneOffset }
    });
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching upcoming participate matches:', error);
    throw error;
  }
};


export const getAchieveMatch = async (
  teamId: string,
  timezoneOffset: number
): Promise<Tournament[]> => {
  try {
    const response = await apiOpen.get<RestResponse<Tournament[]>>(`/teams/tournaments/finished`, {
      params: { teamId, timezoneOffset }
    });
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching achieved matches:', error);
    throw error;
  }
};

export const getFinishMatch = async (
  teamId: string,
  timezoneOffset: number,
  page: number = 1,
  size: number = 20
): Promise<Tournament[]> => {
  try {
    const response = await apiOpen.get<RestResponse<Tournament[]>>(`/teams/matches/finished`, {
      params: { teamId, timezoneOffset, page, size }
    });
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching finished matches:', error);
    throw error;
  }
};



export const getMajorOngoingTournaments = async (
  sportType: string
): Promise<Tournament[]> => {
  try {
    const response = await apiOpen.get<RestResponse<Tournament[]>>(
      `/tournaments/major-ongoing-events`,
      {
        params: { sportType }
      }
    );
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching major ongoing tournaments:', error);
    throw error;
  }
};


export const getTournamentInfo = async (
  tournamentId: string
): Promise<TournamentStats> => {
  try {
    const response = await apiOpen.get<RestResponse<TournamentStats>>(
      `/tournaments/info`,
      {
        params: { tournamentId }
      }
    );
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching tournament info:', error);
    throw error;
  }
};


export const getUpcomingTournamentMatch = async (
  tournamentId: string
): Promise<Tournament[]> => {
  try {
    const response = await apiOpen.get<RestResponse<Tournament[]>>(
      `/tournaments/matches/upcoming`,
      {
        params: { tournamentId }
      }
    );
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching upcoming tournament match:', error);
    throw error;
  }
};

export const getFinishedTournamentMatch = async (
  tournamentId: string
): Promise<Tournament[]> => {
  try {
    const response = await apiOpen.get<RestResponse<Tournament[]>>(
      `/tournaments/matches/finished`,
      {
        params: { tournamentId }
      }
    );
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching finished tournament match:', error);
    throw error;
  }
};



export const getTournamentTable = async (
  tournamentId: string
): Promise<TournamentStanding> => {
  try {
    const response = await apiOpen.get<RestResponse<TournamentStanding>>(
      `/tournaments/table`,
      {
        params: { tournamentId }
      }
    );
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching tournament table:', error);
    throw error;
  }
};



export const getTeamRanking = async (
  sportType: string,
  countryId?: string,
  page: number = 1,
  size: number = 20
): Promise<API.Team[]> => {
  try {
    const response = await apiOpen.get<RestResponse<API.Team[]>>(`/teams/rankings`, {
      params: { sportType, countryId, page, size }
    });
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching team rankings:', error);
    throw error;
  }
};


// -- Final Match --
export const getMatchInfo = async (
  matchId: string
): Promise<Match> => {
  try {
    const response = await apiOpen.get<RestResponse<Match>>(`/matches/info`, {
      params: { matchId }
    });
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching match info:', error);
    throw error;
  }
};


export const getMatchAnalysis = async (
  matchId: string
): Promise<MatchAnalysis> => {
  try {
    const response = await apiOpen.get<RestResponse<MatchAnalysis>>('/matches/analysis', {
      params: { matchId }
    });
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching match analysis:', error);
    throw error;
  }
};


export const getUpcomingMatch = async (
  timezoneOffset: number
): Promise<Match[]> => {
  try {
    const response = await apiOpen.get<RestResponse<Match[]>>('/matches/main', {
      params: { timezoneOffset }
    });
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching upcoming match:', error);
    throw error;
  }
};

// -- Season match, teams --
// gameType: football, basketball
export const getTournamentStanding = async (
  seasonId: string
): Promise<TournamentStanding> => {
  try {
    const response = await apiOpen.get<RestResponse<TournamentStanding>>(
      '/seasons/table',
      {
        params: { seasonId }
      }
    );
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching football tournament standing:', error);
    throw error;
  }
};


/**
 * Transform API team stats to frontend format
 */

