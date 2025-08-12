import { supabase } from '../lib/supabase';

export async function getAuditLogs() {
  const { data, error } = await supabase.from('audit_logs').select('*').order('timestamp', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function logAudit(action: string, userId: string, userEmail: string) {
  const { data, error } = await supabase
    .from('audit_logs')
    .insert([{ action, user_id: userId, user_email: userEmail, timestamp: new Date().toISOString() }])
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function getAuditLogById(id: string) {
  const { data, error } = await supabase.from('audit_logs').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}