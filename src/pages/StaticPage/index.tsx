import Header from "@/components/Header"
import Spacer from "@/components/Spacer"
import BottomAds from "@/components/BottomAds"
import Footer from "@/components/Footer"
import Breadcrumb from "@/components/Breadcrumb"
import styles from "./style.module.css"
import commonStyle from '@/components/common-style.module.css'
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom";
import ChatBubble from "@/components/ChatBubble"

const StaticPage: React.FC = () => {
  const { pageName } = useParams();
  const { t } = useTranslation();
  const [pageContent, setPageContent] = useState<string>('');
  const [pageTitle, setPageTitle] = useState<string>('');


  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/static/${pageName}.html`);
        if (!response.ok) {
          throw new Error(`Failed to load ${pageName} page`);
        }
        const html = await response.text();

        // Create a temporary element to parse the HTML and extract title
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const titleElement = tempDiv.querySelector('h1');
        setPageTitle(titleElement?.textContent || pageName || '');
        const content = tempDiv.querySelector('div.body');
        setPageContent(content?.innerHTML || '');
      } catch (error) {
        console.error('Error loading static page:', error);
        setPageContent('<p>Page not found</p>');
        setPageTitle('Page Not Found');
      }
    };

    if (pageName) {
      fetchContent();
    }
  }, [pageName]);


  return (
    <>
      <Header />
      <Spacer space={55} />
      <section className="container">
        <Breadcrumb items={[
          { label: t('common.home'), url: '/' },
          { label: t('news.title') },
        ]} />
        <h1 className={styles.title}>{pageTitle}</h1>
        <div className={commonStyle.container}>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: pageContent }}
          />
        </div>
      </section>
      <Footer />
      <Spacer space={60} />
      <BottomAds />
      <ChatBubble />
    </>
  )
}

export default StaticPage;
