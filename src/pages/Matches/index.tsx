import Header from "@/components/Header"
import Spacer from "@/components/Spacer"
import BottomAds from "@/components/BottomAds"
import Footer from "@/components/Footer"
import Breadcrumb from "@/components/Breadcrumb"
import style from "./style.module.css"
import MatchCalendar from "./MatchCalendar"
import PromoCodeBlock from "@/components/PromoCodeBlock"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { format, isToday } from "date-fns"
import TournamentMatchesList, { TournamentGroup } from "./TournamentMatchesList"
import { getMatches, getTeamRanking } from "@/service/dataService"
import ListRanking from "@/components/ListRanking"
import SideNews from "@/components/SideNews"
import { useNavigationContext } from "@/context/NavigationContext"
import ChatBubble from "@/components/ChatBubble"

const Matches: React.FC = () => {
  const { currentGame, currentGameName, currentSectionName } = useNavigationContext();
  const { t } = useTranslation();
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
  const [matches, setMatches] = useState<Match[]>([]);
  const [teamRanking, setTeamRanking] = useState<Team[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setIsLoading(true);
        const timezoneOffset = new Date().getTimezoneOffset() * -1;
        // Format the selected date to YYYYMMDD
        const formattedDate = format(selectedDate, 'yyyyMMdd');
        console.log(`Fetching matches for ${formattedDate} with timezoneOffset ${timezoneOffset}`);

        const [matches, teamRanking] = await Promise.all([
          getMatches(formattedDate, timezoneOffset, currentGame),
          currentGame && getTeamRanking(currentGame)
        ]);
        setTeamRanking(teamRanking || []);
        setMatches(matches);

      } catch (error) {
        console.error('Error fetching matches:', error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    }

    if (currentGame) {
      fetchMatches();
    }
  }, [selectedDate, currentGame]);

  const handleDateSelected = (date: Date) => {
    setSelectedDate(date);
  }

  const getTitle = () => {
    if (isToday(selectedDate)) {
      return `${t('matches.matchesToday')} ${currentGameName}`
    }
    return `${t('matches.matchesFor')} ${format(selectedDate, 'dd.MM.yyyy')} ${currentGameName}`
  }

  const getLiveMatchCount = (matches: Match[]) => {
    const now = new Date();
    return matches.filter(match => {
      const matchStartTime = new Date(match.startTime * 1000);
      return isToday(matchStartTime) && matchStartTime <= now;
    }).length;
  };


  const groupMatchesByTournament = (matches: Match[]): TournamentGroup[] => {
    // Create a map to group matches by tournament ID
    const tournamentMap = new Map<string, TournamentGroup>();

    matches.forEach(match => {
      if (!match.tournament) return; // Skip matches without tournament info

      const tournamentId = match.tournament.id;
      if (!tournamentMap.has(tournamentId)) {
        tournamentMap.set(tournamentId, {
          id: tournamentId,
          name: match.tournament.name || '',
          flag: match.tournament.country?.logo || '',
          matches: []
        });
      }

      const group = tournamentMap.get(tournamentId)!;
      group.matches.push(match);
    });

    // Convert map to array and sort by earliest match time in each tournament
    return Array.from(tournamentMap.values())
      .sort((a, b) => {
        const aEarliestMatch = a.matches.reduce((earliest, match) =>
          !earliest || match.startTime < earliest.startTime ? match : earliest
          , a.matches[0]);

        const bEarliestMatch = b.matches.reduce((earliest, match) =>
          !earliest || match.startTime < earliest.startTime ? match : earliest
          , b.matches[0]);

        return aEarliestMatch.startTime - bEarliestMatch.startTime;
      });
  };

  return (
    <>
      <Header />
      <Spacer space={55} />
      <section className="container">
        <Breadcrumb items={[
          { label: t('common.home'), url: '/' },
          { label: currentGameName, url: `/${currentGame}/matches` },
          { label: currentSectionName },
        ]} />
        <h1 className={style.title}>{getTitle()}</h1>
        <div className="contentWrapper">
          <div className="mainContent">
            <MatchCalendar selectedDate={new Date()}
              onDaySelected={(day) => handleDateSelected(day.fullDate)}
              liveCount={getLiveMatchCount(matches)} />
            <Spacer space={20} />
            <TournamentMatchesList tournaments={groupMatchesByTournament(matches)}
              isLoading={isLoading}
            />
          </div>
          <div className="sideContent">
            <PromoCodeBlock
              bookmakerLogo="/img/stake-white.svg"
              promoCode="888sports"
              promoText={t('matches.promoTextTitle')}
            />
            <Spacer space={20} />
            <ListRanking
              title={currentGame === 'football' ? t('matches.sportsTeamRanking') : t('matches.teamRanking')}
              list={teamRanking} currentGame={currentGame || ""} listType="team" />
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

export default Matches
