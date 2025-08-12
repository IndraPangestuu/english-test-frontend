import { supabase } from '../lib/supabase';

// 📌 Ambil semua user (Admin)
export async function getAllUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// 📌 Hapus user (Admin)
export async function deleteUser(userId: string) {
  const { error } = await supabase.from('profiles').delete().eq('id', userId);
  if (error) throw error;
  return true;
}

// 📌 Ambil semua student (Tutor)
export async function getAllStudents() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('role', 'student')
    .order('full_name');

  if (error) throw error;
  return data;
}

// 📌 Update role user (Admin)
export async function updateUserRole(userId: string, newRole: 'admin' | 'tutor' | 'student') {
  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId);

  if (error) throw error;
  return true;
}

// 📌 Cari user by ID
export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}
