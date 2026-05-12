import * as Calendar from 'expo-calendar';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function notifyBookingConfirmed(title: string, body: string) {
  if (Platform.OS === 'web') return;
  await Notifications.requestPermissionsAsync();
  await Notifications.scheduleNotificationAsync({ content: { title, body }, trigger: null });
}

export async function addBookingToCalendar(title: string, startDate: Date, endDate: Date, location?: string) {
  if (Platform.OS === 'web') return;
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== 'granted') return;
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const calendar = calendars.find((item) => item.allowsModifications) ?? calendars[0];
  if (!calendar) return;
  await Calendar.createEventAsync(calendar.id, { title, startDate, endDate, location });
}
