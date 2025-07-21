type CurrencyCode = 'USDT' | 'BTC' | 'ETH' | 'TRX';

interface Wallet {
  id: string;
  balances: Record<CurrencyCode, number>; // Maps specific currency codes to their balances
}

type GameType = 'football' | 'basketball' | 'esports' | 'csgo' | 'lol' | 'dota2' | 'valorant' | 'rainbow6' | 'callofduty' | 'rocketleague' | 'overwatch' | 'arenaofvalor' | 'pubg' | 'wildrift';

type SectionType = 'news' | 'matches' | 'tournaments' | 'tournament' | 'teams' | 'team';

type SubItem = {
  name?: string;
  path: string;
  id?: string;
}


type GameMenuItem = {
  id: GameType;
  name: string;
  icon: string;
  iconFill: string;
  route: string;
};


type LeftPanelMenuItem = {
  id: string;
  name: string;
  route?: string;
  icon?: string;
};
interface NewsItem {
  id: string;
  title: string;
  image?: string;
  date: string;
  time: string | number;
}

interface DateGroupNewsItem {
  date?: string;
  newsItems?: NewsItem[];
}

interface BookiesCompany {
  name: string;
  logo: string;
  odds: string;
  label?: string;
  code?: string;
}


interface Team {
  id: string;
  teamId?: string;
  name?: string;
  logo?: string;
  score?: number;
  country?: Country;
  ranking?: number;
  teamCount?: number;
  homeTeamAsiaOdds?: number;
  awayTeamAsiaOdds?: number;
  homeTeamAsiaOddsBooker?: string;
  awayTeamAsiaOddsBooker?: string;
  points?: number;
  streakType?: string;
  streakCount?: number;
  totalWins?: number;
  totalLosses?: number;
  totalDraws?: number;
  last30DaysWins?: number;
  last30DaysLosses?: number;
  last30DaysDraws?: number;
  last30DaysWinRate?: number;
  last6MonthsWinRate?: number;
  totalWinRate?: number;
  recentMatches?: Match[];
};

interface c extends Team {
  country: Country;
}

interface Odds {
  value: number;
  bookmaker?: string;
}

interface Country {
  id: string;
  name?: string;
  code?: string;
  logo?: string;
  prizePool?: number;
}


interface Match {
  statusId?: number;
  bookmakers?: string[];
  date?: ReactNode;
  time?: ReactNode;
  id: string;
  tips?: number;
  startTime: number;
  homeTeam?: Team;
  homeTeamOdds?: Odds;
  awayTeam?: Team;
  awayTeamOdds?: Odds;
  tournament?: Tournament;
  season?: Season;
  stage?: Stage;
  endTime?: number;
}

type ArticleSection = {
  name: string;
  value: string | Match | string[] | ReactNode;
}
interface Article {
  id: string;
  title: string;
  author?: string;
  created_at?: number;
  board?: string;
  image?: string;
  section: ArticleSection[];
  author_description?: string;
}

interface H2HAnalysis {
  homeWins?: number;
  awayWins?: number;
  draws?: number;
  totalHomeScores?: number;
  totalAwayScores?: number;
  last12MonthsHomeWins?: number;
  last12MonthsAwayWins?: number;
  last12MonthsHomeScores?: number;
  last12MonthsAwayScores?: number;
}
interface MatchAnalysis {
  homeTeam?: Team;
  awayTeam?: Team;
  h2hMatches?: Match[];
  h2hAnalysis?: H2HAnalysis;
  scheduledH2HMatches?: Match[];
}

type EventState = "ONGOING" | "UPCOMING" | "FINISHED" | "CURRENT-YEAR";
type NewsState = "NEWS" | "GUIDE" | "ANALYTICS" | "INTERVIEW";

interface Tournament {
  gameType?: string;
  id: string;
  name?: string;
  logo?: string;
  type?: number; // 0-unknown, 1-league, 2-cup, 3-friendly
  startTime: number;
  endTime?: number;
  country?: Country;
  currentSeason?: string;
  currentStage?: string;
  currentRound?: number;
  roundCount?: number;
  stageDetails?: string;
  quarterFinalsTime?: number;
  teamCount?: number;
  prizePool?: number;
  homeTeam?: Team;
  awayTeam?: Team;
  teams?: number;
  lastMatchTime?: number;
  lastMatchStage?: string;
  division?: string;
  currentSeasonId?: string;
  currentStageId?: string;
  statusId?: number;
}


interface Season {
  id: string;
  // TODO
  name?: string;
}

interface Stage {
  id: string;
  name?: string;
  mode?: number;
  groupCount?: number;
  roundCount?: number;
  order?: number;
}

interface Promotion {
  id: string;
  name: string;
  color: string;
}

interface Stats {
  totalMatches: number;
  totalWins: number;
  totalLosses: number;
  totalDraws: number;
  totalMatchesInYear?: number;
  totalMatchesInLast30Days?: number;
  totalWinsInLast30Days?: number;
  streakType?: "WIN" | "LOSE" | "DRAW";
  streakCount?: number;
}

interface TeamStats {
  team: Team;
  lastMatchTime?: number;
  nextMatchTime?: number;
  stats?: Stats
}

interface MatchStats {
  id: string;
  team?: Team;
  homeTeam?: Team;
  awayTeam?: Team;
  stats?: Stats;
  startTime?: number;
  endTime?: number;

}

interface TournamentStats {
  id: string;
  name?: string;
  logo?: string;
  type?: number;
  startTime?: number;
  endTime?: number;
  country?: Country;
  currentSeason?: string;
  currentStage?: string;
  currentRound?: number;
  roundCount?: number;
  division?: string;
  teamCount?: number;
  groups?: string[];
}

interface Stage {
  id: string;
  name?: string;
  mode?: number;
  groupCount?: number;
  roundCount?: number;
  order?: number;
}


interface TournamentStandingRow {
  team?: Team;
  promotion_id?: string;
  points?: number;
  position?: number;
  deductPoints?: number;
  note?: string;
  total?: number;
  won?: number;
  draw?: number;
  loss?: number;
  goals?: number;
  goalsAgainst?: number;
  goalDiff?: number;
  homePoints?: number;
  homePosition?: number;
  homeTotal?: number;
  homeWon?: number;
  homeDraw?: number;
  homeLoss?: number;
  homeGoals?: number;
  homeGoalsAgainst?: number;
  homeGoalDiff?: number;
  awayPoints?: number;
  awayPosition?: number;
  awayTotal?: number;
  awayWon?: number;
  awayDraw?: number;
  awayLoss?: number;
  awayGoals?: number;
  awayGoalsAgainst?: number;
  awayGoalDiff?: number;

  wonRate?: number;
  pointsAvg?: number;
  pointsAgainstAvg?: number;
  diffAvg?: number;
  streaks?: number;
  home?: string;
  away?: string;
  last10?: string;
}

interface TournamentStanding {
  tables: {
    stage?: Stage;
    name?: string;
    conference?: string;
    group?: number;
    scope?: string; // basketball
    rows: TournamentStandingRow[];
  }[];
  promotions?: Promotion[];
}