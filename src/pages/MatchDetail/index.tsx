import Header from "@/components/Header"
import Spacer from "@/components/Spacer"
import BottomAds from "@/components/BottomAds"
import Footer from "@/components/Footer"
import Breadcrumb from "@/components/Breadcrumb"
import style from "./style.module.css"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import BookesOffer from "@/components/BookiesOffer/index"
import SideNews from "@/components/SideNews"
import { getMatchInfo, getMatchAnalysis, getUpcomingMatch, getTournamentStanding } from "@/service/dataService"
import { useNavigationContext } from "@/context/NavigationContext"
import MatchHeader from './MatchHeader'
import LiveUpdateDetail from "./LiveUpdateDetail"
import RecentMatchList from "./RecentMatchList"
import UpcomingMatchList from "./UpcomingMatchList"
import { useParams } from "react-router-dom"
import TournamentStandingScore from "@/components/TournamentStanding"
import ChatBubble from "@/components/ChatBubble"

const MatchDetail: React.FC = () => {
  const { currentGame, currentGameName, currentSectionName } = useNavigationContext();
  const { matchId } = useParams();
  const { t } = useTranslation();

  const [matchStats, setMatchStats] = useState<Match>();
  const [matchAnalaysis, setMatchAnalaysis] = useState<MatchAnalysis>();
  const [tournamentStanding, setTournamentStanding] = useState<TournamentStanding>();
  const [upcomingData, setUpcomingData] = useState<Match[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get timezone offset in minutes
        const timezoneOffset = new Date().getTimezoneOffset() * -1;

        // Use the matchId from URL params instead of hardcoded value
        const [matchInfoData, matchAnalysisData, upcomingMatchData] = await Promise.all([
          getMatchInfo(matchId || ""),
          getMatchAnalysis(matchId || ""),
          getUpcomingMatch(timezoneOffset)
        ]);

        const seasonId = matchInfoData?.tournament?.currentSeasonId;
        setMatchStats(matchInfoData);
        setMatchAnalaysis(matchAnalysisData);
        setUpcomingData(upcomingMatchData);
        // get tournament standing data according to season id
        const tournamentStandingData = await getTournamentStanding(seasonId || "");
        setTournamentStanding(tournamentStandingData);

      } catch (error) {
        console.error('Error fetching match data:', error);
      }
    };

    if (matchId) {
      fetchData();
    }
  }, [currentGame, matchId]);

  const bookiesCompanyData: BookiesCompany[] = [
    { logo: '/img/bookmakers/stake.svg', odds: '+125%', label: 'For New Users', code: '888SPORT', name: 'Stake' },
    { logo: '/img/bookmakers/bcgame.svg', odds: '+140%', label: 'For New Users', name: 'BC Game' },
    { logo: '/img/bookmakers/betfury.svg', odds: '+115%', label: 'For New Users', name: 'BetFury' },
    { logo: '/img/bookmakers/20bet.svg', odds: '+135%', label: 'For New Users', code: '888SPORT', name: '20Bet' },
    { logo: '/img/bookmakers/vave.svg', odds: '+100%', label: 'For New Users', name: 'Vave' },
    { logo: '/img/bookmakers/mostbet.svg', odds: '+150%', label: 'For New Users', name: 'MostBet' },
    { logo: '/img/bookmakers/gembet.svg', odds: '+130%', label: 'For New Users', code: '888SPORT', name: 'GemBet' },
    { logo: '/img/bookmakers/fairpari.svg', odds: '+120%', label: 'For New Users', name: 'FairPari' },
    { logo: '/img/bookmakers/boomerang.svg', odds: '+145%', label: 'For New Users', name: 'Boomerang' },
    { logo: '/img/bookmakers/betonred.svg', odds: '+110%', label: 'For New Users', name: 'BetOnRed' }
  ];

  const newsItems: NewsItem[] = [
    {
      id: "1",
      title: 'Weekend Football Predictions: Top Matches to Watch (26-27.04)',
      image: 'https://files.tips.gg/static/image/news/weekend-football-predictions.jpg',
      date: 'Today',
      time: '18:21',
    },
    {
      id: "2",
      title: 'Champions League Semi-Final Preview: Tactical Breakdown',
      image: 'https://files.tips.gg/static/image/news/champions-league-preview.jpg',
      date: 'Today',
      time: '22:53',
    },
    {
      id: "3",
      title: 'Rising Star Alert: Young Talents Shaping Modern Football',
      image: 'https://files.tips.gg/static/image/news/football-rising-stars.jpg',
      date: 'Today',
      time: '22:41',
    },
    {
      id: "4",
      title: 'Transfer Rumors: Top Clubs Eyeing Midfield Maestros',
      image: 'https://files.tips.gg/static/image/news/transfer-rumors.jpg',
      date: 'Yesterday',
      time: '22:22',
    },
    {
      id: "5",
      title: 'Historic Rivalries: Classic Matches That Defined Football',
      image: 'https://files.tips.gg/static/image/news/football-rivalries.jpg',
      date: 'Yesterday',
      time: '22:20',
    }
  ];

  const getTitle = () => {
    const currentYear = new Date().getFullYear();
    return `${t(`constants.gameMenuItems.${currentGame}`)} ${t('matchDetail.title')} ${currentYear}`
  }


  return (
    <>
      <Header />
      <Spacer space={55} />
      <section className="container">
        <Breadcrumb items={[
          { label: t('common.home'), url: '/' },
          { label: currentGameName, url: `/${currentGame}/matches` },
          { label: currentSectionName, url: `/${currentGame}/tournaments/${matchStats?.tournament?.country?.id ?? "all"}` },
          { label: matchStats?.tournament?.name ?? t('matchDetail.match') },

          { label: matchStats?.tournament?.name ?? "" },
        ]} />
        <h1 className={style.title}>{getTitle()}</h1>
        <div className="contentWrapper">
          <div className="mainContent">
            <MatchHeader matchStats={matchStats} />
            <Spacer space={20} />
            <LiveUpdateDetail
              matchStats={matchStats}
              matchAnalysis={matchAnalaysis}
              title={t('matchDetail.liveUpdateListTitle')}
            />
            <Spacer space={20} />


            <Spacer space={20} />
            <TournamentStandingScore
              tournamentStanding={tournamentStanding}
              title={t('matchDetail.tournamentStandingTitle')}
              currentStageSubTitle={`${matchStats?.tournament?.currentStage} ${matchStats?.tournament?.currentSeason}`}
            />

            <Spacer space={20} />
            <RecentMatchList
              title={t('matchDetail.recentMatchListTitle')}
              matchStats={matchStats}
            />
            <Spacer space={20} />
          </div>

          <div className="sideContent">
            <UpcomingMatchList
              title={t('matchDetail.upcomingMatchListTitle')}
              match={upcomingData}
            />
            <Spacer space={20} />
            <BookesOffer
              title={t('matchDetail.oddsRankingTitle')}
              bookies={bookiesCompanyData} />
            <Spacer space={20} />
            <SideNews title={t('matchDetail.latestNewsTitle')} news={newsItems} />
          </div>
        </div>
      </section>
      <Footer />
      <Spacer space={60} />
      <BottomAds />
      <ChatBubble />
    </>
  )
}

export default MatchDetail
