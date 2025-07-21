import React, { createContext, useContext } from 'react';
import { GAME_MENU_ITEMS } from '@/constants';
import { capitalize } from '@/utils/string.utils';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

interface NavigationContextType {
  currentGame: GameType | undefined;
  currentGameName: string;
  currentSection: SectionType | undefined;
  currentSectionName: string;
  setCurrentGame: (game: GameType | undefined) => void;
  setCurrentSection: (section: SectionType | undefined) => void;
}

// NavigationContext is decided using URI in the following format
// /[game]/[section]
// Where game should be one of GameType, and section should be one of SectionType.
// Refer to /main.tsx for all possible URI mappings
const NavigationContext = createContext<NavigationContextType>({
  currentGame: undefined,
  currentGameName: '',
  currentSection: undefined,
  currentSectionName: '',
  setCurrentGame: () => { },
  setCurrentSection: () => { },
});

// Create a provider component
export const NavigationContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentGame, setCurrentGame] = useState<GameType>();
  const [currentGameName, setCurrentGameName] = useState<string>('');
  const [currentSection, setCurrentSection] = useState<SectionType>();
  const [currentSectionName, setCurrentSectionName] = useState<string>('');
  const location = useLocation();
  const { i18n } = useTranslation();

  // Update navigation state based on URL
  useEffect(() => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);

    if (segments.length >= 1) {
      const gameSegment = segments[0];
      const isValidGame = GAME_MENU_ITEMS.some(item => item.id === gameSegment);

      if (isValidGame) {
        const game = gameSegment as GameType;
        if (game !== currentGame) {
          setCurrentGame(game);
        }
      } else {
        setCurrentGame(undefined);
      }
    } else {
      setCurrentGame(undefined);
    }

    if (segments.length >= 2) {
      const section = segments[1] as SectionType;
      if (section !== currentSection) {
        setCurrentSection(section);
      }
    } else {
      setCurrentSection(undefined);
    }

  }, [location.pathname]);

  // Update current game name when currentGame changes
  useEffect(() => {
    if (currentGame && i18n.language === 'en') {
      setCurrentGameName(capitalize(currentGame));
    } else if (currentGame) {
      setCurrentGameName(t(`constants.gameMenuItems.${currentGame}`));
    }
  }, [currentGame, i18n.language]);

  // Update current section name when currentSection changes
  useEffect(() => {
    if (currentSection && i18n.language === 'en') {
      setCurrentSectionName(capitalize(currentSection));
    } else if (currentSection) {
      setCurrentSectionName(t(`common.${currentSection}`));
    }
  }, [currentSection]);

  const value = {
    currentGame,
    currentGameName,
    currentSection,
    currentSectionName,
    setCurrentGame,
    setCurrentSection,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

// Create a custom hook for using the navigation context
export function useNavigationContext() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

export default NavigationContext;