import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://YOUR-PROJECT.supabase.co';
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR-ANON-KEY';

export const supabase = createClient(url, anon);
