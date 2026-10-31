-- ============================================================================
-- PLACEHUB CAMPUS PLACEMENT SYSTEM - NEON POSTGRESQL QUERY AUDIT LOG
-- Target Database: Neon PostgreSQL (neondb)
-- Created: 2026-10-31T14:14:28.552Z
-- This file tracks all DDL, DML, and execution queries run against Neon.
-- ============================================================================


-- ============================================================================
-- [2026-10-31T14:15:18.335Z] DDL: CREATE TABLE users
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL,
    student_id INT,
    active BOOLEAN NOT NULL DEFAULT true,
    avatar VARCHAR(10),
    created_at DATE NOT NULL DEFAULT CURRENT_DATE
);

-- ============================================================================
-- [2026-10-31T14:15:19.131Z] DDL: CREATE TABLE students
-- ============================================================================
CREATE TABLE IF NOT EXISTS students (
    id INT PRIMARY KEY,
    roll_no VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(25),
    department VARCHAR(20) NOT NULL,
    batch VARCHAR(10) NOT NULL DEFAULT '2027',
    cgpa NUMERIC(4, 2) NOT NULL CHECK (cgpa >= 0.00 AND cgpa <= 10.00),
    active_backlogs INT NOT NULL DEFAULT 0,
    skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    resume_url TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'Unplaced',
    offers_count INT NOT NULL DEFAULT 0,
    highest_offer_lpa NUMERIC(6, 2)
);

-- ============================================================================
-- [2026-10-31T14:15:19.435Z] DDL: CREATE TABLE companies
-- ============================================================================
CREATE TABLE IF NOT EXISTS companies (
    id INT PRIMARY KEY,
    company_name VARCHAR(120) NOT NULL,
    logo VARCHAR(20),
    industry VARCHAR(100) NOT NULL,
    tier VARCHAR(30) NOT NULL,
    role_title VARCHAR(120) NOT NULL,
    role_type VARCHAR(40) NOT NULL DEFAULT 'Full-Time',
    ctc_lpa NUMERIC(6, 2) NOT NULL CHECK (ctc_lpa > 0),
    stipend_monthly NUMERIC(10, 2) NOT NULL DEFAULT 0,
    location VARCHAR(120) NOT NULL,
    min_cgpa NUMERIC(4, 2) NOT NULL DEFAULT 6.00,
    max_backlogs INT NOT NULL DEFAULT 0,
    eligible_depts JSONB NOT NULL DEFAULT '[]'::jsonb,
    eligible_batch VARCHAR(10) NOT NULL DEFAULT '2027',
    required_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    deadline DATE NOT NULL,
    drive_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Upcoming',
    description TEXT,
    applicants_count INT NOT NULL DEFAULT 0
);

-- ============================================================================
-- [2026-10-31T14:15:19.693Z] DDL: CREATE TABLE applications
-- ============================================================================
CREATE TABLE IF NOT EXISTS applications (
    id INT PRIMARY KEY,
    student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    student_name VARCHAR(100),
    roll_no VARCHAR(20),
    department VARCHAR(20),
    cgpa NUMERIC(4, 2),
    drive_id INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    company_name VARCHAR(120),
    role_title VARCHAR(120),
    ctc_lpa NUMERIC(6, 2),
    applied_date DATE NOT NULL DEFAULT CURRENT_DATE,
    stage VARCHAR(40) NOT NULL DEFAULT 'Applied',
    remarks TEXT,
    resume_url TEXT,
    history JSONB NOT NULL DEFAULT '[]'::jsonb,
    CONSTRAINT uk_student_drive UNIQUE (student_id, drive_id)
);

-- ============================================================================
-- [2026-10-31T14:15:19.952Z] VIEW: vw_placed_students_summary
-- ============================================================================
CREATE OR REPLACE VIEW vw_placed_students_summary AS
SELECT 
    s.id AS student_id,
    s.roll_no,
    s.name AS student_name,
    s.department,
    s.cgpa,
    s.status AS placement_status,
    s.highest_offer_lpa
FROM students s
WHERE s.status = 'Placed';

-- ============================================================================
-- [2026-10-31T14:15:20.203Z] VIEW: vw_branch_wise_placement_stats
-- ============================================================================
CREATE OR REPLACE VIEW vw_branch_wise_placement_stats AS
SELECT 
    s.department,
    COUNT(s.id) AS total_students,
    SUM(CASE WHEN s.status = 'Placed' THEN 1 ELSE 0 END) AS total_placed,
    ROUND(
        (SUM(CASE WHEN s.status = 'Placed' THEN 1 ELSE 0 END) * 100.0) / COUNT(s.id),
        2
    ) AS placement_percentage,
    ROUND(AVG(s.highest_offer_lpa), 2) AS average_ctc_lpa,
    MAX(s.highest_offer_lpa) AS highest_ctc_lpa
FROM students s
GROUP BY s.department;

-- ============================================================================
-- [2026-10-31T14:15:20.481Z] DML: TRUNCATE TABLES
-- ============================================================================
TRUNCATE TABLE applications, companies, students, users CASCADE;

-- ============================================================================
-- [2026-10-31T14:15:21.724Z] DML: INSERT 5 Users
-- ============================================================================
-- Inserted 5 users into 'users' table;

-- ============================================================================
-- [2026-10-31T14:15:34.269Z] DML: INSERT 50 Students
-- ============================================================================
-- Inserted 50 students into 'students' table;

-- ============================================================================
-- [2026-10-31T14:15:36.806Z] DML: INSERT 10 Companies
-- ============================================================================
-- Inserted 10 companies into 'companies' table;

-- ============================================================================
-- [2026-10-31T14:15:40.960Z] DML: INSERT 16 Applications
-- ============================================================================
-- Inserted 16 applications into 'applications' table;

-- ============================================================================
-- [2026-10-31T14:22:24.046Z] SELECT Users
-- ============================================================================
SELECT * FROM users ORDER BY id ASC;

-- ============================================================================
-- [2026-10-31T14:22:24.047Z] SELECT Students
-- ============================================================================
SELECT * FROM students ORDER BY id ASC;

-- ============================================================================
-- [2026-10-31T14:22:24.049Z] SELECT Companies
-- ============================================================================
SELECT * FROM companies ORDER BY id ASC;

-- ============================================================================
-- [2026-10-31T14:22:24.050Z] SELECT Applications
-- ============================================================================
SELECT * FROM applications ORDER BY id ASC;

-- ============================================================================
-- [2026-10-31T14:23:40.856Z] Interactive DBMS Explorer Query
-- ============================================================================
SELECT count(id) as total_students, round(avg(cgpa), 2) as avg_cgpa FROM students;

-- ============================================================================
-- [2026-10-31T14:30:18.907Z] SELECT Users
-- ============================================================================
SELECT * FROM users ORDER BY id ASC;

-- ============================================================================
-- [2026-10-31T14:30:18.909Z] SELECT Students
-- ============================================================================
SELECT * FROM students ORDER BY id ASC;

-- ============================================================================
-- [2026-10-31T14:30:18.910Z] SELECT Companies
-- ============================================================================
SELECT * FROM companies ORDER BY id ASC;

-- ============================================================================
-- [2026-10-31T14:30:18.910Z] SELECT Applications
-- ============================================================================
SELECT * FROM applications ORDER BY id ASC;

-- ============================================================================
-- [2026-10-31T14:30:19.006Z] SELECT Users
-- ============================================================================
SELECT * FROM users ORDER BY id ASC;

-- ============================================================================
-- [2026-10-31T14:30:19.007Z] SELECT Students
-- ============================================================================
SELECT * FROM students ORDER BY id ASC;

-- ============================================================================
-- [2026-10-31T14:30:19.008Z] SELECT Companies
-- ============================================================================
SELECT * FROM companies ORDER BY id ASC;

-- ============================================================================
-- [2026-10-31T14:30:19.009Z] SELECT Applications
-- ============================================================================
SELECT * FROM applications ORDER BY id ASC;

-- ============================================================================
-- [2026-10-31T14:30:19.086Z] SELECT Users
-- ============================================================================
SELECT * FROM users ORDER BY id ASC;

-- ============================================================================
-- [2026-10-31T14:30:19.087Z] SELECT Students
-- ============================================================================
SELECT * FROM students ORDER BY id ASC;

-- ============================================================================
-- [2026-10-31T14:30:19.087Z] SELECT Companies
-- ============================================================================
SELECT * FROM companies ORDER BY id ASC;

-- ============================================================================
-- [2026-10-31T14:30:19.087Z] SELECT Applications
-- ============================================================================
SELECT * FROM applications ORDER BY id ASC;
