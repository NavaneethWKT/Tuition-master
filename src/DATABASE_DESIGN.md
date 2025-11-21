# Tuition Master - Database Design

## Overview
This document outlines the comprehensive database schema for the Tuition Master AI-powered educational platform. The design supports students, parents, teachers, and school administrators with features including AI tutoring, mock tests, answer evaluation, and content management.

---

## Database Schema

### 1. **schools**
Stores information about educational institutions using the platform.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique school identifier |
| name | VARCHAR(255) | NOT NULL | School name |
| address | TEXT | NOT NULL | School address |
| contact_phone | VARCHAR(20) | NOT NULL | Primary contact number |
| contact_email | VARCHAR(255) | NOT NULL, UNIQUE | Primary contact email |
| registration_date | TIMESTAMP | DEFAULT NOW() | When school registered |
| status | ENUM('active', 'inactive', 'suspended') | DEFAULT 'active' | School account status |
| logo_url | TEXT | NULL | School logo image URL |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_schools_email` on `contact_email`
- `idx_schools_status` on `status`

---

### 2. **users**
Core user table for all platform users (students, parents, teachers, admins).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique user identifier |
| school_id | UUID | FOREIGN KEY (schools.id) | Associated school |
| role | ENUM('student', 'parent', 'teacher', 'admin') | NOT NULL | User role |
| full_name | VARCHAR(255) | NOT NULL | User's full name |
| email | VARCHAR(255) | UNIQUE | Email address |
| phone | VARCHAR(20) | NOT NULL, UNIQUE | Phone number (primary login) |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| date_of_birth | DATE | NULL | Date of birth (for students) |
| profile_image_url | TEXT | NULL | Profile picture URL |
| status | ENUM('active', 'inactive', 'suspended') | DEFAULT 'active' | Account status |
| last_login | TIMESTAMP | NULL | Last login timestamp |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_users_email` on `email`
- `idx_users_phone` on `phone`
- `idx_users_school_role` on `school_id, role`

---

### 3. **students**
Extended information specific to students.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Student identifier |
| user_id | UUID | FOREIGN KEY (users.id), UNIQUE | Reference to users table |
| class_id | UUID | FOREIGN KEY (classes.id) | Current class/section |
| roll_number | VARCHAR(50) | NULL | Student roll number |
| parent_id | UUID | FOREIGN KEY (users.id) | Associated parent account |
| admission_date | DATE | NOT NULL | Date of admission |
| ai_credits | INTEGER | DEFAULT 100 | Available AI credits |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_students_class` on `class_id`
- `idx_students_parent` on `parent_id`
- `idx_students_roll` on `class_id, roll_number`

---

### 4. **teachers**
Extended information specific to teachers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Teacher identifier |
| user_id | UUID | FOREIGN KEY (users.id), UNIQUE | Reference to users table |
| subjects | TEXT[] | NOT NULL | Array of subjects taught |
| qualification | VARCHAR(255) | NULL | Educational qualification |
| experience_years | INTEGER | NULL | Years of teaching experience |
| joining_date | DATE | NOT NULL | Date of joining |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_teachers_user` on `user_id`

---

### 5. **classes**
Information about classes/sections in schools.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Class identifier |
| school_id | UUID | FOREIGN KEY (schools.id) | Associated school |
| grade | INTEGER | NOT NULL | Grade level (1-12) |
| section | VARCHAR(10) | NOT NULL | Section name (A, B, C, etc.) |
| class_teacher_id | UUID | FOREIGN KEY (teachers.id) | Class teacher |
| academic_year | VARCHAR(20) | NOT NULL | Academic year (e.g., 2025-26) |
| student_count | INTEGER | DEFAULT 0 | Number of students |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Unique Constraint:** `unique_class` on `school_id, grade, section, academic_year`

**Indexes:**
- `idx_classes_school` on `school_id`
- `idx_classes_teacher` on `class_teacher_id`

---

