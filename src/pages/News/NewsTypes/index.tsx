import React, { useEffect, useRef, useState } from 'react';
import styles from './style.module.css';
import { GAME_MENU_ITEMS } from '@/constants';
import { useNavigationContext } from '@/context/NavigationContext';
import { useTranslation } from 'react-i18next';

interface NewsTypesProps {
  currentEventState?: NewsState;
  onEventStateSelected?: (event: NewsState, selectedCountryId?: string) => void;
  isLoading: boolean;
  emptyEventState?: boolean;
  isInitialLoad?: boolean;
}

const getEventStateDisplay = (eventState: NewsState) => {
  return eventState;
};

const EventStateButton: React.FC<{
  eventState: NewsState;
  currentEventState?: NewsState;
  onSelect?: (event: NewsState) => void;
}> = ({ eventState, currentEventState, onSelect }) => {
  const eventClass = `${styles.event} 
    ${eventState === currentEventState ? styles.active : ''}`;

  return (
    <div className={eventClass} onClick={() => onSelect ? onSelect(eventState) : function () { }}>
      <div className={styles.eventName}>{getEventStateDisplay(eventState)}</div>
    </div>
  );
};

// Main Match Calendar component
const NewsTypes: React.FC<NewsTypesProps> = ({
  currentEventState,
  onEventStateSelected,
  isLoading,
  emptyEventState,
}) => {
  const { t } = useTranslation();
  const { currentGame, setCurrentGame } = useNavigationContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleSportSelect = (sport: GameType) => {
    if (!isLoading) {
      setCurrentGame(sport);
      setIsDropdownOpen(false);
    }
  };


  return (
    <div className={styles.calendarContainer}>
      <div className={styles.leftSection}>
        <div className={styles.gameSelector} ref={dropdownRef} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <div className={styles.sportSelectorContainer}>
            <span className={styles.selectedSport}>
              <img src={GAME_MENU_ITEMS.find(item => item.id === currentGame)?.iconFill} width={30} />
              {t(`constants.gameMenuItems.${currentGame}`)}
            </span>
          </div>
          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              {GAME_MENU_ITEMS.filter(item => item.id !== currentGame).map((item) => (
                <div
                  key={item.id}
                  className={styles.dropdownItem}
                  onClick={() => handleSportSelect(item.id)}
                >
                  <img src={item.iconFill} width={15} />
                  {t(`constants.gameMenuItems.${item.id}`)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.rightSection}>
        {!emptyEventState && (["NEWS", "GUIDES", "INTERVIEW", "ANALYTICS"] as NewsState[])
          .map((event, index) => (
            <EventStateButton key={index}
              eventState={event}
              currentEventState={currentEventState}
              onSelect={(event) => {
                onEventStateSelected?.(event, "");
              }} />
          ))}
      </div>
    </div >
  );
};

export default NewsTypes;