import React from 'react';
import styles from './style.module.css';

interface EmptyListContainerProps {
 title?: string;
}

const EmptyListContainer: React.FC<EmptyListContainerProps> = ({ title }) => {

 return (
  <div className={styles.emptyItem}>
   <div className={styles.dateInfo}>
   </div>
   <div className={styles.championContainer}>
    <div className={styles.eventTitle}>
     {title}
    </div>
   </div>
  </div>
 );
};

export default EmptyListContainer;
