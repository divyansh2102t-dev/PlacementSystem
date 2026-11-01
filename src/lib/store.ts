import {
  initialApplications,
  initialCompanies,
  initialStudents,
  initialUsers,
} from "@/data/seedData";
import {
  Application,
  ApplicationStage,
  CompanyDrive,
  CompanyTier,
  PlacementAnalyticsSummary,
  Student,
  User,
  UserRole,
} from "@/types";
import { checkEligibility } from "./eligibility";
import {
  getDb,
  logExecutedQuery,
  neonGetApplications,
  neonGetCompanies,
  neonGetStudents,
  neonGetUsers,
} from "./db";

// Global in-memory storage singleton that persists during the server lifecycle
declare global {
  // eslint-disable-next-line no-var
  var __placehub_store__: {
    users: User[];
    students: Student[];
    companies: CompanyDrive[];
    applications: Application[];
    websiteVisits: { page: string; views: number }[];
    hydratedFromNeon?: boolean;
  } | undefined;
}

if (!global.__placehub_store__) {
  global.__placehub_store__ = {
    users: [...initialUsers],
    students: [...initialStudents],
    companies: [...initialCompanies],
    applications: [...initialApplications],
    websiteVisits: [
      { page: "/student/companies", views: 24 },
      { page: "/student/dashboard", views: 18 },
      { page: "/student/applications", views: 12 },
    ],
  };
}

const store = global.__placehub_store__;

export async function ensureNeonHydrated(): Promise<void> {
  const sql = getDb();
  if (!sql || store.hydratedFromNeon) return;

  try {
    const [neonUsers, neonStudents, neonCompanies, neonApps] = await Promise.all([
      neonGetUsers(),
      neonGetStudents(),
      neonGetCompanies(),
      neonGetApplications(),
    ]);

    if (neonUsers.length > 0) store.users = neonUsers;
    if (neonStudents.length > 0) store.students = neonStudents;
    if (neonCompanies.length > 0) store.companies = neonCompanies;
    if (neonApps.length > 0) store.applications = neonApps;

    store.hydratedFromNeon = true;
  } catch (err) {
    console.error("Neon hydration check fallback to in-memory store:", err);
  }
}

