import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'pt',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  resources: {
    pt: { translation: {
      home: 'Início', schedule: 'Agendar', bookings: 'Agendamentos', profile: 'Perfil', settings: 'Definições',
      helloName: 'Olá, {{name}}!', welcome: 'Agenda premium para barbearias', login: 'Entrar',
      google: 'Entrar com Google', loyalty: 'Fidelidade', offers: 'Ofertas', appointments: 'Os meus agendamentos',
      about: 'Sobre Nós', confirm: 'Confirmar', next: 'Continuar', cancel: 'Cancelar', history: 'Histórico',
      language: 'Idioma', darkMode: 'Modo escuro', notifications: 'Notificações', terms: 'Termos e Privacidade',
      logout: 'Terminar sessão'
    } },
    en: { translation: {
      home: 'Home', schedule: 'Book', bookings: 'Bookings', profile: 'Profile', settings: 'Settings',
      helloName: 'Hello, {{name}}!', welcome: 'Premium booking for barbershops', login: 'Sign in',
      google: 'Continue with Google', loyalty: 'Loyalty', offers: 'Offers', appointments: 'My bookings',
      about: 'About Us', confirm: 'Confirm', next: 'Continue', cancel: 'Cancel', history: 'History',
      language: 'Language', darkMode: 'Dark mode', notifications: 'Notifications', terms: 'Terms and Privacy',
      logout: 'Sign out'
    } }
  }
});

export default i18n;
