import React from 'react';
import Header from "@/components/Header"
import Spacer from "@/components/Spacer"
import BottomAds from "@/components/BottomAds"
import Footer from "@/components/Footer"
import Breadcrumb from "@/components/Breadcrumb"
import style from "./style.module.css"
import MatchEvents from "../../components/MatchEvents"
import PromoCodeBlock from "@/components/PromoCodeBlock"
import { useEffect, useState, useCallback } from "react"
import BookesOffer from "../../components/BookiesOffer/index"
import SideNews from "@/components/SideNews"
import MainTournamentsList from "@/components/MainTournamentsList"
import { getOngoingTournaments, getUpcomingTournaments, getFinishedTournaments, getCurrentYearTournaments } from "@/service/dataService"
import { useNavigationContext } from "@/context/NavigationContext"
import { useParams } from "react-router-dom"
import { oddsStore } from '@/store/oddsStore';
import ChatBubble from '@/components/ChatBubble';
import { useTranslation } from "react-i18next"

const MAX_TOURNAMENTS = 100;

const Tournaments: React.FC = () => {
  const { t } = useTranslation();

  const promoCodeData: [Team, Team][] = [
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
      date: 'Today',
      time: '18:21',
    },
    {
      id: "2",
      title: 'Champions League Semi-Final Preview: Tactical Breakdown',
      date: 'Today',
      time: '22:53',
    },
    {
      id: "3",
      title: 'Rising Star Alert: Young Talents Shaping Modern Football',
      date: 'Today',
      time: '22:41',
    },
    {
      id: "4",
      title: 'Transfer Rumors: Top Clubs Eyeing Midfield Maestros',
      date: 'Yesterday',
      time: '22:22',
    },
    {
      id: "5",
      title: 'Historic Rivalries: Classic Matches That Defined Football',
      date: 'Yesterday',
      time: '22:20',
    }
  ];

  const { currentGame, currentGameName, currentSectionName } = useNavigationContext();
  const [tournamentData, setTournamentData] = useState<Tournament[]>([]);
  const [filterTournamentData, setFilterTournamentData] = useState<Tournament[]>([]);
  const [selectedEventState, setSelectedEventState] = useState<EventState>("ONGOING");
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true); //this is for initial country id
  const { countryId } = useParams();
  const [selectedOddsType, setSelectedOddsType] = useState(oddsStore.getSelectedOddsType());

  useEffect(() => {
    const unsubscribe = oddsStore.subscribe(() => {
      setSelectedOddsType(oddsStore.getSelectedOddsType());
    });
    return () => unsubscribe();
  }, []);
  const handleEventSelect = useCallback(async (event?: EventState, selectedCountryId?: string) => {
    try {
      setIsLoading(true);
      setSelectedEventState(event ?? selectedEventState);
      const timezoneOffset = new Date().getTimezoneOffset() * -1;
      let data: Tournament[] = [];
      switch (event) {
        case "ONGOING":
          data = await getOngoingTournaments(timezoneOffset, MAX_TOURNAMENTS, currentGame, selectedCountryId);
          break;
        case "UPCOMING":
          data = await getUpcomingTournaments(timezoneOffset, MAX_TOURNAMENTS, currentGame, selectedCountryId);
          break;
        case "FINISHED":
          data = await getFinishedTournaments(timezoneOffset, MAX_TOURNAMENTS, currentGame, selectedCountryId);
          break;
        case "CURRENT-YEAR":
          data = await getCurrentYearTournaments(timezoneOffset, currentGame);
          break;
      }

      setTournamentData(data);
      // [back] if is initial onload, set logic
      if (isInitialLoad && (countryId && countryId !== "all")) {
        handleInitialCountrySelect(data);
      } else {
        setFilterTournamentData(data);
      }
      getTournamentUniqueCountries(data);
    } catch (error) {
      console.error("Error while selecting event:", error);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, [currentGame, selectedEventState, isInitialLoad, countryId]);

  useEffect(() => {
    const initializeData = async () => {
      if (currentGame) {
        await handleEventSelect(selectedEventState);
      }
    };
    initializeData();
  }, [currentGame]);

  const handleInitialCountrySelect = (data: Tournament[]) => {
    const newFilterTournamentData =
      data?.filter(t => t.country?.id == countryId)
    setFilterTournamentData(newFilterTournamentData);
  }

  const handleCountrySelect = (country: Country | undefined) => {
    if (country) {
      const newFilterTournamentData =
        tournamentData.filter(t => t.country?.name == country.name)
      setFilterTournamentData(newFilterTournamentData)
    } else {
      // use unfiltered data
      setFilterTournamentData(tournamentData);
    }
  };

  const getTournamentUniqueCountries = (tournaments: Tournament[]) => {
    const tournamentCountries = tournaments
      .map(tournament => ({
        id: tournament.country?.id ?? "",
        name: tournament.country?.name ?? "",
        logo: tournament.country?.logo ?? ""
      }));

    const uniqueCountries = Array.from(
      new Map(
        tournamentCountries
          .filter(c => c.name.trim() !== "") // Remove empty names
          .map(c => [c.name, c])             // Use name as key for uniqueness
      ).values()
    );

    setCountries(uniqueCountries);
  }

  const getTitle = () => {
    switch (selectedEventState) {
      case "ONGOING":
        return `${t('matchEvents.ONGOING')} ${currentGameName} ${t('header.tournaments')}`;
      case "UPCOMING":
        return `${t('matchEvents.UPCOMING')} ${currentGameName} ${t('header.tournaments')}`;
      case "FINISHED":
        return `${t('matchEvents.FINISHED')} ${currentGameName} ${t('header.tournaments')}`;
      case "CURRENT-YEAR":
      default:
        return `${currentGameName} ${t('header.tournaments')} ${new Date().getFullYear()}`;
    }
  }

  return (
    <>
      <Header />
      <Spacer space={55} />
      <section className="container">
        <Breadcrumb items={[
          { label: t('common.home'), url: '/' },
          { label: currentGameName, url: `/${currentGame}/matches` },
          { label: currentSectionName }
        ]} />
        <h1 className={style.title}>{getTitle()}</h1>
        <div className="contentWrapper">
          <div className="mainContent">
            <MatchEvents
              isLoading={isLoading}
              currentEventState={selectedEventState}
              onEventStateSelected={(event, countryStateId) => handleEventSelect(event, countryStateId)}
              countries={countries}
              onCountrySelected={handleCountrySelect}
              isInitialLoad={isInitialLoad}
            />
            <Spacer space={20} />
            <MainTournamentsList
              isLoading={isLoading}
              showGameTypeIcon={false}
              tournaments={filterTournamentData}
              eventState={selectedEventState}
            />
          </div>
          <div className="sideContent">
            <PromoCodeBlock
              bookmakerLogo="/img/stake-white.svg"
              promoCode="For New Users"
              promoText={t('common.promoText')}
              teams={promoCodeData}
              selectedOddsType={selectedOddsType}
            />
            <Spacer space={20} />
            <BookesOffer
              title={t('common.promoText')}
              bookies={bookiesCompanyData} />
            <Spacer space={20} />
            <SideNews title={t('tournaments.articleNewsTitle')} news={newsItems} />
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

export default Tournaments