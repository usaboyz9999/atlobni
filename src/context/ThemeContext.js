import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

export const LIGHT = {
  bg:         '#EEF2F7',
  card:       '#fff',
  card2:      '#F4F7FB',
  border:     '#DDE4EF',
  text:       '#0A2463',
  text2:      '#0D1B2A',
  subText:    '#6B7C93',
  input:      '#F4F7FB',
  inputBorder:'#DDE4EF',
  header:     '#0A2463',
  headerText: '#fff',
  navBg:      '#fff',
  sectionBg:  '#F7F9FC',
  isDark:     false,
};

export const DARK = {
  bg:         '#0F0F1A',
  card:       '#1C1C2E',
  card2:      '#252538',
  border:     '#2E2E45',
  text:       '#E8EAFF',
  text2:      '#CACAE0',
  subText:    '#8888AA',
  input:      '#252538',
  inputBorder:'#2E2E45',
  header:     '#12122A',
  headerText: '#E8EAFF',
  navBg:      '#1C1C2E',
  sectionBg:  '#252538',
  isDark:     true,
};

const ThemeContext = createContext(LIGHT);
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const { darkMode } = useAuth();
  const theme = darkMode ? DARK : LIGHT;
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}