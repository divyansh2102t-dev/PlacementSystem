"use client";

import React, { useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Award,
  Bell,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  CircleHelp,
  Clock3,
  Database,
  Download,
  ExternalLink,
  Eye,
  FileCheck,
  FileCode2,
  FileText,
  Filter,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  X,
  Zap,
} from "lucide-react";

// ============================================================================
// DATA MODELS & TYPES (Matching DBMS Relational Schema)
// ============================================================================

export type StudentDepartment = "CSE" | "IT" | "ECE" | "EEE" | "MECH" | "CIVIL";
export type PlacementStatus = "Placed" | "In Process" | "Unplaced" | "Higher Studies";
export type CompanyTier = "Super Dream" | "Dream" | "Core" | "Mass Recruiter";
export type ApplicationStage =
  | "Applied"
  | "Shortlisted"
  | "Online Assessment"
  | "Technical Interview"
  | "HR Round"
  | "Offered"
  | "Rejected";

export interface Student {
  id: number;
  rollNo: string;
  name: string;
  email: string;
  phone: string;
  department: StudentDepartment;
  cgpa: number;
  activeBacklogs: number;
  skills: string[];
  status: PlacementStatus;
  offersCount: number;
  highestOfferLpa?: number;
}

export interface CompanyDrive {
  id: number;
  companyName: string;
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
  deadline: string;
  driveDate: string;
  status: "Upcoming" | "Active" | "Completed";
  description: string;
  applicantsCount: number;
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
  remarks: string;
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

// ============================================================================
// INITIAL DATASETS
// ============================================================================

const initialStudents: Student[] = [
  {
    id: 1,
    rollNo: "21CS001",
    name: "Aarav Sharma",
    email: "aarav.sharma@college.edu",
    phone: "+91-9876543210",
    department: "CSE",
    cgpa: 9.35,
    activeBacklogs: 0,
    skills: ["React", "Next.js", "Node.js", "PostgreSQL", "Docker"],
    status: "Placed",
    offersCount: 1,
    highestOfferLpa: 28.5,
  },
  {
    id: 2,
    rollNo: "21CS042",
    name: "Diya Patel",
    email: "diya.patel@college.edu",
    phone: "+91-9876543211",
    department: "CSE",
    cgpa: 8.9,
    activeBacklogs: 0,
    skills: ["Python", "Django", "AWS", "Machine Learning", "FastAPI"],
    status: "Placed",
    offersCount: 1,
    highestOfferLpa: 24.0,
  },
  {
    id: 3,
    rollNo: "21IT015",
    name: "Rohan Gupta",
    email: "rohan.gupta@college.edu",
    phone: "+91-9876543212",
    department: "IT",
    cgpa: 8.42,
    activeBacklogs: 0,
    skills: ["Java", "Spring Boot", "MySQL", "Microservices", "Redis"],
    status: "In Process",
    offersCount: 0,
  },
  {
    id: 4,
    rollNo: "21EC028",
    name: "Ananya Iyer",
    email: "ananya.iyer@college.edu",
    phone: "+91-9876543213",
    department: "ECE",
    cgpa: 7.95,
    activeBacklogs: 0,
    skills: ["C++", "Embedded Systems", "Verilog", "Python", "IoT"],
    status: "In Process",
    offersCount: 0,
  },
  {
    id: 5,
    rollNo: "21ME009",
    name: "Vikram Singh",
    email: "vikram.singh@college.edu",
    phone: "+91-9876543214",
    department: "MECH",
    cgpa: 7.2,
    activeBacklogs: 1,
    skills: ["AutoCAD", "SolidWorks", "ANSYS", "MATLAB", "Python"],
    status: "Unplaced",
    offersCount: 0,
  },
  {
    id: 6,
    rollNo: "21CS088",
    name: "Tanisha Roy",
    email: "tanisha.roy@college.edu",
    phone: "+91-9876543215",
    department: "CSE",
    cgpa: 9.6,
    activeBacklogs: 0,
    skills: ["TypeScript", "Go", "Distributed Systems", "SQL", "GraphQL"],
    status: "Placed",
    offersCount: 2,
    highestOfferLpa: 31.0,
  },
  {
    id: 7,
    rollNo: "21EE019",
    name: "Karan Mehta",
    email: "karan.mehta@college.edu",
    phone: "+91-9876543216",
    department: "EEE",
    cgpa: 8.15,
    activeBacklogs: 0,
    skills: ["Power Electronics", "MATLAB", "PLC", "C++", "Simulink"],
    status: "In Process",
    offersCount: 0,
  },
  {
    id: 8,
    rollNo: "21CV004",
    name: "Pooja Deshmukh",
    email: "pooja.d@college.edu",
    phone: "+91-9876543217",
    department: "CIVIL",
    cgpa: 7.8,
    activeBacklogs: 0,
    skills: ["STAAD Pro", "Revit", "GIS", "Project Management", "MS Excel"],
    status: "Unplaced",
    offersCount: 0,
  },
];

const initialDrives: CompanyDrive[] = [
  {
    id: 1,
    companyName: "Google India",
    industry: "Technology & Cloud",
    tier: "Super Dream",
    roleTitle: "Software Engineer - University Graduate",
    roleType: "Full-Time",
    ctcLpa: 28.5,
    stipendMonthly: 120000,
    location: "Bengaluru / Hyderabad",
    minCgpa: 8.5,
    maxBacklogs: 0,
    eligibleDepts: ["CSE", "IT"],
    deadline: "2026-11-15",
    driveDate: "2026-11-20",
    status: "Active",
    description: "Design and build core distributed systems, search infra, and high-performance cloud applications.",
    applicantsCount: 68,
  },
  {
    id: 2,
    companyName: "Microsoft IDC",
    industry: "Software & Cloud",
    tier: "Super Dream",
    roleTitle: "Software Engineer",
    roleType: "Full-Time",
    ctcLpa: 31.0,
    stipendMonthly: 110000,
    location: "Hyderabad / Bengaluru",
    minCgpa: 8.25,
    maxBacklogs: 0,
    eligibleDepts: ["CSE", "IT"],
    deadline: "2026-11-25",
    driveDate: "2026-12-01",
    status: "Upcoming",
    description: "Build Azure cloud productivity tools and generative AI developer workflows.",
    applicantsCount: 52,
  },
  {
    id: 3,
    companyName: "Amazon",
    industry: "E-Commerce & AWS",
    tier: "Super Dream",
    roleTitle: "Software Development Engineer (SDE-1)",
    roleType: "Full-Time",
    ctcLpa: 24.0,
    stipendMonthly: 85000,
    location: "Hyderabad, India",
    minCgpa: 8.0,
    maxBacklogs: 0,
    eligibleDepts: ["CSE", "IT", "ECE"],
    deadline: "2026-11-10",
    driveDate: "2026-11-16",
    status: "Active",
    description: "Engineer microservices for retail checkout and AWS distributed message buses.",
    applicantsCount: 84,
  },
  {
    id: 4,
    companyName: "Morgan Stanley",
    industry: "Fintech & Banking",
    tier: "Super Dream",
    roleTitle: "Technology Analyst",
    roleType: "Full-Time",
    ctcLpa: 22.0,
    stipendMonthly: 75000,
    location: "Mumbai, India",
    minCgpa: 8.0,
    maxBacklogs: 0,
    eligibleDepts: ["CSE", "IT", "ECE"],
    deadline: "2026-10-30",
    driveDate: "2026-11-05",
    status: "Completed",
    description: "Develop low-latency trade matching systems and risk calculation models.",
    applicantsCount: 45,
  },
  {
    id: 5,
    companyName: "Qualcomm",
    industry: "Semiconductors & Wireless",
    tier: "Dream",
    roleTitle: "Firmware & Systems Engineer",
    roleType: "Full-Time",
    ctcLpa: 19.5,
    stipendMonthly: 60000,
    location: "Bengaluru, India",
    minCgpa: 7.5,
    maxBacklogs: 0,
    eligibleDepts: ["CSE", "ECE", "EEE"],
    deadline: "2026-11-18",
    driveDate: "2026-11-24",
    status: "Upcoming",
    description: "Develop 5G modem firmware and Snapdragon processor kernel subsystems.",
    applicantsCount: 39,
  },
  {
    id: 6,
    companyName: "TCS (Tata Consultancy)",
    industry: "IT Services & Consulting",
    tier: "Mass Recruiter",
    roleTitle: "Graduate Engineer Trainee (Digital / Prime)",
    roleType: "Full-Time",
    ctcLpa: 7.5,
    stipendMonthly: 25000,
    location: "Pan India",
    minCgpa: 6.0,
    maxBacklogs: 1,
    eligibleDepts: ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"],
    deadline: "2026-11-20",
    driveDate: "2026-11-28",
    status: "Upcoming",
    description: "Nationwide flagship campus intake for digital transformation and consulting roles.",
    applicantsCount: 192,
  },
  {
    id: 7,
    companyName: "Infosys Ltd",
    industry: "IT Services",
    tier: "Mass Recruiter",
    roleTitle: "Systems Engineer Specialist (SES)",
    roleType: "Full-Time",
    ctcLpa: 6.5,
    stipendMonthly: 20000,
    location: "Pune / Bengaluru",
    minCgpa: 6.0,
    maxBacklogs: 0,
    eligibleDepts: ["CSE", "IT", "ECE", "EEE"],
    deadline: "2026-11-18",
    driveDate: "2026-11-26",
    status: "Upcoming",
    description: "Cloud-first software engineering, enterprise modernization, and test automation.",
    applicantsCount: 140,
  },
];

const initialApplications: Application[] = [
  {
    id: 101,
    studentId: 1,
    studentName: "Aarav Sharma",
    rollNo: "21CS001",
    department: "CSE",
    cgpa: 9.35,
    driveId: 1,
    companyName: "Google India",
    roleTitle: "Software Engineer",
    ctcLpa: 28.5,
    appliedDate: "2026-10-14",
    stage: "Offered",
    remarks: "Offered after passing 4 rounds with exceptional scores in DSA.",
  },
  {
    id: 102,
    studentId: 2,
    studentName: "Diya Patel",
    rollNo: "21CS042",
    department: "CSE",
    cgpa: 8.9,
    driveId: 3,
    companyName: "Amazon",
    roleTitle: "SDE-1",
    ctcLpa: 24.0,
    appliedDate: "2026-10-15",
    stage: "Offered",
    remarks: "Cleared OA and barcode interview round. Offer rolled out.",
  },
  {
    id: 103,
    studentId: 3,
    studentName: "Rohan Gupta",
    rollNo: "21IT015",
    department: "IT",
    cgpa: 8.42,
    driveId: 3,
    companyName: "Amazon",
    roleTitle: "SDE-1",
    ctcLpa: 24.0,
    appliedDate: "2026-10-15",
    stage: "Technical Interview",
    remarks: "Awaiting Tech Round 2 results on Low-Level Design.",
  },
  {
    id: 104,
    studentId: 4,
    studentName: "Ananya Iyer",
    rollNo: "21EC028",
    department: "ECE",
    cgpa: 7.95,
    driveId: 5,
    companyName: "Qualcomm",
    roleTitle: "Firmware Engineer",
    ctcLpa: 19.5,
    appliedDate: "2026-10-16",
    stage: "Online Assessment",
    remarks: "OA scheduled on HackerEarth platform.",
  },
  {
    id: 105,
    studentId: 6,
    studentName: "Tanisha Roy",
    rollNo: "21CS088",
    department: "CSE",
    cgpa: 9.6,
    driveId: 2,
    companyName: "Microsoft IDC",
    roleTitle: "Software Engineer",
    ctcLpa: 31.0,
    appliedDate: "2026-10-12",
    stage: "Offered",
    remarks: "Premier direct offer in Core Cloud & AI group.",
  },
  {
    id: 106,
    studentId: 7,
    studentName: "Karan Mehta",
    rollNo: "21EE019",
    department: "EEE",
    cgpa: 8.15,
    driveId: 6,
    companyName: "TCS",
    roleTitle: "Graduate Engineer Trainee",
    ctcLpa: 7.5,
    appliedDate: "2026-10-18",
    stage: "Shortlisted",
    remarks: "Eligibility criteria verified by TPO desk.",
  },
  {
    id: 107,
    studentId: 5,
    studentName: "Vikram Singh",
    rollNo: "21ME009",
    department: "MECH",
    cgpa: 7.2,
    driveId: 6,
    companyName: "TCS",
    roleTitle: "Graduate Engineer Trainee",
    ctcLpa: 7.5,
    appliedDate: "2026-10-18",
    stage: "Applied",
    remarks: "Pending backlogs clearance verification.",
  },
];

const initialOffers: OfferReview[] = [
  {
    id: "OFF-GGL-01",
    driveId: 1,
    title: "Software Engineer - University Graduate",
    company: "Google India",
    tier: "Super Dream",
    industry: "Technology",
    location: "Bengaluru / Hyderabad",
    type: "Campus Recruitment",
    compensation: "₹28.50 LPA",
    ctcLpa: 28.5,
    received: "18 October 2026",
    score: 96,
    status: "Pending review",
    summary:
      "Premier software engineering opportunity for top-ranking students. Comprehensive package includes ₹18 LPA Base + ₹6 LPA Stocks + ₹4.5 LPA Joining Bonus.",
    highlights: [
      "Core distributed systems and scalable cloud infrastructure.",
      "Base salary ₹18,00,000 with annual refreshers.",
      "4-year vesting Google Stock Units (GSUs).",
    ],
    risks: [
      "Requires minimum CGPA 8.5 with no active backlogs.",
      "Strict background verification and transcript audit before joining.",
    ],
    category: "Super Dream",
    minCgpa: 8.5,
    eligibleBranches: "CSE, IT",
  },
  {
    id: "OFF-MSFT-02",
    driveId: 2,
    title: "Software Engineer - IDC Core",
    company: "Microsoft IDC",
    tier: "Super Dream",
    industry: "Software",
    location: "Hyderabad, India",
    type: "Campus Recruitment",
    compensation: "₹31.00 LPA",
    ctcLpa: 31.0,
    received: "16 October 2026",
    score: 95,
    status: "Shortlisted",
    summary:
      "Elite hiring partnership for developer tools and cloud engineering. Strong focus on generative AI services and operating system primitives.",
    highlights: [
      "Competitive benefits and health coverage for dependents.",
      "High internal mobility across global divisions.",
      "Annual performance bonuses up to 20% of base salary.",
    ],
    risks: [
      "High workload during major product release quarters.",
      "Initial relocation to Hyderabad IDC campus required.",
    ],
    category: "Super Dream",
    minCgpa: 8.25,
    eligibleBranches: "CSE, IT",
  },
  {
    id: "OFF-AMZN-03",
    driveId: 3,
    title: "Software Development Engineer (SDE-1)",
    company: "Amazon",
    tier: "Super Dream",
    industry: "E-Commerce & Cloud",
    location: "Hyderabad / Bengaluru",
    type: "Campus Recruitment",
    compensation: "₹24.00 LPA",
    ctcLpa: 24.0,
    received: "15 October 2026",
    score: 91,
    status: "Pending review",
    summary:
      "Full-time SDE role inside Amazon Retail and AWS platform teams. Excellent exposure to high-scale asynchronous messaging and transaction engines.",
    highlights: [
      "Monthly internship stipend ₹85,000 for 6 months prior to graduation.",
      "Direct ownership of services serving millions of requests per second.",
      "Amazon Leadership Principles driven culture.",
    ],
    risks: [
      "On-call rotation required after 6 months of onboarding.",
      "Rigorous performance evaluation framework.",
    ],
    category: "Super Dream",
    minCgpa: 8.0,
    eligibleBranches: "CSE, IT, ECE",
  },
  {
    id: "OFF-MS-04",
    driveId: 4,
    title: "Technology Analyst - Enterprise Trading",
    company: "Morgan Stanley",
    tier: "Super Dream",
    industry: "Fintech & Banking",
    location: "Mumbai, India",
    type: "Full-Time Analyst",
    compensation: "₹22.00 LPA",
    ctcLpa: 22.0,
    received: "14 October 2026",
    score: 89,
    status: "Pending review",
    summary:
      "Investment banking financial technology engineering position. Build low-latency equity derivatives processing and real-time ledger accounting.",
    highlights: [
      "Global training program in New York / London for cohort toppers.",
      "Premium compensation with substantial year-end discretionary bonuses.",
      "Mentorship from principal financial architects.",
    ],
    risks: [
      "Fixed Mumbai location without remote flexibility.",
      "High regulatory compliance and audit expectations.",
    ],
    category: "Super Dream",
    minCgpa: 8.0,
    eligibleBranches: "CSE, IT, ECE",
  },
  {
    id: "OFF-QCOM-05",
    driveId: 5,
    title: "Firmware & Systems Engineer",
    company: "Qualcomm",
    tier: "Dream",
    industry: "Semiconductors",
    location: "Bengaluru, India",
    type: "Core Hardware & SW",
    compensation: "₹19.50 LPA",
    ctcLpa: 19.5,
    received: "12 October 2026",
    score: 87,
    status: "Shortlisted",
    summary:
      "Hardware-software codesign and low-level C++ firmware engineering on Snapdragon wireless processors.",
    highlights: [
      "Ideal for ECE and CSE hardware enthusiasts.",
      "Patent filing bonuses and lab research access.",
      "Flexible hybrid work policy.",
    ],
    risks: [
      "Involves laboratory oscilloscope and board bring-up work.",
      "Specialized tech stack with slower generalist software pivoting.",
    ],
    category: "Dream",
    minCgpa: 7.5,
    eligibleBranches: "CSE, ECE, EEE",
  },
  {
    id: "OFF-TCS-06",
    driveId: 6,
    title: "Graduate Engineer Trainee (Prime/Digital)",
    company: "TCS",
    tier: "Mass Recruiter",
    industry: "IT Services",
    location: "Pan India",
    type: "Campus Recruitment",
    compensation: "₹7.50 LPA",
    ctcLpa: 7.5,
    received: "10 October 2026",
    score: 79,
    status: "Pending follow-up",
    summary:
      "Mass recruitment drive accommodating all engineering disciplines. 1 active backlog permitted at the time of online examination.",
    highlights: [
      "Open to all branches: CSE, IT, ECE, EEE, MECH, CIVIL.",
      "TCS Elevate incentive program can boost CTC by up to ₹3 LPA.",
      "Job security and broad enterprise domain training.",
    ],
    risks: [
      "Service agreement bond for 1 year.",
      "Job location assigned post-training based on business demands.",
    ],
    category: "Mass Recruiter",
    minCgpa: 6.0,
    eligibleBranches: "All Branches",
  },
];

// Pre-defined DBMS queries for DBMS evaluation & demonstration
const sampleQueries = [
  {
    id: "q1",
    title: "1. Elite Eligible Candidates",
    description: "Find students eligible for Super Dream drives (CGPA >= 8.5 & 0 backlogs)",
    sql: "SELECT roll_no, full_name, department, cgpa FROM Students WHERE cgpa >= 8.50 AND active_backlogs = 0 ORDER BY cgpa DESC;",
  },
  {
    id: "q2",
    title: "2. Super Dream Drives",
    description: "List all company drives offering CTC >= ₹20 LPA",
    sql: "SELECT company_name, job_title, ctc_lpa, tier, job_location FROM JobDrives WHERE ctc_lpa >= 20.00 ORDER BY ctc_lpa DESC;",
  },
  {
    id: "q3",
    title: "3. Branch-Wise Placement Statistics",
    description: "Aggregate placement count and average CGPA grouped by department",
    sql: "SELECT department, COUNT(student_id) AS total_students, ROUND(AVG(cgpa), 2) AS avg_cgpa FROM Students GROUP BY department;",
  },
  {
    id: "q4",
    title: "4. Placed Candidates (Relational JOIN)",
    description: "Join Students, JobDrives, and Companies to view confirmed offers",
    sql: "SELECT s.roll_no, s.full_name, c.company_name, d.job_title, a.ctc_lpa FROM Applications a JOIN Students s ON a.student_id = s.student_id JOIN JobDrives d ON a.drive_id = d.drive_id JOIN Companies c ON d.company_id = c.company_id WHERE a.application_status = 'Offered';",
  },
  {
    id: "q5",
    title: "5. High Value Companies (HAVING clause)",
    description: "Companies having multiple applicants and high average package",
    sql: "SELECT company_name, COUNT(application_id) AS total_apps, ROUND(AVG(ctc_lpa), 2) AS avg_ctc FROM Applications GROUP BY company_name HAVING total_apps >= 1 ORDER BY avg_ctc DESC;",
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function PlacementSystemApp() {
  // Navigation & Theme
  const [activeNav, setActiveNav] = useState<
    "Dashboard" | "Offers" | "Companies" | "Students" | "Applications" | "Reports" | "DBMS Explorer"
  >("Dashboard");
  const [dark, setDark] = useState<boolean>(false);
  const [mobileNav, setMobileNav] = useState<boolean>(false);
  const [toast, setToast] = useState<string>("");

  // Search & Global state
  const [search, setSearch] = useState<string>("");
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  // Entities state
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [drives, setDrives] = useState<CompanyDrive[]>(initialDrives);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [offers, setOffers] = useState<OfferReview[]>(initialOffers);

  // Offers Review Carousel State
  const [offerFilter, setOfferFilter] = useState<string>("All offers");
  const [currentOfferIndex, setCurrentOfferIndex] = useState<number>(0);
  const [offerNotes, setOfferNotes] = useState<Record<string, string>>({});
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  // Modals state
  const [isNewDriveModalOpen, setIsNewDriveModalOpen] = useState<boolean>(false);
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState<boolean>(false);
  const [activeStudentDetail, setActiveStudentDetail] = useState<Student | null>(null);

  // DBMS Query runner state
  const [activeQuerySql, setActiveQuerySql] = useState<string>(sampleQueries[0].sql);
  const [queryExecutionMessage, setQueryExecutionMessage] = useState<string>("");
  const [selectedSchemaTable, setSelectedSchemaTable] = useState<string>("Students");

  // Notifications
  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2800);
  };

  // Filtered offers for the Offers Review carousel
  const filteredOffers = useMemo(() => {
    return offers.filter((item) => {
      const matchesFilter =
        offerFilter === "All offers" ||
        (offerFilter === "Pending review" && item.status === "Pending review") ||
        (offerFilter === "Shortlisted" && item.status === "Shortlisted") ||
        (offerFilter === "Pending follow-up" && item.status === "Pending follow-up");

      const q = search.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [offers, offerFilter, search]);

  const safeOfferIndex = Math.min(
    currentOfferIndex,
    Math.max(filteredOffers.length - 1, 0)
  );
  const currentOffer = filteredOffers[safeOfferIndex];

  // Actions for Offers
  const handleOfferDecision = (
    decision: "Shortlisted" | "Passed" | "Pending follow-up" | "Skipped"
  ) => {
    if (!currentOffer) return;

    if (decision === "Skipped") {
      setCurrentOfferIndex((prev) => Math.min(prev + 1, filteredOffers.length - 1));
      notify(`Skipped ${currentOffer.company} review for now`);
      return;
    }

    setOffers((prev) =>
      prev.map((o) => (o.id === currentOffer.id ? { ...o, status: decision } : o))
    );

    notify(`${currentOffer.company} marked as: ${decision}`);
  };

  // Applications stage advance
  const handleAdvanceApplicationStage = (appId: number) => {
    const stageOrder: ApplicationStage[] = [
      "Applied",
      "Shortlisted",
      "Online Assessment",
      "Technical Interview",
      "HR Round",
      "Offered",
    ];

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const currentIdx = stageOrder.indexOf(app.stage);
        if (currentIdx >= 0 && currentIdx < stageOrder.length - 1) {
          const nextStage = stageOrder[currentIdx + 1];
          notify(`Advanced ${app.studentName} to ${nextStage}`);

          // If offered, update student placement status
          if (nextStage === "Offered") {
            setStudents((sList) =>
              sList.map((s) =>
                s.id === app.studentId
                  ? {
                      ...s,
                      status: "Placed",
                      offersCount: s.offersCount + 1,
                      highestOfferLpa: Math.max(s.highestOfferLpa || 0, app.ctcLpa),
                    }
                  : s
              )
            );
          }

          return { ...app, stage: nextStage };
        }
        return app;
      })
    );
  };

  // Add new company drive
  const handleCreateDrive = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newDrive: CompanyDrive = {
      id: drives.length + 1,
      companyName: formData.get("companyName") as string,
      industry: formData.get("industry") as string,
      tier: formData.get("tier") as CompanyTier,
      roleTitle: formData.get("roleTitle") as string,
      roleType: "Full-Time",
      ctcLpa: parseFloat(formData.get("ctcLpa") as string) || 8.0,
      stipendMonthly: parseFloat(formData.get("stipend") as string) || 25000,
      location: formData.get("location") as string,
      minCgpa: parseFloat(formData.get("minCgpa") as string) || 7.0,
      maxBacklogs: parseInt(formData.get("maxBacklogs") as string) || 0,
      eligibleDepts: ["CSE", "IT", "ECE"],
      deadline: formData.get("deadline") as string,
      driveDate: formData.get("driveDate") as string,
      status: "Upcoming",
      description: formData.get("description") as string,
      applicantsCount: 0,
    };

    setDrives([newDrive, ...drives]);
    setIsNewDriveModalOpen(false);
    notify(`Added recruitment drive for ${newDrive.companyName} (${newDrive.ctcLpa} LPA)`);
  };

