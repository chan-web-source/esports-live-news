import MainNews from "@/components/MainNews"
import Header from "@/components/Header"
import Spacer from "@/components/Spacer"
import style from "./style.module.css"
import PromoCodeBlock from "@/components/PromoCodeBlock"
import SideMatchesList from "./SideMatchesList"
import MainMatchesList from "./MainMatchesList"
import BottomAds from "@/components/BottomAds"
import MainTournamentsList from "@/components/MainTournamentsList"
import Footer from "@/components/Footer"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { getLiveMatches, getMainMatches, getTodayMatches, getTomorrowMatches, getMainTournaments } from "@/service/dataService"
import ChatBubble from "@/components/ChatBubble"
import { useNavigationContext } from "@/context/NavigationContext"
import { oddsStore } from "@/store/oddsStore";

const MAX_MATCHES = 16;

const Home: React.FC = () => {

  const { setCurrentGame, setCurrentSection } = useNavigationContext();
  const [selectedOddsType, setSelectedOddsType] = useState(oddsStore.getSelectedOddsType());
  const { t } = useTranslation();

  useEffect(() => {
    setCurrentGame(undefined);
    setCurrentSection(undefined);
  }, [setCurrentGame, setCurrentSection]);

  useEffect(() => {
    const unsubscribe = oddsStore.subscribe(() => {
      setSelectedOddsType(oddsStore.getSelectedOddsType());
    });
    return () => unsubscribe();
  }, []);

  const newsItems: NewsItem[] = [
    {
      id: "1",
      title: 'Weekend Football Predictions Digest (26-27.04)',
      image: '/img/news/1200x900-25.webp',
      date: 'Yesterday',
      time: '18:21'
    },
    {
      id: "2",
      title: 'Barcelona vs Real Madrid Prediction: 26.04.2025 Copa Del Rey Final Preview',
      image: '/img/news/Barcelona-25.webp',
      date: 'Yesterday',
      time: '22:53'
    },
    {
      id: "3",
      title: 'Yokohama F Marinos vs Al Nassr Prediction: 26.04.2025 AFC Champions League Elite Preview',
      image: '/img/news/Yokohama-F-Marinos-25.webp',
      date: 'Yesterday',
      time: '22:41'
    },
    {
      id: "4",
      title: 'Al Ahli SC vs Buriram Prediction: 26.04.2025 AFC Champions League Elite Quarterfinals Preview',
      image: '/img/news/Al-Ahli-SC-25.webp',
      date: 'Yesterday',
      time: '22:22'
    },
    {
      id: "5",
      title: 'Varazdin vs Lokomotiva Zagreb Prediction: 26.04.2025 1. HNL Preview',
      image: '/img/news/Varazdin-26.webp',
      date: 'Yesterday',
      time: '22:20'
    }
  ];

  const homepagePromoTeamsData: [Team, Team][] = [
    [
      {
        id: 'Barcelona',
        name: 'Barcelona',
        logo: '/img/teams/fc-barcelona-football.svg',
        homeTeamAsiaOdds: 2.07,
      },
      {
        id: 'Real Madrid',
        name: 'Real Madrid',
        logo: '/img/teams/real-madrid-football.png',
        homeTeamAsiaOdds: 3.10,
      }
    ],
    [
      {
        id: 'Dundee United',
        name: 'Dundee United',
        logo: '/img/teams/dundee-united-football.png',
        homeTeamAsiaOdds: 9.80,
      },
      {
        id: 'Celtic',
        name: 'Celtic',
        logo: '/img/teams/celtic-fc-football.svg',
        homeTeamAsiaOdds: 1.30,
      }
    ],
    [
      {
        id: 'Saint Mirren',
        name: 'Saint Mirren',
        logo: '/img/teams/saint-mirren-football.png',
        homeTeamAsiaOdds: 4.90,
      },
      {
        id: 'Rangers',
        name: 'Rangers',
        logo: '/img/teams/glasgow-rangers-football.svg',
        homeTeamAsiaOdds: 1.64,
      }
    ]
  ];

  // Main
  const [todayMatches, setTodayMatches] = useState<Match[]>([]);
  const [tomorrowMatches, setTomorrowMatches] = useState<Match[]>([]);
  const [mainTournaments, setMainTournaments] = useState<Tournament[]>([]);
  // Side
  const [mainMatches, setMainMatches] = useState<Match[]>([]);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setIsLoading(true);
        const timezoneOffset = new Date().getTimezoneOffset() * -1;
        console.log("Fetching matches with timezoneOffset...", timezoneOffset);

        // Use the updated functions with dependencies
        const [todayMatches, tomorrowMatches, liveMatches, mainMatches, mainTournaments] = await Promise.all([
          getTodayMatches(timezoneOffset, MAX_MATCHES),
          getTomorrowMatches(timezoneOffset, MAX_MATCHES),
          getLiveMatches(MAX_MATCHES), // Live matches do not require timezone offset. Always return all matches ongoing currently.
          getMainMatches(timezoneOffset, MAX_MATCHES),
          getMainTournaments(timezoneOffset, MAX_MATCHES)
        ]);

        // Set the state with the transformed data
        setTodayMatches(todayMatches);
        setTomorrowMatches(tomorrowMatches);
        setLiveMatches(liveMatches);
        setMainMatches(mainMatches);
        setMainTournaments(mainTournaments);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <>
      <Header />

      <Spacer space={55} />
      <section className="container">
        {/* <SubscriptionBanner /> */}
        <h1 className={style.heading}>{t('home.headerTitle')}</h1>
        <div className="contentWrapper">
          <div className="mainContent">
            {newsItems && (
              <MainNews title={t('home.sportsNewsTitle')} newsItems={newsItems} />)}
            <Spacer space={20} />
            {todayMatches && (
              <MainMatchesList
                title={t('home.liveMatchesTitle')}
                matches={todayMatches}
                isLoading={isLoading}
                selectedOddsType={selectedOddsType}
              />
            )}
            <Spacer space={20} />
            {tomorrowMatches && (
              <MainMatchesList
                title={t('home.tomorrowMatchesTitle')}
                matches={tomorrowMatches}
                isLoading={isLoading}
                selectedOddsType={selectedOddsType}
              />
            )}
            <Spacer space={20} />
            {mainTournaments && (
              <MainTournamentsList
                showGameTypeIcon={true}
                title={t('home.mainTournamentsTitle')}
                tournaments={mainTournaments} isLoading={isLoading}
                eventState="UPCOMING" />)}
          </div>
          <div className="sideContent">
            <PromoCodeBlock
              bookmakerLogo="/img/stake-white.svg"
              promoCode="888sports"
              promoText={t('home.promoText')}
              teams={homepagePromoTeamsData}
              selectedOddsType={selectedOddsType}
            />
            <Spacer space={20} />
            {liveMatches && (<SideMatchesList title={t('home.liveMatchesTitle')} matches={liveMatches} selectedOddsType={selectedOddsType} />)}
            <Spacer space={20} />
            {mainMatches && (<SideMatchesList title={t('home.mainMatchesTitle')} matches={mainMatches} selectedOddsType={selectedOddsType} />)}
          </div>
        </div>
      </section>
      <Footer />
      <Spacer space={60} />
      <BottomAds />
      <ChatBubble />
    </>
  )
};

export default Home;