### 6. **subjects**
List of subjects available in the platform.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Subject identifier |
| school_id | UUID | FOREIGN KEY (schools.id) | Associated school |
| name | VARCHAR(255) | NOT NULL | Subject name |
| code | VARCHAR(50) | NULL | Subject code |
| description | TEXT | NULL | Subject description |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_subjects_school` on `school_id`

---

### 7. **syllabus**
Syllabus documents uploaded by schools/teachers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Syllabus identifier |
| school_id | UUID | FOREIGN KEY (schools.id) | Associated school |
| subject_id | UUID | FOREIGN KEY (subjects.id) | Subject |
| grade | INTEGER | NOT NULL | Grade level |
| title | VARCHAR(255) | NOT NULL | Syllabus title |
| file_url | TEXT | NOT NULL | PDF/document URL |
| file_size | BIGINT | NULL | File size in bytes |
| uploaded_by | UUID | FOREIGN KEY (users.id) | User who uploaded |
| upload_date | TIMESTAMP | DEFAULT NOW() | Upload timestamp |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_syllabus_school_grade` on `school_id, grade`
- `idx_syllabus_subject` on `subject_id`

---

### 8. **lessons**
Individual lessons/chapters for subjects.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Lesson identifier |
| subject_id | UUID | FOREIGN KEY (subjects.id) | Associated subject |
| grade | INTEGER | NOT NULL | Grade level |
| chapter_number | INTEGER | NOT NULL | Chapter number |
| title | VARCHAR(255) | NOT NULL | Lesson title |
| content | TEXT | NOT NULL | Lesson content (HTML/Markdown) |
| objectives | TEXT[] | NULL | Learning objectives |
| keywords | TEXT[] | NULL | Key concepts/keywords |
| estimated_duration | INTEGER | NULL | Duration in minutes |
| difficulty_level | ENUM('easy', 'medium', 'hard') | DEFAULT 'medium' | Difficulty level |
| created_by | UUID | FOREIGN KEY (users.id) | Creator user |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_lessons_subject_grade` on `subject_id, grade`
- `idx_lessons_chapter` on `subject_id, chapter_number`

---

### 9. **study_materials**
Notes, PDFs, and other study materials uploaded by teachers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Material identifier |
| class_id | UUID | FOREIGN KEY (classes.id) | Target class |
| subject_id | UUID | FOREIGN KEY (subjects.id) | Associated subject |
| teacher_id | UUID | FOREIGN KEY (teachers.id) | Uploading teacher |
| title | VARCHAR(255) | NOT NULL | Material title |
| description | TEXT | NULL | Material description |
| file_url | TEXT | NOT NULL | File URL |
| file_type | VARCHAR(50) | NOT NULL | File type (pdf, doc, ppt, etc.) |
| file_size | BIGINT | NULL | File size in bytes |
| download_count | INTEGER | DEFAULT 0 | Number of downloads |
| upload_date | TIMESTAMP | DEFAULT NOW() | Upload timestamp |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_materials_class` on `class_id`
- `idx_materials_subject` on `subject_id`
- `idx_materials_teacher` on `teacher_id`

---

### 10. **tests**
Mock tests and assessments created by teachers or AI.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Test identifier |
| class_id | UUID | FOREIGN KEY (classes.id) | Target class |
| subject_id | UUID | FOREIGN KEY (subjects.id) | Associated subject |
| created_by | UUID | FOREIGN KEY (users.id) | Creator (teacher) |
| title | VARCHAR(255) | NOT NULL | Test title |
| description | TEXT | NULL | Test instructions |
| test_type | ENUM('mcq', 'short', 'long', 'mixed') | NOT NULL | Test format |
| duration_minutes | INTEGER | NOT NULL | Test duration |
| total_marks | INTEGER | NOT NULL | Maximum marks |
| scheduled_date | TIMESTAMP | NULL | Scheduled test date |
| is_ai_generated | BOOLEAN | DEFAULT FALSE | Generated by AI |
| status | ENUM('draft', 'scheduled', 'active', 'completed') | DEFAULT 'draft' | Test status |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_tests_class` on `class_id`
- `idx_tests_subject` on `subject_id`
- `idx_tests_scheduled` on `scheduled_date`

---

### 11. **test_questions**
Individual questions within tests.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Question identifier |
| test_id | UUID | FOREIGN KEY (tests.id) | Associated test |
| question_number | INTEGER | NOT NULL | Question order |
| question_type | ENUM('mcq', 'short', 'long') | NOT NULL | Question type |
| question_text | TEXT | NOT NULL | Question content |
| options | JSONB | NULL | MCQ options (if applicable) |
| correct_answer | TEXT | NULL | Correct answer (for MCQ) |
| marks | INTEGER | NOT NULL | Marks for this question |
| difficulty_level | ENUM('easy', 'medium', 'hard') | DEFAULT 'medium' | Difficulty level |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_test_questions_test` on `test_id`

---

### 12. **test_submissions**
Student submissions for tests.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Submission identifier |
| test_id | UUID | FOREIGN KEY (tests.id) | Associated test |
| student_id | UUID | FOREIGN KEY (students.id) | Student who submitted |
| start_time | TIMESTAMP | NOT NULL | When student started |
| submit_time | TIMESTAMP | NULL | When student submitted |
| time_taken_minutes | INTEGER | NULL | Time taken to complete |
| total_score | DECIMAL(5,2) | NULL | Total score achieved |
| max_score | INTEGER | NOT NULL | Maximum possible score |
| percentage | DECIMAL(5,2) | NULL | Percentage score |
| status | ENUM('in_progress', 'submitted', 'evaluated') | DEFAULT 'in_progress' | Submission status |
| evaluated_by | UUID | FOREIGN KEY (users.id) | Teacher/AI who evaluated |
| evaluated_at | TIMESTAMP | NULL | Evaluation timestamp |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_submissions_test` on `test_id`
- `idx_submissions_student` on `student_id`
- `idx_submissions_status` on `status`

---

### 13. **test_answers**
Individual answers submitted by students.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Answer identifier |
| submission_id | UUID | FOREIGN KEY (test_submissions.id) | Associated submission |
| question_id | UUID | FOREIGN KEY (test_questions.id) | Question answered |
| answer_text | TEXT | NULL | Student's answer |
| answer_file_url | TEXT | NULL | Uploaded answer image/file |
| marks_obtained | DECIMAL(5,2) | NULL | Marks received |
| max_marks | INTEGER | NOT NULL | Maximum marks |
| is_correct | BOOLEAN | NULL | Correct/incorrect (for MCQ) |
| ai_feedback | TEXT | NULL | AI-generated feedback |
| teacher_feedback | TEXT | NULL | Teacher's feedback |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_answers_submission` on `submission_id`
- `idx_answers_question` on `question_id`

---

### 14. **answer_evaluations**
AI evaluations of uploaded handwritten answers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Evaluation identifier |
| student_id | UUID | FOREIGN KEY (students.id) | Student who submitted |
| subject_id | UUID | FOREIGN KEY (subjects.id) | Subject |
| answer_image_url | TEXT | NOT NULL | Uploaded answer image |
| question_text | TEXT | NULL | Question being answered |
| ai_score | INTEGER | NULL | AI-assigned score (0-100) |
| max_score | INTEGER | DEFAULT 100 | Maximum score |
| strengths | TEXT[] | NULL | Identified strengths |
| improvements | TEXT[] | NULL | Areas for improvement |
| suggestions | TEXT | NULL | AI suggestions |
| processed_at | TIMESTAMP | NULL | When AI processed |
| credits_used | INTEGER | DEFAULT 1 | AI credits consumed |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_evaluations_student` on `student_id`
- `idx_evaluations_subject` on `subject_id`

---

### 15. **ai_chat_sessions**
AI tutor chat sessions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Session identifier |
| student_id | UUID | FOREIGN KEY (students.id) | Student user |
| subject_id | UUID | FOREIGN KEY (subjects.id) | Subject discussed |
| session_title | VARCHAR(255) | NULL | Session title/topic |
| start_time | TIMESTAMP | DEFAULT NOW() | Session start time |
| end_time | TIMESTAMP | NULL | Session end time |
| message_count | INTEGER | DEFAULT 0 | Number of messages |
| credits_used | INTEGER | DEFAULT 0 | AI credits consumed |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_chat_sessions_student` on `student_id`
- `idx_chat_sessions_subject` on `subject_id`

---

### 16. **ai_chat_messages**
Individual messages in AI tutor chats.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Message identifier |
| session_id | UUID | FOREIGN KEY (ai_chat_sessions.id) | Chat session |
| role | ENUM('user', 'ai') | NOT NULL | Message sender |
| message_text | TEXT | NOT NULL | Message content |
| attachments | TEXT[] | NULL | Attached files/images |
| timestamp | TIMESTAMP | DEFAULT NOW() | Message timestamp |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |

**Indexes:**
- `idx_chat_messages_session` on `session_id`

---

### 17. **revision_topics**
Topics saved by students for revision.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Revision topic identifier |
| student_id | UUID | FOREIGN KEY (students.id) | Student who saved |
| lesson_id | UUID | FOREIGN KEY (lessons.id) | Associated lesson |
| subject_id | UUID | FOREIGN KEY (subjects.id) | Subject |
| title | VARCHAR(255) | NOT NULL | Topic title |
| notes | TEXT | NULL | Student's personal notes |
| added_date | TIMESTAMP | DEFAULT NOW() | When added to revision |
| last_reviewed | TIMESTAMP | NULL | Last review timestamp |
| review_count | INTEGER | DEFAULT 0 | Number of times reviewed |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_revision_student` on `student_id`
- `idx_revision_lesson` on `lesson_id`

---

### 18. **pdf_summaries**
AI-generated summaries of uploaded PDFs.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Summary identifier |
| student_id | UUID | FOREIGN KEY (students.id) | Student who uploaded |
| pdf_url | TEXT | NOT NULL | Original PDF URL |
| pdf_name | VARCHAR(255) | NOT NULL | PDF filename |
| pdf_size | BIGINT | NULL | File size in bytes |
| summary_data | JSONB | NOT NULL | AI-generated summary (structured) |
| key_concepts | TEXT[] | NULL | Extracted key concepts |
| formulas | TEXT[] | NULL | Extracted formulas |
| practice_tips | TEXT[] | NULL | AI-generated study tips |
| processed_at | TIMESTAMP | DEFAULT NOW() | Processing timestamp |
| credits_used | INTEGER | DEFAULT 2 | AI credits consumed |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_pdf_summaries_student` on `student_id`

---

### 19. **student_progress**
Track student learning progress.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Progress identifier |
| student_id | UUID | FOREIGN KEY (students.id) | Student |
| lesson_id | UUID | FOREIGN KEY (lessons.id) | Lesson |
| status | ENUM('not_started', 'in_progress', 'completed') | DEFAULT 'not_started' | Progress status |
| completion_percentage | INTEGER | DEFAULT 0 | Completion % (0-100) |
| time_spent_minutes | INTEGER | DEFAULT 0 | Time spent on lesson |
| last_accessed | TIMESTAMP | NULL | Last access timestamp |
| completed_at | TIMESTAMP | NULL | Completion timestamp |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Unique Constraint:** `unique_student_lesson` on `student_id, lesson_id`

**Indexes:**
- `idx_progress_student` on `student_id`
- `idx_progress_lesson` on `lesson_id`

---

