import Header from "@/components/Header"
import Spacer from "@/components/Spacer"
import BottomAds from "@/components/BottomAds"
import Footer from "@/components/Footer"
import Breadcrumb from "@/components/Breadcrumb"
import style from "./style.module.css"
import MatchEvents from "../../components/MatchEvents"
import PromoCodeBlock from "@/components/PromoCodeBlock"
import { useEffect, useState } from "react"
import BookesOffer from "../../components/BookiesOffer/index"
import TeamRankList from "./TeamRankList"
import { useNavigationContext } from "@/context/NavigationContext"
import { getTeamRanking } from "@/service/dataService"
import { useParams } from "react-router-dom"
import { oddsStore } from "@/store/oddsStore"
import ChatBubble from "@/components/ChatBubble"
import { useTranslation } from "react-i18next"

const Teams: React.FC = () => {
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

  const { currentGame, currentGameName } = useNavigationContext();
  const { countryId } = useParams();
  const [teamsData, setTeamsData] = useState<Team[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);  //all available countries
  // const [topCountry, setTopCountry] = useState<Country[]>([]);  //top 6 countries on header
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [selectedCountry, setSelectedCountry] = useState<Country>(); //current selected country
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedOddsType, setSelectedOddsType] = useState(oddsStore.getSelectedOddsType());

  useEffect(() => {
    const unsubscribe = oddsStore.subscribe(() => {
      setSelectedOddsType(oddsStore.getSelectedOddsType());
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!currentGame) {
        setIsLoading(false);
        setIsInitialLoad(false);
        return;
      }

      setIsLoading(true);
      try {
        if (countryId && countryId !== "all") {
          await handleCountrySelect({ id: countryId });
        } else {
          const teamRankings: Team[] = await getTeamRanking(currentGame, "");
          setTeamsData(teamRankings);
          handleCountryOptions(teamRankings);
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };

    if (currentGame) {
      fetchMatches();
    }

  }, [currentGame]);

  const getTitle = () => {
    if (selectedCountry) {
      return `${selectedCountry?.name} ${currentGameName} ${t('teams.ranking')}`
    }
    return `${currentGameName} ${t('teams.teamsRanking')}`
  }

  const handleCountryOptions = (teams: Team[]) => {
    const countries = teams
      .map(d => ({
        id: d.country?.id ?? "",
        name: d.country?.name ?? "",
        logo: d.country?.logo ?? ""
      }));

    const uniqueCountry = Array.from(
      new Map(
        countries
          .filter(c => c.name.trim() !== "") // Remove empty names
          .map(c => [c.name, c])             // Use name as key for uniqueness
      ).values()
    );

    setCountries(uniqueCountry);
  }

  const handleCountrySelect = async (country: Country | undefined) => {
    try {
      setIsLoading(true);
      const countryId = country?.id ?? "";
      const teamRankings: Team[] = currentGame ? await getTeamRanking(currentGame, countryId) : [];
      // Batch state updates together
      setTeamsData(teamRankings);
      setSelectedCountry(countryId ? country : undefined);
      handleCountryOptions(teamRankings);
    } catch (error) {
      console.error(error, '==error')
    } finally {
      setIsLoading(false);
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
          { label: selectedCountry?.name ?? t('breadCrumb.teams') },
        ]} />
        <h1 className={style.title}>{getTitle()}</h1>
        <div className="contentWrapper">
          <div className="mainContent">
            <MatchEvents
              emptyEventState={true}
              isLoading={isLoading}
              countries={countries}
              // only clear country
              onEventStateSelected={() => handleCountrySelect(undefined)}
              onCountrySelected={handleCountrySelect}
              isInitialLoad={isInitialLoad}
            />
            <Spacer space={20} />
            <TeamRankList
              title={getTitle()}
              isLoading={isLoading}
              showGameTypeIcon={false}
              teams={teamsData}
              gameType={currentGame}
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

export default Teams
