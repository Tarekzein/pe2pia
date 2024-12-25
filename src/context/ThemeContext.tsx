import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme,toggleLang } from '../modules/app/stores/themeSlice'; // Update the import path as needed
import { RootState } from '../modules/store'; // Update the path for your Redux store's RootState

type Theme = 'light' | 'dark';
type Lang = 'en' | 'ar';
interface ThemeContextProps {
  theme: Theme;
  lang: Lang;
  toggleTheme: () => void;
  toggleLang: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.theme);
    const lang = useSelector((state: RootState) => state.theme.lang);
  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };
  const handleToggleLang = () => {
      dispatch(toggleLang());
  };
  return (
    <ThemeContext.Provider value={{ theme,lang, toggleTheme: handleToggleTheme,toggleLang:handleToggleLang }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
