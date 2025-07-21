import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import styles from './style.module.css';

interface BottomAdsProps {
  alwaysVisible?: boolean;
}

const BottomAds: React.FC<BottomAdsProps> = ({ alwaysVisible = false }) => {
  const [isVisible, setIsVisible] = useState(alwaysVisible);
  const { t } = useTranslation();

  useEffect(() => {
    if (alwaysVisible) {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 100); // only appear when scroll more than 100px
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [alwaysVisible]);

  if (!isVisible) return null;

  return (
    <div className={styles.banner}>
      <div className={styles.container}>
        <span className={styles.promo}>
          {t('bottomAds.promo')} <span className={styles.highlight}>250%</span>
        </span>

        <div className={`${styles.betPromo} ${styles.noCode}`}>
          <span className={`${styles.button} ${styles.outboundBet}`}>
            {t('bottomAds.button')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BottomAds;