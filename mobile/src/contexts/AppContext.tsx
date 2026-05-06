import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { I18nManager } from 'react-native';
import i18n from '../i18n';
import { supabase } from '../services/supabase';

type Lang = 'pt' | 'en';
type ThemeMode = 'dark' | 'light';

type AppCtx = {
  user: any;
  theme: ThemeMode;
  lang: Lang;
  notifications: boolean;
  setTheme: (v: ThemeMode) => Promise<void>;
  setLang: (v: Lang) => Promise<void>;
  setNotifications: (v: boolean) => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AppCtx>({} as AppCtx);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [lang, setLangState] = useState<Lang>('pt');
  const [notifications, setNotificationsState] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    (async () => {
      const storedTheme = (await AsyncStorage.getItem('theme')) as ThemeMode | null;
      const storedLang = (await AsyncStorage.getItem('lang')) as Lang | null;
      const storedNotifications = await AsyncStorage.getItem('notifications');
      if (storedTheme) setThemeState(storedTheme);
      if (storedLang) {
        setLangState(storedLang);
        i18n.changeLanguage(storedLang);
      }
      if (storedNotifications !== null) setNotificationsState(storedNotifications === 'true');
    })();
    return () => listener.subscription.unsubscribe();
  }, []);

  const setTheme = async (value: ThemeMode) => {
    setThemeState(value);
    await AsyncStorage.setItem('theme', value);
  };

  const setLang = async (value: Lang) => {
    setLangState(value);
    await i18n.changeLanguage(value);
    I18nManager.forceRTL(false);
    await AsyncStorage.setItem('lang', value);
  };

  const setNotifications = async (value: boolean) => {
    setNotificationsState(value);
    await AsyncStorage.setItem('notifications', String(value));
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = useMemo(
    () => ({ user, theme, lang, notifications, setTheme, setLang, setNotifications, signOut }),
    [user, theme, lang, notifications],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useApp = () => useContext(Ctx);
