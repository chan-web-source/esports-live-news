import Header from "@/components/Header"
import Spacer from "@/components/Spacer"
import BottomAds from "@/components/BottomAds"
import Footer from "@/components/Footer"
import Breadcrumb from "@/components/Breadcrumb"
import style from "./style.module.css"
import { useEffect, useState } from "react"
import ScheduleAndScoreList from "@/components/ScheduleAndScoreList"
import ClubDetail from "./ClubDetails"

import TeamHeader from './TeamHeader'
import { useParams } from "react-router-dom";
import {
  getTeamRanking, getTeamStats,
  getTeamScheduleMatch, getParticipateMatch, getUpcomingParticipateMatch, getAchieveMatch, getFinishMatch,
} from "@/service/dataService"
import ParticipateMatchList from "./ParticipateMatchList"
import PromoCodeBlock from "@/components/PromoCodeBlock"
import { useNavigationContext } from "@/context/NavigationContext"
import { oddsStore } from "@/store/oddsStore"
import ChatBubble from "@/components/ChatBubble"
import { useTranslation } from "react-i18next"
import ListRanking from "@/components/ListRanking"


const TeamDetail: React.FC = () => {
  const { t } = useTranslation();
  const { currentGame, currentGameName } = useNavigationContext();
  const { teamId } = useParams() || "";
  const [isLoading, setIsLoading] = useState(true);

  const [teamStats, setTeamStats] = useState<TeamStats>();
  const [upcomingMatch, setUpcomingMatch] = useState<Tournament[]>([]);
  const [finishedMatch, setFinishedMatch] = useState<Tournament[]>([]);
  const [participateMatch, setParticipateMatch] = useState<Tournament[]>([]);
  const [upcomingParticipateMatch, setUpcomingParticipateMatch] = useState<Tournament[]>([]);
  const [achievementMatch, setAchievementMatch] = useState<Tournament[]>([]);
  const [winRate, setWinRate] = useState<number>();
  const [winRateLast30d, setWinRateLast30d] = useState<number>();
  const [teamRanking, setTeamRanking] = useState<Team[]>([]);
  const [selectedOddsType, setSelectedOddsType] = useState(oddsStore.getSelectedOddsType());

  const winRateCount = (wins?: number, match?: number): number | undefined => {
    return Math.round(((wins ?? 0) / (match ?? 0)) * 100);
  }

  useEffect(() => {
    const unsubscribe = oddsStore.subscribe(() => {
      setSelectedOddsType(oddsStore.getSelectedOddsType());
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // try with dummy url: http://localhost:5173/football/teams/p4jwq2ghd57m0ve
    const fetchMatch = async () => {
      try {
        setIsLoading(true);
        const timezoneOffset = new Date().getTimezoneOffset() * -1;
        console.log("Fetching TeamDetail with timezoneOffset...", timezoneOffset, teamId);

        const [teamStats, upcomingMatch, participateMatch,
          upcomingParticipateMatch, achieveMatch, finishMatch

        ] = await Promise.all([
          getTeamStats(teamId || "", timezoneOffset),

          getTeamScheduleMatch(teamId || "", timezoneOffset),
          getParticipateMatch(teamId || "", timezoneOffset),
          getUpcomingParticipateMatch(teamId || "", timezoneOffset),
          getAchieveMatch(teamId || "", timezoneOffset),
          getFinishMatch(teamId || "", timezoneOffset),
        ]);
        setWinRate(winRateCount(teamStats?.stats?.totalWins, teamStats?.stats?.totalMatches))
        setWinRateLast30d(winRateCount(teamStats?.stats?.totalWinsInLast30Days, teamStats?.stats?.totalMatchesInLast30Days))
        setTeamStats(teamStats);

        const countryId = teamStats?.team?.country?.id || "";
        const teamRanking = (currentGame && countryId) && await getTeamRanking(currentGame, countryId);
        setTeamRanking(teamRanking || []);

        // TODO: UPCOMING matches with real API
        setUpcomingMatch(upcomingMatch);
        setParticipateMatch(participateMatch);
        setUpcomingParticipateMatch(upcomingParticipateMatch);
        setAchievementMatch(achieveMatch);
        setFinishedMatch(finishMatch)

      } catch (error) {
        console.error('Error fetching TeamDetail:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentGame) {
      fetchMatch();
    }
  }, [currentGame]);

  return (
    <>
      <Header />
      <Spacer space={55} />
      <section className="container">
        <Breadcrumb items={[
          { label: t('common.home'), url: '/' },
          { label: currentGameName || '', url: `/${currentGame}/teams` },
          { label: teamStats?.team?.country?.name ?? "", url: `/${currentGame}/teams/${teamStats?.team?.country?.id ?? "all"}` },
          { label: teamStats?.team?.name ?? "" },
        ]} />
        <h1 className={style.title}>{`${teamStats?.team.name} - ${t('matches.matchesToday')}`}</h1>
        <div className="contentWrapper">
          <div className="mainContent">
            <TeamHeader teamStats={teamStats}
              winRate={winRate} winRateLast30d={winRateLast30d}
            />
            <Spacer space={20} />

            {upcomingMatch && (
              <>
                <ScheduleAndScoreList title={t('teamDetail.recentMatchListTitle')} isLoading={isLoading} match={upcomingMatch} selectedOddsType={selectedOddsType} />
                <Spacer space={20} />
              </>)}

            <ClubDetail teamStats={teamStats} title={t('teamDetail.teamDetailTitle')} match={finishedMatch} winRate={winRate} />
            <Spacer space={20} />

            {participateMatch && (
              <>
                <ParticipateMatchList title={t('teamDetail.participateMatchTitle')} isLoading={isLoading} matches={participateMatch} />
                <Spacer space={20} />
              </>
            )}

            {upcomingParticipateMatch && (
              <>
                <ParticipateMatchList title={t('teamDetail.upcomingParticipateMatchTitle')} isLoading={isLoading} matches={upcomingParticipateMatch} />
                <Spacer space={20} />
              </>
            )}

            {achievementMatch && (
              <>
                <ParticipateMatchList title={t('teamDetail.achievementMatchTitle')} isLoading={isLoading} matches={achievementMatch} />
                <Spacer space={20} />
              </>
            )}

            {upcomingMatch && (
              <>
                <ScheduleAndScoreList title={t('teamDetail.scoreMatchTitle')} isLoading={isLoading} match={upcomingMatch} stats={teamStats?.stats} isScore={true} selectedOddsType={selectedOddsType} />
                <Spacer space={20} />
              </>
            )}

          </div>
          <div className="sideContent">
            <ListRanking
              title={currentGame === 'football' ? t('teamDetail.sportTeamRankingTitle') : t('teamDetail.teamRankingTitle')}
              list={teamRanking} currentGame={currentGame || ""} listType="team" />
            <Spacer space={20} />
            <PromoCodeBlock
              bookmakerLogo="/img/stake-white.svg"
              promoCode="888sports"
              promoText={t('common.promoText')}
            />
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

export default TeamDetail
