interface BreadCrumbTranslation {
    home?: string;
    tournaments?: string;
    match?: string;
    teams?: string;

}

interface ProfileFormTranslation {
    overviewTitle?: string;
    profileTitle?: string;
    emailLabel?: string;
    displayNameLabel?: string;
    currentPasswordLabel?: string;
    newPasswordLabel?: string;
    confirmPasswordLabel?: string;
    updateButton?: string;
    walletTitle?: string;
    walletBalance?: string;
    walletDeposit?: string;
    walletWithdraw?: string;
    walletTransfer?: string;
    walletBalanceTitle?: string;
}

interface RegisterFormTranslation {
    welcome?: string;
    socialLogin?: {
        wechat?: string;
        qq?: string;
    };
    divider?: string;
    form?: {
        email?: {
            label?: string;
            placeholder?: string;
        };
        password?: {
            label?: string;
            placeholder?: string;
        };
    };
    terms?: {
        agreement?: string;
        termsOfService?: string;
        and?: string;
        privacyPolicy?: string;
    };
    ageConfirmation?: string;
    submitButton?: string;
    footer?: {
        prompt?: string;
        login?: string;
    };
    errors?: {
        termsNotAccepted?: string;
        emailAlreadyRegistered?: string;
        registrationFailed?: string;
    };
}

interface ArticleNewsTranslation {
    title?: string;
    subtitle?: string;
    readMore?: string;
    latestNewsTitle?: string;
}

interface StaticPageTranslation {
    home?: string;
}

interface MatchTranslation {
    title?: string;
    subtitle?: string;
    description?: string;
    button?: string;
    liveUpdateListTitle?: string;
    finalMatchScoreTitle?: string;
    tournamentStandingTitle?: string;
    recentMatchListTitle?: string;
    upcomingMatchListTitle?: string;
    latestNewsTitle?: string;
    team?: string;
    win?: string;
    lose?: string;
    draw?: string;
    maps?: string;
    winningLosingStreak?: string;
    streak?: string;
    last6MonthWinRate?: string;
    recentMatchHistory?: string;
    upcoming?: string;
    ongoing?: string;
    finished?: string;
    homeTeam?: string;
    matchesToday?: string;
    matchesFor?: string;
    sportsTeamRanking?: string;
    teamRanking?: string;
    in?: string;
    day?: string;
    days?: string;
    hrs?: string;
    today?: string;
    promoTextTitle?: string;
}

interface MatchTranslationGrouped {
    matches: MatchTranslation;
    breadCrumb: BreadCrumbTranslation;
}



interface HomeTranslation {
    headerTitle?: string;
    sportsNewsTitle?: string;
    liveMatchesTitle?: string;
    tomorrowMatchesTitle?: string;
    mainTournamentsTitle?: string;
    promoText?: string;
    mainMatchesTitle?: string;
}

interface TeamDetailTranslation extends Partial<BreadCrumbTranslation> {
    title?: string;
    subtitle?: string;
    description?: string;
    button?: string;
    recentMatchListTitle?: string;
    teamDetailTitle?: string;
    participateMatchTitle?: string;
    upcomingParticipateMatchTitle?: string;
    achievementMatchTitle?: string;
    scoreMatchTitle?: string;
    teamRankingTitle?: string;
    sportTeamRankingTitle?: string;
    promoCode?: string;
    promoText?: string;
    scoresAndOutcomes?: string;
    date?: string;
    opponent?: string;
    score?: string;
    odds?: string;
    bookiesPromo?: string;
    bookiesPromoTitle?: string;
}

interface MainTournamentTranslation {
    finals?: string,
    in?: string,
    days?: string,
    left?: string,
    streak?: string,
    d?: string,
    noOngoingStage?: string,
    teams?: string,
    matches?: string,
    loading?: string,
    noTournamentsAvailable?: string,
    NA?: string,
    t30dWinrate?: string,
    winrate?: string,
    lastMatch?: string,
    dAgo?: string,
    nearestMatch?: string,
    quarterfinals?: string,
    noMatchesAvailable?: string,
    tournaments?: string,
    articleNewsTitle?: string,
}

interface TeamTranslationGrouped {
    teamDetail: TeamDetailTranslation;
    mainTournament: MainTournamentTranslation;
    breadCrumb: BreadCrumbTranslation;
    matchEvents: MatchEventTranslation;
}

export interface MatchEventTranslation {
    ONGOING?: string;
    UPCOMING?: string;
    FINISHED?: string;
}

export {
    type MatchTranslation,
    type BreadCrumbTranslation,
    type ProfileFormTranslation,
    type RegisterFormTranslation,
    type ArticleNewsTranslation,
    type StaticPageTranslation,
    type HomeTranslation,
    type TeamDetailTranslation,
    type MainTournamentTranslation,
    type TeamTranslationGrouped,
    type MatchEventTranslation,
    type MatchTranslationGrouped,
};
