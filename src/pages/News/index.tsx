import Header from "@/components/Header"
import Spacer from "@/components/Spacer"
import BottomAds from "@/components/BottomAds"
import Footer from "@/components/Footer"
import Breadcrumb from "@/components/Breadcrumb"
import style from "./style.module.css"
import NewsTypes from './NewsTypes'
import PromoCodeBlock from "@/components/PromoCodeBlock"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { format } from "date-fns"
import NewsList from "./NewsList"
import { useNavigationContext } from "@/context/NavigationContext"
import ChatBubble from "@/components/ChatBubble"

const News: React.FC = () => {
  const { currentGame, currentGameName } = useNavigationContext();
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventState, setEventState] = useState<NewsState>("NEWS");
  const [isLoading, setIsLoading] = useState(false);
  const [groupedNewsList, setGroupedNewsList] = useState<DateGroupNewsItem[]>([]);

  const newsItems: NewsItem[] = [
    {
      id: "1",
      title: 'Weekend Football Predictions Digest (26-27.04)',
      image: '/img/news/1200х900-25.webp',
      date: 'Yesterday',
      time: 1755769000
    },
    {
      id: "2",
      title: 'Barcelona vs Real Madrid Prediction: 26.04.2025 Copa Del Rey Final Preview',
      image: '/img/news/Barcelona-25.webp',
      date: 'Yesterday',
      time: 1755769000
    },
    {
      id: "3",
      title: 'Yokohama F Marinos vs Al Nassr Prediction: 26.04.2025 AFC Champions League Elite Preview',
      image: '/img/news/Yokohama-F-Marinos-25.webp',
      date: 'Yesterday',
      time: 1748995200
    },
    {
      id: "4",
      title: 'Al Ahli SC vs Buriram Prediction: 26.04.2025 AFC Champions League Elite Quarterfinals Preview',
      image: '/img/news/Al-Ahli-SC-25.webp',
      date: 'Yesterday',
      time: 1755769000
    },
    {
      id: "5",
      title: 'Varazdin vs Lokomotiva Zagreb Prediction: 26.04.2025 1. HNL Preview',
      image: '/img/news/Varazdin-26.webp',
      date: 'Yesterday',
      time: 1755769000
    }
  ];

  const formatDate = (timestamp: number): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };


  const groupNewsByDate = (items: NewsItem[]) => {
    const grouped: Record<string, NewsItem[]> = {};

    items.forEach(item => {
      const dateKey = formatDate(item.time ? Number(item.time) : 0);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(item);
    });

    // Transform the record into an array of DateGroupNewsItem
    const groupedNews: DateGroupNewsItem[] = [];
    Object.entries(grouped).forEach(([date, newsItems]) => {
      groupedNews.push({
        date,
        newsItems
      });
    });
    setGroupedNewsList(groupedNews);
  };



  useEffect(() => {
    const fetchNews = async () => {
      try {
        const timezoneOffset = new Date().getTimezoneOffset() * -1;
        // Format the selected date to YYYYMMDD
        const formattedDate = format(selectedDate, 'yyyyMMdd');
        setSelectedDate(new Date());
        console.log(`Fetching news for ${formattedDate} with timezoneOffset ${timezoneOffset}`);
        groupNewsByDate(newsItems);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    }

    fetchNews();
  }, [currentGame]);


  const handleEventStateSelected = (event: NewsState) => {
    setEventState(event);
    //TODO: change api according to event
  }

  return (
    <>
      <Header />
      <Spacer space={55} />
      <section className="container">
        <Breadcrumb items={[
          { label: t('common.home'), url: '/' },
          { label: t('news.title') },
        ]} />
        <h1 className={style.title}>{`${currentGameName} ${t('news.title')}`}</h1>
        <div className="contentWrapper">
          <div className="mainContent">
            <NewsTypes
              isLoading={isLoading}
              // only clear country
              currentEventState={eventState}
              onEventStateSelected={(event: NewsState) => handleEventStateSelected(event)}
            />
            <Spacer space={20} />
            <NewsList
              showGameTypeIcon={true}
              gameType={currentGame}
              groupedNewsList={groupedNewsList}
              isLoading={isLoading} />
          </div>
          <div className="sideContent">
            <PromoCodeBlock
              bookmakerLogo="/img/stake-white.svg"
              promoCode="888sports"
              promoText={t('matches.promoTextTitle')}
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

export default News
