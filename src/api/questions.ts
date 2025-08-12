import { supabase } from '../lib/supabase';
import type { Question } from '../types';

export async function getAllQuestions() {
  const { data, error } = await supabase.from('questions').select('*');
  if (error) throw error;
  return data || [];
}

export async function getQuestionById(id: string) {
  const { data, error } = await supabase.from('questions').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createQuestion(question: Omit<Question, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase.from('questions').insert([question]).select().single();
  if (error) throw error;
  return data;
}

export async function updateQuestion(id: string, updates: Partial<Question>) {
  const { data, error } = await supabase.from('questions').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteQuestion(id: string) {
  const { error } = await supabase.from('questions').delete().eq('id', id);
  if (error) throw error;
  return true;
}
