import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import style from "./style.module.css";
import commonStyles from '@/components/common-style.module.css';
import { useAuth } from "@/components/auth/AuthContext";
import { GAME_MENU_ITEMS } from "@/constants";
import { useNavigationContext } from "@/context/NavigationContext";
import LeftPanel from '@/components/LeftPanel';
import { useTranslation } from "react-i18next";

const Header: React.FC = () => {
  const { currentGame, currentSection } = useNavigationContext();
  const { isAuthenticated, username } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle dropdown menu
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      // Handle left panel
      const leftPanelElement = document.querySelector(`.${style.leftPanelWrapper}`);
      const sidebarButton = document.querySelector(`.${style.sidebarButton}`);
      if (
        isLeftPanelOpen &&
        leftPanelElement &&
        !leftPanelElement.contains(event.target as Node) &&
        !sidebarButton?.contains(event.target as Node)
      ) {
        // setIsLeftPanelOpen(false);
        handlePanelClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLeftPanelOpen]);

  const getDisplayName = (email: string | null) => {
    return email?.split('@')[0] || email;
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getMainNavItems = () => {
    return (<div className={style.mainNav}>
      <Link
        to={`/${currentGame}/matches`}
        className={`${style.mainNavItem} ${(currentSection === 'matches') ? style.active : ''}`}
      >
        {t('common.matches')}
      </Link>
      <Link
        to={`/${currentGame}/news`}
        className={`${style.mainNavItem} ${(currentSection === 'news') ? style.active : ''}`}
      >
        {t('header.predictions')}
      </Link>
      <Link
        to={`/${currentGame}/tournaments/all`}
        className={`${style.mainNavItem} ${(currentSection === 'tournaments' || currentSection === 'tournament') ? style.active : ''}`}
      >
        {t('header.tournaments')}
      </Link>
      <Link
        to={`/${currentGame}/teams/all`}
        className={`${style.mainNavItem} ${(currentSection === 'teams' || currentSection === 'team') ? style.active : ''}`}
      >
        {t('common.teams')}
      </Link>
    </div>);
  };


  const handlePanelClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsLeftPanelOpen(false);
      setIsClosing(false);
    }, 300); // Match animation duration
  }, []);

  const handlePanelToggle = () => {
    if (isLeftPanelOpen) {
      handlePanelClose();
    } else {
      setIsLeftPanelOpen(true);
    }
  };

  const handleGameNavigation = (gameTypeId: string) => {
    setIsDropdownOpen(false);
    switch (currentSection) {
      case 'tournament':
        navigate(`/${gameTypeId}/tournaments/all`);
        break;
      case 'team':
        navigate(`/${gameTypeId}/teams/all`);
        break;
      case 'matches':
        navigate(`/${gameTypeId}/matches`);
        break;
      case 'news':
        navigate(`/${gameTypeId}/news`);
        break;
      default:
        navigate(`/${gameTypeId}/${currentSection}/all`);
        break;
    }
  };

  return (
    <>
      <header className={style.header}>
        <div className={style.container}>
          <div className={style.left}>
            <div
              className={style.sidebarButton}
              onClick={handlePanelToggle}
            ></div>
            <a href="/">
              <img className={style.logo} src="/img/logo-h.png" alt="Logo" />
            </a>

            {!currentGame && (
              <div className={style.gamesNavShort}>
                <Link to="/football/matches">
                  <img src="/img/games/football.svg" width="30" />
                  <span className={style.gamesNavItem}>{t('header.football')}</span>
                </Link>
                <Link to="/basketball/matches">
                  <img src="/img/games/basketball.svg" width="30" />
                  <span className={style.gamesNavItem}>{t('header.basketball')}</span>
                </Link>
                <Link to="/esports/matches">
                  <img src="/img/games/allgames.svg" width="30" />
                  <span className={style.gamesNavItem}>{t('header.esports')}</span>
                </Link>
              </div>
            )}

            {currentGame && (
              <div className={style.games} ref={dropdownRef}>
                <div
                  className={`${style.toggle} ${style.game}`}
                  onClick={toggleDropdown}
                >
                  {(() => {
                    const activeItem = GAME_MENU_ITEMS.find(item => item.id === currentGame);
                    return (
                      <>
                        <img className={style.gameIcon} src={activeItem?.icon} width="30" alt={activeItem?.name} />
                        <span className={style.gameName}>{t(`constants.gameMenuItems.${activeItem?.id}`)}</span>
                        <div className={`${commonStyles.arrow} ${isDropdownOpen ? commonStyles.arrowUp : commonStyles.arrowDown} ${style.arrow}`} />
                      </>
                    );
                  })()}
                </div>

                <nav className={`${style.toggleContent} ${isDropdownOpen ? style.show : ''}`}>
                  {GAME_MENU_ITEMS
                    .filter(item => item.id !== currentGame)
                    .map(item => (
                      <div
                        key={item.id}
                        className={style.game}
                        onClick={() => handleGameNavigation(item.id)}
                      >
                        <img className={style.gameIcon} src={item.icon} width="30" alt={item.name} />
                        <span className={style.gameName}>{t(`constants.gameMenuItems.${item.id}`)}</span>
                      </div>
                    ))}
                </nav>
              </div>
            )}

            {currentGame && getMainNavItems()}
          </div>

          <nav className={style.right}>
            {isAuthenticated ? (
              <Link className={style.accountLink} to="/account">{getDisplayName(username)}</Link>
            ) : (
              <>
                <Link to="/login" className={style.signin}>{t('header.login')}</Link>
                <Link to="/register" className={`${style.signin} ${style.signup}`}>{t('header.register')}</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      {(isLeftPanelOpen || isClosing) && (
        <div className={`${style.leftPanelWrapper} ${isClosing ? style.slideOut : ''}`}>
          <LeftPanel setIsLeftPanelOpen={handlePanelClose} />
        </div>
      )}
    </>
  );
};

export default Header;