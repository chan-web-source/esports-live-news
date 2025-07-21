interface RestResponse<T> {
  status: number;
  message: string;
  data: T;
}

declare namespace API {
  interface Match {
    id: string;
    startTime: number;
    homeTeam: {
      id: string;
      name: string;
      logo: string;
      score: number;
      homeTeamAsiaOdds?: number;
    };
    awayTeam: {
      id: string;
      name: string;
      logo: string;
      score: number;
      awayTeamAsiaOdds?: number;
    };
    tournament: Tournament;
    odds?: {
      [bookmakerId: string]: {
        asia?: {
          homeWinOdd: number;
          drawOdd: number;
          awayWinOdd: number;
        };
        eu?: {
          homeWinOdd: number;
          drawOdd: number;
          awayWinOdd: number;
        };
        bs?: {
          homeWinOdd: number;
          drawOdd: number;
          awayWinOdd: number;
        };
        cr?: {
          homeWinOdd: number;
          drawOdd: number;
          awayWinOdd: number;
        };
      };
    };
    updatedAt?: string;
    type?: string;
  };

  interface Team {
    id: string;
    name: string;
    logo: string;
    score?: number;
    country?: Country;
    countryId?: string;
    tournamentId?: string;
    updatedAt?: string;
  }


  interface Tournament {
    sportType?: string; // football, basketball, etc
    id: string;
    name: string;
    logo: string;
    type: number; // 0-unknown, 1-league, 2-cup, 3-friendly
    startTime: number;
    endTime: number;
    country: Country;
    currentSeason: string;
    currentStage: string;
    currentRound: number;
    roundCount: number;
  }

  interface Season {
    id: string;
    tournmentId: string;
    year: string;
    startTime: Date;
    endTime: Date;
    updatedAt: string;
  }

  interface Country {
    id: string;
    name: string;
    logo: string;
  }


  interface TeamStats {
    team: Team;
    lastMatchTime?: number;
    nextMatchTime?: number;
    stats?: Stats;
  }
};

