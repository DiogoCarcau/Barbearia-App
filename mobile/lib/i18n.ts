import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'pt',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  resources: {
    pt: { translation: {
      home: 'Início', book: 'Agendar', bookings: 'Agendamentos', profile: 'Perfil', settings: 'Definições',
      login: 'Entrar', register: 'Criar conta', forgotPassword: 'Recuperar password', logout: 'Terminar sessão',
      noTenant: 'Barbearia não configurada', configureTenant: 'Define EXPO_PUBLIC_TENANT_SLUG ou cria um tenant ativo no Supabase.',
      bookNow: 'Agendar agora', points: 'Pontos', nextLevel: 'Próximo nível', upcoming: 'Próximos', history: 'Histórico',
      save: 'Guardar', cancel: 'Cancelar', repeat: 'Repetir', about: 'Sobre nós', route: 'Como chegar',
      darkMode: 'Modo escuro', language: 'Idioma', notifications: 'Notificações', deleteAccount: 'Eliminar conta',
    } },
    en: { translation: {
      home: 'Home', book: 'Book', bookings: 'Bookings', profile: 'Profile', settings: 'Settings',
      login: 'Sign in', register: 'Create account', forgotPassword: 'Reset password', logout: 'Sign out',
      noTenant: 'Barbershop not configured', configureTenant: 'Set EXPO_PUBLIC_TENANT_SLUG or create an active tenant in Supabase.',
      bookNow: 'Book now', points: 'Points', nextLevel: 'Next level', upcoming: 'Upcoming', history: 'History',
      save: 'Save', cancel: 'Cancel', repeat: 'Repeat', about: 'About us', route: 'Directions',
      darkMode: 'Dark mode', language: 'Language', notifications: 'Notifications', deleteAccount: 'Delete account',
    } },
  },
});

export default i18n;
