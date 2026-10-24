-- ============================================================================
-- CAMPUS PLACEMENT MANAGEMENT SYSTEM (DBMS PROJECT)
-- Relational Database Schema, Constraints, Views, Triggers & Sample Queries
-- Target RDBMS: MySQL 8.0+ / MariaDB / PostgreSQL compatible
-- ============================================================================

DROP DATABASE IF EXISTS placement_system_db;
CREATE DATABASE placement_system_db;
USE placement_system_db;

-- ----------------------------------------------------------------------------
-- 1. COMPANIES TABLE
-- Stores profile and recruitment metadata of participating organizations.
-- ----------------------------------------------------------------------------
CREATE TABLE Companies (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL UNIQUE,
    industry VARCHAR(60) NOT NULL,
    website VARCHAR(150),
    tier ENUM('Super Dream', 'Dream', 'Core', 'Mass Recruiter') NOT NULL DEFAULT 'Core',
    headquarters VARCHAR(100) NOT NULL,
    hr_contact_name VARCHAR(80),
    hr_contact_email VARCHAR(120) NOT NULL UNIQUE,
    hr_contact_phone VARCHAR(20),
    established_year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 2. STUDENTS TABLE
-- Stores academic and profile records of eligible students.
-- ----------------------------------------------------------------------------
CREATE TABLE Students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    roll_no VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL,
    department ENUM('CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL') NOT NULL,
    cgpa DECIMAL(3, 2) NOT NULL CHECK (cgpa >= 0.00 AND cgpa <= 10.00),
    active_backlogs INT NOT NULL DEFAULT 0 CHECK (active_backlogs >= 0),
    history_backlogs INT NOT NULL DEFAULT 0 CHECK (history_backlogs >= 0),
    graduation_year INT NOT NULL DEFAULT 2027,
    skills TEXT,
    resume_url VARCHAR(255),
    placement_status ENUM('Unplaced', 'In Process', 'Placed', 'Higher Studies', 'Opted Out') NOT NULL DEFAULT 'Unplaced',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 3. JOB DRIVES TABLE
-- Represents specific campus recruitment drives by companies.
-- ----------------------------------------------------------------------------
CREATE TABLE JobDrives (
    drive_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    job_title VARCHAR(120) NOT NULL,
    role_type ENUM('Full-Time', 'Internship', 'Intern + PPO') NOT NULL DEFAULT 'Full-Time',
    ctc_lpa DECIMAL(5, 2) NOT NULL CHECK (ctc_lpa > 0),
    stipend_monthly DECIMAL(8, 2) DEFAULT 0,
    job_location VARCHAR(100) NOT NULL,
    min_cgpa DECIMAL(3, 2) NOT NULL DEFAULT 6.50,
    max_backlogs_allowed INT NOT NULL DEFAULT 0,
    eligible_departments VARCHAR(255) NOT NULL DEFAULT 'CSE,IT,ECE',
    registration_deadline DATE NOT NULL,
    drive_date DATE NOT NULL,
    drive_status ENUM('Upcoming', 'Ongoing', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Upcoming',
    job_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_drive_company FOREIGN KEY (company_id) REFERENCES Companies(company_id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 4. APPLICATIONS TABLE (Junction Table: Students <-> JobDrives)
-- Tracks student applications submitted for campus drives.
-- ----------------------------------------------------------------------------
CREATE TABLE Applications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    drive_id INT NOT NULL,
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    application_status ENUM(
        'Applied',
        'Eligible',
        'Shortlisted',
        'Online Assessment',
        'Technical Round',
        'HR Round',
        'Offered',
        'Rejected'
    ) NOT NULL DEFAULT 'Applied',
    remarks VARCHAR(255),
    CONSTRAINT uk_student_drive UNIQUE (student_id, drive_id),
    CONSTRAINT fk_app_student FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_app_drive FOREIGN KEY (drive_id) REFERENCES JobDrives(drive_id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 5. INTERVIEW SCHEDULES TABLE
-- Records scheduled evaluation rounds for shortlisted candidates.
-- ----------------------------------------------------------------------------
CREATE TABLE InterviewSchedules (
    interview_id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    round_number INT NOT NULL DEFAULT 1,
    round_name VARCHAR(60) NOT NULL,
    scheduled_at DATETIME NOT NULL,
    mode ENUM('Online', 'In-Person') NOT NULL DEFAULT 'Online',
    meeting_link_or_venue VARCHAR(255),
    interviewer_name VARCHAR(80),
    result ENUM('Pending', 'Qualified', 'Disqualified', 'Rescheduled') NOT NULL DEFAULT 'Pending',
    feedback TEXT,
    CONSTRAINT fk_interview_app FOREIGN KEY (application_id) REFERENCES Applications(application_id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 6. PLACEMENT OFFERS TABLE
-- Tracks official offer letters and packages awarded to students.
-- ----------------------------------------------------------------------------
CREATE TABLE PlacementOffers (
    offer_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    company_id INT NOT NULL,
    drive_id INT NOT NULL,
    offer_letter_no VARCHAR(60) NOT NULL UNIQUE,
    ctc_lpa DECIMAL(5, 2) NOT NULL CHECK (ctc_lpa > 0),
    role_title VARCHAR(100) NOT NULL,
    offer_date DATE NOT NULL,
    acceptance_status ENUM('Pending Review', 'Accepted', 'Declined', 'Revoked') NOT NULL DEFAULT 'Pending Review',
    joining_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_offer_student FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_offer_company FOREIGN KEY (company_id) REFERENCES Companies(company_id) ON DELETE CASCADE,
    CONSTRAINT fk_offer_drive FOREIGN KEY (drive_id) REFERENCES JobDrives(drive_id) ON DELETE CASCADE
);

-- ============================================================================
-- TRIGGERS FOR DATA INTEGRITY AND AUTOMATION
-- ============================================================================

-- Trigger 1: Automatically update Student placement_status to 'Placed' when offer is Accepted
DELIMITER $$
CREATE TRIGGER trg_offer_accepted_update_student
AFTER UPDATE ON PlacementOffers
FOR EACH ROW
BEGIN
    IF NEW.acceptance_status = 'Accepted' AND OLD.acceptance_status <> 'Accepted' THEN
        UPDATE Students
        SET placement_status = 'Placed'
        WHERE student_id = NEW.student_id;
    END IF;
END$$

-- Trigger 2: Prevent student from applying if CGPA is below drive requirement
CREATE TRIGGER trg_verify_eligibility_before_apply
BEFORE INSERT ON Applications
FOR EACH ROW
BEGIN
    DECLARE v_student_cgpa DECIMAL(3, 2);
    DECLARE v_student_backlogs INT;
    DECLARE v_min_cgpa DECIMAL(3, 2);
    DECLARE v_max_backlogs INT;

    SELECT cgpa, active_backlogs INTO v_student_cgpa, v_student_backlogs
    FROM Students WHERE student_id = NEW.student_id;

    SELECT min_cgpa, max_backlogs_allowed INTO v_min_cgpa, v_max_backlogs
    FROM JobDrives WHERE drive_id = NEW.drive_id;

    IF v_student_cgpa < v_min_cgpa THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Eligibility Error: Student CGPA is below the minimum required for this drive.';
    END IF;

    IF v_student_backlogs > v_max_backlogs THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Eligibility Error: Student has more active backlogs than permitted for this drive.';
    END IF;
END$$
DELIMITER ;

-- ============================================================================
-- VIEWS FOR REPORTING & ANALYTICS
-- ============================================================================

-- View 1: Placed Students Comprehensive Overview
CREATE OR REPLACE VIEW vw_placed_students_summary AS
SELECT 
    s.student_id,
    s.roll_no,
    s.full_name AS student_name,
    s.department,
    s.cgpa,
    c.company_name,
    c.tier AS company_tier,
    o.role_title,
    o.ctc_lpa,
    o.acceptance_status,
    o.offer_date
FROM PlacementOffers o
JOIN Students s ON o.student_id = s.student_id
JOIN Companies c ON o.company_id = c.company_id;

-- View 2: Branch-wise Placement Statistics
CREATE OR REPLACE VIEW vw_branch_wise_placement_stats AS
SELECT 
    s.department,
    COUNT(s.student_id) AS total_students,
    SUM(CASE WHEN s.placement_status = 'Placed' THEN 1 ELSE 0 END) AS total_placed,
    ROUND(
        (SUM(CASE WHEN s.placement_status = 'Placed' THEN 1 ELSE 0 END) * 100.0) / COUNT(s.student_id),
        2
    ) AS placement_percentage,
    ROUND(AVG(o.ctc_lpa), 2) AS average_ctc_lpa,
    MAX(o.ctc_lpa) AS highest_ctc_lpa
FROM Students s
LEFT JOIN PlacementOffers o ON s.student_id = o.student_id AND o.acceptance_status = 'Accepted'
GROUP BY s.department;

-- ============================================================================
-- SAMPLE DATA (DML)
-- ============================================================================

INSERT INTO Companies (company_name, industry, website, tier, headquarters, hr_contact_name, hr_contact_email, hr_contact_phone, established_year) VALUES
('Google India', 'Technology & Cloud', 'https://careers.google.com', 'Super Dream', 'Bengaluru, India', 'Sundar Rao', 'india-campus@google.com', '+91-80-67210000', 1998),
('Amazon', 'E-commerce & AWS', 'https://amazon.jobs', 'Super Dream', 'Hyderabad, India', 'Priya Sharma', 'campus-in@amazon.com', '+91-40-67891234', 1994),
('Microsoft IDC', 'Software & Cloud', 'https://careers.microsoft.com', 'Super Dream', 'Hyderabad, India', 'Aditya Verma', 'recruitment-idc@microsoft.com', '+91-40-66992222', 1975),
('Morgan Stanley', 'Fintech & Investment Banking', 'https://morganstanley.com', 'Super Dream', 'Mumbai, India', 'Neha Kapoor', 'campus.recruitment@morganstanley.com', '+91-22-61181000', 1935),
('TCS (Tata Consultancy)', 'IT Services & Consulting', 'https://tcs.com/careers', 'Mass Recruiter', 'Mumbai, India', 'Ramesh Iyer', 'campus.tcs@tcs.com', '+91-22-67789999', 1968),
('Infosys Ltd', 'IT Services', 'https://infosys.com/careers', 'Mass Recruiter', 'Bengaluru, India', 'Kavita Pillai', 'talent.acquisition@infosys.com', '+91-80-28520261', 1981);

INSERT INTO Students (roll_no, full_name, email, phone, department, cgpa, active_backlogs, history_backlogs, graduation_year, skills, placement_status) VALUES
('21CS001', 'Aarav Sharma', 'aarav.sharma@college.edu', '+91-9876543210', 'CSE', 9.35, 0, 0, 2027, 'React, Node.js, Next.js, PostgreSQL, Docker', 'Placed'),
('21CS042', 'Diya Patel', 'diya.patel@college.edu', '+91-9876543211', 'CSE', 8.90, 0, 0, 2027, 'Python, Django, AWS, Kubernetes, Machine Learning', 'Placed'),
('21IT015', 'Rohan Gupta', 'rohan.gupta@college.edu', '+91-9876543212', 'IT', 8.42, 0, 1, 2027, 'Java, Spring Boot, MySQL, Microservices', 'In Process'),
('21EC028', 'Ananya Iyer', 'ananya.iyer@college.edu', '+91-9876543213', 'ECE', 7.95, 0, 0, 2027, 'C++, Embedded Systems, Verilog, Python', 'In Process'),
('21ME009', 'Vikram Singh', 'vikram.singh@college.edu', '+91-9876543214', 'MECH', 7.20, 1, 1, 2027, 'AutoCAD, SolidWorks, MATLAB, Python', 'Unplaced'),
('21CS088', 'Tanisha Roy', 'tanisha.roy@college.edu', '+91-9876543215', 'CSE', 9.60, 0, 0, 2027, 'TypeScript, Go, Distributed Systems, SQL, GraphQL', 'Placed');

INSERT INTO JobDrives (company_id, job_title, role_type, ctc_lpa, stipend_monthly, job_location, min_cgpa, max_backlogs_allowed, eligible_departments, registration_deadline, drive_date, drive_status, job_description) VALUES
(1, 'Software Engineer - University Graduate', 'Full-Time', 28.50, 120000.00, 'Bengaluru / Hyderabad', 8.50, 0, 'CSE,IT', '2026-11-15', '2026-11-20', 'Upcoming', 'Design and implement scalable backend distributed services and user applications.'),
(2, 'Software Development Engineer (SDE-1)', 'Full-Time', 24.00, 85000.00, 'Hyderabad, India', 8.00, 0, 'CSE,IT,ECE', '2026-11-10', '2026-11-16', 'Ongoing', 'Work on Amazon e-commerce core platforms and AWS cloud infrastructure microservices.'),
(3, 'Software Engineer - Core Engineering', 'Full-Time', 31.00, 110000.00, 'Hyderabad / Bengaluru', 8.25, 0, 'CSE,IT', '2026-11-25', '2026-12-01', 'Upcoming', 'Build next-gen cloud productivity apps and generative AI developer workflows.'),
(4, 'Technology Analyst', 'Full-Time', 22.00, 75000.00, 'Mumbai, India', 8.00, 0, 'CSE,IT,ECE', '2026-10-30', '2026-11-05', 'Completed', 'Engineering high-frequency trading platforms and financial calculation engines.'),
(5, 'Graduate Trainee Engineer (Ninja / Digital)', 'Full-Time', 7.50, 25000.00, 'Pan India', 6.00, 1, 'CSE,IT,ECE,EEE,MECH,CIVIL', '2026-11-20', '2026-11-28', 'Upcoming', 'Comprehensive entry-level software development and enterprise support program.'),
(6, 'Systems Engineer Specialist', 'Full-Time', 6.50, 20000.00, 'Pune / Bengaluru', 6.00, 0, 'CSE,IT,ECE,EEE', '2026-11-18', '2026-11-26', 'Upcoming', 'Development of digital enterprise systems and full-stack cloud solutions.');

INSERT INTO Applications (student_id, drive_id, application_status, remarks) VALUES
(1, 1, 'Offered', 'Qualified all 4 algorithmic technical and system design rounds.'),
(2, 2, 'Offered', 'Excellent performance in coding round and behavioral review.'),
(3, 2, 'Technical Round', 'Cleared OA with 100% test cases; awaiting Round 2 schedule.'),
(4, 2, 'Applied', 'Resume shortlisted, awaiting OA link dispatch.'),
(6, 3, 'Offered', 'Direct offer given with top tier engineering evaluation.');

INSERT INTO PlacementOffers (student_id, company_id, drive_id, offer_letter_no, ctc_lpa, role_title, offer_date, acceptance_status, joining_date) VALUES
(1, 1, 1, 'GOOG-IN-2027-041', 28.50, 'Software Engineer', '2026-11-22', 'Accepted', '2027-07-01'),
(2, 2, 2, 'AMZN-HYD-2027-112', 24.00, 'Software Development Engineer-1', '2026-11-18', 'Accepted', '2027-07-15'),
(6, 3, 3, 'MSFT-IDC-2027-089', 31.00, 'Software Engineer', '2026-12-03', 'Accepted', '2027-08-01');

-- ============================================================================
-- ESSENTIAL DBMS PROJECT QUERIES (Professors / Evaluators standard checks)
-- ============================================================================

-- Query 1: Find all students eligible for Google campus drive (CGPA >= 8.5 AND Backlogs = 0)
-- SELECT roll_no, full_name, department, cgpa FROM Students WHERE cgpa >= 8.50 AND active_backlogs = 0;

-- Query 2: Display companies offering CTC >= 20 LPA (Super Dream category)
-- SELECT company_name, industry, tier, headquarters FROM Companies WHERE tier = 'Super Dream';

-- Query 3: Find average CTC offered by each company
-- SELECT c.company_name, ROUND(AVG(o.ctc_lpa), 2) AS avg_ctc, COUNT(o.offer_id) AS total_offers
-- FROM Companies c
-- JOIN PlacementOffers o ON c.company_id = o.company_id
-- GROUP BY c.company_id, c.company_name;

-- Query 4: List all students who received multiple offers (Relational HAVING clause)
-- SELECT s.roll_no, s.full_name, COUNT(o.offer_id) AS total_offers_received
-- FROM Students s
-- JOIN PlacementOffers o ON s.student_id = o.student_id
-- GROUP BY s.student_id, s.roll_no, s.full_name
-- HAVING COUNT(o.offer_id) > 1;

-- Query 5: Full outer relational status of Students and their Applications
-- SELECT s.roll_no, s.full_name, s.department, d.job_title, c.company_name, a.application_status
-- FROM Students s
-- LEFT JOIN Applications a ON s.student_id = a.student_id
-- LEFT JOIN JobDrives d ON a.drive_id = d.drive_id
-- LEFT JOIN Companies c ON d.company_id = c.company_id;