export const PlaceHubStore = {
  // ================= USERS =================
  getUsers(): User[] {
    return store.users;
  },
  getUserByEmail(email: string): User | undefined {
    return store.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
  },
  getUserById(id: number): User | undefined {
    return store.users.find((u) => u.id === id);
  },
  addUser(userData: Omit<User, "id" | "createdAt">): User {
    const newUser: User = {
      ...userData,
      id: Math.max(0, ...store.users.map((u) => u.id)) + 1,
      createdAt: new Date().toISOString().split("T")[0],
    };
    store.users.unshift(newUser);

    // Sync to Neon
    const sql = getDb();
    if (sql) {
      const q = `INSERT INTO users (id, name, email, role, student_id, active, avatar, created_at)
VALUES (${newUser.id}, '${newUser.name.replace(/'/g, "''")}', '${newUser.email}', '${newUser.role}', ${newUser.studentId ?? "NULL"}, ${newUser.active}, '${newUser.avatar || ""}', '${newUser.createdAt}')`;
      logExecutedQuery("INSERT User", q);
      sql.query(q).catch((e) => console.error("Neon User Insert Error:", e));
    }

    return newUser;
  },
  updateUser(id: number, updates: Partial<User>): User | null {
    const index = store.users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    store.users[index] = { ...store.users[index], ...updates };

    // Sync to Neon
    const sql = getDb();
    if (sql) {
      const user = store.users[index];
      const q = `UPDATE users SET name = '${user.name.replace(/'/g, "''")}', active = ${user.active}, role = '${user.role}' WHERE id = ${id}`;
      logExecutedQuery("UPDATE User", q);
      sql.query(q).catch((e) => console.error("Neon User Update Error:", e));
    }

    return store.users[index];
  },
  updateUserRole(id: number, role: UserRole): User | null {
    const user = store.users.find((u) => u.id === id);
    if (!user) return null;
    user.role = role;
    const sql = getDb();
    if (sql) {
      const q = `UPDATE users SET role = '${role}' WHERE id = ${id}`;
      logExecutedQuery("UPDATE User Role", q);
      sql.query(q).catch((e) => console.error("Neon User Role Update Error:", e));
    }
    return user;
  },

  // ================= STUDENTS =================
  getStudents(): Student[] {
    return store.students;
  },
  getStudentById(id: number): Student | undefined {
    return store.students.find((s) => s.id === id);
  },
  getStudentByRollNo(rollNo: string): Student | undefined {
    return store.students.find(
      (s) => s.rollNo.toLowerCase() === rollNo.toLowerCase()
    );
  },
  addStudent(studentData: Omit<Student, "id">): Student {
    const newStudent: Student = {
      ...studentData,
      id: Math.max(0, ...store.students.map((s) => s.id)) + 1,
    };
    store.students.unshift(newStudent);

    // Sync to Neon
    const sql = getDb();
    if (sql) {
      const q = `INSERT INTO students (id, roll_no, name, email, phone, department, batch, cgpa, active_backlogs, skills, resume_url, status, offers_count, highest_offer_lpa)
VALUES (${newStudent.id}, '${newStudent.rollNo}', '${newStudent.name.replace(/'/g, "''")}', '${newStudent.email}', '${newStudent.phone}', '${newStudent.department}', '${newStudent.batch || "2027"}', ${newStudent.cgpa}, ${newStudent.activeBacklogs || 0}, '${JSON.stringify(newStudent.skills || [])}', '${newStudent.resumeUrl || ""}', '${newStudent.status}', ${newStudent.offersCount || 0}, ${newStudent.highestOfferLpa ?? "NULL"})`;
      logExecutedQuery("INSERT Student", q);
      sql.query(q).catch((e) => console.error("Neon Student Insert Error:", e));
    }

    return newStudent;
  },
  updateStudent(id: number, updates: Partial<Student>): Student | null {
    const index = store.students.findIndex((s) => s.id === id);
    if (index === -1) return null;
    store.students[index] = { ...store.students[index], ...updates };

    // Sync to Neon
    const sql = getDb();
    if (sql) {
      const s = store.students[index];
      const q = `UPDATE students SET cgpa = ${s.cgpa}, active_backlogs = ${s.activeBacklogs}, status = '${s.status}', skills = '${JSON.stringify(s.skills || [])}', phone = '${s.phone}' WHERE id = ${id}`;
      logExecutedQuery("UPDATE Student", q);
      sql.query(q).catch((e) => console.error("Neon Student Update Error:", e));
    }

    return store.students[index];
  },

  // ================= COMPANIES =================
  getCompanies(): CompanyDrive[] {
    return store.companies;
  },
  getCompanyById(id: number): CompanyDrive | undefined {
    return store.companies.find((c) => c.id === id);
  },
  addCompany(companyData: Omit<CompanyDrive, "id" | "applicantsCount">): CompanyDrive {
    const newCompany: CompanyDrive = {
      ...companyData,
      id: Math.max(0, ...store.companies.map((c) => c.id)) + 1,
      applicantsCount: 0,
    };
    store.companies.unshift(newCompany);

    // Sync to Neon
    const sql = getDb();
    if (sql) {
      const q = `INSERT INTO companies (id, company_name, logo, industry, tier, role_title, role_type, ctc_lpa, stipend_monthly, location, min_cgpa, max_backlogs, eligible_depts, eligible_batch, required_skills, deadline, drive_date, status, description, applicants_count)
VALUES (${newCompany.id}, '${newCompany.companyName.replace(/'/g, "''")}', '${newCompany.logo || ""}', '${newCompany.industry}', '${newCompany.tier}', '${newCompany.roleTitle.replace(/'/g, "''")}', '${newCompany.roleType}', ${newCompany.ctcLpa}, ${newCompany.stipendMonthly || 0}, '${newCompany.location}', ${newCompany.minCgpa}, ${newCompany.maxBacklogs}, '${JSON.stringify(newCompany.eligibleDepts || [])}', '${newCompany.eligibleBatch || "2027"}', '${JSON.stringify(newCompany.requiredSkills || [])}', '${newCompany.deadline}', '${newCompany.driveDate}', '${newCompany.status || "Upcoming"}', '${(newCompany.description || "").replace(/'/g, "''")}', 0)`;
      logExecutedQuery("INSERT Company", q);
      sql.query(q).catch((e) => console.error("Neon Company Insert Error:", e));
    }

    return newCompany;
  },
  updateCompany(id: number, updates: Partial<CompanyDrive>): CompanyDrive | null {
    const index = store.companies.findIndex((c) => c.id === id);
    if (index === -1) return null;
    store.companies[index] = { ...store.companies[index], ...updates };

    // Sync to Neon
    const sql = getDb();
    if (sql) {
      const c = store.companies[index];
      const q = `UPDATE companies SET role_title = '${c.roleTitle.replace(/'/g, "''")}', ctc_lpa = ${c.ctcLpa}, deadline = '${c.deadline}', status = '${c.status}', stages = '${JSON.stringify(c.stages || [])}' WHERE id = ${id}`;
      logExecutedQuery("UPDATE Company", q);
      sql.query(q).catch((e) => console.error("Neon Company Update Error:", e));
    }

    return store.companies[index];
  },
  updateCompanyStages(id: number, stages: any[]): CompanyDrive | null {
    const company = store.companies.find((c) => c.id === id);
    if (!company) return null;
    company.stages = stages;

    const sql = getDb();
    if (sql) {
      const q = `UPDATE companies SET stages = '${JSON.stringify(stages)}' WHERE id = ${id}`;
      logExecutedQuery("UPDATE Company Stages", q);
      sql.query(q).catch((e) => console.error("Neon Company Stages Update Error:", e));
    }

    return company;
  },
  deleteCompany(id: number): boolean {
    const index = store.companies.findIndex((c) => c.id === id);
    if (index === -1) return false;
    store.companies.splice(index, 1);
    store.applications = store.applications.filter((a) => a.driveId !== id);

    // Sync to Neon
    const sql = getDb();
    if (sql) {
      const q = `DELETE FROM companies WHERE id = ${id}`;
      logExecutedQuery("DELETE Company", q);
      sql.query(q).catch((e) => console.error("Neon Company Delete Error:", e));
    }

    return true;
  },

  // ================= APPLICATIONS =================
  getApplications(): Application[] {
    return store.applications;
  },
  getApplicationsByStudent(studentId: number): Application[] {
    return store.applications.filter((a) => a.studentId === studentId);
  },
  getApplicationsByCompany(driveId: number): Application[] {
    return store.applications.filter((a) => a.driveId === driveId);
  },
  getApplication(studentId: number, driveId: number): Application | undefined {
    return store.applications.find(
      (a) => a.studentId === studentId && a.driveId === driveId
    );
  },
  applyToDrive(
    studentId: number,
    driveId: number
  ): { success: boolean; message: string; application?: Application } {
    const student = this.getStudentById(studentId);
    if (!student) {
      return { success: false, message: "Student record not found." };
    }

    const company = this.getCompanyById(driveId);
    if (!company) {
      return { success: false, message: "Company drive not found." };
    }

    // Check unique constraint
    const existing = this.getApplication(studentId, driveId);
    if (existing) {
      return {
        success: false,
        message: `Unique Constraint Violation: You have already applied for ${company.companyName}.`,
      };
    }

    // Enforce Server-Side Eligibility
    const eligibility = checkEligibility(student, company);
    if (!eligibility.eligible) {
      return {
        success: false,
        message: `Eligibility Validation Failed: ${eligibility.reasons.join("; ")}`,
      };
    }

    const today = new Date().toISOString().split("T")[0];
    const newApp: Application = {
      id: Math.max(0, ...store.applications.map((a) => a.id)) + 1,
      studentId: student.id,
      studentName: student.name,
      rollNo: student.rollNo,
      department: student.department,
      cgpa: student.cgpa,
      driveId: company.id,
      companyName: company.companyName,
      roleTitle: company.roleTitle,
      ctcLpa: company.ctcLpa,
      appliedDate: today,
      stage: "Applied",
      remarks: "Application received. Under initial screening.",
      resumeUrl: student.resumeUrl || `/resumes/${student.rollNo}.pdf`,
      history: [
        {
          stage: "Applied",
          date: today,
          note: "Application submitted by student.",
        },
      ],
    };

    store.applications.unshift(newApp);
    company.applicantsCount += 1;

    // Update student status if unplaced
    if (student.status === "Unplaced") {
      student.status = "In Process";
    }

    // Sync to Neon
    const sql = getDb();
    if (sql) {
      const q = `INSERT INTO applications (id, student_id, student_name, roll_no, department, cgpa, drive_id, company_name, role_title, ctc_lpa, applied_date, stage, remarks, resume_url, history)
VALUES (${newApp.id}, ${newApp.studentId}, '${newApp.studentName.replace(/'/g, "''")}', '${newApp.rollNo}', '${newApp.department}', ${newApp.cgpa}, ${newApp.driveId}, '${newApp.companyName.replace(/'/g, "''")}', '${newApp.roleTitle.replace(/'/g, "''")}', ${newApp.ctcLpa}, '${newApp.appliedDate}', '${newApp.stage}', '${(newApp.remarks || "").replace(/'/g, "''")}', '${newApp.resumeUrl || ""}', '${JSON.stringify(newApp.history)}')`;
      logExecutedQuery("INSERT Application", q);
      sql.query(q).catch((e) => console.error("Neon Application Insert Error:", e));
    }

    return {
      success: true,
      message: `Successfully applied to ${company.companyName}!`,
      application: newApp,
    };
  },
  updateApplicationStage(
    appId: number,
    stage: ApplicationStage,
    remarks?: string
  ): Application | null {
    const app = store.applications.find((a) => a.id === appId);
    if (!app) return null;

    const today = new Date().toISOString().split("T")[0];
    app.stage = stage;
    if (remarks) app.remarks = remarks;

    if (!app.history) app.history = [];
    app.history.push({
      stage,
      date: today,
      note: remarks || `Status changed to ${stage} by placement team.`,
    });

    // If accepted/hired, update student record
    const isOffer = stage === "Accepted" || stage === "Hired" || stage.toLowerCase().includes("hired") || stage.toLowerCase().includes("offer");
    if (isOffer) {
      const student = this.getStudentById(app.studentId);
      if (student) {
        student.status = "Placed";
        student.offersCount = (student.offersCount || 0) + 1;
        student.highestOfferLpa = Math.max(
          student.highestOfferLpa || 0,
          app.ctcLpa
        );
        // Also sync student status update to Neon
        const sql = getDb();
        if (sql) {
          const q = `UPDATE students SET status = 'Placed', offers_count = ${student.offersCount}, highest_offer_lpa = ${student.highestOfferLpa} WHERE id = ${student.id}`;
          logExecutedQuery("UPDATE Student Placement Status", q);
          sql.query(q).catch((e) => console.error("Neon Student Placement Sync Error:", e));
        }
      }
    }

    // Sync to Neon
    const sql = getDb();
    if (sql) {
      const q = `UPDATE applications SET stage = '${stage}', remarks = '${(remarks || "").replace(/'/g, "''")}', history = '${JSON.stringify(app.history)}' WHERE id = ${appId}`;
      logExecutedQuery("UPDATE Application Stage", q);
      sql.query(q).catch((e) => console.error("Neon App Stage Update Error:", e));
    }

    return app;
  },

  // Bulk Accept/Reject
  bulkUpdateApplications(
    appIds: number[],
    stage: ApplicationStage,
    remarks?: string
  ): number {
    let updatedCount = 0;
    for (const id of appIds) {
      if (this.updateApplicationStage(id, stage, remarks)) {
        updatedCount++;
      }
    }
    return updatedCount;
  },

  // ================= ANALYTICS =================
  getAnalytics(): PlacementAnalyticsSummary {
    const totalStudents = store.students.length;
    const placedStudents = store.students.filter((s) => s.status === "Placed").length;
    const placementRate = totalStudents > 0 ? (placedStudents / totalStudents) * 100 : 0;
    const totalCompanies = store.companies.length;
    const totalApplications = store.applications.length;
    const acceptedApplications = store.applications.filter((a) => a.stage === "Accepted").length;
    const rejectedApplications = store.applications.filter((a) => a.stage === "Rejected").length;
    const pendingApplications = totalApplications - acceptedApplications - rejectedApplications;

    const placedCtcs = store.students
      .filter((s) => s.status === "Placed" && s.highestOfferLpa)
      .map((s) => s.highestOfferLpa || 0);

    const highestCtcLpa = placedCtcs.length > 0 ? Math.max(...placedCtcs) : 34.0;
    const averageCtcLpa =
      placedCtcs.length > 0
        ? placedCtcs.reduce((a, b) => a + b, 0) / placedCtcs.length
        : 18.5;

    // Branch breakdown
    const depts = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"];
    const branchStats = depts.map((d) => {
      const inDept = store.students.filter((s) => s.department === d);
      const placed = inDept.filter((s) => s.status === "Placed").length;
      const pct = inDept.length > 0 ? Math.round((placed / inDept.length) * 100) : 0;
      const placedDeptCtcs = inDept
        .filter((s) => s.status === "Placed" && s.highestOfferLpa)
        .map((s) => s.highestOfferLpa || 0);
      const avg =
        placedDeptCtcs.length > 0
          ? (placedDeptCtcs.reduce((a, b) => a + b, 0) / placedDeptCtcs.length).toFixed(1)
          : "—";
      return {
        branch: d,
        total: inDept.length,
        placed,
        percentage: pct,
        avgLpa: avg !== "—" ? `₹${avg} LPA` : "Pending",
      };
    });

    // Tier stats
    const allTiers: CompanyTier[] = ["Super Dream", "Dream", "Core", "Mass Recruiter"];
    const tierStats = allTiers.map((tier) => {
      const count = store.companies.filter((c) => c.tier === tier).length;
      return {
        tier,
        count,
        percentage: totalCompanies > 0 ? Math.round((count / totalCompanies) * 100) : 0,
      };
    });

    return {
      totalStudents,
      placedStudents,
      placementRate: Math.round(placementRate * 10) / 10,
      totalCompanies,
      totalApplications,
      acceptedApplications,
      rejectedApplications,
      pendingApplications,
      highestCtcLpa,
      averageCtcLpa: Math.round(averageCtcLpa * 10) / 10,
      branchStats,
      tierStats,
      recentApplicationsTrend: [
        { date: "Oct 15", applications: 1, acceptances: 0 },
        { date: "Oct 16", applications: 1, acceptances: 0 },
        { date: "Oct 18", applications: 1, acceptances: 1 },
      ],
      websiteStats: {
        activeUsers: store.users.length,
        dailyLogins: store.users.length * 2,
        mostVisitedPages: store.websiteVisits.slice(0, 3),
      },
    };
  },
};
