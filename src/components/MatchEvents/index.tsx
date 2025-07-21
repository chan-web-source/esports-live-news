import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import styles from './style.module.css';
import { GAME_MENU_ITEMS } from '@/constants';
import FlagCountries from "@/components/FlagCountries";
import { useNavigationContext } from '@/context/NavigationContext';
import { useParams } from 'react-router-dom';

interface MatchEventsProps {
  currentEventState?: EventState;
  onEventStateSelected?: (event: EventState, selectedCountryId?: string) => void;
  countries: Country[];
  onCountrySelected: (country: Country | undefined) => void;
  isLoading: boolean;
  emptyEventState?: boolean;
  isInitialLoad?: boolean;
}

const getEventStateDisplay = (eventState: EventState, t: (key: string) => string) => {
  if (eventState === 'CURRENT-YEAR') {
    return new Date().getFullYear().toString()
  }
  return t(`matchEvents.${eventState}`) || '';
};

const EventStateButton: React.FC<{
  eventState: EventState;
  currentEventState?: EventState;
  onSelect?: (event: EventState) => void;
  t: (key: string) => string;
}> = ({ eventState, currentEventState, onSelect, t }) => {
  const eventClass = `${styles.event} 
    ${eventState === currentEventState ? styles.active : ''}
    ${eventState === 'ONGOING' ? styles.current : ''}`;

  return (
    <div className={eventClass} onClick={() => onSelect ? onSelect(eventState) : undefined}>
      <div className={styles.eventName}>{getEventStateDisplay(eventState, t)}</div>
    </div>
  );
};

// Main Match Calendar component
const MatchEvents: React.FC<MatchEventsProps> = ({
  currentEventState,
  onEventStateSelected,
  countries,
  onCountrySelected,
  isLoading,
  emptyEventState,
  isInitialLoad,
}) => {
  const { currentGame, setCurrentGame } = useNavigationContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOpenFlagCountry, setIsOpenFlagCountry] = useState(false);
  const [countryState, setCountryState] = useState<Country>();
  const { countryId } = useParams();
  const defaultEventState = currentEventState ?? "ONGOING";
  const { t } = useTranslation();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const countryFlagsDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }

      if (countryFlagsDropdownRef.current && !countryFlagsDropdownRef.current.contains(event.target as Node)) {
        setIsOpenFlagCountry(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    handleInitialCountrySelect();
  }, [isInitialLoad]);

  const handleInitialCountrySelect = () => {
    if (countryId && countryId !== "all") {
      const country = countries?.find(c => c.id === countryId);
      handleCountrySelectAndClose(country ?? undefined);
    }
  }


  const handleSportSelect = (sport: GameType) => {
    if (!isLoading) {
      setCurrentGame(sport);
      setIsDropdownOpen(false);
    }
  };

  const handleCountrySelectAndClose = (country?: Country) => {
    setCountryState(country);
    onCountrySelected(country);
    setIsOpenFlagCountry(false);
  };

  const handleWorldSelectAndClearCountry = () => {
    onCountrySelected(undefined);
    setCountryState(undefined);
  }




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
        {!emptyEventState && (["ONGOING", "UPCOMING", "FINISHED", "CURRENT-YEAR"] as EventState[])
          .map((event, index) => (
            <EventStateButton key={index}
              eventState={event}
              currentEventState={currentEventState}
              t={t}
              onSelect={(event) => {
                onEventStateSelected?.(event, countryState?.id ?? "");
                if (event === "CURRENT-YEAR") {
                  handleWorldSelectAndClearCountry();
                }
              }} />
          ))}
        <div className={styles.iconContainer}>
          <div className={styles.event}
            onClick={() => {
              onEventStateSelected?.(defaultEventState, "");
              handleWorldSelectAndClearCountry();
            }}
            style={{ backgroundColor: !countryState ? "white" : "" }}
          >
            <img className={styles.icon} src="/img/world.svg" />
          </div>
          <div className={styles.event} onClick={() => setIsOpenFlagCountry(!isOpenFlagCountry)}
            style={{ backgroundColor: countryState ? "white" : "" }}
          >
            <img className={styles.icon} src={countryState?.logo || "/img/flag.svg"} />
          </div>
          {isOpenFlagCountry && (
            <FlagCountries
              ref={countryFlagsDropdownRef}
              countries={countries}
              onSelect={handleCountrySelectAndClose}
            />
          )}
        </div>
      </div>
    </div >
  );
};

export default MatchEvents;