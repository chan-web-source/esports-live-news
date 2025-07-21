import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import styles from './style.module.css';
import { GAME_MENU_ITEMS } from '@/constants';
import Calendar from 'react-calendar';
import { useNavigationContext } from '@/context/NavigationContext';

// Define TypeScript types
interface Day {
  dayOfWeek: string;
  date: number;
  fullDate: Date;
  isActive?: boolean;
  isToday?: boolean;
}

interface MatchCalendarProps {
  liveCount?: number;
  selectedDate?: Date;
  onDaySelected?: (day: Day) => void;
}

// Calendar day component
const CalendarDay: React.FC<{
  day: Day;
  onSelect: (day: Day) => void;
}> = ({ day, onSelect }) => {
  const dayClass = `${styles.day} ${day.isActive ? styles.active : ''} ${day.isToday ? styles.today : ''
    }`;

  return (
    <div className={dayClass} onClick={() => onSelect(day)}>
      <div className={styles.dayName}>{day.dayOfWeek}</div>
      <div className={styles.dayNumber}>{day.date}</div>
    </div>
  );
};

// Main Match Calendar component
const MatchCalendar: React.FC<MatchCalendarProps> = ({
  liveCount = 0,
  selectedDate = new Date(),
  onDaySelected,
}) => {
  const { currentGame, setCurrentGame } = useNavigationContext();
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  // This state controls the days array calculation
  const [calendarBaseDate, setCalendarBaseDate] = useState<Date>(selectedDate || new Date());
  // This state tracks the currently selected day
  const [selectedDayState, setSelectedDayState] = useState<Date>(selectedDate || new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const today = new Date();

  const days = useMemo(() => {
    const daysArray: Day[] = [];
    const dayNames = [
      t('matchCalendar.dayNames.sun'),
      t('matchCalendar.dayNames.mon'),
      t('matchCalendar.dayNames.tue'),
      t('matchCalendar.dayNames.wed'),
      t('matchCalendar.dayNames.thu'),
      t('matchCalendar.dayNames.fri'),
      t('matchCalendar.dayNames.sat')
    ];

    // Generate days from calendarBaseDate-1 to calendarBaseDate+4
    for (let i = -1; i <= 4; i++) {
      const date = new Date(calendarBaseDate);
      date.setDate(date.getDate() + i);

      const isToday = date.toDateString() === today.toDateString();

      daysArray.push({
        dayOfWeek: dayNames[date.getDay()],
        date: date.getDate(),
        fullDate: date,
        isActive: date.toDateString() === selectedDayState.toDateString(),
        isToday,
      });
    }

    return daysArray;
  }, [calendarBaseDate, selectedDayState, today, t]);

  const handleDaySelect = (day: Day) => {
    setSelectedDayState(day.fullDate);
    if (onDaySelected) {
      onDaySelected(day);
    }
  };

  // Update both states when calendar date is selected
  const handleCalendarDateSelect = (date: Date) => {
    setCalendarBaseDate(date);
    setSelectedDayState(date);
    const dayNames = [
      t('matchCalendar.dayNames.sun'),
      t('matchCalendar.dayNames.mon'),
      t('matchCalendar.dayNames.tue'),
      t('matchCalendar.dayNames.wed'),
      t('matchCalendar.dayNames.thu'),
      t('matchCalendar.dayNames.fri'),
      t('matchCalendar.dayNames.sat')
    ];
    const selectedDay: Day = {
      dayOfWeek: dayNames[date.getDay()],
      date: date.getDate(),
      fullDate: date,
      isActive: true
    };
    if (onDaySelected) {
      onDaySelected(selectedDay);
    }
    setShowCalendar(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSportSelect = (sport: GameType) => {
    setCurrentGame(sport);
    setIsDropdownOpen(false);
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

      <div className={styles.middleSection}>
        {liveCount > 0 && (
          <div className={`${styles.day} ${styles.live}`} >
            <span className={`${styles.dayName} ${styles.liveDayName}`}>{t('matchCalendar.live')}</span>
            <span className={`${styles.dayNumber} ${styles.live}`}>{liveCount}</span>
          </div>
        )}
      </div>

      <div className={styles.rightSection}>
        {days.map((day, index) => (
          <CalendarDay key={index} day={day} onSelect={handleDaySelect} />
        ))}
        <div className={styles.calendarIconWrapper} ref={calendarRef}>
          <img
            src="/img/calendar.svg"
            width={25}
            onClick={(e) => {
              e.stopPropagation();
              setShowCalendar(!showCalendar);
            }}
          />
          {showCalendar && (
            <div className={styles.calendarPopup}>
              <Calendar
                onChange={(date) => {
                  if (date instanceof Date) {
                    handleCalendarDateSelect(date);
                  }
                }}
                value={selectedDayState}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchCalendar;