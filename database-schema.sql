-- ================================
-- ENGLISH TEST APPLICATION DATABASE SCHEMA
-- ================================
-- Database schema untuk aplikasi English Test
-- Support untuk role-based access: admin, tutor, student
-- Features: Authentication, Test Management, Question Bank, Achievements, Audit Logs

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================
-- 1. PROFILES TABLE (User Management)
-- ================================
-- Table untuk menyimpan profile user dengan role-based access
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'tutor', 'student')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes untuk optimasi query
CREATE INDEX profiles_role_idx ON profiles(role);
CREATE INDEX profiles_email_idx ON profiles(email);
CREATE INDEX profiles_created_at_idx ON profiles(created_at);

-- ================================
-- 2. QUESTIONS TABLE (Question Bank)
-- ================================
-- Table untuk menyimpan bank soal
CREATE TABLE questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    text TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of options: ["A", "B", "C", "D"]
    correct_answer TEXT NOT NULL,
    difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    category TEXT NOT NULL DEFAULT 'general', -- grammar, vocabulary, reading, listening, etc.
    skill_focus TEXT, -- specific skill being tested
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes untuk optimasi query
CREATE INDEX questions_category_idx ON questions(category);
CREATE INDEX questions_difficulty_idx ON questions(difficulty);
CREATE INDEX questions_created_by_idx ON questions(created_by);
CREATE INDEX questions_skill_focus_idx ON questions(skill_focus);

-- ================================
-- 3. TESTS TABLE (Test Management)
-- ================================
-- Table untuk menyimpan test yang dibuat
CREATE TABLE tests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    tutor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    duration_minutes INTEGER DEFAULT 60,
    max_attempts INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX tests_tutor_id_idx ON tests(tutor_id);
CREATE INDEX tests_is_active_idx ON tests(is_active);
CREATE INDEX tests_created_at_idx ON tests(created_at);

-- ================================
-- 4. TEST_QUESTIONS TABLE (Test-Question Relationship)
-- ================================
-- Junction table untuk menghubungkan test dengan questions
CREATE TABLE test_questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    question_order INTEGER DEFAULT 1,
    points DECIMAL(5,2) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Unique constraint untuk mencegah duplikasi
ALTER TABLE test_questions ADD CONSTRAINT unique_test_question UNIQUE (test_id, question_id);

-- Indexes
CREATE INDEX test_questions_test_id_idx ON test_questions(test_id);
CREATE INDEX test_questions_question_id_idx ON test_questions(question_id);
CREATE INDEX test_questions_order_idx ON test_questions(question_order);

-- ================================
-- 5. TEST_ASSIGNMENTS TABLE (Student Test Assignment)
-- ================================
-- Table untuk assign test ke student
CREATE TABLE test_assignments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    tutor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE,
    is_completed BOOLEAN DEFAULT false,
    attempts_used INTEGER DEFAULT 0
);

-- Unique constraint
ALTER TABLE test_assignments ADD CONSTRAINT unique_test_student UNIQUE (test_id, student_id);

-- Indexes
CREATE INDEX test_assignments_test_id_idx ON test_assignments(test_id);
CREATE INDEX test_assignments_student_id_idx ON test_assignments(student_id);
CREATE INDEX test_assignments_tutor_id_idx ON test_assignments(tutor_id);
CREATE INDEX test_assignments_due_date_idx ON test_assignments(due_date);

-- ================================
-- 6. TEST_SUBMISSIONS TABLE (Test Attempts & Results)
-- ================================
-- Table untuk menyimpan submission/attempt test
CREATE TABLE test_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    tutor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'in-progress' CHECK (status IN ('in-progress', 'completed', 'abandoned', 'reviewed')),
    score DECIMAL(5,2) DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    time_taken INTEGER, -- in seconds
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    feedback TEXT,
    metadata JSONB -- untuk menyimpan data tambahan seperti browser info, ip, etc.
);

-- Indexes
CREATE INDEX test_submissions_test_id_idx ON test_submissions(test_id);
CREATE INDEX test_submissions_student_id_idx ON test_submissions(student_id);
CREATE INDEX test_submissions_status_idx ON test_submissions(status);
CREATE INDEX test_submissions_completed_at_idx ON test_submissions(completed_at);
CREATE INDEX test_submissions_score_idx ON test_submissions(score);

-- ================================
-- 7. TEST_ANSWERS TABLE (Individual Question Answers)
-- ================================
-- Table untuk menyimpan jawaban per question
CREATE TABLE test_answers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    submission_id UUID REFERENCES test_submissions(id) ON DELETE CASCADE,
    answer TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false,
    time_spent INTEGER, -- time spent on this question in seconds
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX test_answers_submission_id_idx ON test_answers(submission_id);
CREATE INDEX test_answers_test_id_idx ON test_answers(test_id);
CREATE INDEX test_answers_student_id_idx ON test_answers(student_id);
CREATE INDEX test_answers_question_id_idx ON test_answers(question_id);
CREATE INDEX test_answers_is_correct_idx ON test_answers(is_correct);

-- ================================
-- 8. ACHIEVEMENTS TABLE (Badge & Reward System)
-- ================================
-- Table untuk menyimpan achievement/badge system
CREATE TABLE achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT, -- icon class or image url
    badge_color TEXT DEFAULT '#3B82F6',
    criteria JSONB NOT NULL, -- criteria untuk mendapat achievement
    points INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sample achievements
INSERT INTO achievements (name, description, icon, badge_color, criteria, points) VALUES
('First Test', 'Complete your first test', '🎯', '#10B981', '{"type": "test_completed", "count": 1}', 10),
('Perfect Score', 'Get 100% on any test', '⭐', '#F59E0B', '{"type": "perfect_score", "count": 1}', 50),
('Speed Demon', 'Complete a test in under 10 minutes', '⚡', '#EF4444', '{"type": "time_based", "max_time": 600}', 25),
('Consistent Learner', 'Complete 5 tests', '📚', '#8B5CF6', '{"type": "test_completed", "count": 5}', 30),
('Grammar Master', 'Score 90%+ on 3 grammar tests', '📝', '#06B6D4', '{"type": "category_mastery", "category": "grammar", "min_score": 90, "count": 3}', 40);

-- ================================
-- 9. USER_ACHIEVEMENTS TABLE (User Achievement Tracking)
-- ================================
-- Junction table untuk track achievement user
CREATE TABLE user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    related_test_id UUID REFERENCES tests(id) ON DELETE SET NULL
);

-- Unique constraint
ALTER TABLE user_achievements ADD CONSTRAINT unique_user_achievement UNIQUE (user_id, achievement_id);

-- Indexes
CREATE INDEX user_achievements_user_id_idx ON user_achievements(user_id);
CREATE INDEX user_achievements_achievement_id_idx ON user_achievements(achievement_id);
CREATE INDEX user_achievements_earned_at_idx ON user_achievements(earned_at);

-- ================================
-- 10. ANALYTICS TABLE (Performance Analytics)
-- ================================
-- Table untuk menyimpan analytics data
CREATE TABLE analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    metric_type TEXT NOT NULL, -- 'skill_progress', 'category_performance', 'time_analysis'
    category TEXT, -- grammar, vocabulary, reading, etc.
    skill TEXT, -- specific skill
    value DECIMAL(10,2) NOT NULL,
    metadata JSONB,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX analytics_user_id_idx ON analytics(user_id);
CREATE INDEX analytics_metric_type_idx ON analytics(metric_type);
CREATE INDEX analytics_category_idx ON analytics(category);
CREATE INDEX analytics_recorded_at_idx ON analytics(recorded_at);

-- ================================
-- 11. AUDIT_LOGS TABLE (System Audit Trail)
-- ================================
-- Table untuk menyimpan audit logs untuk admin
CREATE TABLE audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- 'login', 'create_test', 'delete_user', etc.
    resource_type TEXT, -- 'user', 'test', 'question', etc.
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX audit_logs_user_id_idx ON audit_logs(user_id);
CREATE INDEX audit_logs_action_idx ON audit_logs(action);
CREATE INDEX audit_logs_resource_type_idx ON audit_logs(resource_type);
CREATE INDEX audit_logs_timestamp_idx ON audit_logs(timestamp);

-- ================================
-- 12. SETTINGS TABLE (Application Settings)
-- ================================
-- Table untuk menyimpan system settings
CREATE TABLE settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false, -- whether setting is visible to non-admins
    updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Default settings
INSERT INTO settings (key, value, description, is_public) VALUES
('app_name', '"English Test Platform"', 'Application name', true),
('default_test_duration', '60', 'Default test duration in minutes', false),
('max_test_attempts', '3', 'Maximum test attempts per student', false),
('enable_achievements', 'true', 'Enable achievement system', true),
('anti_cheat_enabled', 'true', 'Enable anti-cheating measures', false),
('theme_options', '["light", "dark", "high-contrast"]', 'Available theme options', true);

-- ================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ================================
-- PROFILES POLICIES
-- ================================
-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Admins can manage all profiles
CREATE POLICY "Admins can manage profiles" ON profiles FOR ALL TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
) 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Tutors can read their students
CREATE POLICY "Tutors can read their students" ON profiles FOR SELECT TO authenticated 
USING (
    role = 'student' AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'tutor')
    )
);

-- ================================
-- QUESTIONS POLICIES
-- ================================
-- All authenticated users can read questions
CREATE POLICY "Authenticated users can read questions" ON questions FOR SELECT TO authenticated USING (true);

-- Admins and tutors can manage questions
CREATE POLICY "Admins and tutors can manage questions" ON questions FOR ALL TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'tutor')
    )
) 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'tutor')
    )
);

-- ================================
-- TESTS POLICIES
-- ================================
-- Admins can read all tests
CREATE POLICY "Admins can read all tests" ON tests FOR SELECT TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Tutors can read their own tests
CREATE POLICY "Tutors can read own tests" ON tests FOR SELECT TO authenticated 
USING (tutor_id = auth.uid());

-- Students can read assigned tests
CREATE POLICY "Students can read assigned tests" ON tests FOR SELECT TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM test_assignments 
        WHERE test_id = tests.id AND student_id = auth.uid()
    )
);

-- Admins and tutors can manage tests
CREATE POLICY "Admins and tutors can manage tests" ON tests FOR INSERT TO authenticated 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'tutor')
    )
);

CREATE POLICY "Tutors can update own tests" ON tests FOR UPDATE TO authenticated 
USING (tutor_id = auth.uid()) 
WITH CHECK (tutor_id = auth.uid());

CREATE POLICY "Admins can update all tests" ON tests FOR UPDATE TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
) 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- ================================
-- TEST_SUBMISSIONS POLICIES
-- ================================
-- Students can read their own submissions
CREATE POLICY "Students can read own submissions" ON test_submissions FOR SELECT TO authenticated 
USING (student_id = auth.uid());

-- Tutors can read submissions for their tests
CREATE POLICY "Tutors can read their test submissions" ON test_submissions FOR SELECT TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM tests 
        WHERE id = test_submissions.test_id AND tutor_id = auth.uid()
    )
);

-- Admins can read all submissions
CREATE POLICY "Admins can read all submissions" ON test_submissions FOR SELECT TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Students can create their own submissions
CREATE POLICY "Students can create submissions" ON test_submissions FOR INSERT TO authenticated 
WITH CHECK (student_id = auth.uid());

-- Students can update their own in-progress submissions
CREATE POLICY "Students can update own submissions" ON test_submissions FOR UPDATE TO authenticated 
USING (student_id = auth.uid() AND status = 'in-progress') 
WITH CHECK (student_id = auth.uid());

-- ================================
-- ACHIEVEMENTS POLICIES
-- ================================
-- Everyone can read achievements
CREATE POLICY "Everyone can read achievements" ON achievements FOR SELECT TO authenticated USING (is_active = true);

-- Admins can manage achievements
CREATE POLICY "Admins can manage achievements" ON achievements FOR ALL TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
) 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- ================================
-- USER_ACHIEVEMENTS POLICIES
-- ================================
-- Users can read their own achievements
CREATE POLICY "Users can read own achievements" ON user_achievements FOR SELECT TO authenticated 
USING (user_id = auth.uid());

-- System can insert achievements (this would typically be done via functions)
CREATE POLICY "System can insert achievements" ON user_achievements FOR INSERT TO authenticated 
WITH CHECK (true);

-- ================================
-- SETTINGS POLICIES
-- ================================
-- Everyone can read public settings
CREATE POLICY "Everyone can read public settings" ON settings FOR SELECT TO authenticated 
USING (is_public = true);

-- Admins can read all settings
CREATE POLICY "Admins can read all settings" ON settings FOR SELECT TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Admins can manage settings
CREATE POLICY "Admins can manage settings" ON settings FOR ALL TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
) 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- ================================
-- AUDIT_LOGS POLICIES
-- ================================
-- Only admins can read audit logs
CREATE POLICY "Admins can read audit logs" ON audit_logs FOR SELECT TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- System can insert audit logs
CREATE POLICY "System can insert audit logs" ON audit_logs FOR INSERT TO authenticated 
WITH CHECK (true);

-- ================================
-- FUNCTIONS & TRIGGERS
-- ================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_tests_updated_at BEFORE UPDATE ON tests FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', new.email),
        new.email,
        COALESCE(new.raw_user_meta_data->>'role', 'student')
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to calculate test score
CREATE OR REPLACE FUNCTION calculate_test_score(submission_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    correct_count INTEGER;
    total_count INTEGER;
    score DECIMAL;
BEGIN
    SELECT 
        COUNT(*) FILTER (WHERE is_correct = true),
        COUNT(*)
    INTO correct_count, total_count
    FROM test_answers
    WHERE test_answers.submission_id = $1;
    
    IF total_count = 0 THEN
        RETURN 0;
    END IF;
    
    score := (correct_count::DECIMAL / total_count::DECIMAL) * 100;
    
    -- Update the submission with the calculated score
    UPDATE test_submissions 
    SET 
        score = calculate_test_score.score,
        correct_answers = correct_count,
        total_questions = total_count
    WHERE id = $1;
    
    RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Function to check and award achievements
CREATE OR REPLACE FUNCTION check_achievements(user_id UUID)
RETURNS VOID AS $$
DECLARE
    achievement_record RECORD;
    user_test_count INTEGER;
    user_perfect_scores INTEGER;
BEGIN
    -- Check each achievement
    FOR achievement_record IN SELECT * FROM achievements WHERE is_active = true
    LOOP
        -- Check if user already has this achievement
        IF NOT EXISTS (
            SELECT 1 FROM user_achievements 
            WHERE user_achievements.user_id = $1 AND achievement_id = achievement_record.id
        ) THEN
            -- Check criteria based on type
            IF achievement_record.criteria->>'type' = 'test_completed' THEN
                SELECT COUNT(*) INTO user_test_count
                FROM test_submissions
                WHERE student_id = $1 AND status = 'completed';
                
                IF user_test_count >= (achievement_record.criteria->>'count')::INTEGER THEN
                    INSERT INTO user_achievements (user_id, achievement_id)
                    VALUES ($1, achievement_record.id);
                END IF;
                
            ELSIF achievement_record.criteria->>'type' = 'perfect_score' THEN
                SELECT COUNT(*) INTO user_perfect_scores
                FROM test_submissions
                WHERE student_id = $1 AND status = 'completed' AND score = 100;
                
                IF user_perfect_scores >= (achievement_record.criteria->>'count')::INTEGER THEN
                    INSERT INTO user_achievements (user_id, achievement_id)
                    VALUES ($1, achievement_record.id);
                END IF;
            END IF;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ================================
-- SAMPLE DATA FOR TESTING
-- ================================

-- Sample questions
INSERT INTO questions (text, options, correct_answer, difficulty, category, skill_focus) VALUES
('What is the past tense of "go"?', '["went", "gone", "goes", "going"]', 'went', 'easy', 'grammar', 'verb_tenses'),
('Choose the correct article: "I saw ___ elephant at the zoo."', '["a", "an", "the", "no article"]', 'an', 'easy', 'grammar', 'articles'),
('What does "ubiquitous" mean?', '["rare", "everywhere", "beautiful", "expensive"]', 'everywhere', 'hard', 'vocabulary', 'word_meaning'),
('Which sentence is grammatically correct?', '["She don''t like coffee", "She doesn''t like coffee", "She not like coffee", "She no like coffee"]', 'She doesn''t like coffee', 'medium', 'grammar', 'negation'),
('What is the synonym of "happy"?', '["sad", "angry", "joyful", "tired"]', 'joyful', 'easy', 'vocabulary', 'synonyms');

-- ================================
-- END OF SCHEMA
-- ================================

-- To use this schema:
-- 1. Copy this SQL content
-- 2. Run it in your Supabase SQL editor
-- 3. Make sure to configure your Supabase project URL and anon key in your React app
-- 4. The RLS policies ensure data security based on user roles
-- 5. The triggers handle automatic profile creation and timestamp updates
-- 6. The functions provide business logic for scoring and achievements

COMMENT ON SCHEMA public IS 'English Test Application Database Schema - Complete schema with RLS policies, triggers, and sample data';