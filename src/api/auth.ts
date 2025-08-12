import { supabase } from '../lib/supabase';

// LOGIN
export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error };

  const user = data.user;
  if (!user) return { error: { message: 'User not found' } };

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) return { error: profileError };

  return { user, profile };
}

// REGISTER
export async function register(
  email: string,
  password: string,
  metadata: { full_name: string; role?: string }
) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { error };

  const user = data.user;
  if (!user) return { error: { message: 'Failed to create user' } };

  const { error: profileError } = await supabase.from('profiles').insert([
    { id: user.id, full_name: metadata.full_name, role: metadata.role || 'student' },
  ]);

  if (profileError) return { error: profileError };
  return { user };
}

// RESET PASSWORD
export async function resetPassword(email: string) {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
}

// LOGOUT
export async function logout() {
  return await supabase.auth.signOut();
}

// CURRENT USER + PROFILE
export async function getCurrentUserWithProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { user, profile };
}
// UPDATE PROFILE
export async function updateProfile(
  full_name: string,
  role: string,
  avatar_url?: string
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: { message: 'User not authenticated' } };

  const { error } = await supabase
    .from('profiles')
    .update({ full_name, role, avatar_url })
    .eq('id', user.id);

  if (error) return { error };
  
  return { message: 'Profile updated successfully' };
}