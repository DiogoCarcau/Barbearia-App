import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type React from 'react';
import { buildTheme, ThemeMode } from '../constants/theme';
import { supabase } from '../lib/supabase';
import { Barbeiro, FotoFeed, Localizacao, Perfil, Tenant } from '../lib/types';
import { useAuth } from './useAuth';

type TenantContextValue = {
  tenant: Tenant | null;
  localizacoes: Localizacao[];
  barbeiros: Barbeiro[];
  feed: FotoFeed[];
  perfil: Perfil | null;
  selectedLocationId: string | null;
  setSelectedLocationId: (id: string | null) => void;
  loading: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  theme: ReturnType<typeof buildTheme>;
  refresh: () => Promise<void>;
};

const TenantContext = createContext<TenantContextValue | null>(null);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([]);
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);
  const [feed, setFeed] = useState<FotoFeed[]>([]);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');
  const [loading, setLoading] = useState(true);
  const tenantSlug = process.env.EXPO_PUBLIC_TENANT_SLUG;

  async function refresh() {
    setLoading(true);
    const query = supabase.from('tenants').select('*').eq('ativo', true);
    const { data: tenantData } = tenantSlug ? await query.eq('slug', tenantSlug).maybeSingle() : await query.limit(1).maybeSingle();
    setTenant(tenantData ?? null);
    if (tenantData) {
      const [locationsResult, barbersResult, feedResult, profileResult] = await Promise.all([
        supabase.from('localizacoes').select('*').eq('tenant_id', tenantData.id).eq('ativo', true).order('nome'),
        supabase.from('barbeiros').select('*').eq('tenant_id', tenantData.id).eq('ativo', true).order('ordem'),
        supabase.from('fotos_feed').select('*').eq('tenant_id', tenantData.id).eq('ativo', true).order('ordem'),
        user ? supabase.from('utilizadores').select('*').eq('tenant_id', tenantData.id).eq('id', user.id).maybeSingle() : Promise.resolve({ data: null }),
      ]);
      setLocalizacoes((locationsResult.data ?? []) as Localizacao[]);
      setBarbeiros((barbersResult.data ?? []) as Barbeiro[]);
      setFeed((feedResult.data ?? []) as FotoFeed[]);
      setPerfil((profileResult.data ?? null) as Perfil | null);
      setSelectedLocationId((current) => current ?? locationsResult.data?.[0]?.id ?? null);
    }
    setLoading(false);
  }

  useEffect(() => { AsyncStorage.getItem('themeMode').then((value) => value && setThemeModeState(value as ThemeMode)); }, []);
  useEffect(() => { refresh(); }, [tenantSlug, user?.id]);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await AsyncStorage.setItem('themeMode', mode);
  };

  const theme = useMemo(() => buildTheme(tenant, themeMode), [tenant, themeMode]);
  const value = useMemo(() => ({ tenant, localizacoes, barbeiros, feed, perfil, selectedLocationId, setSelectedLocationId, loading, themeMode, setThemeMode, theme, refresh }), [tenant, localizacoes, barbeiros, feed, perfil, selectedLocationId, loading, themeMode, theme]);
  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  const value = useContext(TenantContext);
  if (!value) throw new Error('useTenant deve ser usado dentro de TenantProvider.');
  return value;
}
