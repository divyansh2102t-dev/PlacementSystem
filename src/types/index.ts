// ============================================================================
// PLACEHUB DATA MODELS & DOMAIN TYPES
// ============================================================================

export type UserRole = "admin" | "student";

export type StudentDepartment = "CSE" | "IT" | "ECE" | "EEE" | "MECH" | "CIVIL";

export type PlacementStatus = "Placed" | "In Process" | "Unplaced" | "Higher Studies";

export type CompanyTier = "Super Dream" | "Dream" | "Core" | "Mass Recruiter";

export type ApplicationStage =
  | "Applied"
  | "Under Review"
  | "Shortlisted"
  | "Online Assessment"
  | "Technical Interview"
  | "HR Round"
  | "Accepted"
  | "Rejected";

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  studentId?: number;
  active: boolean;
  avatar?: string;
  createdAt: string;
}

export interface Student {
  id: number;
  rollNo: string;
  name: string;
  email: string;
  phone: string;
  department: StudentDepartment;
  batch: string;
  cgpa: number;
  activeBacklogs: number;
  skills: string[];
  resumeUrl?: string;
  status: PlacementStatus;
  offersCount: number;
  highestOfferLpa?: number;
}

export interface CompanyDrive {
  id: number;
  companyName: string;
  logo?: string;
  industry: string;
  tier: CompanyTier;
  roleTitle: string;
  roleType: "Full-Time" | "Internship" | "Intern + PPO";
  ctcLpa: number;
  stipendMonthly: number;
  location: string;
  minCgpa: number;
  maxBacklogs: number;
  eligibleDepts: StudentDepartment[];
  eligibleBatch: string;
  requiredSkills: string[];
  deadline: string;
  driveDate: string;
  status: "Upcoming" | "Active" | "Completed";
  description: string;
  applicantsCount: number;
}

export interface ApplicationHistoryItem {
  stage: ApplicationStage;
  date: string;
  note: string;
}

export interface Application {
  id: number;
  studentId: number;
  studentName: string;
  rollNo: string;
  department: StudentDepartment;
  cgpa: number;
  driveId: number;
  companyName: string;
  roleTitle: string;
  ctcLpa: number;
  appliedDate: string;
  stage: ApplicationStage;
  remarks?: string;
  resumeUrl?: string;
  history?: ApplicationHistoryItem[];
}

export interface OfferReview {
  id: string;
  driveId: number;
  title: string;
  company: string;
  tier: CompanyTier;
  industry: string;
  location: string;
  type: string;
  compensation: string;
  ctcLpa: number;
  received: string;
  score: number;
  status: "Pending review" | "Shortlisted" | "Accepted" | "Passed" | "Pending follow-up";
  summary: string;
  highlights: string[];
  risks: string[];
  category: string;
  minCgpa: number;
  eligibleBranches: string;
}

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
  isApplied: boolean;
  isExpired: boolean;
}

export interface PlacementAnalyticsSummary {
  totalStudents: number;
  placedStudents: number;
  placementRate: number;
  totalCompanies: number;
  totalApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  pendingApplications: number;
  highestCtcLpa: number;
  averageCtcLpa: number;
  branchStats: {
    branch: string;
    total: number;
    placed: number;
    percentage: number;
    avgLpa: string;
  }[];
  tierStats: {
    tier: CompanyTier;
    count: number;
    percentage: number;
  }[];
  recentApplicationsTrend: {
    date: string;
    applications: number;
    acceptances: number;
  }[];
  websiteStats: {
    activeUsers: number;
    dailyLogins: number;
    mostVisitedPages: { page: string; views: number }[];
  };
}
