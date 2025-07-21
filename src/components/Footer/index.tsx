import React from 'react';
import { useTranslation } from "react-i18next";
import styles from './style.module.css';
import { INFORMATION_MENU_ITEMS, ODDS_OPTIONS, LANGUAGE_OPTIONS } from '@/constants';
import { useLocation } from 'react-router-dom';
import { oddsStore } from '../../store/oddsStore';
import i18n from '@/i18n/i18n';

const Footer: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  //odds
  const [showOddsDropdown, setShowOddsDropdown] = React.useState(false);
  const [selectedOddsType, setSelectedOddsType] = React.useState(oddsStore.getSelectedOddsType());
  const [dropdownOddsPos, setDropdownOddsPos] = React.useState<{ left: number, bottom: number } | null>(null);
  const oddsButtonRef = React.useRef<HTMLButtonElement>(null);
  //language
  const [showLanguageDropdown, setShowLanguageDropdown] = React.useState(false);
  const [dropdownLanguagePos, setDropdownLanguagePos] = React.useState<{ left: number, bottom: number } | null>(null);
  const languageButtonRef = React.useRef<HTMLButtonElement>(null);


  React.useEffect(() => {
    const unsubscribeOdds = oddsStore.subscribe(() => {
      setSelectedOddsType(oddsStore.getSelectedOddsType());
      console.log(selectedOddsType)
    });
    return () => {
      unsubscribeOdds();
    };
  }, []);

  React.useEffect(() => {
    if (showOddsDropdown && oddsButtonRef.current) {
      const rect = oddsButtonRef.current.getBoundingClientRect();
      setDropdownOddsPos({
        left: rect.left + rect.width / 2,
        bottom: window.innerHeight - rect.top + 8 // 8px gap
      });
    }
  }, [showOddsDropdown]);

  React.useEffect(() => {
    if (showLanguageDropdown && languageButtonRef.current) {
      const rect = languageButtonRef.current.getBoundingClientRect();
      setDropdownLanguagePos({
        left: rect.left + rect.width / 2,
        bottom: window.innerHeight - rect.top + 8 // 8px gap
      });
    }
  }, [showLanguageDropdown]);

  const handleOddsChange = (oddsId: string) => {
    oddsStore.setSelectedOddsType(oddsId);
    setShowOddsDropdown(false);
  };

  const handleLanguageChange = (languageId: string) => {
    setShowLanguageDropdown(false);
    i18n.changeLanguage(languageId);
  };

  const selectedOddsName = t(`constants.oddsOptions.${ODDS_OPTIONS.find(opt => opt.id === selectedOddsType)?.id}`)
  const selectedLanguageName = LANGUAGE_OPTIONS.find(opt => opt.id === i18n.language)?.name || 'English';

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.row}>
          <img src="/img/logo-h.png" alt="888 Sports" className={styles.logo} />
          <div className={styles.regionSelector}>
            <div className={styles.regionWrapper}>
              <button
                ref={oddsButtonRef}
                className={styles.regionButton}
                onClick={() => setShowOddsDropdown(!showOddsDropdown)}
              >
                <img src="/img/odds-white.svg" className={styles.regionIcon} />
                {selectedOddsName}
              </button>
              {showOddsDropdown && dropdownOddsPos && (
                <div
                  className={styles.oddsDropdown}
                  style={{
                    position: 'fixed',
                    left: dropdownOddsPos.left,
                    bottom: dropdownOddsPos.bottom,
                    transform: 'translateX(-50%)'
                  }}
                >
                  {ODDS_OPTIONS.map((option) => (
                    <div
                      key={option.id}
                      className={styles.oddsOption}
                      onClick={() => handleOddsChange(option.id)}
                    >
                      {t(`constants.oddsOptions.${option.id}`)}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button className={styles.regionButton}>
              <img src="/img/timezone-white.svg" className={styles.regionIcon} />
              {t('footer.timezone')}
            </button>
            <button
              ref={languageButtonRef}
              className={styles.regionButton}
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            >
              <img src="/img/globe-white.svg" className={styles.regionIcon} />
              {selectedLanguageName}
            </button>
            {showLanguageDropdown && dropdownLanguagePos && (
              <div
                className={styles.oddsDropdown}
                style={{
                  position: 'fixed',
                  left: dropdownLanguagePos.left,
                  bottom: dropdownLanguagePos.bottom,
                  transform: 'translateX(-50%)'
                }}
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <div
                    key={option.id}
                    className={styles.oddsOption}
                    onClick={() => handleLanguageChange(option.id)}
                  >
                    {option.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.appDownloads}>
            <a href="#" className={styles.downloadLink} style={{ backgroundImage: `url('/img/progressive-web-app.svg')` }}>
              {t('footer.launchNowAs')}
            </a>
            <a href="#" className={styles.downloadLink} style={{ backgroundImage: `url('/img/play-store.svg')` }}>
              {t('footer.getItOn')}
            </a>
            <a href="#" className={styles.downloadLink} style={{ backgroundImage: `url('/img/microsoft-store.svg')` }}>
              {t('footer.getItFrom')}
            </a>
          </div>

          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialIcon}>
              <img src="/img/google-news.svg" alt="Google News" />
            </a>
            <a href="#" className={styles.socialIcon}>
              <img src="/img/x.svg" alt="Twitter / X" />
            </a>
            <a href="#" className={styles.socialIcon}>
              <img src="/img/facebook.svg" alt="Facebook" />
            </a>
            <a href="#" className={styles.socialIcon}>
              <img src="/img/youtube-eb.svg" alt="YouTube" />
            </a>
            <a href="#" className={styles.socialIcon}>
              <img src="/img/tiktok.svg" alt="TikTok" />
            </a>
            <a href="#" className={styles.socialIcon}>
              <img src="/img/steam.svg" alt="Steam" />
            </a>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.navSection}>
            <div className={styles.primaryLinks}>
              {INFORMATION_MENU_ITEMS.slice(0, 3).map((item) => (
                <a
                  key={item.id}
                  href={item.route}
                  className={`${styles.navLink} ${location.pathname === item.route ? styles.navLinkActive : ''}`}
                >
                  {t(`constants.informationMenuItems.${item.id}`)}
                </a>
              ))}
            </div>

            <div className={styles.legalLinks}>
              {INFORMATION_MENU_ITEMS.slice(3).map((item) => (
                <a
                  key={item.id}
                  href={item.route}
                  className={`${styles.navLink} ${location.pathname === item.route ? styles.navLinkActive : ''}`}
                >
                  {t(`constants.informationMenuItems.${item.id}`)}
                </a>
              ))}
            </div>
          </div>

          <div className={styles.bottomSection}>
            <div className={styles.gamingLinks}>
              <a href="#" className={styles.navLink}>{t('footer.gamblingTherapy')}</a>
              <a href="#" className={styles.navLink}>{t('footer.beGambleAware')}</a>
              <a href="#" className={styles.navLink}>{t('footer.gamCare')}</a>
              <a href="#" className={styles.navLink}>
                <img src="/img/plus-18.svg" alt="18+" className={styles.ageIcon} />
              </a>
            </div>
            <div className={styles.copyright}>
              {t('footer.copyright')}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;