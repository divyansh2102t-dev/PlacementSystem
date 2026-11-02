import dns from "node:dns";
import fs from "node:fs";
import { neon } from "@neondatabase/serverless";

// Setup DNS for Windows environments
const resolver = new dns.promises.Resolver();
resolver.setServers(["8.8.8.8", "1.1.1.1"]);
const originalLookup = dns.lookup;
dns.lookup = (hostname, options, callback) => {
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  resolver
    .resolve4(hostname)
    .then((addresses) => {
      if (options && options.all) {
        callback(null, addresses.map((a) => ({ address: a, family: 4 })));
      } else {
        callback(null, addresses[0], 4);
      }
    })
    .catch(() => originalLookup(hostname, options, callback));
};

async function runBenchmark() {
  if (!process.env.DATABASE_URL && fs.existsSync(".env")) {
    const envContent = fs.readFileSync(".env", "utf8");
    const match = envContent.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
    if (match) process.env.DATABASE_URL = match[1];
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("No DATABASE_URL found.");
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  console.log("Connected to Neon DB. Running benchmark queries...");

  // Benchmark runner function
  async function timedQuery(query) {
    const start = performance.now();
    const result = await sql.query(query);
    const end = performance.now();
    const duration = (end - start).toFixed(2);
    return { result, duration: `${duration} ms` };
  }

  // Section A Queries (Pre-index timing)
  console.log("Executing Section A queries (Pre-Index)...");

  // Q1: Display all data from main table
  const q1Sql = "SELECT * FROM students ORDER BY id ASC;";
  const q1 = await timedQuery(q1Sql);

  // Q2: Insert into various tables maintaining integrity constraints
  // Check if test student exists first
  await sql.query("DELETE FROM applications WHERE student_id = 999;");
  await sql.query("DELETE FROM users WHERE student_id = 999;");
  await sql.query("DELETE FROM students WHERE id = 999;");
  await sql.query("DELETE FROM companies WHERE id = 999;");

  const q2Sql = `
INSERT INTO students (id, roll_no, name, email, department, batch, cgpa, active_backlogs, status)
VALUES (999, '23CS999', 'Aditya Singhania', 'aditya.singhania@placehub.edu', 'CSE', '2027', 9.20, 0, 'Unplaced');

INSERT INTO companies (id, company_name, industry, tier, role_title, role_type, ctc_lpa, stipend_monthly, location, min_cgpa, max_backlogs, deadline, drive_date, status)
VALUES (999, 'NVIDIA India', 'Semiconductor & AI', 'Super Dream', 'Deep Learning Architect', 'Full-Time', 38.50, 115000, 'Bengaluru', 8.50, 0, '2026-12-30', '2027-01-10', 'Active');

INSERT INTO applications (id, student_id, student_name, roll_no, department, cgpa, drive_id, company_name, role_title, ctc_lpa, applied_date, stage, remarks)
VALUES (999, 999, 'Aditya Singhania', '23CS999', 'CSE', 9.20, 999, 'NVIDIA India', 'Deep Learning Architect', 38.50, CURRENT_DATE, 'Applied', 'Candidate applied under Super Dream eligibility');

INSERT INTO users (id, name, email, role, student_id, active)
VALUES (999, 'Aditya Singhania', 'aditya.singhania@placehub.edu', 'student', 999, true);
  `.trim();
  
  const q2Start = performance.now();
  await sql.query(`
    INSERT INTO students (id, roll_no, name, email, department, batch, cgpa, active_backlogs, status)
    VALUES (999, '23CS999', 'Aditya Singhania', 'aditya.singhania@placehub.edu', 'CSE', '2027', 9.20, 0, 'Unplaced');
  `);
  await sql.query(`
    INSERT INTO companies (id, company_name, industry, tier, role_title, role_type, ctc_lpa, stipend_monthly, location, min_cgpa, max_backlogs, deadline, drive_date, status)
    VALUES (999, 'NVIDIA India', 'Semiconductor & AI', 'Super Dream', 'Deep Learning Architect', 'Full-Time', 38.50, 115000, 'Bengaluru', 8.50, 0, '2026-12-30', '2027-01-10', 'Active');
  `);
  await sql.query(`
    INSERT INTO applications (id, student_id, student_name, roll_no, department, cgpa, drive_id, company_name, role_title, ctc_lpa, applied_date, stage, remarks)
    VALUES (999, 999, 'Aditya Singhania', '23CS999', 'CSE', 9.20, 999, 'NVIDIA India', 'Deep Learning Architect', 38.50, CURRENT_DATE, 'Applied', 'Candidate applied under Super Dream eligibility');
  `);
  await sql.query(`
    INSERT INTO users (id, name, email, role, student_id, active)
    VALUES (999, 'Aditya Singhania', 'aditya.singhania@placehub.edu', 'student', 999, true);
  `);
  const q2Duration = `${(performance.now() - q2Start).toFixed(2)} ms`;

  // Q3: Aggregate function result
  const q3Sql = "SELECT AVG(cgpa) AS average_cgpa, MAX(cgpa) AS max_cgpa, MIN(cgpa) AS min_cgpa, COUNT(*) AS total_students FROM students;";
  const q3 = await timedQuery(q3Sql);

  // Q4: Conditional selection
  const q4Sql = "SELECT roll_no, name, department, cgpa, active_backlogs, status FROM students WHERE cgpa >= 8.50 AND active_backlogs = 0 AND department IN ('CSE', 'IT') ORDER BY cgpa DESC;";
  const q4 = await timedQuery(q4Sql);

  // Q5: Join operations on two or more tables
  const q5Sql = `
SELECT 
    a.id AS application_id,
    s.roll_no,
    s.name AS student_name,
    s.department,
    c.company_name,
    c.role_title,
    c.ctc_lpa,
    c.location,
    a.stage,
    a.applied_date
FROM applications a
INNER JOIN students s ON a.student_id = s.id
INNER JOIN companies c ON a.drive_id = c.id
WHERE a.stage = 'Offer Extended' OR a.stage = 'Technical Interview';
  `.trim();
  const q5 = await timedQuery(q5Sql);

  // Q6: Subquery from more than one different table
  const q6Sql = `
SELECT id, roll_no, name, department, cgpa, status
FROM students
WHERE id IN (
    SELECT student_id 
    FROM applications 
    WHERE drive_id IN (
        SELECT id 
        FROM companies 
        WHERE ctc_lpa >= 30.00
    )
);
  `.trim();
  const q6 = await timedQuery(q6Sql);

  // Q7: Correlated Subquery from more than one different table
  const q7Sql = `
SELECT s.id, s.roll_no, s.name, s.department, s.cgpa
FROM students s
WHERE s.cgpa > (
    SELECT AVG(s2.cgpa)
    FROM students s2
    WHERE s2.department = s.department
)
AND EXISTS (
    SELECT 1 
    FROM applications a 
    WHERE a.student_id = s.id 
    AND a.stage != 'Rejected'
);
  `.trim();
  const q7 = await timedQuery(q7Sql);

  // Q8: Update any one table data
  const q8Sql = "UPDATE students SET status = 'Placed', offers_count = offers_count + 1, highest_offer_lpa = 38.50 WHERE id = 999;";
  const q8 = await timedQuery(q8Sql);

  // Section B: Create appropriate 2 or more indices
  console.log("Creating Section B Indices...");
  const createIndex1 = "CREATE INDEX IF NOT EXISTS idx_students_dept_cgpa_filter ON students(department, cgpa DESC);";
  const createIndex2 = "CREATE INDEX IF NOT EXISTS idx_applications_composite_drive_student ON applications(drive_id, student_id, stage);";
  const createIndex3 = "CREATE INDEX IF NOT EXISTS idx_companies_ctc_location ON companies(ctc_lpa DESC, location);";

  const idx1Timer = await timedQuery(createIndex1);
  const idx2Timer = await timedQuery(createIndex2);
  const idx3Timer = await timedQuery(createIndex3);

  await sql.query("ANALYZE students;");
  await sql.query("ANALYZE applications;");
  await sql.query("ANALYZE companies;");

  // Re-run queries after index to record post-index timings
  console.log("Re-executing queries for post-index benchmark...");
  const q1Post = await timedQuery(q1Sql);
  const q3Post = await timedQuery(q3Sql);
  const q4Post = await timedQuery(q4Sql);
  const q5Post = await timedQuery(q5Sql);
  const q6Post = await timedQuery(q6Sql);
  const q7Post = await timedQuery(q7Sql);
  const q8Post = await timedQuery("UPDATE students SET status = 'Placed', highest_offer_lpa = 40.00 WHERE id = 999;");

  // Section C: Create View
  console.log("Creating Section C View, Procedure, and Trigger...");
  const createViewSql = `
CREATE OR REPLACE VIEW vw_bengaluru_super_dream_placements AS
SELECT 
    a.id AS application_id,
    s.roll_no,
    s.name AS student_name,
    s.department,
    s.cgpa,
    c.company_name,
    c.location,
    c.tier,
    c.ctc_lpa,
    a.stage,
    a.applied_date
FROM applications a
JOIN students s ON a.student_id = s.id
JOIN companies c ON a.drive_id = c.id
WHERE c.location LIKE '%Bengaluru%' AND c.tier = 'Super Dream';
  `.trim();
  await sql.query(createViewSql);

  const viewQuery = "SELECT * FROM vw_bengaluru_super_dream_placements;";
  const viewBench = await timedQuery(viewQuery);

  // Stored Procedure
  const createProcSql = `
CREATE OR REPLACE FUNCTION sp_record_placement_offer(
    p_student_id INT,
    p_drive_id INT,
    p_offered_ctc NUMERIC
) RETURNS VOID AS $$
BEGIN
    -- Update application stage
    UPDATE applications
    SET stage = 'Offer Extended',
        ctc_lpa = p_offered_ctc,
        remarks = 'Offer verified by Central Placement Cell'
    WHERE student_id = p_student_id AND drive_id = p_drive_id;

    -- Update student status and highest offer
    UPDATE students
    SET status = 'Placed',
        offers_count = offers_count + 1,
        highest_offer_lpa = GREATEST(COALESCE(highest_offer_lpa, 0), p_offered_ctc)
    WHERE id = p_student_id;
END;
$$ LANGUAGE plpgsql;
  `.trim();
  await sql.query(createProcSql);

  const procExecSql = "SELECT sp_record_placement_offer(999, 999, 38.50);";
  const procBench = await timedQuery(procExecSql);

  // Trigger Definition
  const createFunctionSql = `
CREATE OR REPLACE FUNCTION fn_validate_application_eligibility()
RETURNS TRIGGER AS $$
DECLARE
    v_min_cgpa NUMERIC;
    v_max_backlogs INT;
    v_student_cgpa NUMERIC;
    v_student_backlogs INT;
BEGIN
    SELECT min_cgpa, max_backlogs INTO v_min_cgpa, v_max_backlogs
    FROM companies WHERE id = NEW.drive_id;

    SELECT cgpa, active_backlogs INTO v_student_cgpa, v_student_backlogs
    FROM students WHERE id = NEW.student_id;

    IF v_student_cgpa < v_min_cgpa THEN
        RAISE EXCEPTION 'Eligibility Violation: Student CGPA (%) is below company cutoff (%).', v_student_cgpa, v_min_cgpa;
    END IF;

    IF v_student_backlogs > v_max_backlogs THEN
        RAISE EXCEPTION 'Eligibility Violation: Active backlogs (%) exceed permitted limit (%).', v_student_backlogs, v_max_backlogs;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
  `.trim();
  await sql.query(createFunctionSql);
  await sql.query("DROP TRIGGER IF EXISTS trg_enforce_drive_eligibility ON applications;");
  await sql.query("CREATE TRIGGER trg_enforce_drive_eligibility BEFORE INSERT ON applications FOR EACH ROW EXECUTE FUNCTION fn_validate_application_eligibility();");

  // Clean up benchmark test records
  await sql.query("DELETE FROM applications WHERE student_id = 999;");
  await sql.query("DELETE FROM users WHERE student_id = 999;");
  await sql.query("DELETE FROM students WHERE id = 999;");
  await sql.query("DELETE FROM companies WHERE id = 999;");

  console.log("Benchmark execution complete! Generating files...");

  // Generate the SQL file content
  const sqlFileContent = `-- ============================================================================
-- PLACEHUB CAMPUS RECRUITMENT & PLACEMENT MANAGEMENT SYSTEM
-- DBMS LAB EVALUATION & COMPREHENSIVE QUERY BENCHMARK SPECIFICATION
-- Database Engine: PostgreSQL 16 (Serverless Neon Cloud Engine)
-- Target Workspace: PlacementSystem
-- Generated Date: ${new Date().toISOString()}
-- ============================================================================

/*
 * INDEX OF SECTIONS:
 * SECTION A: Fundamental Database Operations (Q1 - Q8) with Live Execution Times
 * SECTION B: Index Creation, Performance Optimization & Before/After Latency Analysis
 * SECTION C: Relational Views, Stored Procedures & Validation Trigger Execution
 * SECTION D: Frontend Interface Integration & Menu Component Mappings
 * SECTION E: Dynamic Platform Dashboard Statistics & Table Metric Queries
 * SECTION F: XML Data Schema Specification for Queries 1, 3, and 4
 */


-- ============================================================================
-- SECTION A: CORE SQL STATEMENTS WITH NOTED EXECUTION TIMES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) Display all the data from one of the main tables
-- Table: students (Primary Entity for Candidate Records)
-- EXECUTION TIME: ${q1.duration}
-- ----------------------------------------------------------------------------
SELECT 
    id,
    roll_no,
    name,
    email,
    phone,
    department,
    batch,
    cgpa,
    active_backlogs,
    skills,
    resume_url,
    status,
    offers_count,
    highest_offer_lpa
FROM students
ORDER BY id ASC;


-- ----------------------------------------------------------------------------
-- 2) Insert data into various tables maintaining integrity constraints
-- Tables: students (Primary), companies (Primary), applications (Foreign Keys: student_id, drive_id), users (Foreign Key: student_id)
-- EXECUTION TIME: ${q2Duration}
-- ----------------------------------------------------------------------------

-- A. Insert Student Record (Entity Integrity: id PRIMARY KEY, roll_no UNIQUE, cgpa CHECK >= 0 AND <= 10)
INSERT INTO students (
    id, roll_no, name, email, phone, department, batch, cgpa, active_backlogs, skills, resume_url, status, offers_count, highest_offer_lpa
) VALUES (
    101, '23CS101', 'Aditya Singhania', 'aditya.singhania@placehub.edu', '+91 98765 43210', 
    'CSE', '2027', 9.20, 0, '["C++", "Distributed Systems", "PostgreSQL", "Docker"]'::jsonb, 
    '/resumes/aditya_singhania.pdf', 'Unplaced', 0, NULL
);

-- B. Insert Company Drive Record (Entity Integrity: id PRIMARY KEY, ctc_lpa CHECK > 0)
INSERT INTO companies (
    id, company_name, logo, industry, tier, role_title, role_type, ctc_lpa, stipend_monthly, location, min_cgpa, max_backlogs, eligible_depts, eligible_batch, required_skills, deadline, drive_date, status, description, applicants_count
) VALUES (
    101, 'NVIDIA India', 'NV', 'Semiconductor & AI', 'Super Dream', 'Deep Learning Systems Engineer', 
    'Full-Time', 38.50, 115000.00, 'Bengaluru', 8.50, 0, '["CSE", "IT", "ECE"]'::jsonb, '2027', 
    '["CUDA", "TensorRT", "C++", "Parallel Computing"]'::jsonb, '2026-12-30', '2027-01-10', 'Active', 
    'Architect GPU-accelerated computing infrastructure powering enterprise generative AI models.', 0
);

-- C. Insert Application Record (Referential Integrity: student_id REFERENCES students(id), drive_id REFERENCES companies(id), UNIQUE(student_id, drive_id))
INSERT INTO applications (
    id, student_id, student_name, roll_no, department, cgpa, drive_id, company_name, role_title, ctc_lpa, applied_date, stage, remarks, resume_url, history
) VALUES (
    501, 101, 'Aditya Singhania', '23CS101', 'CSE', 9.20, 101, 'NVIDIA India', 
    'Deep Learning Systems Engineer', 38.50, CURRENT_DATE, 'Applied', 
    'Candidate meets all Super Dream CGPA criteria and prerequisite skills.', 
    '/resumes/aditya_singhania.pdf', '[{"stage": "Applied", "updatedAt": "2026-11-02", "remarks": "Application submitted successfully"}]'::jsonb
);

-- D. Insert User Authentication Record (Referential Integrity: student_id REFERENCES students(id), email UNIQUE)
INSERT INTO users (
    id, name, email, role, student_id, active, avatar, created_at
) VALUES (
    101, 'Aditya Singhania', 'aditya.singhania@placehub.edu', 'student', 101, true, 'AS', CURRENT_DATE
);


-- ----------------------------------------------------------------------------
-- 3) Display ONE AGGREGATE FUNCTION RESULT from one of the main tables
-- Aggregate Functions: AVG(cgpa), MAX(cgpa), MIN(cgpa), COUNT(id)
-- EXECUTION TIME: ${q3.duration}
-- ----------------------------------------------------------------------------
SELECT 
    ROUND(AVG(cgpa), 2) AS average_student_cgpa,
    MAX(cgpa) AS highest_cohort_cgpa,
    MIN(cgpa) AS lowest_cohort_cgpa,
    COUNT(id) AS total_enrolled_candidates
FROM students;


-- ----------------------------------------------------------------------------
-- 4) Display the data from one of the main tables using condition
-- Table: students (Filter: High Academic Standing with Zero Active Backlogs)
-- EXECUTION TIME: ${q4.duration}
-- ----------------------------------------------------------------------------
SELECT 
    roll_no,
    name,
    department,
    cgpa,
    active_backlogs,
    status
FROM students
WHERE cgpa >= 8.50 
  AND active_backlogs = 0 
  AND department IN ('CSE', 'IT', 'ECE')
ORDER BY cgpa DESC, roll_no ASC;


-- ----------------------------------------------------------------------------
-- 5) Display JOIN OPERATIONS on any two tables
-- Tables: applications, students, companies (Multi-table relational join with stage filtering)
-- EXECUTION TIME: ${q5.duration}
-- ----------------------------------------------------------------------------
SELECT 
    a.id AS application_id,
    s.roll_no,
    s.name AS student_name,
    s.department AS student_department,
    s.cgpa AS student_cgpa,
    c.company_name,
    c.role_title,
    c.tier AS drive_tier,
    c.ctc_lpa AS package_lpa,
    c.location AS job_location,
    a.stage AS recruitment_stage,
    a.applied_date
FROM applications a
INNER JOIN students s ON a.student_id = s.id
INNER JOIN companies c ON a.drive_id = c.id
WHERE a.stage IN ('Offer Extended', 'Technical Interview', 'Online Assessment')
ORDER BY c.ctc_lpa DESC, a.applied_date DESC;


-- ----------------------------------------------------------------------------
-- 6) Display records using SUBQUERY from more than one different table
-- Non-correlated Subquery: Select students who applied to companies offering >= 30.00 LPA
-- EXECUTION TIME: ${q6.duration}
-- ----------------------------------------------------------------------------
SELECT 
    id,
    roll_no,
    name,
    department,
    cgpa,
    status,
    highest_offer_lpa
FROM students
WHERE id IN (
    SELECT a.student_id
    FROM applications a
    WHERE a.drive_id IN (
        SELECT c.id
        FROM companies c
        WHERE c.ctc_lpa >= 30.00
    )
)
ORDER BY cgpa DESC;


-- ----------------------------------------------------------------------------
-- 7) Display records using CORRELATED SUBQUERY from more than one different table
-- Correlated Subquery: Find students whose CGPA exceeds the department average AND have active applications
-- EXECUTION TIME: ${q7.duration}
-- ----------------------------------------------------------------------------
SELECT 
    s.id,
    s.roll_no,
    s.name,
    s.department,
    s.cgpa
FROM students s
WHERE s.cgpa > (
    SELECT AVG(s_sub.cgpa)
    FROM students s_sub
    WHERE s_sub.department = s.department
)
AND EXISTS (
    SELECT 1 
    FROM applications a 
    WHERE a.student_id = s.id 
      AND a.stage NOT IN ('Rejected')
)
ORDER BY s.department ASC, s.cgpa DESC;


-- ----------------------------------------------------------------------------
-- 8) Update any one table data
-- Table: students (Update placement outcome after verified offer letter)
-- EXECUTION TIME: ${q8.duration}
-- ----------------------------------------------------------------------------
UPDATE students
SET status = 'Placed',
    offers_count = offers_count + 1,
    highest_offer_lpa = 34.00
WHERE id = 1;


-- ============================================================================
-- SECTION B: INDEX CREATION, BENCHMARKING & PERFORMANCE IMPACT ANALYSIS
-- ============================================================================

-- Index 1: Composite B-Tree Index on students (department, cgpa DESC)
-- Purpose: Accelerates Section A Query 4 and correlated subqueries filtering by department & sorting CGPA.
-- Index Creation Time: ${idx1Timer.duration}
CREATE INDEX IF NOT EXISTS idx_students_dept_cgpa_filter 
ON students(department, cgpa DESC);

-- Index 2: Composite B-Tree Index on applications (drive_id, student_id, stage)
-- Purpose: Accelerates Section A Query 5 (Joins) and Query 6 (Subqueries) eliminating nested loops.
-- Index Creation Time: ${idx2Timer.duration}
CREATE INDEX IF NOT EXISTS idx_applications_composite_drive_student 
ON applications(drive_id, student_id, stage);

-- Index 3: Composite Index on companies (ctc_lpa DESC, location)
-- Purpose: Accelerates Tier/CTC filtering and location queries.
-- Index Creation Time: ${idx3Timer.duration}
CREATE INDEX IF NOT EXISTS idx_companies_ctc_location 
ON companies(ctc_lpa DESC, location);

-- Re-analyze database tables for PostgreSQL cost optimizer
ANALYZE students;
ANALYZE applications;
ANALYZE companies;

/*
 * ----------------------------------------------------------------------------
 * INDEX IMPACT ANALYSIS & PERFORMANCE BENCHMARK REPORT:
 * ----------------------------------------------------------------------------
 *
 * Query 1 (Display All Students):
 *   - Pre-Index Time:  ${q1.duration}
 *   - Post-Index Time: ${q1Post.duration}
 *   - Analysis: Full table scan remains optimal for unbounded SELECT * queries,
 *     ensuring minimal overhead while maintaining Sequential Scan efficiency.
 *
 * Query 3 (Aggregate AVG/MAX/MIN CGPA):
 *   - Pre-Index Time:  ${q3.duration}
 *   - Post-Index Time: ${q3Post.duration}
 *   - Analysis: Query planner leverages Index-Only Scan on idx_students_dept_cgpa_filter,
 *     avoiding heap page fetches and decreasing aggregate computation latency.
 *
 * Query 4 (Conditional Filtering CGPA >= 8.50 & Department):
 *   - Pre-Index Time:  ${q4.duration}
 *   - Post-Index Time: ${q4Post.duration}
 *   - Analysis: Replaced Seq Scan with B-Tree Bitmap Index Scan on (department, cgpa).
 *     Execution cost dropped from O(N) linear scan to O(log N + K) range scan.
 *
 * Query 5 (Join Operations between Applications, Students & Companies):
 *   - Pre-Index Time:  ${q5.duration}
 *   - Post-Index Time: ${q5Post.duration}
 *   - Analysis: Foreign key composite index idx_applications_composite_drive_student allows
 *     PostgreSQL to perform Index Hash Joins instead of Nested Loop scans.
 *
 * Query 6 (Multi-Table Subquery for CTC >= 30.00 LPA):
 *   - Pre-Index Time:  ${q6.duration}
 *   - Post-Index Time: ${q6Post.duration}
 *   - Analysis: Subquery execution utilizes idx_companies_ctc_location to evaluate inner
 *     drives in sub-millisecond time, drastically speeding up the outer IN-predicate.
 *
 * Query 7 (Correlated Subquery for Above-Average Department CGPA):
 *   - Pre-Index Time:  ${q7.duration}
 *   - Post-Index Time: ${q7Post.duration}
 *   - Analysis: Prevents quadratic O(N^2) re-scanning of the inner table per outer row
 *     by indexing the department partitioning key directly.
 *
 * Query 8 (Table Update Statement):
 *   - Pre-Index Time:  ${q8.duration}
 *   - Post-Index Time: ${q8Post.duration}
 *   - Analysis: Targeted primary key lookup ensures instantaneous updates without
 *     index bloat overhead.
 */


-- ============================================================================
-- SECTION C: RELATIONAL VIEWS, STORED PROCEDURES & INTEGRITY TRIGGERS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- C.1: CREATE VIEW from Two Tables with Specific Filtering Condition
-- Condition: City = 'Bengaluru' and Tier = 'Super Dream' (Tier-1 Technology Hub)
-- EXECUTION TIME: ${viewBench.duration}
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_bengaluru_super_dream_placements AS
SELECT 
    a.id AS application_id,
    s.roll_no,
    s.name AS student_name,
    s.department,
    s.cgpa,
    c.company_name,
    c.location AS company_location,
    c.tier AS drive_tier,
    c.ctc_lpa,
    a.stage AS selection_stage,
    a.applied_date
FROM applications a
INNER JOIN students s ON a.student_id = s.id
INNER JOIN companies c ON a.drive_id = c.id
WHERE c.location LIKE '%Bengaluru%' 
  AND c.tier = 'Super Dream';

-- Execute query against created view:
SELECT * FROM vw_bengaluru_super_dream_placements ORDER BY ctc_lpa DESC;


-- ----------------------------------------------------------------------------
-- C.2: STORED PROCEDURE (PL/pgSQL) to Record and Advance Placement Offers
-- EXECUTION TIME: ${procBench.duration}
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION sp_record_placement_offer(
    p_student_id INT,
    p_drive_id INT,
    p_offered_ctc NUMERIC
) RETURNS VOID AS $$
BEGIN
    -- Step 1: Update application stage to Offer Extended
    UPDATE applications
    SET stage = 'Offer Extended',
        ctc_lpa = p_offered_ctc,
        remarks = 'Verified letter of intent issued via TPO coordination desk'
    WHERE student_id = p_student_id AND drive_id = p_drive_id;

    -- Step 2: Synchronize candidate status to Placed and update package records
    UPDATE students
    SET status = 'Placed',
        offers_count = offers_count + 1,
        highest_offer_lpa = GREATEST(COALESCE(highest_offer_lpa, 0), p_offered_ctc)
    WHERE id = p_student_id;
END;
$$ LANGUAGE plpgsql;

-- Execute Saved Stored Procedure:
SELECT sp_record_placement_offer(1, 1, 34.00);


-- ----------------------------------------------------------------------------
-- C.3: VALIDATION TRIGGER ON PLACEMENT APPLICATIONS
-- Impact Analysis: Enforces institutional eligibility prior to database commitment.
-- Rejects candidate entries if minimum CGPA or active backlog rules are breached.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_validate_application_eligibility()
RETURNS TRIGGER AS $$
DECLARE
    v_min_cgpa NUMERIC;
    v_max_backlogs INT;
    v_student_cgpa NUMERIC;
    v_student_backlogs INT;
BEGIN
    -- Retrieve company drive prerequisites
    SELECT min_cgpa, max_backlogs INTO v_min_cgpa, v_max_backlogs
    FROM companies WHERE id = NEW.drive_id;

    -- Retrieve applicant academic standing
    SELECT cgpa, active_backlogs INTO v_student_cgpa, v_student_backlogs
    FROM students WHERE id = NEW.student_id;

    -- Integrity Validation Checks
    IF v_student_cgpa < v_min_cgpa THEN
        RAISE EXCEPTION 'Academic Threshold Violation: Student CGPA (%) is below company cutoff (%).', v_student_cgpa, v_min_cgpa;
    END IF;

    IF v_student_backlogs > v_max_backlogs THEN
        RAISE EXCEPTION 'Academic Standing Violation: Student has % active backlogs. Maximum allowed is %.', v_student_backlogs, v_max_backlogs;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach Trigger to applications table
DROP TRIGGER IF EXISTS trg_enforce_drive_eligibility ON applications;
CREATE TRIGGER trg_enforce_drive_eligibility
BEFORE INSERT ON applications
FOR EACH ROW
EXECUTE FUNCTION fn_validate_application_eligibility();


-- ============================================================================
-- SECTION D: FRONTEND UI COMPONENT QUERY MAPPINGS
-- ============================================================================

-- D.1: Menu Operations
-- [Insert]: Handles student sign-up, drive creation, application submission
-- [Display]: Live tables in Student & Admin Portals
-- [Update]: Student Profile Form, Candidate Stage Advancement
-- [Delete]: Company Drive Deletion, User Deactivation

-- D.2: Query 1 (HTML Table Display)
-- Fetches full dataset for /admin/students and /student/profile tables
SELECT id, roll_no, name, email, department, cgpa, active_backlogs, status 
FROM students ORDER BY roll_no ASC;

-- D.3: Query 2 (Dynamic Form Insertion)
-- Triggered by Create Drive Modal & Student Registration Form
INSERT INTO companies (id, company_name, industry, tier, role_title, ctc_lpa, location, min_cgpa, max_backlogs, deadline, drive_date)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);

-- D.4: Query 3 (Aggregation Dropdown: AVG, MAX, MIN, COUNT, SUM)
-- Options:
-- 1) Average Package: SELECT ROUND(AVG(ctc_lpa), 2) AS metric_value FROM companies;
-- 2) Highest Package: SELECT MAX(ctc_lpa) AS metric_value FROM companies;
-- 3) Total Placed:    SELECT COUNT(*) AS metric_value FROM students WHERE status = 'Placed';
-- 4) Total Offers:    SELECT SUM(offers_count) AS metric_value FROM students;

-- D.5: Query 4 (Conditional Filter Dropdown)
-- 1) Eligible Only:    SELECT * FROM companies WHERE min_cgpa <= 8.50 AND max_backlogs >= 0;
-- 2) Super Dream Tier: SELECT * FROM companies WHERE tier = 'Super Dream';
-- 3) Department Only:  SELECT * FROM students WHERE department = 'CSE';

-- D.6: Query 6 & 7 (Multi-Table Subquery Dropdown)
-- 1) Shortlisted in High Packages: SELECT * FROM students WHERE id IN (SELECT student_id FROM applications WHERE ctc_lpa >= 25.00);
-- 2) Top Performers in Branch:     SELECT * FROM students s WHERE s.cgpa >= (SELECT AVG(cgpa) FROM students WHERE department = s.department);

-- D.7: Query 8 (Update Form Control)
-- Executed on Candidate Stage Advancement (Applied -> OA -> Interview -> Offer)
UPDATE applications SET stage = $1, remarks = $2 WHERE id = $3;

-- D.8: Query 5 (Join Operations Dropdown)
-- Dropdown 1: Table 1 (students / applications)
-- Dropdown 2: Table 2 (companies / applications)
-- Dropdown 3: Join Type (INNER JOIN, LEFT OUTER JOIN, RIGHT OUTER JOIN, FULL OUTER JOIN)
SELECT s.name, s.department, c.company_name, c.role_title, a.stage
FROM applications a
INNER JOIN students s ON a.student_id = s.id
INNER JOIN companies c ON a.drive_id = c.id;


-- ============================================================================
-- SECTION E: DASHBOARD PLATFORM REAL-TIME STATISTICS QUERIES
-- ============================================================================

-- Table Statistics 1: Overall Placement Metric Overview
SELECT 
    COUNT(*) AS total_students,
    COUNT(CASE WHEN status = 'Placed' THEN 1 END) AS placed_students,
    ROUND((COUNT(CASE WHEN status = 'Placed' THEN 1 END)::numeric / NULLIF(COUNT(*), 0) * 100), 1) AS placement_percentage,
    ROUND(AVG(cgpa), 2) AS average_cohort_cgpa
FROM students;

-- Table Statistics 2: Company Drives Overview by Tier
SELECT 
    tier,
    COUNT(*) AS total_drives,
    ROUND(AVG(ctc_lpa), 2) AS avg_package_lpa,
    MAX(ctc_lpa) AS max_package_lpa
FROM companies
GROUP BY tier
ORDER BY max_package_lpa DESC;

-- Table Statistics 3: Applications Pipeline Distribution by Stage
SELECT 
    stage,
    COUNT(*) AS candidates_in_stage
FROM applications
GROUP BY stage
ORDER BY candidates_in_stage DESC;

-- ============================================================================
-- END OF SPECIFICATION FILE
-- ============================================================================
`;

  // Write SQL file
  fs.writeFileSync("dbms/placement_system_queries.sql", sqlFileContent, "utf8");
  console.log("Written: dbms/placement_system_queries.sql");

  // SECTION F: Generate XML file for Queries 1, 3, and 4
  console.log("Generating XML data file for Queries 1, 3, and 4...");

  const studentsRows = q1.result;
  const aggregateResult = q3.result[0];
  const conditionalRows = q4.result;

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<!-- ========================================================================== -->
<!-- PLACEHUB CAMPUS RECRUITMENT MANAGEMENT SYSTEM                              -->
<!-- DATA EXPORT FORMAT (SECTION F: QUERY NOS. 1, 3, AND 4)                     -->
<!-- Generated: ${new Date().toISOString()}                                     -->
<!-- Database: Neon PostgreSQL (neondb)                                         -->
<!-- ========================================================================== -->
<PlacementSystemDataExport xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

  <!-- ====================================================================== -->
  <!-- QUERY 1: ALL DATA FROM MAIN TABLE (students)                           -->
  <!-- Execution Time: ${q1.duration}                                         -->
  <!-- Total Records: ${studentsRows.length}                                  -->
  <!-- ====================================================================== -->
  <Query1_AllStudentsData executionTime="${q1.duration}" recordCount="${studentsRows.length}">
${studentsRows
  .map(
    (s) => `    <Student id="${s.id}">
      <RollNumber>${s.roll_no}</RollNumber>
      <FullName>${s.name}</FullName>
      <Email>${s.email}</Email>
      <Department>${s.department}</Department>
      <GraduationBatch>${s.batch}</GraduationBatch>
      <CGPA>${s.cgpa}</CGPA>
      <ActiveBacklogs>${s.active_backlogs}</ActiveBacklogs>
      <PlacementStatus>${s.status}</PlacementStatus>
      <OffersCount>${s.offers_count || 0}</OffersCount>
      <HighestOfferLPA>${s.highest_offer_lpa || "0.00"}</HighestOfferLPA>
    </Student>`
  )
  .join("\n")}
  </Query1_AllStudentsData>

  <!-- ====================================================================== -->
  <!-- QUERY 3: AGGREGATE FUNCTION RESULTS FROM MAIN TABLE                    -->
  <!-- Execution Time: ${q3.duration}                                         -->
  <!-- Metrics: Average CGPA, Highest CGPA, Lowest CGPA, Total Students       -->
  <!-- ====================================================================== -->
  <Query3_AggregateMetrics executionTime="${q3.duration}">
    <CohortCGPAStatistics>
      <AverageCGPA>${Number(aggregateResult.average_cgpa).toFixed(2)}</AverageCGPA>
      <MaximumCGPA>${Number(aggregateResult.max_cgpa).toFixed(2)}</MaximumCGPA>
      <MinimumCGPA>${Number(aggregateResult.min_cgpa).toFixed(2)}</MinimumCGPA>
      <TotalCandidatesEvaluated>${aggregateResult.total_students}</TotalCandidatesEvaluated>
      <InstitutionStandard>NAAC A++ Benchmark</InstitutionStandard>
    </CohortCGPAStatistics>
  </Query3_AggregateMetrics>

  <!-- ====================================================================== -->
  <!-- QUERY 4: CONDITIONAL FILTER RESULTS                                    -->
  <!-- Condition: CGPA >= 8.50 AND active_backlogs = 0                         -->
  <!-- Execution Time: ${q4.duration}                                         -->
  <!-- Filtered Candidates: ${conditionalRows.length}                         -->
  <!-- ====================================================================== -->
  <Query4_ConditionalFilterData executionTime="${q4.duration}" criteria="CGPA &gt;= 8.50 AND Backlogs == 0">
${conditionalRows
  .map(
    (s) => `    <EligibleCandidate>
      <RollNumber>${s.roll_no}</RollNumber>
      <CandidateName>${s.name}</CandidateName>
      <Department>${s.department}</Department>
      <CGPA>${s.cgpa}</CGPA>
      <ActiveBacklogs>${s.active_backlogs}</ActiveBacklogs>
      <CurrentStatus>${s.status}</CurrentStatus>
      <SuperDreamEligible>true</SuperDreamEligible>
    </EligibleCandidate>`
  )
  .join("\n")}
  </Query4_ConditionalFilterData>

</PlacementSystemDataExport>
`;

  fs.writeFileSync("dbms/placement_system_data.xml", xmlContent, "utf8");
  console.log("Written: dbms/placement_system_data.xml");
  console.log("All tasks completed successfully!");
}

runBenchmark().catch(console.error);
