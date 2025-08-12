// ================================
// TYPE DEFINITIONS FOR ENGLISH TEST APP
// ================================

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'tutor' | 'student';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correct_answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  skill_focus?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Test {
  id: string;
  title: string;
  description?: string;
  tutor_id: string;
  duration_minutes: number;
  max_attempts: number;
  is_active: boolean;
  start_time?: string;
  end_time?: string;
  instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface TestQuestion {
  id: string;
  test_id: string;
  question_id: string;
  question_order: number;
  points: number;
  created_at: string;
}

export interface TestAssignment {
  id: string;
  test_id: string;
  student_id: string;
  tutor_id: string;
  assigned_at: string;
  due_date?: string;
  is_completed: boolean;
  attempts_used: number;
}

export interface TestSubmission {
  id: string;
  test_id: string;
  student_id: string;
  tutor_id?: string;
  status: 'in-progress' | 'completed' | 'abandoned' | 'reviewed';
  score: number;
  total_questions: number;
  correct_answers: number;
  time_taken?: number;
  started_at: string;
  completed_at?: string;
  reviewed_at?: string;
  feedback?: string;
  metadata?: Record<string, unknown>;
}

export interface TestAnswer {
  id: string;
  test_id: string;
  question_id: string;
  student_id: string;
  submission_id: string;
  answer: string;
  is_correct: boolean;
  time_spent?: number;
  answered_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  badge_color: string;
  criteria: Record<string, unknown>;
  points: number;
  is_active: boolean;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  related_test_id?: string;
}

export interface Analytics {
  id: string;
  user_id: string;
  metric_type: string;
  category?: string;
  skill?: string;
  value: number;
  metadata?: Record<string, unknown>;
  recorded_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
}

export interface Setting {
  id: string;
  key: string;
  value: unknown;
  description?: string;
  is_public: boolean;
  updated_by?: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    details?: string;
  };
}

// Form types
export interface QuestionFormData {
  text: string;
  options: string[];
  correct_answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  skill_focus?: string;
}

export interface TestFormData {
  title: string;
  description?: string;
  duration_minutes: number;
  max_attempts: number;
  start_time?: string;
  end_time?: string;
  instructions?: string;
  question_ids: string[];
  student_ids: string[];
}

// Component props types
export interface TestWithQuestions extends Test {
  questions: Question[];
}

export interface TestResult {
  title: string;
  score: number;
  total: number;
  questions: {
    id: string;
    text: string;
    your_answer: string;
    correct_answer: string;
    is_correct: boolean;
  }[];
}

// Dashboard data types
export interface DashboardStats {
  totalTests: number;
  totalQuestions: number;
  totalUsers: number;
  recentActivity: AuditLog[];
}

export interface StudentProgress {
  student_id: string;
  student_name: string;
  completed_tests: number;
  average_score: number;
  last_activity: string;
}

// Store types
export interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  fetchProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

export interface TestState {
  currentTest: TestWithQuestions | null;
  answers: Record<string, string>;
  timeRemaining: number;
  isSubmitting: boolean;
  setCurrentTest: (test: TestWithQuestions | null) => void;
  setAnswer: (questionId: string, answer: string) => void;
  setTimeRemaining: (time: number) => void;
  setSubmitting: (submitting: boolean) => void;
  resetTest: () => void;
}

export interface ThemeState {
  theme: 'light' | 'dark' | 'high-contrast';
  setTheme: (theme: 'light' | 'dark' | 'high-contrast') => void;
}