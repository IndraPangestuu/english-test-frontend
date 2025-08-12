import { supabase } from '../lib/supabase';

export async function getSettings() {
  const { data, error } = await supabase.from('settings').select('*').single();
  if (error) throw error;
  return data;
}

export async function updateSettings(updates: any) {
  const { data, error } = await supabase.from('settings').update(updates).eq('id', 1).select().single();
  if (error) throw error;
  return data;
}
export async function resetSettings() {
  const defaultSettings = {
    theme: 'light',
    notifications: true,
  };
  const { data, error } = await supabase.from('settings').update(defaultSettings).eq('id', 1).select().single();
  if (error) throw error;
  return data;
}