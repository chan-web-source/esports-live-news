


export const BOOKMAKER_MAP: Record<number, string> = {
  2: 'BET365',
  3: 'Crown',
  4: '10BET',
  5: 'Ladbrokes',
  6: 'Mansion88',
  7: 'Macauslot',
  8: 'SNAI',
  9: 'William Hill',
  10: 'Easybets',
  11: 'Vcbet',
  12: 'EuroBet',
  13: 'Interwetten',
  14: '12bet',
  15: 'Sbobet',
  16: 'Wewbet',
  17: '18Bet',
  18: 'Fun88',
  21: '188bet',
  22: 'Pinnacle',
};

// Functions that return current language constants

export const GAME_MENU_ITEMS: GameMenuItem[] = [
  { id: "football", name: "Football", icon: "/img/games/football.svg", iconFill: "/img/games/football-fill.svg", route: "/football/matches" },
  { id: "basketball", name: "Basketball", icon: "/img/games/basketball.svg", iconFill: "/img/games/basketball-fill.svg", route: "/basketball/matches" },
  { id: "esports", name: "Esports", icon: "/img/games/allgames.svg", iconFill: "/img/games/allgames-fill.svg", route: "/esports/matches" },
  { id: "csgo", name: "CS2 (CS:GO)", icon: "/img/games/csgo.svg", iconFill: "/img/games/csgo-fill.svg", route: "/csgo/matches" },
  { id: "lol", name: "LoL", icon: "/img/games/lol.svg", iconFill: "/img/games/lol-fill.svg", route: "/lol/matches" },
  { id: "dota2", name: "Dota 2", icon: "/img/games/dota2.svg", iconFill: "/img/games/dota2-fill.svg", route: "/dota2/matches" },
  { id: "valorant", name: "Valorant", icon: "/img/games/valorant.svg", iconFill: "/img/games/valorant-fill.svg", route: "/valorant/matches" },
  { id: "rainbow6", name: "Rainbow 6", icon: "/img/games/r6.svg", iconFill: "/img/games/r6-fill.svg", route: "/rainbow6/matches" },
  { id: "callofduty", name: "Call of Duty", icon: "/img/games/cod.svg", iconFill: "/img/games/cod-fill.svg", route: "/callofduty/matches" },
  { id: "rocketleague", name: "Rocket League", icon: "/img/games/rl.svg", iconFill: "/img/games/rl-fill.svg", route: "/rocketleague/matches" },
  { id: "overwatch", name: "Overwatch", icon: "/img/games/ow.svg", iconFill: "/img/games/ow-fill.svg", route: "/overwatch/matches" },
  { id: "arenaofvalor", name: "Arena of Valor", icon: "/img/games/aov.svg", iconFill: "/img/games/aov-fill.svg", route: "/arenaofvalor/matches" },
  { id: "pubg", name: "PUBG", icon: "/img/games/pubg.svg", iconFill: "/img/games/pubg-fill.svg", route: "/pubg/matches" },
  { id: "wildrift", name: "Wild Rift", icon: "/img/games/wr.svg", iconFill: "/img/games/wr-fill.svg", route: "/wildrift/matches" },
];

export const LEFT_PANEL_SUB_ITEMS: SubItem[] = [
  { id: 'matches', name: 'Matches', path: 'matches' },
  { id: 'predictions', name: 'Predictions', path: 'predictions' },
  { id: 'liveScore', name: 'Live Score', path: 'matches' },
  { id: 'tournaments', name: 'Tournaments', path: 'tournaments/all' },
  { id: 'teams', name: 'Teams', path: 'teams/all' }
];

export const LEFT_PANEL_LOGIN_SUB_ITEMS: SubItem[] = [
  { id: 'login', name: 'Login', path: 'login' },
  { id: 'register', name: 'Sign up', path: 'register' },
  { id: 'accountRecovery', name: 'Account Recovery', path: 'login' },
]

export const LEFT_PANEL_ACCOUNT_SUB_ITEMS: SubItem[] = [
  { id: 'profile', name: 'Profile', path: 'account' },
  { id: 'logout', name: 'Logout', path: '#' },
]

export const INFORMATION_MENU_ITEMS: LeftPanelMenuItem[] = [
  { id: "contacts", name: "Contacts", route: "/info/contacts" },
  { id: "about", name: "About", route: "/info/about" },
  { id: "subscription-policy", name: "Subscription Policy", route: "/info/subscription-policy" },
  { id: "jobs", name: "Jobs", route: "/info/jobs" },
  { id: "terms-and-conditions", name: "Terms of Service", route: "/info/terms-of-service" },
  { id: "privacy-policy", name: "Privacy Policy", route: "/info/privacy-policy" },
  { id: "cookie-policy", name: "Cookies", route: "/info/cookies" },
  { id: "responsible-gaming", name: "Responsible Gaming", route: "/info/responsible-gaming" }
];

export const ODDS_OPTIONS: LeftPanelMenuItem[] = [

  { id: "decimal", name: "Decimal", icon: "/img/odds/decimal.svg" },
  { id: "fractional", name: "Fractional", icon: "/img/odds/fractional.svg" },
  { id: "american", name: "American", icon: "/img/odds/american.svg" },
  { id: "hk", name: "Hong Kong", icon: "/img/odds/hk.svg" },
];

export const LANGUAGE_OPTIONS: LeftPanelMenuItem[] = [
  { id: "en", name: "English", icon: "/img/languages/english.svg" },
  { id: "zh", name: "中文", icon: "/img/languages/chinese.svg" },
];


export function getGameIcon(gameType: GameType, filled: boolean = false): string {
  const menuItem = GAME_MENU_ITEMS.find(item => item.id === gameType);
  if (!menuItem) {
    throw new Error(`Invalid game type: ${gameType}`);
  }
  return filled ? menuItem.iconFill : menuItem.icon;
}
