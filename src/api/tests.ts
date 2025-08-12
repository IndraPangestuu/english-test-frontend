import { supabase } from '../lib/supabase';

// -------------------- ADMIN --------------------
export async function getAllTests() {
  const { data, error } = await supabase
    .from('tests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function deleteTest(testId: string) {
  const { error } = await supabase.from('tests').delete().eq('id', testId);
  if (error) throw error;
  return true;
}

// -------------------- TUTOR --------------------
export async function createTest({
  title,
  question_ids,
  student_ids,
}: {
  title: string;
  question_ids: string[];
  student_ids: string[];
}) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Not logged in');

  const { data: newTest, error: testError } = await supabase
    .from('tests')
    .insert([{ title, tutor_id: user.id }])
    .select()
    .single();
  if (testError) throw testError;

  const questionAssignments = question_ids.map((qid) => ({
    test_id: newTest.id,
    question_id: qid,
  }));
  const { error: qError } = await supabase.from('test_questions').insert(questionAssignments);
  if (qError) throw qError;

  const studentAssignments = student_ids.map((sid) => ({
    test_id: newTest.id,
    student_id: sid,
    tutor_id: user.id,
  }));
  const { error: sError } = await supabase.from('test_assignments').insert(studentAssignments);
  if (sError) throw sError;

  return newTest;
}

export async function getTestsForReview() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Not logged in');

  const { data, error } = await supabase
    .from('test_submissions')
    .select('id, test_id, tests(title), student_id, profiles(full_name), status')
    .eq('tutor_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    title: row.tests[0].title,
    student_name: row.profiles[0].full_name,
    status: row.status,
  }));
}

export async function submitReview(testSubmissionId: string, { status }: { status: string }) {
  const { error } = await supabase
    .from('test_submissions')
    .update({ status })
    .eq('id', testSubmissionId);
  if (error) throw error;
  return true;
}

// -------------------- STUDENT --------------------
export async function getAssignedTests() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Not logged in');

  const { data, error } = await supabase
    .from('test_assignments')
    .select('test_id, tests(title, tutor_id, profiles!tests_tutor_id_fkey(full_name))')
    .eq('student_id', user.id);

  if (error) throw error;

  return data.map((a) => ({
    id: a.test_id,
    title: a.tests[0].title,
    tutor_name: a.tests[0].profiles[0].full_name,
  }));
}

export async function startTest(testId: string) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Not logged in');

  const { error } = await supabase.from('test_submissions').insert([
    {
      test_id: testId,
      student_id: user.id,
      tutor_id: null, // opsional
      status: 'in-progress',
    },
  ]);

  if (error) throw error;
  return true;
}

export async function getTestHistory() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Not logged in');

  const { data, error } = await supabase
    .from('test_submissions')
    .select('id, test_id, tests(title), score, completed_at')
    .eq('student_id', user.id)
    .order('completed_at', { ascending: false });

  if (error) throw error;

  return data.map((t) => ({
    id: t.id,
    test_title: t.tests[0].title,
    score: t.score,
    completed_at: t.completed_at,
  }));
}

// -------------------- TEST ENGINE --------------------
export async function getTestById(testId: string) {
  const { data, error } = await supabase
    .from('tests')
    .select(`
      id,
      title,
      test_questions(
        question_id,
        questions(
          id,
          text,
          options
        )
      )
    `)
    .eq('id', testId)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    title: data.title,
    questions: data.test_questions.map((tq: any) => tq.questions),
  };
}

export async function submitTestAnswers(testId: string, answers: Record<string, string>) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Not logged in');

  // Fetch correct answers
  const { data: questions, error: qError } = await supabase
    .from('questions')
    .select('id, correct_answer')
    .in('id', Object.keys(answers));
  if (qError) throw qError;

  let score = 0;
  const answerRecords = questions.map((q) => {
    const isCorrect = answers[q.id] === q.correct_answer;
    if (isCorrect) score++;
    return {
      test_id: testId,
      question_id: q.id,
      student_id: user.id,
      answer: answers[q.id],
      is_correct: isCorrect,
    };
  });

  // Save answers
  const { error: aError } = await supabase.from('test_answers').insert(answerRecords);
  if (aError) throw aError;

  // Update submission
  const { error: sError } = await supabase
    .from('test_submissions')
    .update({
      score,
      completed_at: new Date(),
      status: 'completed',
    })
    .eq('test_id', testId)
    .eq('student_id', user.id);
  if (sError) throw sError;

  return { score, total: questions.length };
}

export async function getTestResult(testId: string) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Not logged in');

  // Get submission info
  const { data: submission, error: subError } = await supabase
    .from('test_submissions')
    .select('score')
    .eq('test_id', testId)
    .eq('student_id', user.id)
    .single();
  if (subError) throw subError;

  // Get questions + answers
  const { data: qData, error: qError } = await supabase
    .from('test_answers')
    .select('question_id, answer, is_correct, questions(text, correct_answer)')
    .eq('test_id', testId)
    .eq('student_id', user.id);
  if (qError) throw qError;

  return {
    title: `Test #${testId}`,
    score: submission.score,
    total: qData.length,
    questions: qData.map((qa) => ({
      id: qa.question_id,
      text: qa.questions[0].text,
      your_answer: qa.answer,
      correct_answer: qa.questions[0].correct_answer,
      is_correct: qa.is_correct,
    })),
  };
}
