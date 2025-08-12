import { supabase } from '../lib/supabase';

// 📊 Admin: statistik umum
export async function getOverallStats() {
  const [{ count: total_users }, { count: total_tests }, { count: total_questions }] =
    await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('tests').select('*', { count: 'exact', head: true }),
      supabase.from('questions').select('*', { count: 'exact', head: true }),
    ]);

  return { total_users, total_tests, total_questions };
}

// 📊 Tutor: statistik milik tutor
export async function getTutorStats() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Not logged in');

  const [{ count: total_tests }, { count: total_questions }, { count: total_students }] =
    await Promise.all([
      supabase
        .from('tests')
        .select('*', { count: 'exact', head: true })
        .eq('tutor_id', user.id),
      supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('tutor_id', user.id),
      supabase
        .from('test_assignments')
        .select('student_id', { count: 'exact', head: true })
        .eq('tutor_id', user.id),
    ]);

  return { total_tests, total_questions, total_students };
}

// 📊 Tutor: laporan performa siswa
export async function getTutorReports() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Not logged in');

  const { data, error } = await supabase
    .from('student_scores_view') // View berisi data agregat
    .select('*')
    .eq('tutor_id', user.id);

  if (error) throw error;
  return data;
}

// 📊 Admin / Tutor: heatmap skill
export async function getSkillHeatmap(userId?: string) {
  let query = supabase.from('skill_performance_view').select('*');
  if (userId) query = query.eq('student_id', userId);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
