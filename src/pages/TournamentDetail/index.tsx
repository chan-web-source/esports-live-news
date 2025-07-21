import Header from "@/components/Header"
import Spacer from "@/components/Spacer"
import BottomAds from "@/components/BottomAds"
import Footer from "@/components/Footer"
import Breadcrumb from "@/components/Breadcrumb"
import style from "./style.module.css"
import { useEffect, useState } from "react"
import ScheduleAndScoreList from "@/components/ScheduleAndScoreList"

import TournamentHeader from './TournamentHeader'
import { useParams } from "react-router-dom";
import {
  getTournamentInfo, getTournamentTable, getUpcomingTournamentMatch, getFinishedTournamentMatch, getMajorOngoingTournaments
} from "@/service/dataService"
import PromoCodeBlock from "@/components/PromoCodeBlock"
import ListRanking from "@/components/ListRanking"
import { useNavigationContext } from "@/context/NavigationContext"
import { oddsStore } from "@/store/oddsStore"
import { useTranslation } from "react-i18next"
import TournamentStandingScore from "@/components/TournamentStanding"

const TeamDetail: React.FC = () => {
  const { t } = useTranslation();
  const { currentGame, currentGameName } = useNavigationContext();
  const { tournamentId } = useParams() || "";
  const [isLoading, setIsLoading] = useState(true);

  const [tournamentStats, setTournamentStats] = useState<TournamentStats>();
  const [upcomingMatch, setUpcomingMatch] = useState<Tournament[]>([]);
  const [finishedMatch, setFinishedMatch] = useState<Tournament[]>([]);
  const [teamCount, setTeamCount] = useState<number>(0);

  const [tournamentStanding, setTournamentStanding] = useState<TournamentStanding>();
  const [eventRanking, setEventRanking] = useState<Team[]>([]);
  const [selectedOddsType, setSelectedOddsType] = useState(oddsStore.getSelectedOddsType());

  useEffect(() => {
    const unsubscribe = oddsStore.subscribe(() => {
      setSelectedOddsType(oddsStore.getSelectedOddsType());
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {

    const fetchMatch = async () => {
      try {
        setIsLoading(true);

        const [tournamentInfo, upcomingMatch, finishedMatch, majorOngoingEvent, tournamentTable] = await Promise.all([
          getTournamentInfo(tournamentId || ""),
          getUpcomingTournamentMatch(tournamentId || ""),
          getFinishedTournamentMatch(tournamentId || ""),
          getMajorOngoingTournaments(currentGame || ""),
          getTournamentTable(tournamentId || ""),
        ]);

        const totalTeamCount = tournamentTable?.tables?.reduce((count, table) => count + (table.rows?.length || 0), 0) || 0;
        setTeamCount(totalTeamCount);
        setTournamentStats(tournamentInfo);
        setUpcomingMatch(upcomingMatch);
        setFinishedMatch(finishedMatch);
        setTournamentStanding(tournamentTable);

        setEventRanking(majorOngoingEvent);

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
          { label: currentGameName || '', url: `/${currentGame}/matches` },
          { label: tournamentStats?.country?.name ?? "Country", url: `/${currentGame}/tournaments/${tournamentStats?.country?.id ?? "all"}` },
          { label: tournamentStats?.name ?? "" },
        ]} />
        <h1 className={style.title}>{tournamentStats?.name}</h1>
        <div className="contentWrapper">
          <div className="mainContent">
            {tournamentStats && <TournamentHeader tournamentStats={tournamentStats} teamCount={teamCount} />}
            <Spacer space={20} />

            {upcomingMatch && (
              <>
                <ScheduleAndScoreList title={t('mainTournamentsList.upcomingMatchListTitle')} isLoading={isLoading} match={upcomingMatch} selectedOddsType={selectedOddsType} />
                <Spacer space={20} />
              </>)}

            {finishedMatch && (
              <>
                <ScheduleAndScoreList title={t('mainTournamentsList.finishedMatchListTitle')} isLoading={isLoading} match={finishedMatch} selectedOddsType={selectedOddsType} />
                <Spacer space={20} />
              </>)}

            {tournamentStanding && (
              <>
                <TournamentStandingScore title={t('matchDetail.tournamentStandingTitle')} tournamentStanding={tournamentStanding}
                  currentStageSubTitle={`${tournamentStats?.currentStage} ${tournamentStats?.currentSeason}`} />
                <Spacer space={20} />
              </>)}

          </div>
          <div className="sideContent">
            <ListRanking
              title={t('matches.majorOngoingEvent')} list={eventRanking}
              currentGame={currentGame || ""} listType="tournament" />
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
    </>
  )
}

export default TeamDetail
