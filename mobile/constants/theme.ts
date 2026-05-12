import { Tenant } from '../lib/types';

export type ThemeMode = 'light' | 'dark';

export function buildTheme(tenant?: Tenant | null, mode: ThemeMode = 'dark') {
  const dark = mode === 'dark';
  return {
    mode,
    colors: {
      primary: tenant?.cor_primaria ?? '#C7A85A',
      secondary: tenant?.cor_secundaria ?? '#111214',
      background: dark ? '#101114' : '#F7F5EF',
      surface: dark ? '#1B1D22' : '#FFFFFF',
      surfaceAlt: dark ? '#272A31' : '#EEE8DA',
      text: dark ? '#FFFFFF' : '#17181D',
      muted: dark ? '#B9BBC2' : '#666053',
      border: dark ? '#30333B' : '#DED5C4',
      danger: '#D9534F',
      success: '#38A169',
    },
    radius: 10,
    spacing: 16,
  };
}