  // Add new student
  const handleCreateStudent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newStudent: Student = {
      id: students.length + 1,
      rollNo: formData.get("rollNo") as string,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      department: formData.get("department") as StudentDepartment,
      cgpa: parseFloat(formData.get("cgpa") as string) || 7.5,
      activeBacklogs: parseInt(formData.get("backlogs") as string) || 0,
      skills: (formData.get("skills") as string).split(",").map((s) => s.trim()),
      status: "Unplaced",
      offersCount: 0,
    };

    setStudents([newStudent, ...students]);
    setIsNewStudentModalOpen(false);
    notify(`Student ${newStudent.name} (${newStudent.rollNo}) registered!`);
  };

  // Execute Simulated DBMS SQL Query
  const handleRunQuery = () => {
    setQueryExecutionMessage(`Executing on placement_system_db... Query returned records in 4ms.`);
    notify("SQL Query executed successfully!");
  };

  // Navigation Items
  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Offers", icon: FileText },
    { label: "Companies", icon: Building2 },
    { label: "Students", icon: Users },
    { label: "Applications", icon: Layers },
    { label: "Reports", icon: TrendingUp },
    { label: "DBMS Explorer", icon: Database },
  ] as const;

  return (
    <main
      className={`min-h-screen px-3 py-3 transition-colors sm:px-6 sm:py-5 lg:px-8 font-sans ${
        dark ? "bg-slate-950 text-slate-100" : "bg-[#d8eedf] text-[#242926]"
      }`}
    >
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1550px] flex-col">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between pb-2 text-[10px] font-semibold tracking-wider uppercase text-emerald-950/70">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>CAMPUS PLACEMENT MANAGEMENT SYSTEM · DBMS PROJECT</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded bg-emerald-700/10 px-2 py-0.5 text-[9px] font-mono text-emerald-900">
              RDBMS: MySQL 8.0
            </span>
            <span>ACADEMIC BATCH 2023–2027</span>
          </div>
        </header>

        {/* Main Application Container */}
        <div
          className={`flex flex-1 gap-2.5 rounded-[22px] border-[3px] p-2.5 shadow-[0_8px_0_rgba(20,40,30,0.06)] transition-colors ${
            dark ? "border-slate-800 bg-slate-900" : "border-[#252a27] bg-[#f4f5ec]"
          }`}
        >
          {/* Sidebar Navigation */}
          <aside
            className={`hidden w-12 shrink-0 flex-col items-center gap-3 rounded-2xl py-3 sm:flex transition-colors ${
              dark ? "bg-slate-800/80 text-slate-300" : "bg-[#fbfcf5] text-slate-700"
            }`}
          >
            {/* Logo */}
            <div
              onClick={() => setActiveNav("Dashboard")}
              className="grid h-8 w-8 cursor-pointer place-items-center rounded-xl bg-[#252a27] text-sm font-black text-emerald-300 shadow"
              title="PlaceHub Home"
            >
              P
            </div>

            <div className="my-1 h-[1px] w-6 bg-slate-200 dark:bg-slate-700" />

            {/* Nav icons */}
            {navItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => {
                  setActiveNav(label);
                  notify(`Opened ${label} view`);
                }}
                title={label}
                className={`group relative grid h-8 w-8 place-items-center rounded-xl transition ${
                  activeNav === label
                    ? "bg-[#252a27] text-emerald-300 shadow-sm"
                    : "text-slate-500 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon size={16} />
                <span className="pointer-events-none absolute left-12 z-40 hidden whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] text-white opacity-0 shadow-lg group-hover:block group-hover:opacity-100 transition-opacity">
                  {label}
                </span>
              </button>
            ))}

            <div className="flex-1" />

            {/* Help & Settings */}
            <button
              title="DBMS Project Docs & Help"
              onClick={() =>
                notify("DBMS Placement System: Schema, Triggers, Views & DDL/DML are active.")
              }
              className="grid h-8 w-8 place-items-center rounded-xl text-slate-400 hover:bg-slate-200/50 hover:text-slate-800"
            >
              <CircleHelp size={16} />
            </button>
            <button
              title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              onClick={() => setDark((prev) => !prev)}
              className="grid h-8 w-8 place-items-center rounded-xl text-slate-400 hover:bg-slate-200/50 hover:text-slate-800"
            >
              <Settings size={16} />
            </button>
          </aside>

          {/* Main Content Area */}
          <section className="flex min-w-0 flex-1 flex-col px-1 pb-1 sm:px-2">
            {/* Top Toolbar */}
            <header className="flex min-h-11 items-center justify-between gap-3 border-b border-slate-200/60 pb-2.5 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  className="rounded-lg bg-slate-200/70 p-2 sm:hidden dark:bg-slate-800"
                  onClick={() => setMobileNav((prev) => !prev)}
                  aria-label="Toggle navigation"
                >
                  <Menu size={16} />
                </button>
                <div className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-lg bg-[#e2e8da] dark:bg-slate-800 text-xs font-bold text-emerald-800 dark:text-emerald-400">
                    ❖
                  </span>
                  <div>
                    <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white sm:text-base">
                      {activeNav}
                    </h1>
                  </div>
                </div>
              </div>

              {/* Action Buttons & Profile */}
              <div className="flex items-center gap-2">
                <button
                  aria-label="Search"
                  onClick={() => setSearchOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 rounded-full border border-slate-300/80 bg-[#fffef9] px-3 py-1.5 text-xs text-slate-600 shadow-sm hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  <Search size={13} />
                  <span className="hidden md:inline">Search...</span>
                  <kbd className="hidden rounded bg-slate-100 px-1 text-[9px] font-mono text-slate-400 dark:bg-slate-700 md:inline">
                    /
                  </kbd>
                </button>

                <button
                  aria-label="Notifications"
                  onClick={() =>
                    notify("4 New placement drive notifications received today!")
                  }
                  className="relative grid h-8 w-8 place-items-center rounded-full border border-slate-300/80 bg-[#fffef9] text-slate-600 shadow-sm hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  <Bell size={14} />
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500" />
                </button>

                <div className="flex items-center gap-2 rounded-full border border-slate-300/80 bg-[#fffef9] py-1 pl-1.5 pr-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <div className="grid h-6 w-6 place-items-center rounded-full bg-emerald-200 text-xs font-black text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100">
                    T
                  </div>
                  <div className="hidden sm:block text-left text-[11px] leading-tight">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Tanisha Roy
                    </p>
                    <p className="text-[9px] text-slate-400">Placement Cell Head</p>
                  </div>
                </div>
              </div>
            </header>

            {/* Mobile Nav Drawer */}
            {mobileNav && (
              <div className="my-2 flex flex-wrap gap-1.5 rounded-xl bg-white p-2.5 shadow-md dark:bg-slate-800 sm:hidden">
                {navItems.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => {
                      setActiveNav(label);
                      setMobileNav(false);
                    }}
                    className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium ${
                      activeNav === label
                        ? "bg-[#252a27] text-white"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                    }`}
                  >
                    <Icon size={14} /> {label}
                  </button>
                ))}
              </div>
            )}

            {/* Global Search Bar */}
            {searchOpen && (
              <div className="my-2 flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <Search size={15} className="text-emerald-600" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search across students, roll numbers, companies, offers, or skills..."
                  className="w-full bg-transparent text-xs text-slate-800 outline-none dark:text-slate-100 placeholder:text-slate-400"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => setSearchOpen(false)}
                  className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* VIEW ROUTING */}
            <div className="mt-3 flex-1">
              {activeNav === "Dashboard" && (
                <DashboardView
                  students={students}
                  drives={drives}
                  applications={applications}
                  onNavigate={(nav) => setActiveNav(nav)}
                />
              )}

              {activeNav === "Offers" && (
                <OffersReviewView
                  offers={filteredOffers}
                  allOffersCount={offers.length}
                  current={currentOffer}
                  safeIndex={safeOfferIndex}
                  totalFiltered={filteredOffers.length}
                  filter={offerFilter}
                  setFilter={(f) => {
                    setOfferFilter(f);
                    setCurrentOfferIndex(0);
                  }}
                  onPrevious={() => setCurrentOfferIndex((i) => Math.max(i - 1, 0))}
                  onNext={() =>
                    setCurrentOfferIndex((i) =>
                      Math.min(i + 1, filteredOffers.length - 1)
                    )
                  }
                  onDecision={handleOfferDecision}
                  notes={offerNotes}
                  setNotes={setOfferNotes}
                  openDetails={() => setDetailsOpen(true)}
                />
              )}

              {activeNav === "Companies" && (
                <CompaniesView
                  drives={drives}
                  search={search}
                  onOpenNewDriveModal={() => setIsNewDriveModalOpen(true)}
                  onSelectDrive={(drive) => {
                    notify(`Drive selected: ${drive.companyName} - ${drive.roleTitle}`);
                  }}
                />
              )}

              {activeNav === "Students" && (
                <StudentsView
                  students={students}
                  search={search}
                  onOpenNewStudentModal={() => setIsNewStudentModalOpen(true)}
                  onSelectStudent={(student) => setActiveStudentDetail(student)}
                />
              )}

              {activeNav === "Applications" && (
                <ApplicationsView
                  applications={applications}
                  search={search}
                  onAdvanceStage={handleAdvanceApplicationStage}
                />
              )}

              {activeNav === "Reports" && (
                <ReportsView
                  students={students}
                  drives={drives}
                  applications={applications}
                  offers={offers}
                  onExport={() => notify("Generating Placement Reports summary PDF...")}
                />
              )}

              {activeNav === "DBMS Explorer" && (
                <DbmsExplorerView
                  activeQuerySql={activeQuerySql}
                  setActiveQuerySql={setActiveQuerySql}
                  onRunQuery={handleRunQuery}
                  executionMessage={queryExecutionMessage}
                  selectedTable={selectedSchemaTable}
                  setSelectedTable={setSelectedSchemaTable}
                  students={students}
                  drives={drives}
                  applications={applications}
                />
              )}
            </div>
          </section>
        </div>

        {/* Bottom Status Footer */}
        <footer className="flex flex-wrap items-center justify-between px-2 pt-2 text-[10px] text-emerald-950/70 dark:text-emerald-400/60 font-medium">
          <div className="flex items-center gap-2">
            <span>PLACEHUB SYSTEM</span>
            <span>·</span>
            <span>STATUS: DATABASE ONLINE</span>
            <span>·</span>
            <span className="font-mono">schema.sql verified</span>
          </div>
          <div className="flex items-center gap-3">
            <span>COLLEGE CAMPUS RECRUITMENT 2026–2027</span>
            <span>TPO PORTAL</span>
          </div>
        </footer>
      </div>

      {/* MODAL: Offer Full Details */}
      {detailsOpen && currentOffer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          onClick={() => setDetailsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-xl rounded-2xl bg-[#fffef9] p-6 text-slate-800 shadow-2xl dark:bg-slate-900 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                  {currentOffer.category}
                </span>
                <h2 className="mt-1.5 text-lg font-bold text-slate-900 dark:text-white">
                  {currentOffer.title}
                </h2>
                <p className="text-xs text-slate-500">{currentOffer.company} · {currentOffer.location}</p>
              </div>
              <button
                onClick={() => setDetailsOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              <div className="rounded-lg bg-slate-100 p-2.5 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400">Total CTC</span>
                <p className="font-bold text-emerald-700 dark:text-emerald-400">{currentOffer.compensation}</p>
              </div>
              <div className="rounded-lg bg-slate-100 p-2.5 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400">Min CGPA</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{currentOffer.minCgpa}</p>
              </div>
              <div className="rounded-lg bg-slate-100 p-2.5 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400">Branches</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{currentOffer.eligibleBranches}</p>
              </div>
              <div className="rounded-lg bg-slate-100 p-2.5 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400">Tier</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{currentOffer.tier}</p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300">Opportunity Summary</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{currentOffer.summary}</p>
            </div>

            <div className="mt-4">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300">Key Offer Highlights</h3>
              <ul className="mt-1 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                {currentOffer.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <Check size={12} className="text-emerald-600" /> {h}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400">Eligibility & Risk Notes</h3>
              <ul className="mt-1 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                {currentOffer.risks.map((r, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <CircleAlert size={12} className="text-amber-600" /> {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setDetailsOpen(false)}
                className="rounded-full bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleOfferDecision("Shortlisted");
                  setDetailsOpen(false);
                }}
                className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Shortlist Offer Drive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Register New Drive */}
      {isNewDriveModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          onClick={() => setIsNewDriveModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Register Campus Recruitment Drive
                </h2>
              </div>
              <button onClick={() => setIsNewDriveModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateDrive} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Company Name</label>
                  <input
                    required
                    name="companyName"
                    placeholder="e.g. Adobe India"
                    className="mt-1 w-full rounded-lg border p-2 text-xs dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Industry / Domain</label>
                  <input
                    required
                    name="industry"
                    placeholder="e.g. Creative Cloud"
                    className="mt-1 w-full rounded-lg border p-2 text-xs dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Job Role Title</label>
                  <input
                    required
                    name="roleTitle"
                    placeholder="e.g. Software Engineer"
                    className="mt-1 w-full rounded-lg border p-2 text-xs dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Recruitment Tier</label>
                  <select
                    name="tier"
                    className="mt-1 w-full rounded-lg border p-2 text-xs dark:bg-slate-800 dark:border-slate-700"
                  >
                    <option value="Super Dream">Super Dream (&gt; 20 LPA)</option>
                    <option value="Dream">Dream (10–20 LPA)</option>
                    <option value="Core">Core Engineering</option>
                    <option value="Mass Recruiter">Mass Recruiter</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">CTC (LPA)</label>
                  <input
                    required
                    type="number"
                    step="0.1"
                    name="ctcLpa"
                    placeholder="18.5"
                    className="mt-1 w-full rounded-lg border p-2 text-xs dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Monthly Stipend (₹)</label>
                  <input
                    type="number"
                    name="stipend"
                    placeholder="50000"
                    className="mt-1 w-full rounded-lg border p-2 text-xs dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Min CGPA</label>
                  <input
                    required
                    type="number"
                    step="0.1"
                    name="minCgpa"
                    defaultValue="7.5"
                    className="mt-1 w-full rounded-lg border p-2 text-xs dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Job Location</label>
                  <input
                    required
                    name="location"
                    placeholder="Bengaluru / Noida"
                    className="mt-1 w-full rounded-lg border p-2 text-xs dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Max Backlogs Allowed</label>
                  <input
                    type="number"
                    name="maxBacklogs"
                    defaultValue="0"
                    className="mt-1 w-full rounded-lg border p-2 text-xs dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Registration Deadline</label>
                  <input
                    required
                    type="date"
                    name="deadline"
                    defaultValue="2026-11-20"
                    className="mt-1 w-full rounded-lg border p-2 text-xs dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Drive Date</label>
                  <input
                    required
                    type="date"
                    name="driveDate"
                    defaultValue="2026-11-28"
                    className="mt-1 w-full rounded-lg border p-2 text-xs dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Job Description / Requirements</label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Outline the technical evaluation stages, skills required and job roles."
                  className="mt-1 w-full rounded-lg border p-2 text-xs dark:bg-slate-800 dark:border-slate-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewDriveModalOpen(false)}
                  className="rounded-lg bg-slate-100 px-4 py-2 font-medium hover:bg-slate-200 dark:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800"
                >
                  Save & Publish Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Register New Student */}
      {isNewStudentModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          onClick={() => setIsNewStudentModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Add Student to Placement Database
                </h2>
              </div>
              <button onClick={() => setIsNewStudentModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Roll Number</label>
                  <input
                    required
                    name="rollNo"
                    placeholder="e.g. 21CS099"
                    className="mt-1 w-full rounded-lg border p-2 text-xs dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                  <input
                    required
                    name="name"
                    placeholder="e.g. Ishaan Verma"
                    className="mt-1 w-full rounded-lg border p-2 text-xs dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">College Email</label>
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="ishaan.v@college.edu"
                    className="mt-1 w-full rounded-lg border p-2 text-xs dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Phone</label>
                  <input
                    required
                    name="phone"
                    placeholder="+91-9876543210"
                    className="mt-1 w-full rounded-lg border p-2 text-xs dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Department</label>
                  <select
                    name="department"
                    className="mt-1 w-full rounded-lg border p-2 text-xs dark:bg-slate-800 dark:border-slate-700"
                  >
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">CGPA</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    name="cgpa"
                    placeholder="8.50"
                    className="mt-1 w-full rounded-lg border p-2 text-xs dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Active Backlogs</label>
                  <input
                    type="number"
                    name="backlogs"
                    defaultValue="0"
                    className="mt-1 w-full rounded-lg border p-2 text-xs dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Key Skills (comma separated)</label>
                <input
                  name="skills"
                  placeholder="e.g. React, Python, C++, SQL, Docker"
                  className="mt-1 w-full rounded-lg border p-2 text-xs dark:bg-slate-800 dark:border-slate-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewStudentModalOpen(false)}
                  className="rounded-lg bg-slate-100 px-4 py-2 font-medium hover:bg-slate-200 dark:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800"
                >
                  Register Student (INSERT)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Student Profile Inspection */}
      {activeStudentDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          onClick={() => setActiveStudentDetail(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {activeStudentDetail.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {activeStudentDetail.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {activeStudentDetail.rollNo} · {activeStudentDetail.department}
                  </p>
                </div>
              </div>
              <button onClick={() => setActiveStudentDetail(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400">CGPA</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{activeStudentDetail.cgpa}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400">Backlogs</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{activeStudentDetail.activeBacklogs}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400">Status</span>
                <p className="font-bold text-emerald-700 dark:text-emerald-400">{activeStudentDetail.status}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400">Offers</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{activeStudentDetail.offersCount}</p>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Skills & Tech Stack:
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {activeStudentDetail.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setActiveStudentDetail(null)}
                className="w-full rounded-xl bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-emerald-700"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-[#252a27] px-5 py-2.5 text-xs font-medium text-white shadow-2xl flex items-center gap-2 border border-emerald-500/30"
        >
          <Sparkles size={14} className="text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}
    </main>
  );
}

// ============================================================================
// VIEW COMPONENT 1: DASHBOARD
// ============================================================================

function DashboardView({
  students,
  drives,
  applications,
  onNavigate,
}: {
  students: Student[];
  drives: CompanyDrive[];
  applications: Application[];
  onNavigate: (view: "Offers" | "Companies" | "Students" | "Applications" | "Reports" | "DBMS Explorer") => void;
}) {
  const placedCount = students.filter((s) => s.status === "Placed").length;
  const placementRate = Math.round((placedCount / students.length) * 100);
  const highestPackage = Math.max(...drives.map((d) => d.ctcLpa));
  const avgPackage = (
    drives.reduce((acc, curr) => acc + curr.ctcLpa, 0) / drives.length
  ).toFixed(1);

  return (
    <div className="space-y-4">
      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Total Registered" value={students.length.toString()} sub="Eligible candidates" icon={<Users size={16} />} color="emerald" />
        <KpiCard label="Active Drives" value={drives.length.toString()} sub="Top visiting companies" icon={<Building2 size={16} />} color="blue" />
        <KpiCard label="Placed Students" value={placedCount.toString()} sub={`${placementRate}% placement rate`} icon={<UserCheck size={16} />} color="teal" />
        <KpiCard label="Highest Package" value={`₹${highestPackage} LPA`} sub="Microsoft IDC campus" icon={<Award size={16} />} color="purple" />
        <KpiCard label="Average CTC" value={`₹${avgPackage} LPA`} sub="Across all recruiters" icon={<TrendingUp size={16} />} color="amber" />
        <KpiCard label="Total Offers" value={applications.filter((a) => a.stage === "Offered").length.toString()} sub="Verified offer letters" icon={<FileCheck size={16} />} color="rose" />
      </div>

      {/* Main Dashboard Two-Column Section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left 2 Cols: Live Campus Drives & Quick Applications */}
        <div className="space-y-4 lg:col-span-2">
          {/* Active Drives Showcase */}
          <div className="rounded-2xl bg-white p-4 shadow-xs dark:bg-slate-800">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BriefcaseBusiness size={16} className="text-emerald-700" />
                  Upcoming & Active Campus Drives
                </h3>
                <p className="text-[11px] text-slate-400">
                  Real-time status of recruiting companies and test dates
                </p>
              </div>
              <button
                onClick={() => onNavigate("Companies")}
                className="text-xs font-semibold text-emerald-800 hover:underline dark:text-emerald-400"
              >
                View all drives →
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {drives.slice(0, 4).map((drive) => (
                <div
                  key={drive.id}
                  className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 hover:border-emerald-300 transition-all dark:border-slate-700 dark:bg-slate-900/60"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="rounded bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {drive.tier}
                      </span>
                      <h4 className="mt-1 font-bold text-slate-900 dark:text-white text-xs">
                        {drive.companyName}
                      </h4>
                      <p className="text-[11px] text-slate-500">{drive.roleTitle}</p>
                    </div>
                    <span className="text-right text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      ₹{drive.ctcLpa} LPA
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 border-t pt-2 dark:border-slate-800">
                    <span>Min CGPA: <strong className="text-slate-700 dark:text-slate-200">{drive.minCgpa}</strong></span>
                    <span>Drive: <strong className="text-slate-700 dark:text-slate-200">{drive.driveDate}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Branch-Wise Placement Rate */}
          <div className="rounded-2xl bg-white p-4 shadow-xs dark:bg-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
              <GraduationCap size={16} className="text-emerald-700" />
              Branch-Wise Placement Progress (DBMS Aggregate)
            </h3>
            <p className="text-[11px] text-slate-400 mb-3">
              Calculated via GROUP BY department on registered database records
            </p>

            <div className="space-y-2.5 text-xs">
              <BranchProgressBar branch="Computer Science (CSE)" percentage={94} placed={47} total={50} avg="₹22.4 LPA" />
              <BranchProgressBar branch="Information Technology (IT)" percentage={88} placed={35} total={40} avg="₹18.6 LPA" />
              <BranchProgressBar branch="Electronics & Comm. (ECE)" percentage={80} placed={32} total={40} avg="₹14.2 LPA" />
              <BranchProgressBar branch="Electrical & Electronics (EEE)" percentage={68} placed={24} total={35} avg="₹9.5 LPA" />
              <BranchProgressBar branch="Mechanical Engineering (MECH)" percentage={60} placed={18} total={30} avg="₹7.8 LPA" />
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Actions & DBMS Spotlight */}
        <div className="space-y-4">
          {/* Quick Action Hub */}
          <div className="rounded-2xl bg-gradient-to-br from-emerald-800 to-[#1b4332] p-4 text-white shadow-md">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-300" />
              Placement Operations Hub
            </h3>
            <p className="mt-1 text-xs text-emerald-100/80 leading-relaxed">
              Streamline placement drives, filter eligible candidates via SQL queries, and roll out verified offer letters.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-2 text-xs">
              <button
                onClick={() => onNavigate("Offers")}
                className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2 font-medium hover:bg-white/20 transition backdrop-blur-xs"
              >
                <span>Review Drive Offers</span>
                <ArrowRight size={13} />
              </button>
              <button
                onClick={() => onNavigate("Applications")}
                className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2 font-medium hover:bg-white/20 transition backdrop-blur-xs"
              >
                <span>Track Applications Pipeline</span>
                <ArrowRight size={13} />
              </button>
              <button
                onClick={() => onNavigate("DBMS Explorer")}
                className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2 font-medium hover:bg-white/20 transition backdrop-blur-xs"
              >
                <span>Open DBMS Relational Schema</span>
                <Database size={13} />
              </button>
            </div>
          </div>

          {/* Recent Placed Candidates Wall */}
          <div className="rounded-2xl bg-white p-4 shadow-xs dark:bg-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <CheckCircle2 size={16} className="text-emerald-600" />
              Recent Confirmed Placements
            </h3>

            <div className="space-y-2.5">
              {students
                .filter((s) => s.status === "Placed")
                .map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 dark:bg-slate-900/60"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
                        {student.name[0]}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {student.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {student.rollNo} · {student.department} (CGPA {student.cgpa})
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      ₹{student.highestOfferLpa} LPA
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-800/90">
      <div className="flex items-center justify-between text-slate-400">
        <span className="text-[10px] font-semibold uppercase">{label}</span>
        <span className="text-emerald-700 dark:text-emerald-400">{icon}</span>
      </div>
      <p className="mt-1.5 text-lg font-black tracking-tight text-slate-900 dark:text-white">
        {value}
      </p>
      <p className="text-[9px] text-slate-400 truncate">{sub}</p>
    </div>
  );
}

function BranchProgressBar({
  branch,
  percentage,
  placed,
  total,
  avg,
}: {
  branch: string;
  percentage: number;
  placed: number;
  total: number;
  avg: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-1">
        <span className="font-semibold text-slate-700 dark:text-slate-300">{branch}</span>
        <span className="text-slate-500">
          {placed}/{total} Placed ({percentage}%) · Avg: <strong className="text-emerald-700 dark:text-emerald-400">{avg}</strong>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// VIEW COMPONENT 2: OFFERS REVIEW (Card Reviewer)
// ============================================================================

function OffersReviewView({
  offers,
  allOffersCount,
  current,
  safeIndex,
  totalFiltered,
  filter,
  setFilter,
  onPrevious,
  onNext,
  onDecision,
  notes,
  setNotes,
  openDetails,
}: {
  offers: OfferReview[];
  allOffersCount: number;
  current: OfferReview | undefined;
  safeIndex: number;
  totalFiltered: number;
  filter: string;
  setFilter: (f: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onDecision: (decision: "Shortlisted" | "Passed" | "Pending follow-up" | "Skipped") => void;
  notes: Record<string, string>;
  setNotes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  openDetails: () => void;
}) {
  const tabs = ["All offers", "Pending review", "Shortlisted", "Pending follow-up"];

  return (
    <div className="space-y-3">
      {/* Filters & Navigation toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                filter === tab
                  ? "bg-[#252a27] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              <span>{tab}</span>
              <span className="rounded-full bg-slate-200/60 dark:bg-slate-700 px-1.5 py-0.2 text-[9px]">
                {tab === "All offers" ? allOffersCount : offers.filter((o) => o.status === tab).length}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 text-[11px]">
            Reviewing <strong>{totalFiltered ? safeIndex + 1 : 0}</strong> of <strong>{totalFiltered}</strong>
          </span>
          <button
            disabled={safeIndex === 0}
            onClick={onPrevious}
            className="flex items-center gap-1 rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800"
          >
            <ArrowLeft size={12} /> Prev
          </button>
          <button
            disabled={!current || safeIndex >= totalFiltered - 1}
            onClick={onNext}
            className="flex items-center gap-1 rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800"
          >
            Next <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {!current ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl bg-white p-8 text-center dark:bg-slate-800">
          <Search size={28} className="text-slate-400" />
          <h3 className="mt-2 text-sm font-bold text-slate-800 dark:text-slate-100">No offers found</h3>
          <p className="mt-1 text-xs text-slate-400">Try changing your filter or clearing search.</p>
          <button
            onClick={() => setFilter("All offers")}
            className="mt-3 rounded-full bg-[#252a27] px-4 py-1.5 text-xs font-semibold text-white"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          {/* Main Card Review Area */}
          <div className="grid grid-cols-1 items-stretch gap-3 lg:grid-cols-[1.8fr_1.1fr]">
            {/* Left Card: Core Details */}
            <article className="flex flex-col rounded-2xl bg-white p-4 shadow-xs dark:bg-slate-800">
              <div className="flex gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-lg font-black text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
                  {current.company.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {current.tier}
                    </span>
                    <span className="text-[10px] text-slate-400">{current.id}</span>
                  </div>
                  <h2 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                    {current.title}
                  </h2>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                    <span>Company: <strong className="text-slate-700 dark:text-slate-200">{current.company}</strong></span>
                    <span>Industry: <strong className="text-slate-700 dark:text-slate-200">{current.industry}</strong></span>
                    <span>Location: <strong className="text-slate-700 dark:text-slate-200">{current.location}</strong></span>
                  </div>
                </div>
              </div>

              {/* Match / Quality Score */}
              <div className="mt-4">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Drive Quality / Match Index</span>
                  <strong className="text-emerald-700 dark:text-emerald-400">{current.score}% Score</strong>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                    style={{ width: `${current.score}%` }}
                  />
                </div>
              </div>

              {/* Compensation Grid */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-900/60">
                  <span className="text-[10px] text-slate-400">Total CTC</span>
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{current.compensation}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-900/60">
                  <span className="text-[10px] text-slate-400">Min CGPA</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{current.minCgpa}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-900/60">
                  <span className="text-[10px] text-slate-400">Branches</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{current.eligibleBranches}</p>
                </div>
              </div>

              {/* Review Notes */}
              <div className="mt-3 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-900/60">
                <label className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                  <MessageSquareText size={12} /> TPO Placement Desk Notes
                </label>
                <textarea
                  rows={2}
                  value={notes[current.id] || ""}
                  onChange={(e) =>
                    setNotes((prev) => ({ ...prev, [current.id]: e.target.value }))
                  }
                  placeholder="Record special interview round notes, bond details, or queries..."
                  className="w-full resize-none rounded-lg border border-slate-200 bg-white p-2 text-xs outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="mt-auto flex items-center justify-between pt-3 text-[10px] text-slate-400 border-t dark:border-slate-700/60">
                <span>Received: {current.received}</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Status: {current.status}
                </span>
              </div>
            </article>

            {/* Right Card: AI & Eligibility Breakdown */}
            <aside className="flex flex-col rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 p-4 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  <Sparkles size={14} /> AI Criteria & Evaluation
                </div>
                <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-bold text-emerald-800 shadow-2xs dark:bg-slate-700 dark:text-emerald-300">
                  VERIFIED
                </span>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {current.summary}
              </p>

              <div className="mt-3">
                <h4 className="text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                  <Check size={12} /> Key Highlights
                </h4>
                <ul className="mt-1 space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                  {current.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-3">
                <h4 className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-400 flex items-center gap-1">
                  <ShieldAlert size={12} /> Eligibility Checks
                </h4>
                <ul className="mt-1 space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                  {current.risks.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-600">⚠</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={openDetails}
                className="mt-auto flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Inspect Full Criteria <ExternalLink size={12} />
              </button>
            </aside>
          </div>

          {/* Action Decision Buttons */}
          <footer className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => onDecision("Shortlisted")}
              className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              <Check size={14} /> Shortlist Drive
            </button>
            <button
              onClick={() => onDecision("Passed")}
              className="flex items-center gap-1.5 rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 transition"
            >
              <X size={14} /> Pass
            </button>
            <button
              onClick={() => onDecision("Pending follow-up")}
              className="flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <MessageSquareText size={14} /> Follow-up
            </button>
            <button
              onClick={() => onDecision("Skipped")}
              className="flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Skip <ArrowRight size={14} />
            </button>
          </footer>
        </>
      )}
    </div>
  );
}

// ============================================================================
// VIEW COMPONENT 3: COMPANIES & RECRUITMENT DRIVES
// ============================================================================

function CompaniesView({
  drives,
  search,
  onOpenNewDriveModal,
  onSelectDrive,
}: {
  drives: CompanyDrive[];
  search: string;
  onOpenNewDriveModal: () => void;
  onSelectDrive: (drive: CompanyDrive) => void;
}) {
  const [selectedTier, setSelectedTier] = useState<string>("All");

  const filtered = useMemo(() => {
    return drives.filter((drive) => {
      const matchTier = selectedTier === "All" || drive.tier === selectedTier;
      const q = search.toLowerCase();
      const matchSearch =
        drive.companyName.toLowerCase().includes(q) ||
        drive.roleTitle.toLowerCase().includes(q) ||
        drive.industry.toLowerCase().includes(q);
      return matchTier && matchSearch;
    });
  }, [drives, selectedTier, search]);

  return (
    <div className="space-y-3">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {["All", "Super Dream", "Dream", "Mass Recruiter"].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                selectedTier === tier
                  ? "bg-[#252a27] text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenNewDriveModal}
          className="flex items-center gap-1.5 rounded-full bg-emerald-700 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800"
        >
          <Plus size={14} /> Add Recruitment Drive
        </button>
      </div>

      {/* Grid of Drives */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((drive) => (
          <div
            key={drive.id}
            onClick={() => onSelectDrive(drive)}
            className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer dark:border-slate-800 dark:bg-slate-800/90"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {drive.tier}
                </span>
                <h3 className="mt-1.5 text-sm font-bold text-slate-900 dark:text-white">
                  {drive.companyName}
                </h3>
                <p className="text-xs text-slate-500">{drive.roleTitle}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                  ₹{drive.ctcLpa} LPA
                </span>
                <p className="text-[10px] text-slate-400">Stipend: ₹{drive.stipendMonthly}/mo</p>
              </div>
            </div>

            <p className="mt-2.5 text-xs leading-relaxed text-slate-600 line-clamp-2 dark:text-slate-300">
              {drive.description}
            </p>

            <div className="mt-3 flex flex-wrap gap-1 text-[10px]">
              <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                Min CGPA: <strong>{drive.minCgpa}</strong>
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                Backlogs: <strong>{drive.maxBacklogs} allowed</strong>
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                Depts: <strong>{drive.eligibleDepts.join(", ")}</strong>
              </span>
            </div>

            <div className="mt-auto flex items-center justify-between pt-3 text-[10px] text-slate-400 border-t dark:border-slate-700/60">
              <span className="flex items-center gap-1">
                <Calendar size={11} /> Drive: {drive.driveDate}
              </span>
              <span className="font-semibold text-emerald-800 dark:text-emerald-400">
                {drive.applicantsCount} Applicants
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// VIEW COMPONENT 4: STUDENTS DIRECTORY
// ============================================================================

function StudentsView({
  students,
  search,
  onOpenNewStudentModal,
  onSelectStudent,
}: {
  students: Student[];
  search: string;
  onOpenNewStudentModal: () => void;
  onSelectStudent: (student: Student) => void;
}) {
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const filtered = useMemo(() => {
    return students.filter((student) => {
      const matchDept = selectedDept === "All" || student.department === selectedDept;
      const matchStatus = selectedStatus === "All" || student.status === selectedStatus;
      const q = search.toLowerCase();
      const matchSearch =
        student.name.toLowerCase().includes(q) ||
        student.rollNo.toLowerCase().includes(q) ||
        student.skills.some((s) => s.toLowerCase().includes(q));
      return matchDept && matchStatus && matchSearch;
    });
  }, [students, selectedDept, selectedStatus, search]);

  return (
    <div className="space-y-3">
      {/* Filtering Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="All">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="All">All Placement Statuses</option>
            <option value="Placed">Placed</option>
            <option value="In Process">In Process</option>
            <option value="Unplaced">Unplaced</option>
          </select>
        </div>

        <button
          onClick={onOpenNewStudentModal}
          className="flex items-center gap-1.5 rounded-full bg-emerald-700 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800"
        >
          <Plus size={14} /> Add Student (INSERT)
        </button>
      </div>

      {/* Relational Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:bg-slate-900/50">
              <tr>
                <th className="px-4 py-3">Roll No</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">CGPA</th>
                <th className="px-4 py-3">Backlogs</th>
                <th className="px-4 py-3">Skills / Tech Stack</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filtered.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-slate-50/60 transition dark:hover:bg-slate-700/30"
                >
                  <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">
                    {student.rollNo}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                    {student.name}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                      {student.department}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                    {student.cgpa}
                  </td>
                  <td className="px-4 py-3">
                    {student.activeBacklogs === 0 ? (
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">0 Clean</span>
                    ) : (
                      <span className="text-rose-600 font-bold">{student.activeBacklogs} Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex max-w-xs flex-wrap gap-1">
                      {student.skills.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="rounded bg-emerald-50 px-1.5 py-0.2 text-[9px] text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        >
                          {s}
                        </span>
                      ))}
                      {student.skills.length > 3 && (
                        <span className="text-[9px] text-slate-400">
                          +{student.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        student.status === "Placed"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : student.status === "In Process"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onSelectStudent(student)}
                      className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VIEW COMPONENT 5: APPLICATIONS & RECRUITMENT PIPELINE
// ============================================================================

function ApplicationsView({
  applications,
  search,
  onAdvanceStage,
}: {
  applications: Application[];
  search: string;
  onAdvanceStage: (appId: number) => void;
}) {
  const stages: ApplicationStage[] = [
    "Applied",
    "Shortlisted",
    "Online Assessment",
    "Technical Interview",
    "Offered",
  ];

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const q = search.toLowerCase();
      return (
        app.studentName.toLowerCase().includes(q) ||
        app.companyName.toLowerCase().includes(q) ||
        app.rollNo.toLowerCase().includes(q) ||
        app.roleTitle.toLowerCase().includes(q)
      );
    });
  }, [applications, search]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers size={16} className="text-emerald-700" />
            Recruitment Process Pipeline (Relational Tracking)
          </h2>
          <p className="text-xs text-slate-500">
            Advance candidates across evaluation stages or inspect feedback
          </p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          {filtered.length} Applications Total
        </span>
      </div>

      {/* Kanban Pipeline Columns */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 items-start">
        {stages.map((stage) => {
          const stageApps = filtered.filter((a) => a.stage === stage);
          return (
            <div
              key={stage}
              className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/50"
            >
              <div className="mb-2.5 flex items-center justify-between border-b pb-2 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {stage}
                </span>
                <span className="rounded-full bg-slate-200 px-2 py-0.2 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {stageApps.length}
                </span>
              </div>

              <div className="space-y-2">
                {stageApps.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-2xs dark:border-slate-700 dark:bg-slate-800"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {app.studentName}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {app.rollNo} · {app.department} (CGPA {app.cgpa})
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                        ₹{app.ctcLpa}L
                      </span>
                    </div>

                    <div className="mt-2 rounded bg-slate-50 p-1.5 text-[10px] dark:bg-slate-900/60">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {app.companyName}
                      </span>
                      <p className="text-slate-400 truncate">{app.roleTitle}</p>
                    </div>

                    <p className="mt-1.5 text-[9px] text-slate-500 italic line-clamp-1">
                      {app.remarks}
                    </p>

                    {stage !== "Offered" && (
                      <button
                        onClick={() => onAdvanceStage(app.id)}
                        className="mt-2.5 w-full rounded-lg bg-emerald-700 py-1 text-[10px] font-semibold text-white hover:bg-emerald-800 transition"
                      >
                        Advance Stage →
                      </button>
                    )}
                  </div>
                ))}

                {stageApps.length === 0 && (
                  <div className="py-6 text-center text-[11px] text-slate-400">
                    No candidates
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// VIEW COMPONENT 6: REPORTS & PLACEMENT ANALYTICS
// ============================================================================

function ReportsView({
  students,
  drives,
  applications,
  offers,
  onExport,
}: {
  students: Student[];
  drives: CompanyDrive[];
  applications: Application[];
  offers: OfferReview[];
  onExport: () => void;
}) {
  return (
    <div className="space-y-4">
      {/* Analytics Toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-700" />
            Placement Statistics & Evaluation Reports
          </h2>
          <p className="text-xs text-slate-500">
            Comprehensive institutional DBMS summary metrics and distribution analysis
          </p>
        </div>
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 rounded-full bg-emerald-700 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800"
        >
          <Download size={13} /> Export PDF Report
        </button>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Package Tier Distribution */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Package Tier Distribution (CTC LPA)
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Super Dream (&gt; ₹20 LPA)
                </span>
                <span className="font-bold text-emerald-700">4 Drives (57%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: "57%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Dream (₹10 – ₹20 LPA)
                </span>
                <span className="font-bold text-teal-700">1 Drive (14%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700">
                <div className="h-full rounded-full bg-teal-500" style={{ width: "14%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Mass Recruiter (&lt; ₹10 LPA)
                </span>
                <span className="font-bold text-blue-700">2 Drives (29%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700">
                <div className="h-full rounded-full bg-blue-500" style={{ width: "29%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Top Hiring Recruiters */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Top Recruiters by CTC & Intake
          </h3>
          <div className="space-y-2">
            {drives.slice(0, 4).map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 dark:bg-slate-900/50"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {d.companyName}
                  </h4>
                  <p className="text-[10px] text-slate-400">{d.location}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    ₹{d.ctcLpa} LPA
                  </span>
                  <p className="text-[10px] text-slate-400">{d.applicantsCount} Enrolled</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VIEW COMPONENT 7: DBMS RELATIONAL SCHEMA & LIVE SQL EXPLORER
// ============================================================================

function DbmsExplorerView({
  activeQuerySql,
  setActiveQuerySql,
  onRunQuery,
  executionMessage,
  selectedTable,
  setSelectedTable,
  students,
  drives,
  applications,
}: {
  activeQuerySql: string;
  setActiveQuerySql: (sql: string) => void;
  onRunQuery: () => void;
  executionMessage: string;
  selectedTable: string;
  setSelectedTable: (tbl: string) => void;
  students: Student[];
  drives: CompanyDrive[];
  applications: Application[];
}) {
  const schemaTables = [
    {
      name: "Students",
      records: students.length,
      columns: [
        { name: "student_id", type: "INT AUTO_INCREMENT", key: "PK" },
        { name: "roll_no", type: "VARCHAR(20) UNIQUE", key: "UK" },
        { name: "full_name", type: "VARCHAR(100)", key: "" },
        { name: "email", type: "VARCHAR(120) UNIQUE", key: "UK" },
        { name: "department", type: "ENUM('CSE','IT','ECE','EEE','MECH','CIVIL')", key: "" },
        { name: "cgpa", type: "DECIMAL(3,2) CHECK (cgpa <= 10.0)", key: "" },
        { name: "active_backlogs", type: "INT DEFAULT 0", key: "" },
        { name: "placement_status", type: "ENUM('Unplaced','In Process','Placed')", key: "" },
      ],
    },
    {
      name: "Companies",
      records: 6,
      columns: [
        { name: "company_id", type: "INT AUTO_INCREMENT", key: "PK" },
        { name: "company_name", type: "VARCHAR(100) UNIQUE", key: "UK" },
        { name: "industry", type: "VARCHAR(60)", key: "" },
        { name: "tier", type: "ENUM('Super Dream','Dream','Core','Mass')", key: "" },
        { name: "headquarters", type: "VARCHAR(100)", key: "" },
        { name: "hr_contact_email", type: "VARCHAR(120)", key: "" },
      ],
    },
    {
      name: "JobDrives",
      records: drives.length,
      columns: [
        { name: "drive_id", type: "INT AUTO_INCREMENT", key: "PK" },
        { name: "company_id", type: "INT", key: "FK -> Companies" },
        { name: "job_title", type: "VARCHAR(120)", key: "" },
        { name: "ctc_lpa", type: "DECIMAL(5,2)", key: "" },
        { name: "min_cgpa", type: "DECIMAL(3,2) DEFAULT 6.50", key: "" },
        { name: "max_backlogs_allowed", type: "INT DEFAULT 0", key: "" },
        { name: "drive_date", type: "DATE", key: "" },
      ],
    },
    {
      name: "Applications",
      records: applications.length,
      columns: [
        { name: "application_id", type: "INT AUTO_INCREMENT", key: "PK" },
        { name: "student_id", type: "INT", key: "FK -> Students" },
        { name: "drive_id", type: "INT", key: "FK -> JobDrives" },
        { name: "applied_date", type: "TIMESTAMP", key: "" },
        { name: "application_status", type: "ENUM('Applied','Shortlisted','Offered')", key: "" },
      ],
    },
    {
      name: "PlacementOffers",
      records: 3,
      columns: [
        { name: "offer_id", type: "INT AUTO_INCREMENT", key: "PK" },
        { name: "student_id", type: "INT", key: "FK -> Students" },
        { name: "company_id", type: "INT", key: "FK -> Companies" },
        { name: "ctc_lpa", type: "DECIMAL(5,2)", key: "" },
        { name: "acceptance_status", type: "ENUM('Pending','Accepted','Declined')", key: "" },
      ],
    },
  ];

  const currentTableMeta = schemaTables.find((t) => t.name === selectedTable);

  return (
    <div className="space-y-4">
      {/* Title & Info Banner */}
      <div className="rounded-2xl bg-emerald-950 p-4 text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Database size={20} className="text-emerald-400" />
            <div>
              <h2 className="text-sm font-bold tracking-wide">
                DBMS Relational Architecture & SQL Query Runner
              </h2>
              <p className="text-xs text-emerald-200/70">
                Database: <span className="font-mono text-emerald-300">placement_system_db</span> · Third Normal Form (3NF) compliant relational schema
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-800/80 px-3 py-1 text-[11px] font-mono text-emerald-200 border border-emerald-700">
            schema.sql loaded
          </span>
        </div>
      </div>

      {/* Main Two-Column View: Schema Navigator vs SQL Runner */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left Column: Schema Tables (4 Cols) */}
        <div className="space-y-3 lg:col-span-5">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Relational Tables (DDL Models)
            </h3>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {schemaTables.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setSelectedTable(t.name)}
                  className={`flex flex-col rounded-xl p-2.5 text-left text-xs transition ${
                    selectedTable === t.name
                      ? "bg-[#252a27] text-white shadow-xs"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-900/60 dark:text-slate-200"
                  }`}
                >
                  <span className="font-mono font-bold">{t.name}</span>
                  <span className="text-[10px] opacity-70">{t.records} tuples</span>
                </button>
              ))}
            </div>

            {/* Table Column Specs */}
            {currentTableMeta && (
              <div className="mt-4">
                <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between mb-2">
                  <span>Columns in `{currentTableMeta.name}`</span>
                  <span className="text-[10px] text-slate-400">{currentTableMeta.columns.length} Attributes</span>
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-700">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-50 text-[10px] uppercase text-slate-500 dark:bg-slate-900">
                      <tr>
                        <th className="p-2">Attribute</th>
                        <th className="p-2">Data Type</th>
                        <th className="p-2">Key / Constraint</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[10px]">
                      {currentTableMeta.columns.map((c) => (
                        <tr key={c.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                          <td className="p-2 font-bold text-slate-800 dark:text-slate-200">{c.name}</td>
                          <td className="p-2 text-slate-500">{c.type}</td>
                          <td className="p-2">
                            {c.key ? (
                              <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                {c.key}
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: SQL Query Playground (7 Cols) */}
        <div className="space-y-3 lg:col-span-7">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Professors / Examiners Standard SQL Queries
            </h3>

            {/* Quick Query Selector buttons */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {sampleQueries.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setActiveQuerySql(q.sql)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 transition"
                >
                  {q.title}
                </button>
              ))}
            </div>

            {/* SQL Editor Area */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-emerald-400 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 text-[10px] text-slate-400 border-b border-slate-800 mb-2">
                <span>SQL Query Editor</span>
                <span>Dialect: MySQL / PostgreSQL</span>
              </div>
              <textarea
                rows={3}
                value={activeQuerySql}
                onChange={(e) => setActiveQuerySql(e.target.value)}
                className="w-full bg-transparent text-emerald-300 outline-none resize-none font-mono text-xs"
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                {executionMessage || "Ready to run query against placement_system_db"}
              </span>
              <button
                onClick={onRunQuery}
                className="flex items-center gap-1.5 rounded-full bg-emerald-700 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition"
              >
                <RefreshCw size={13} /> Run SQL Query
              </button>
            </div>

            {/* Results Output Mock Table */}
            <div className="mt-4 rounded-xl border border-slate-200/80 dark:border-slate-700 overflow-hidden">
              <div className="bg-slate-100 p-2 text-[10px] font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-300 flex items-center justify-between">
                <span>Query Result Output Set (tuples returned)</span>
                <span className="text-emerald-700 font-mono">Status: 200 OK</span>
              </div>
              <div className="p-3 text-xs overflow-x-auto bg-slate-50/50 dark:bg-slate-900/40">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead>
                    <tr className="border-b text-[10px] uppercase text-slate-400">
                      <th className="pb-1.5 pr-3">Roll No</th>
                      <th className="pb-1.5 pr-3">Full Name</th>
                      <th className="pb-1.5 pr-3">Dept</th>
                      <th className="pb-1.5 pr-3">CGPA</th>
                      <th className="pb-1.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr>
                      <td className="py-1.5 font-bold">21CS088</td>
                      <td>Tanisha Roy</td>
                      <td>CSE</td>
                      <td className="font-bold text-emerald-600">9.60</td>
                      <td>Placed</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold">21CS001</td>
                      <td>Aarav Sharma</td>
                      <td>CSE</td>
                      <td className="font-bold text-emerald-600">9.35</td>
                      <td>Placed</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold">21CS042</td>
                      <td>Diya Patel</td>
                      <td>CSE</td>
                      <td className="font-bold text-emerald-600">8.90</td>
                      <td>Placed</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
