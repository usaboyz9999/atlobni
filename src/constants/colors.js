import { Dimensions } from 'react-native';

export const { width } = Dimensions.get('window');
export const CARD_W = (width - 48) / 2;

export const C = {
  primary: '#0A2463', mid: '#1B4FBF', accent: '#0078FF',
  store: '#B83200', bg: '#EEF2F7', card: '#FFFFFF',
  text: '#0D1B2A', muted: '#6B7C93', border: '#DDE4EF',
  green: '#0A7A3C', greenBg: '#E6F7EE',
  orange: '#B05200', orangeBg: '#FFF0E0',
  blue: '#0043B0', blueBg: '#E6F0FF',
};
