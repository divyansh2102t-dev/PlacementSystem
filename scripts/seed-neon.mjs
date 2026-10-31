import dns from "node:dns";
import fs from "node:fs";
import path from "node:path";

// 1. DNS Hook for reliable resolution on Windows/ISP environments
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
        callback(
          null,
          addresses.map((a) => ({ address: a, family: 4 }))
        );
      } else {
        callback(null, addresses[0], 4);
      }
    })
    .catch(() => originalLookup(hostname, options, callback));
};

import { neon } from "@neondatabase/serverless";

// 2. Query Logging Helper
const QUERY_LOG_PATH = path.resolve("dbms/executed_queries.sql");

function logQuery(title, sqlString) {
  const timestamp = new Date().toISOString();
  const entry = `\n-- ============================================================================\n-- [${timestamp}] ${title}\n-- ============================================================================\n${sqlString.trim()};\n`;
  fs.appendFileSync(QUERY_LOG_PATH, entry, "utf8");
}

// 3. Main Seeding Function
async function seedNeon() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("Error: DATABASE_URL not found in environment.");
    process.exit(1);
  }

  // Ensure query log exists with initial documentation header
  if (!fs.existsSync(QUERY_LOG_PATH)) {
    fs.writeFileSync(
      QUERY_LOG_PATH,
      `-- ============================================================================\n-- PLACEHUB CAMPUS PLACEMENT SYSTEM - NEON POSTGRESQL QUERY AUDIT LOG\n-- Target Database: Neon PostgreSQL (neondb)\n-- Created: ${new Date().toISOString()}\n-- This file tracks all DDL, DML, and execution queries run against Neon.\n-- ============================================================================\n\n`,
      "utf8"
    );
  }

  console.log("Connecting to Neon PostgreSQL...");
  const sql = neon(databaseUrl);

  // Load Seed Data
  const seedModule = await import("./seedData.clean.ts");
  const { initialUsers, initialStudents, initialCompanies, initialApplications } = seedModule;

  console.log("Creating tables in Neon PostgreSQL...");

  // DDL: Create Tables
  const ddlUsers = `
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL,
    student_id INT,
    active BOOLEAN NOT NULL DEFAULT true,
    avatar VARCHAR(10),
    created_at DATE NOT NULL DEFAULT CURRENT_DATE
)`;
  await sql.query(ddlUsers);
  logQuery("DDL: CREATE TABLE users", ddlUsers);

  const ddlStudents = `
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
)`;
  await sql.query(ddlStudents);
  logQuery("DDL: CREATE TABLE students", ddlStudents);

  const ddlCompanies = `
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
)`;
  await sql.query(ddlCompanies);
  logQuery("DDL: CREATE TABLE companies", ddlCompanies);

  const ddlApplications = `
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
)`;
  await sql.query(ddlApplications);
  logQuery("DDL: CREATE TABLE applications", ddlApplications);

  // Analytical Views
  const view1 = `
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
WHERE s.status = 'Placed'`;
  await sql.query(view1);
  logQuery("VIEW: vw_placed_students_summary", view1);

  const view2 = `
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
GROUP BY s.department`;
  await sql.query(view2);
  logQuery("VIEW: vw_branch_wise_placement_stats", view2);

  console.log("Truncating existing data (with cascade) for fresh seed...");
  await sql`TRUNCATE TABLE applications, companies, students, users CASCADE;`;
  logQuery("DML: TRUNCATE TABLES", "TRUNCATE TABLE applications, companies, students, users CASCADE");

  // 1. Insert Users
  console.log(`Inserting ${initialUsers.length} users...`);
  for (const u of initialUsers) {
    await sql`
      INSERT INTO users (id, name, email, role, student_id, active, avatar, created_at)
      VALUES (${u.id}, ${u.name}, ${u.email}, ${u.role}, ${u.studentId || null}, ${u.active}, ${u.avatar || null}, ${u.createdAt});
    `;
  }
  logQuery(
    `DML: INSERT ${initialUsers.length} Users`,
    `-- Inserted ${initialUsers.length} users into 'users' table`
  );

  // 2. Insert Students
  console.log(`Inserting ${initialStudents.length} students...`);
  for (const s of initialStudents) {
    await sql`
      INSERT INTO students (
        id, roll_no, name, email, phone, department, batch, cgpa,
        active_backlogs, skills, resume_url, status, offers_count, highest_offer_lpa
      )
      VALUES (
        ${s.id}, ${s.rollNo}, ${s.name}, ${s.email}, ${s.phone}, ${s.department}, ${s.batch || "2027"},
        ${s.cgpa}, ${s.activeBacklogs || 0}, ${JSON.stringify(s.skills || [])}, ${s.resumeUrl || null},
        ${s.status}, ${s.offersCount || 0}, ${s.highestOfferLpa || null}
      );
    `;
  }
  logQuery(
    `DML: INSERT ${initialStudents.length} Students`,
    `-- Inserted ${initialStudents.length} students into 'students' table`
  );

  // 3. Insert Companies
  console.log(`Inserting ${initialCompanies.length} companies...`);
  for (const c of initialCompanies) {
    await sql`
      INSERT INTO companies (
        id, company_name, logo, industry, tier, role_title, role_type, ctc_lpa,
        stipend_monthly, location, min_cgpa, max_backlogs, eligible_depts, eligible_batch,
        required_skills, deadline, drive_date, status, description, applicants_count
      )
      VALUES (
        ${c.id}, ${c.companyName}, ${c.logo || null}, ${c.industry}, ${c.tier}, ${c.roleTitle},
        ${c.roleType || "Full-Time"}, ${c.ctcLpa}, ${c.stipendMonthly || 0}, ${c.location},
        ${c.minCgpa}, ${c.maxBacklogs}, ${JSON.stringify(c.eligibleDepts || [])}, ${c.eligibleBatch || "2027"},
        ${JSON.stringify(c.requiredSkills || [])}, ${c.deadline}, ${c.driveDate}, ${c.status || "Upcoming"},
        ${c.description}, ${c.applicantsCount || 0}
      );
    `;
  }
  logQuery(
    `DML: INSERT ${initialCompanies.length} Companies`,
    `-- Inserted ${initialCompanies.length} companies into 'companies' table`
  );

  // 4. Insert Applications
  console.log(`Inserting ${initialApplications.length} applications...`);
  for (const a of initialApplications) {
    await sql`
      INSERT INTO applications (
        id, student_id, student_name, roll_no, department, cgpa, drive_id,
        company_name, role_title, ctc_lpa, applied_date, stage, remarks, resume_url, history
      )
      VALUES (
        ${a.id}, ${a.studentId}, ${a.studentName}, ${a.rollNo}, ${a.department}, ${a.cgpa},
        ${a.driveId}, ${a.companyName}, ${a.roleTitle}, ${a.ctcLpa}, ${a.appliedDate},
        ${a.stage}, ${a.remarks || null}, ${a.resumeUrl || null}, ${JSON.stringify(a.history || [])}
      );
    `;
  }
  logQuery(
    `DML: INSERT ${initialApplications.length} Applications`,
    `-- Inserted ${initialApplications.length} applications into 'applications' table`
  );

  // Verification counts
  console.log("Verifying inserted counts in Neon PostgreSQL...");
  const [usersCount] = await sql`SELECT count(*) FROM users`;
  const [studentsCount] = await sql`SELECT count(*) FROM students`;
  const [companiesCount] = await sql`SELECT count(*) FROM companies`;
  const [appsCount] = await sql`SELECT count(*) FROM applications`;

  console.log("=========================================");
  console.log("✓ Neon Database Seeding Complete!");
  console.log(`- Users:        ${usersCount.count}`);
  console.log(`- Students:     ${studentsCount.count}`);
  console.log(`- Companies:    ${companiesCount.count}`);
  console.log(`- Applications: ${appsCount.count}`);
  console.log(`- Query Audit:  ${QUERY_LOG_PATH}`);
  console.log("=========================================");
}

seedNeon().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
