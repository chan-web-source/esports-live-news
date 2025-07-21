import React, { useState } from 'react';
import styles from './style.module.css';
import { LEFT_PANEL_SUB_ITEMS, GAME_MENU_ITEMS, INFORMATION_MENU_ITEMS, LANGUAGE_OPTIONS, ODDS_OPTIONS } from "@/constants";
import { Link } from 'react-router-dom';
import { oddsStore } from '../../store/oddsStore';
import { LEFT_PANEL_LOGIN_SUB_ITEMS, LEFT_PANEL_ACCOUNT_SUB_ITEMS } from "@/constants";
import { useAuth } from '../auth/AuthContext';
import { useTranslation } from "react-i18next";
import i18n from '@/i18n/i18n';

interface LeftPanelProps {
    setIsLeftPanelOpen: (isOpen: boolean) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ setIsLeftPanelOpen }) => {
    // Get current language constants
    const { isAuthenticated, username } = useAuth();
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const [expandedSetting, setExpandedSetting] = useState<string | null>(null);

    const { t, i18n: { changeLanguage } } = useTranslation();

    const handleItemClick = (itemId: string) => {
        setExpandedItem(expandedItem === itemId ? null : itemId);
    };

    const handleSettingClick = (settingId: string) => {
        setExpandedSetting(expandedSetting === settingId ? null : settingId);
    };

    const handleOdds = (oddsFormat: string) => {
        oddsStore.setSelectedOddsType(oddsFormat);
        setIsLeftPanelOpen(false);
    };

    const handleLanguage = (languageId: string) => {
        changeLanguage(languageId);
        setIsLeftPanelOpen(false);
    };

    return (
        <div className={styles.leftPanel}>
            <div className={styles.navList}>
                <div key="login" className={styles.navItemContainer}>
                    <div
                        className={`${styles.navItem} ${styles.navItemLogin}`}
                        onClick={() => handleItemClick("login")}
                    >
                        <div className={styles.navItemContent}>
                            <img
                                className={styles.gameIcon}
                                src="/img/user-black.svg"
                                width="30"
                            />
                            {isAuthenticated ?
                                (<span className={styles.gameName}>{username}</span>) :
                                (<span className={styles.gameName}>{t('leftPanel.hello')}</span>)
                            }
                        </div>
                        <span className={`${styles.arrow} ${expandedItem === "login" ? styles.expanded : ''}`}>
                        </span>
                    </div>
                    {expandedItem === "login" && (
                        <div className={styles.subItems}>
                            {(isAuthenticated ? LEFT_PANEL_ACCOUNT_SUB_ITEMS : LEFT_PANEL_LOGIN_SUB_ITEMS).map(
                                (subItem, index: number) => (
                                    <Link
                                        key={index}
                                        to={`/${subItem.path}`}
                                        className={styles.subItem}
                                        onClick={() => setIsLeftPanelOpen(false)}
                                    >
                                        {isAuthenticated ?
                                            t(`constants.leftPanelAccountSubItems.${subItem.id}`) :
                                            t(`constants.leftPanelLoginSubItems.${subItem.id}`)
                                        }
                                    </Link>
                                ))}
                        </div>
                    )}
                </div>
                {GAME_MENU_ITEMS.map((item) => (
                    <div key={item.id} className={styles.navItemContainer}>
                        <div
                            className={`${styles.navItem} ${styles.navItemGame}`}
                            onClick={() => handleItemClick(item.id)}
                        >
                            <div className={styles.navItemContent}>
                                <img
                                    className={styles.gameIcon}
                                    src={item.icon}
                                    width="30"
                                    alt={item.name}
                                />
                                <span className={styles.gameName}>{t(`constants.gameMenuItems.${item.id}`)}</span>
                            </div>
                            <span className={`${styles.arrow} ${expandedItem === item.id ? styles.expanded : ''}`}>
                            </span>
                        </div>
                        {expandedItem === item.id && (
                            <div className={styles.subItems}>
                                {LEFT_PANEL_SUB_ITEMS.map((subItem, index: number) => (
                                    <Link
                                        key={index}
                                        to={`/${item.id}/${subItem.path}`}
                                        className={styles.subItem}
                                        onClick={() => setIsLeftPanelOpen(false)}
                                    >
                                        {t(`constants.gameSubItems.${subItem.id}`)}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {/* Settings Section */}
                <div className={styles.settingsSection}>
                    <h2 className={styles.settingsTitle}>{t('leftPanel.settings.helpAndSettings')}</h2>

                    {/* Language Setting */}
                    <div className={styles.settingItem}>
                        <div
                            className={styles.navItem}
                            onClick={() => handleSettingClick('language')}
                        >
                            <div className={styles.navItemContent}>
                                <img
                                    className={styles.gameIcon}
                                    src="/img/globe-black.svg"
                                    width="30"
                                    alt={t('leftPanel.language')}
                                />
                                <span className={styles.gameName}>{t('leftPanel.settings.language')}</span>
                            </div>
                            <span className={`${styles.arrow} ${expandedSetting === 'language' ? styles.expanded : ''}`}>
                            </span>
                        </div>
                        {expandedSetting === 'language' && (
                            <div className={styles.subItems}>
                                {LANGUAGE_OPTIONS.map((subItem) => (
                                    <div
                                        key={subItem.id}
                                        className={`${styles.subItem} ${i18n.language === subItem.id ? styles.isActive : ''}`}
                                        onClick={() => handleLanguage(subItem.id)}
                                    >
                                        {t(`constants.languageOptions.${subItem.id}`)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Odds Setting */}
                    <div className={styles.settingItem}>
                        <div
                            className={styles.navItem}
                            onClick={() => handleSettingClick('odds')}
                        >
                            <div className={styles.navItemContent}>
                                <img
                                    className={styles.gameIcon}
                                    src="/img/odds-black.svg"
                                    width="30"
                                    alt={"odds"}
                                />
                                {/* [back] use settings.xxx.xxx */}
                                <span className={styles.gameName}>{t('leftPanel.settings.odds')}</span>
                            </div>
                            <span className={`${styles.arrow} ${expandedSetting === 'odds' ? styles.expanded : ''}`}>
                            </span>
                        </div>
                        {expandedSetting === 'odds' && (
                            <div className={styles.subItems}>
                                {ODDS_OPTIONS.map((subItem) => (
                                    <div
                                        key={subItem.id}
                                        className={`${styles.subItem} ${oddsStore.getSelectedOddsType() === subItem.id ? styles.isActive : ''}`}
                                        onClick={() => handleOdds(subItem.id)}
                                    >
                                        {t(`constants.oddsOptions.${subItem.id}`)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Information Setting */}
                    <div className={styles.settingItem}>
                        <div
                            className={styles.navItem}
                            onClick={() => handleSettingClick('information')}
                        >
                            <div className={styles.navItemContent}>
                                <img
                                    className={styles.gameIcon}
                                    src="/img/info-black.svg"
                                    width="30"
                                    alt={t('leftPanel.settings.information')}
                                />
                                <span className={styles.gameName}>{t('leftPanel.settings.information')}</span>
                            </div>
                            <span className={`${styles.arrow} ${expandedSetting === 'information' ? styles.expanded : ''}`}>
                            </span>
                        </div>
                        {expandedSetting === 'information' && (
                            <div className={styles.subItems}>
                                {INFORMATION_MENU_ITEMS.map((subItem) => (
                                    <Link
                                        key={subItem.id}
                                        to={`${subItem.route}`}
                                        className={styles.subItem}
                                        onClick={() => setIsLeftPanelOpen(false)}
                                    >
                                        {t(`constants.informationMenuItems.${subItem.id}`)}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeftPanel;