-- ============================================
-- SkillWeave SA — Learning Content Schema
-- Lessons, quizzes, and file uploads
-- ============================================

-- LESSONS (content units within a module)
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'video',
  content_url TEXT,
  content_html TEXT,
  duration_minutes INTEGER DEFAULT 10,
  position INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lessons_module ON lessons(module_id);

-- QUIZ QUESTIONS
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  correct_index INTEGER NOT NULL DEFAULT 0,
  explanation TEXT,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LESSON PROGRESS (per user per lesson)
CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id);

-- FILE UPLOADS tracking
CREATE TABLE IF NOT EXISTS file_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER DEFAULT 0,
  mime_type TEXT,
  purpose TEXT DEFAULT 'general',
  entity_type TEXT,
  entity_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_file_uploads_user ON file_uploads(user_id);

-- Allow authenticated users to read lessons
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lessons are readable by authenticated users" ON lessons FOR SELECT TO authenticated USING (is_published = true);

ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Quiz questions readable by authenticated" ON quiz_questions FOR SELECT TO authenticated USING (true);

ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own lesson progress" ON lesson_progress FOR ALL USING (auth.uid() = user_id);

ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own uploads" ON file_uploads FOR ALL USING (auth.uid() = user_id);

-- Seed sample lessons for Python module
INSERT INTO lessons (id, module_id, title, type, duration_minutes, position, content_html) VALUES
('00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0001-000000000003', 'Welcome & Course Overview', 'video', 8, 0, '<p>Welcome to Introduction to Programming with Python! In this module you will learn the fundamentals of programming.</p>'),
('00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0001-000000000003', 'Variables and Data Types', 'video', 15, 1, '<p>Learn about variables, strings, integers, floats, and booleans in Python.</p><pre>name = "Thabo"\nage = 25\nheight = 1.75\nis_student = True</pre>'),
('00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0001-000000000003', 'Practice: Variables', 'assessment', 10, 2, NULL),
('00000000-0000-0000-0005-000000000004', '00000000-0000-0000-0001-000000000003', 'Control Flow: If/Else', 'video', 18, 3, '<p>Learn conditional logic with if, elif, and else statements.</p>'),
('00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0001-000000000003', 'Loops and Iteration', 'video', 20, 4, '<p>Master for loops, while loops, and iteration patterns in Python.</p>'),
('00000000-0000-0000-0005-000000000006', '00000000-0000-0000-0001-000000000003', 'Practice: Loops', 'assessment', 15, 5, NULL),
('00000000-0000-0000-0005-000000000007', '00000000-0000-0000-0001-000000000003', 'Functions & Scope', 'reading', 12, 6, '<h3>Defining Functions</h3><p>In Python, you define a function using the <code>def</code> keyword:</p><pre>def greet(name):\n    return f"Hello, {name}!"</pre><h3>Scope</h3><p>Variables defined inside a function are local to that function.</p>'),
('00000000-0000-0000-0005-000000000008', '00000000-0000-0000-0001-000000000003', 'Data Structures: Lists & Dicts', 'video', 22, 7, '<p>Learn about lists, dictionaries, tuples, and sets.</p>'),
('00000000-0000-0000-0005-000000000009', '00000000-0000-0000-0001-000000000003', 'Practice: Data Structures', 'assessment', 15, 8, NULL),
('00000000-0000-0000-0005-000000000010', '00000000-0000-0000-0001-000000000003', 'Final Assessment', 'assessment', 30, 9, NULL)
ON CONFLICT (id) DO NOTHING;

-- Seed quiz questions for Practice: Loops lesson
INSERT INTO quiz_questions (id, lesson_id, question, options, correct_index, explanation, position) VALUES
('00000000-0000-0000-0006-000000000001', '00000000-0000-0000-0005-000000000006', 'What will this code print? for i in range(3): print(i)', '["1 2 3", "0 1 2", "0 1 2 3", "1 2"]', 1, 'range(3) generates 0, 1, 2', 0),
('00000000-0000-0000-0006-000000000002', '00000000-0000-0000-0005-000000000006', 'Which loop is best when you don''t know how many times to iterate?', '["for loop", "while loop", "do-while loop", "foreach loop"]', 1, 'while loops continue until a condition is false', 1),
('00000000-0000-0000-0006-000000000003', '00000000-0000-0000-0005-000000000006', 'What does the break statement do inside a loop?', '["Skips current iteration", "Exits the loop entirely", "Restarts the loop", "Pauses execution"]', 1, 'break immediately exits the loop', 2),
('00000000-0000-0000-0006-000000000004', '00000000-0000-0000-0005-000000000006', 'How do you loop through a dictionary''s keys and values?', '["for k, v in dict.items()", "for k in dict.keys()", "for v in dict.values()", "for i in range(len(dict))"]', 0, 'items() returns key-value pairs', 3),
('00000000-0000-0000-0006-000000000005', '00000000-0000-0000-0005-000000000006', 'What is a list comprehension?', '["A way to understand lists better", "A compact way to create lists from iterables", "A function that lists all variables", "A debugging tool for lists"]', 1, 'List comprehensions provide concise syntax for creating lists', 4)
ON CONFLICT (id) DO NOTHING;

-- Seed quiz questions for Practice: Variables lesson
INSERT INTO quiz_questions (id, lesson_id, question, options, correct_index, explanation, position) VALUES
('00000000-0000-0000-0006-000000000006', '00000000-0000-0000-0005-000000000003', 'Which is a valid variable name in Python?', '["2name", "my-var", "my_name", "class"]', 2, 'Variable names can contain letters, numbers, and underscores but cannot start with a number', 0),
('00000000-0000-0000-0006-000000000007', '00000000-0000-0000-0005-000000000003', 'What type is the value 3.14?', '["int", "str", "float", "bool"]', 2, '3.14 is a floating-point number', 1),
('00000000-0000-0000-0006-000000000008', '00000000-0000-0000-0005-000000000003', 'What does type("hello") return?', '["<class ''int''>", "<class ''str''>", "<class ''list''>", "<class ''bool''>"]', 1, 'Strings have type str', 2)
ON CONFLICT (id) DO NOTHING;