### 20. **announcements**
Announcements posted by teachers/admins.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Announcement identifier |
| school_id | UUID | FOREIGN KEY (schools.id) | Associated school |
| created_by | UUID | FOREIGN KEY (users.id) | Creator (teacher/admin) |
| target_audience | ENUM('all', 'students', 'parents', 'teachers') | DEFAULT 'all' | Target audience |
| title | VARCHAR(255) | NOT NULL | Announcement title |
| message | TEXT | NOT NULL | Announcement content |
| priority | ENUM('low', 'medium', 'high') | DEFAULT 'medium' | Priority level |
| published_at | TIMESTAMP | DEFAULT NOW() | Publish timestamp |
| expires_at | TIMESTAMP | NULL | Expiry timestamp |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_announcements_school` on `school_id`
- `idx_announcements_active` on `is_active, published_at`

---

### 21. **analytics_events**
Track user activities for analytics.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Event identifier |
| user_id | UUID | FOREIGN KEY (users.id) | User who triggered event |
| event_type | VARCHAR(100) | NOT NULL | Event type |
| event_data | JSONB | NULL | Additional event data |
| timestamp | TIMESTAMP | DEFAULT NOW() | Event timestamp |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |

**Indexes:**
- `idx_analytics_user` on `user_id`
- `idx_analytics_type` on `event_type`
- `idx_analytics_timestamp` on `timestamp`

---

### 22. **credit_transactions**
Track AI credit purchases and usage.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Transaction identifier |
| student_id | UUID | FOREIGN KEY (students.id) | Student account |
| transaction_type | ENUM('purchase', 'usage', 'refund', 'bonus') | NOT NULL | Transaction type |
| amount | INTEGER | NOT NULL | Credit amount (+/-) |
| balance_after | INTEGER | NOT NULL | Balance after transaction |
| description | TEXT | NULL | Transaction description |
| reference_id | UUID | NULL | Reference to related record |
| timestamp | TIMESTAMP | DEFAULT NOW() | Transaction timestamp |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |

**Indexes:**
- `idx_credit_transactions_student` on `student_id`
- `idx_credit_transactions_type` on `transaction_type`

---

## Relationships Summary

### One-to-Many Relationships
- **schools** → **users** (one school has many users)
- **schools** → **classes** (one school has many classes)
- **schools** → **subjects** (one school has many subjects)
- **users** → **students** (one user can be one student)
- **users** → **teachers** (one user can be one teacher)
- **classes** → **students** (one class has many students)
- **subjects** → **lessons** (one subject has many lessons)
- **classes** → **study_materials** (one class has many materials)
- **tests** → **test_questions** (one test has many questions)
- **tests** → **test_submissions** (one test has many submissions)
- **students** → **test_submissions** (one student has many submissions)
- **students** → **revision_topics** (one student has many revision topics)
- **students** → **ai_chat_sessions** (one student has many chat sessions)

### Many-to-Many Relationships
- **teachers** ↔ **classes** (through class assignments)
- **students** ↔ **lessons** (through student_progress)

---

## Key Features of This Design

1. **Multi-tenancy**: School-based isolation for data
2. **Role-based Access**: Supports students, parents, teachers, and admins
3. **AI Integration**: Tracks AI usage, credits, and evaluations
4. **Content Management**: Syllabus, lessons, materials, and tests
5. **Progress Tracking**: Student progress and analytics
6. **Communication**: Announcements and notifications
7. **Scalability**: UUID primary keys, proper indexing
8. **Audit Trail**: Created_at and updated_at timestamps on all tables
9. **Flexibility**: JSONB fields for extensible data

---

## Sample Queries

### Get all class notes for a student
```sql
SELECT sm.*, s.name as subject_name, t.full_name as teacher_name
FROM study_materials sm
JOIN students st ON st.class_id = sm.class_id
JOIN subjects s ON sm.subject_id = s.id
JOIN teachers t ON sm.teacher_id = t.id
WHERE st.user_id = 'student_user_id'
ORDER BY sm.upload_date DESC;
```

### Get student's revision topics
```sql
SELECT rt.*, l.title as lesson_title, s.name as subject_name
FROM revision_topics rt
JOIN lessons l ON rt.lesson_id = l.id
JOIN subjects s ON rt.subject_id = s.id
WHERE rt.student_id = 'student_id'
ORDER BY rt.added_date DESC;
```

### Get AI credit balance
```sql
SELECT ai_credits
FROM students
WHERE user_id = 'user_id';
```

### Analytics: Most active students
```sql
SELECT u.full_name, COUNT(ae.id) as activity_count
FROM analytics_events ae
JOIN users u ON ae.user_id = u.id
WHERE u.role = 'student'
  AND ae.timestamp >= NOW() - INTERVAL '30 days'
GROUP BY u.id, u.full_name
ORDER BY activity_count DESC
LIMIT 10;
```

---

## Notes

- All tables use UUID for primary keys to ensure global uniqueness
- Timestamps are stored in UTC
- File URLs should point to cloud storage (S3, Azure Blob, etc.)
- JSONB columns allow flexible schema for AI-generated content
- Indexes are carefully placed for common query patterns
- Foreign key constraints ensure referential integrity
- Consider partitioning large tables (analytics_events, ai_chat_messages) by date for better performance
