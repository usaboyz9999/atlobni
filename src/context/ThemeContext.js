import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

export const LIGHT = {
  bg:          '#EEF2F7',
  card:        '#fff',
  card2:       '#F4F7FB',
  border:      '#DDE4EF',
  text:        '#0A2463',
  text2:       '#0D1B2A',
  subText:     '#6B7C93',
  input:       '#F4F7FB',
  inputBorder: '#DDE4EF',
  header:      '#0A2463',
  headerText:  '#fff',
  navBg:       '#fff',
  sectionBg:   '#F7F9FC',
  overlay:     'rgba(10,36,99,0.35)',
  isDark:      false,
};

export const DARK = {
  bg:          '#0F0F1A',
  card:        '#1C1C2E',
  card2:       '#252538',
  border:      '#3A3A55',
  text:        '#FFFFFF',
  text2:       '#E0E0F0',
  subText:     '#AAAACC',
  input:       '#252538',
  inputBorder: '#3A3A55',
  header:      '#0F0F1A',
  headerText:  '#FFFFFF',
  navBg:       '#1C1C2E',
  sectionBg:   '#252538',
  overlay:     'rgba(0,0,0,0.3)',
  isDark:      true,
};

const ThemeContext = createContext(LIGHT);
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const { darkMode } = useAuth();
  const theme = darkMode ? DARK : LIGHT;
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}