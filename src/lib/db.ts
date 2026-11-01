import dns from "node:dns";
import fs from "node:fs";
import path from "node:path";
import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { Application, CompanyDrive, Student, User, HeadlineStatsConfig, DEFAULT_HEADLINE_STATS } from "@/types";

// Setup custom DNS resolver for reliable Neon endpoint resolution across ISP environments
if (typeof window === "undefined") {
  try {
    const resolver = new dns.promises.Resolver();
    resolver.setServers(["8.8.8.8", "1.1.1.1"]);
    const originalLookup = dns.lookup;
    (dns as any).lookup = (hostname: string, options: any, callback: any) => {
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
  } catch {
    // Ignore in environments where dns is not mutable
  }
}

const QUERY_LOG_PATH = path.resolve(process.cwd(), "dbms/executed_queries.sql");

export function logExecutedQuery(title: string, sqlQuery: string) {
  try {
    const timestamp = new Date().toISOString();
    const entry = `\n-- ============================================================================\n-- [${timestamp}] ${title}\n-- ============================================================================\n${sqlQuery.trim()};\n`;
    fs.appendFileSync(QUERY_LOG_PATH, entry, "utf8");
  } catch (err) {
    console.error("Failed to write to query audit log:", err);
  }
}

let cachedSql: NeonQueryFunction<false, false> | null = null;

export function getDb() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || (!dbUrl.startsWith("postgres://") && !dbUrl.startsWith("postgresql://"))) {
    return null;
  }
  if (!cachedSql) {
    cachedSql = neon(dbUrl);
  }
  return cachedSql;
}

// ============================================================================
// TYPED NEON DATABASE QUERIES
// ============================================================================

export async function neonGetUsers(): Promise<User[]> {
  const sql = getDb();
  if (!sql) return [];
  const query = "SELECT * FROM users ORDER BY id ASC";
  logExecutedQuery("SELECT Users", query);
  const rows = (await sql.query(query)) as any[];
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    role: r.role,
    studentId: r.student_id ?? undefined,
    active: r.active,
    avatar: r.avatar ?? undefined,
    createdAt: r.created_at ? new Date(r.created_at).toISOString().split("T")[0] : "",
  }));
}

export async function neonGetStudents(): Promise<Student[]> {
  const sql = getDb();
  if (!sql) return [];
  const query = "SELECT * FROM students ORDER BY id ASC";
  logExecutedQuery("SELECT Students", query);
  const rows = (await sql.query(query)) as any[];
  return rows.map((r) => ({
    id: r.id,
    rollNo: r.roll_no,
    name: r.name,
    email: r.email,
    phone: r.phone ?? "",
    department: r.department,
    batch: r.batch ?? "2027",
    cgpa: Number(r.cgpa),
    activeBacklogs: Number(r.active_backlogs ?? 0),
    skills: typeof r.skills === "string" ? JSON.parse(r.skills) : r.skills ?? [],
    resumeUrl: r.resume_url ?? undefined,
    status: r.status,
    offersCount: Number(r.offers_count ?? 0),
    highestOfferLpa: r.highest_offer_lpa ? Number(r.highest_offer_lpa) : undefined,
  }));
}

export async function neonGetCompanies(): Promise<CompanyDrive[]> {
  const sql = getDb();
  if (!sql) return [];
  const query = "SELECT * FROM companies ORDER BY id ASC";
  logExecutedQuery("SELECT Companies", query);
  const rows = (await sql.query(query)) as any[];
  return rows.map((r) => ({
    id: r.id,
    companyName: r.company_name,
    logo: r.logo ?? undefined,
    industry: r.industry,
    tier: r.tier,
    roleTitle: r.role_title,
    roleType: r.role_type,
    ctcLpa: Number(r.ctc_lpa),
    stipendMonthly: Number(r.stipend_monthly ?? 0),
    location: r.location,
    minCgpa: Number(r.min_cgpa),
    maxBacklogs: Number(r.max_backlogs ?? 0),
    eligibleDepts: typeof r.eligible_depts === "string" ? JSON.parse(r.eligible_depts) : r.eligible_depts ?? [],
    eligibleBatch: r.eligible_batch ?? "2027",
    requiredSkills: typeof r.required_skills === "string" ? JSON.parse(r.required_skills) : r.required_skills ?? [],
    deadline: r.deadline ? new Date(r.deadline).toISOString().split("T")[0] : "",
    driveDate: r.drive_date ? new Date(r.drive_date).toISOString().split("T")[0] : "",
    status: r.status,
    description: r.description ?? "",
    applicantsCount: Number(r.applicants_count ?? 0),
    stages: typeof r.stages === "string" ? JSON.parse(r.stages) : r.stages ?? [],
  }));
}

export async function neonGetApplications(): Promise<Application[]> {
  const sql = getDb();
  if (!sql) return [];
  const query = "SELECT * FROM applications ORDER BY id ASC";
  logExecutedQuery("SELECT Applications", query);
  const rows = (await sql.query(query)) as any[];
  return rows.map((r) => ({
    id: r.id,
    studentId: r.student_id,
    studentName: r.student_name,
    rollNo: r.roll_no,
    department: r.department,
    cgpa: Number(r.cgpa),
    driveId: r.drive_id,
    companyName: r.company_name,
    roleTitle: r.role_title,
    ctcLpa: Number(r.ctc_lpa),
    appliedDate: r.applied_date ? new Date(r.applied_date).toISOString().split("T")[0] : "",
    stage: r.stage,
    remarks: r.remarks ?? undefined,
    resumeUrl: r.resume_url ?? undefined,
    history: typeof r.history === "string" ? JSON.parse(r.history) : r.history ?? [],
  }));
}

export async function neonGetHeadlineStats(): Promise<HeadlineStatsConfig> {
  const sql = getDb();
  if (!sql) return DEFAULT_HEADLINE_STATS;
  try {
    const rows = (await sql.query("SELECT value FROM site_settings WHERE key = 'headline_stats'")) as any[];
    if (rows && rows.length > 0 && rows[0].value) {
      return typeof rows[0].value === "string" ? JSON.parse(rows[0].value) : rows[0].value;
    }
  } catch (e) {
    console.error("Error reading headline_stats from Neon:", e);
  }
  return DEFAULT_HEADLINE_STATS;
}

export async function neonSaveHeadlineStats(stats: HeadlineStatsConfig): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;
  try {
    const q = `INSERT INTO site_settings (key, value) VALUES ('headline_stats', '${JSON.stringify(stats)}') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`;
    logExecutedQuery("UPSERT Headline Stats", q);
    await sql.query(q);
    return true;
  } catch (e) {
    console.error("Error saving headline_stats to Neon:", e);
    return false;
  }
}
