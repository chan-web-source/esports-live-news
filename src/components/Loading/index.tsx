import React from 'react';
import { useTranslation } from "react-i18next";
import styles from './style.module.css';

const Loading: React.FC = () => {
 const { t } = useTranslation();

 return (
  <div className={styles.loadingItem}>
   <div className={styles.dateInfo}>
    <div className={styles.dateRange}>
     <img className={styles.loadingIcon} src="/img/loading.png" />
    </div>
   </div>
   <div className={styles.championContainer}>
    <div className={styles.eventTitle}>{t('common.loading')}</div>
   </div>
  </div>
 );
};

export default Loading; 