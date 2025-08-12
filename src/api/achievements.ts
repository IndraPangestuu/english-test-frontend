import { supabase } from '../lib/supabase';

// -------------------- STUDENT --------------------
export async function getStudentAchievements() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Not logged in');

  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('student_id', user.id)
    .order('earned_at', { ascending: false });

  if (error) throw error;
  return data;
}

// -------------------- ADMIN/TUTOR --------------------
// Kalau nanti mau ada fitur tambah badge atau lihat semua pencapaian
export async function addAchievement(studentId: string, badgeName: string, description: string) {
  const { data, error } = await supabase.from('achievements').insert([
    {
      student_id: studentId,
      badge_name: badgeName,
      description,
      earned_at: new Date(),
    },
  ]);
  if (error) throw error;
  return data;
}
    