import Header from "@/components/Header"
import Spacer from "@/components/Spacer"
import BottomAds from "@/components/BottomAds"
import Footer from "@/components/Footer"
import Breadcrumb from "@/components/Breadcrumb"
import style from "./style.module.css"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import SideNews from "@/components/SideNews"
import { useNavigationContext } from "@/context/NavigationContext"
import { useParams } from "react-router-dom"
import MainArticle from "./MainArticle"
import PromoCodeBlock from "@/components/PromoCodeBlock"
import Arthor from './Arthor';
import ChatBubble from "@/components/ChatBubble"

const NewsArticle: React.FC = () => {
  const { articleId } = useParams();
  const { currentGame } = useNavigationContext();
  const { t } = useTranslation();

  const [matchStats, setMatchStats] = useState<Match>();
  const [article, setArticle] = useState<Article>();

  const mockMatchStats: Match = {
    "id": "23xmvkh63j6wqg8",
    "startTime": 1749052800,
    "endTime": 1749060911,
    "statusId": 8,
    "homeTeam": {
      "id": "zp5rzghj17nq82w",
      "name": "KACM Marrakech",
      "logo": "https://img.thesports.com/football/team/e6d014b447c5ebded36c1976fd866cb4.png",
      "score": 5
    },
    "awayTeam": {
      "id": "y0or5jh4x6zqwzv",
      "name": "UTS Union Touarga Sport Rabat",
      "logo": "https://img.thesports.com/football/team/01d255de45c5cd372b12b94025e7b770.png",
      "score": 8
    },
    "tournament": {
      "id": "l965mkyhy2zr1ge",
      "name": "Morocco Excellence Cup",
      "logo": "https://img.thesports.com/football/competition/a246adff7c5ed3ec18be24a06b55b928.png",
      "type": 2,
      "startTime": 1725468600,
      "endTime": 1749060000,
      "country": {
        "id": "z8yomo4h2wq0j6l",
        "name": "Morocco",
        "logo": "https://img.thesports.com/football/country/4adc9885531c6167c47d16260d2e9fc4.png"
      },
      "currentSeason": "2024-2025",
      "currentSeasonId": "9vjxm8ghnkyr6od",
      "currentStage": "1/8 Final",
      "currentStageId": "vjxm8gh77n9r6od",
      "currentRound": 0,
      "roundCount": 0,
      "division": "premier"
    }
  }
  const mockWesternMatches: Match = {
    "id": "w3xmvkh63j6wqg9",
    "startTime": 1749052800,
    "endTime": 1749060911,
    "statusId": 8,
    "homeTeam": {
      "id": "wp5rzghj17nq82x",
      "name": "Raja Casablanca",
      "logo": "https://img.thesports.com/football/team/e6d014b447c5ebded36c1976fd866cb4.png",
      "score": 3
    },
    "awayTeam": {
      "id": "w0or5jh4x6zqwzw",
      "name": "Wydad Athletic Club",
      "logo": "https://img.thesports.com/football/team/01d255de45c5cd372b12b94025e7b770.png",
      "score": 2
    },
    "tournament": {
      "id": "w965mkyhy2zr1gf",
      "name": "Moroccan Pro League",
      "logo": "https://img.thesports.com/football/competition/a246adff7c5ed3ec18be24a06b55b928.png",
      "type": 2,
      "startTime": 1725468600,
      "endTime": 1749060000,
      "country": {
        "id": "w8yomo4h2wq0j6m",
        "name": "Morocco",
        "logo": "https://img.thesports.com/football/country/4adc9885531c6167c47d16260d2e9fc4.png"
      },
      "currentSeason": "2024-2025",
      "currentSeasonId": "wvjxm8ghnkyr6oe",
      "currentStage": "Round of 16",
      "currentStageId": "wjxm8gh77n9r6oe",
      "currentRound": 0,
      "roundCount": 0,
      "division": "premier"
    }
  }
  const mockArticle: Article = {
    "id": "54321",
    "title": "Tips for New Users",
    "author": "Moderator1",
    "created_at": 1717939200,
    "board": "guides",
    "image": "https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Zm9vdGJhbGx8ZW58MHx8MHx8fDA%3D",
    "section": [
      { name: 'content', value: "The Oklahoma City Thunder are heading back to the NBA Finals for the first time since 2012, dismantling the Minnesota Timberwolves in just five games to clinch the Western Conference crown. With Indiana holding a 3–1 edge over New York, OKC now awaits its Eastern Conference opponent." },
      { name: 'title', value: "Conference Finals Matchups:" },
      { name: 'content', value: "The 2025 NBA Playoffs have delivered drama, dominance, and a fierce battle for supremacy — and now, we're down to four. The Oklahoma City Thunder have officially eliminated the reigning champions, the Denver Nuggets, with a resounding 125-93 victory in Game 7, clinching a spot in the Western Conference Finals." },
      { name: 'match', value: matchStats },
      { name: 'title', value: "Thunder Path to Victory in the Finals" },
      { name: 'content', value: "This was a Thunder clinic in playoff pressure. The Timberwolves, who had cruised past the Lakers and Warriors earlier in the playoffs, were throttled into irrelevance, trailing by as much as 39 points. Their shooting woes—just 41.2% from the field and 35.3% from three—were the result of a swarming OKC defense led by the league's best regular-season rating (106.6), which has only tightened to 105.7 during the playoffs." },
      { name: 'bulletPoints', value: ["West: Oklahoma City Thunder vs. Minnesota Timberwolves", "East: New York Knicks vs. Indiana Pacers"] },
      { name: 'match', value: mockWesternMatches },
    ],
    author_description: "Moderator1 is a total esports geek and our main gaming industry coverage specialist. He's been into semi-pro Counter Strike scene since 2013 casting some semi-pro games at local Polish scene. Patryk is absolutely fond of modern gaming scene and follows all possible events in the DOTA 2, Valorant, CS2 and LoL. Beyond the cybersports scene his supporter of BC Real Madrid and a Sunday Basketball League player himself, specializing in the 3-pointers since he was a junior.",
  }

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



  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Update with api
        setMatchStats(mockMatchStats);
        setArticle(mockArticle);
      } catch (error) {
        console.error('Error fetching match data:', error);
      }
    };

    if (articleId) {
      fetchData();
    }
  }, [currentGame, articleId]);

  return (
    <>
      <Header />
      <Spacer space={55} />
      <section className="container">
        <Breadcrumb items={[
          { label: t('common.home'), url: '/' },
          { label: t('news.title'), url: `/${currentGame}/news` },
          { label: article?.title || '' },
        ]} />
        <h1 className={style.title}>{article?.title}</h1>
        <div className="contentWrapper">
          <div className="mainContent">
            <MainArticle article={article} />
            <Spacer space={20} />
            <Arthor arthor={article?.author} description={article?.author_description} />
          </div>
          <div className="sideContent">
            <PromoCodeBlock
              bookmakerLogo="/img/stake-white.svg"
              promoCode="888sports"
            />
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

export default NewsArticle;
