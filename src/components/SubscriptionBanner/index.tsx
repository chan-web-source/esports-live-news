// SubscriptionBanner.tsx
import React from 'react';
import { useTranslation } from "react-i18next";
import styles from './style.module.css';
import { Zap } from 'lucide-react';

interface SubscriptionBannerProps {
  onGetAccess?: () => void;
}

const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({ onGetAccess }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.heading}>
          {t('subscriptionBanner.heading.prefix')} <span className={styles.highlight}>{t('subscriptionBanner.heading.highlight')}</span> {t('subscriptionBanner.heading.suffix')}
        </h1>
        <p className={styles.subheading}>
          {t('subscriptionBanner.subheading.prefix')}
          <span className={styles.bold}>{t('subscriptionBanner.subheading.monthlyPredictionsText')}</span>{' '}
          60,000
          <span className={styles.bold}>{t('subscriptionBanner.subheading.sources')}</span>
          {t('subscriptionBanner.subheading.sourcesText')}.
        </p>
        <button
          className={styles.accessButton}
          onClick={onGetAccess}
        >
          <Zap className={styles.icon} />
          {t('subscriptionBanner.button.text')}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionBanner;