import React from 'react';
import styles from './style.module.css';

interface BreadcrumbItem {
  label: string;
  url?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = '/'
}) => {
  return (
    <nav className={`${styles.breadcrumb}`}>
      <ol className={styles.list}>
        {items
          .filter(item => item.label && item.label.trim() !== '')
          .map((item, index, filteredItems) => {
            const isLast = index === filteredItems.length - 1;
            return (
              <li key={index} className={styles.item}>
                {!isLast && item.url ? (
                  <>
                    <a href={item.url} className={styles.link}>
                      {item.label}
                    </a>
                    <span className={styles.separator}>{separator}</span>
                  </>
                ) : (
                  <>
                    <span className={`${styles.text} ${isLast ? styles.active : ''}`}>
                      {item.label}
                    </span>
                    {!isLast && <span className={styles.separator}>{separator}</span>}
                  </>
                )}
              </li>
            );
          })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;