import { FC, useState } from 'react';
import { useTranslation } from "react-i18next";
import styles from './style.module.css';

const Settings: FC = () => {
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const { t } = useTranslation();

    const handleItemClick = (itemId: string) => {
        setExpandedItem(expandedItem === itemId ? null : itemId);
    };

    return (
        <div className={styles.settings}>
            <h2 className={styles.title}>{t('leftPanel.helpAndSettings')}</h2>

            <div className={styles.settingItem} onClick={() => handleItemClick('language')}>
                <div className={styles.settingHeader}>
                    <div className={styles.settingIcon}>
                        <img src="/img/globe-white.svg" alt={t('leftPanel.language.title')} />
                    </div>
                    <span className={styles.settingLabel}>{t('leftPanel.language.title')}</span>
                    <span className={`${styles.arrow} ${expandedItem === 'language' ? styles.expanded : ''}`}>
                        ▼
                    </span>
                </div>
                {expandedItem === 'language' && (
                    <div className={styles.settingContent}>
                        <div className={styles.option}>{t('leftPanel.language.options.english')}</div>
                        <div className={styles.option}>{t('leftPanel.language.options.chinese')}</div>
                    </div>
                )}
            </div>

            <div className={styles.settingItem} onClick={() => handleItemClick('odds')}>
                <div className={styles.settingHeader}>
                    <div className={styles.settingIcon}>
                        <img src="/img/odds-white.svg" alt={t('leftPanel.odds.title')} />
                    </div>
                    <span className={styles.settingLabel}>{t('leftPanel.odds.title')}</span>
                    <span className={`${styles.arrow} ${expandedItem === 'odds' ? styles.expanded : ''}`}>
                        ▼
                    </span>
                </div>
                {expandedItem === 'odds' && (
                    <div className={styles.settingContent}>
                        <div className={styles.option}>{t('leftPanel.odds.options.decimal')}</div>
                        <div className={styles.option}>{t('leftPanel.odds.options.fractional')}</div>
                        <div className={styles.option}>{t('leftPanel.odds.options.american')}</div>
                    </div>
                )}
            </div>

            <div className={styles.settingItem} onClick={() => handleItemClick('information')}>
                <div className={styles.settingHeader}>
                    <div className={styles.settingIcon}>
                        <img src="/img/info-white.svg" alt={t('leftPanel.information.title')} />
                    </div>
                    <span className={styles.settingLabel}>{t('leftPanel.information.title')}</span>
                    <span className={`${styles.arrow} ${expandedItem === 'information' ? styles.expanded : ''}`}>
                        ▼
                    </span>
                </div>
                {expandedItem === 'information' && (
                    <div className={styles.settingContent}>
                        <div className={styles.option}>{t('leftPanel.information.options.aboutUs')}</div>
                        <div className={styles.option}>{t('leftPanel.information.options.termsOfService')}</div>
                        <div className={styles.option}>{t('leftPanel.information.options.privacyPolicy')}</div>
                        <div className={styles.option}>{t('leftPanel.information.options.contactSupport')}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings; 