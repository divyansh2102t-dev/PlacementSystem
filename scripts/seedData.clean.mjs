// ============================================================================
// USERS (Admin + Student Accounts) - Clean dataset: 3 users
// ============================================================================
export const initialUsers = [
  {
    id: 1,
    name: "Tanisha Roy",
    email: "admin@placehub.edu",
    role: "admin",
    active: true,
    avatar: "T",
    createdAt: "2026-08-01",
  },
  {
    id: 2,
    name: "Aarav Sharma",
    email: "student@placehub.edu",
    role: "student",
    studentId: 1,
    active: true,
    avatar: "A",
    createdAt: "2026-08-15",
  },
  {
    id: 3,
    name: "Diya Patel",
    email: "diya.patel@placehub.edu",
    role: "student",
    studentId: 2,
    active: true,
    avatar: "D",
    createdAt: "2026-08-15",
  },
];

// ============================================================================
// RECRUITMENT COMPANIES & DRIVES - Clean dataset: 3 companies
// ============================================================================
export const initialCompanies = [
  {
    id: 1,
    companyName: "Google India",
    logo: "G",
    industry: "Cloud & Distributed Systems",
    tier: "Super Dream",
    roleTitle: "Software Engineer (L3)",
    roleType: "Full-Time",
    ctcLpa: 34.0,
    stipendMonthly: 110000,
    location: "Bengaluru / Hyderabad",
    minCgpa: 8.5,
    maxBacklogs: 0,
    eligibleDepts: ["CSE", "IT"],
    eligibleBatch: "2027",
    requiredSkills: ["Data Structures", "Algorithms", "C++ / Java", "Distributed Systems"],
    deadline: "2026-11-25",
    driveDate: "2026-12-05",
    status: "Active",
    description: "Premier core systems engineering opportunity. Build scalable infrastructure powering Google Search and Cloud.",
    applicantsCount: 1,
    stages: [
      { id: "stg-1-1", name: "Applied", order: 1 },
      { id: "stg-1-2", name: "Shortlisting", order: 2 },
      { id: "stg-1-3", name: "Online Assessment", order: 3 },
      { id: "stg-1-4", name: "Technical Interview", order: 4 },
      { id: "stg-1-5", name: "HR Interview", order: 5 },
      { id: "stg-1-6", name: "Hired", order: 6 },
    ],
  },
  {
    id: 2,
    companyName: "Microsoft IDC",
    logo: "M",
    industry: "Enterprise Software & AI",
    tier: "Super Dream",
    roleTitle: "Software Development Engineer",
    roleType: "Full-Time",
    ctcLpa: 31.0,
    stipendMonthly: 95000,
    location: "Hyderabad, India",
    minCgpa: 8.25,
    maxBacklogs: 0,
    eligibleDepts: ["CSE", "IT", "ECE"],
    eligibleBatch: "2027",
    requiredSkills: ["Data Structures", "Cloud Architecture", "Azure", "C# / Python"],
    deadline: "2026-11-20",
    driveDate: "2026-11-30",
    status: "Active",
    description: "Develop generative AI developer primitives, cloud telemetry pipelines, and core Windows services.",
    applicantsCount: 1,
    stages: [
      { id: "stg-2-1", name: "Applied", order: 1 },
      { id: "stg-2-2", name: "Shortlisting", order: 2 },
      { id: "stg-2-3", name: "Online Assessment", order: 3 },
      { id: "stg-2-4", name: "Technical Interview", order: 4 },
      { id: "stg-2-5", name: "HR Interview", order: 5 },
      { id: "stg-2-6", name: "Hired", order: 6 },
    ],
  },
  {
    id: 3,
    companyName: "Amazon AWS",
    logo: "A",
    industry: "E-Commerce & Cloud Computing",
    tier: "Super Dream",
    roleTitle: "SDE - 1 (AWS Platform)",
    roleType: "Intern + PPO",
    ctcLpa: 28.5,
    stipendMonthly: 85000,
    location: "Bengaluru / Chennai",
    minCgpa: 8.0,
    maxBacklogs: 0,
    eligibleDepts: ["CSE", "IT", "ECE"],
    eligibleBatch: "2027",
    requiredSkills: ["OOP", "Java / Golang", "High-Throughput APIs", "SQL"],
    deadline: "2026-11-18",
    driveDate: "2026-11-28",
    status: "Active",
    description: "Architect high-scale asynchronous transaction backends handling peak holiday shopping loads.",
    applicantsCount: 1,
    stages: [
      { id: "stg-3-1", name: "Applied", order: 1 },
      { id: "stg-3-2", name: "Shortlisting", order: 2 },
      { id: "stg-3-3", name: "Online Assessment", order: 3 },
      { id: "stg-3-4", name: "Technical Interview", order: 4 },
      { id: "stg-3-5", name: "HR Interview", order: 5 },
      { id: "stg-3-6", name: "Hired", order: 6 },
    ],
  },
];

// ============================================================================
// STUDENTS (Batch 2027) - Clean dataset: 3 students
// ============================================================================
export const initialStudents = [
  {
    id: 1,
    rollNo: "21CS001",
    name: "Aarav Sharma",
    email: "student@placehub.edu",
    phone: "+91 98765 43210",
    department: "CSE",
    batch: "2027",
    cgpa: 9.35,
    activeBacklogs: 0,
    skills: ["Data Structures", "Algorithms", "C++", "Java", "Distributed Systems"],
    resumeUrl: "https://example.com/resumes/aarav_sharma.pdf",
    status: "Placed",
    offersCount: 1,
    highestOfferLpa: 34.0,
  },
  {
    id: 2,
    rollNo: "21IT014",
    name: "Diya Patel",
    email: "diya.patel@placehub.edu",
    phone: "+91 98765 43211",
    department: "IT",
    batch: "2027",
    cgpa: 8.8,
    activeBacklogs: 0,
    skills: ["React", "TypeScript", "Python", "Cloud Architecture"],
    resumeUrl: "https://example.com/resumes/diya_patel.pdf",
    status: "In Process",
    offersCount: 0,
    highestOfferLpa: null,
  },
  {
    id: 3,
    rollNo: "21EC025",
    name: "Rohan Kulkarni",
    email: "rohan.kulkarni@placehub.edu",
    phone: "+91 98765 43212",
    department: "ECE",
    batch: "2027",
    cgpa: 7.9,
    activeBacklogs: 0,
    skills: ["Embedded Systems", "C", "Python", "IoT"],
    resumeUrl: "https://example.com/resumes/rohan_kulkarni.pdf",
    status: "Unplaced",
    offersCount: 0,
    highestOfferLpa: null,
  },
];

// ============================================================================
// APPLICATIONS - Clean dataset: 3 applications
// ============================================================================
export const initialApplications = [
  {
    id: 1,
    studentId: 1,
    studentName: "Aarav Sharma",
    rollNo: "21CS001",
    department: "CSE",
    cgpa: 9.35,
    driveId: 1,
    companyName: "Google India",
    roleTitle: "Software Engineer (L3)",
    ctcLpa: 34.0,
    appliedDate: "2026-10-15",
    stage: "Accepted",
    remarks: "Selected for L3 Software Engineering position with ₹34.0 LPA CTC offer.",
    resumeUrl: "https://example.com/resumes/aarav_sharma.pdf",
    history: [
      {
        stage: "Applied",
        date: "2026-10-15",
        note: "Application submitted.",
      },
      {
        stage: "Online Assessment",
        date: "2026-10-18",
        note: "Scored 100% on coding assessment.",
      },
      {
        stage: "Technical Interview",
        date: "2026-10-22",
        note: "System design and algorithm round cleared.",
      },
      {
        stage: "Accepted",
        date: "2026-10-25",
        note: "Offer letter issued.",
      },
    ],
  },
  {
    id: 2,
    studentId: 2,
    studentName: "Diya Patel",
    rollNo: "21IT014",
    department: "IT",
    cgpa: 8.8,
    driveId: 2,
    companyName: "Microsoft IDC",
    roleTitle: "Software Development Engineer",
    ctcLpa: 31.0,
    appliedDate: "2026-10-16",
    stage: "Technical Interview",
    remarks: "Technical Round 1 cleared. Scheduled for Round 2.",
    resumeUrl: "https://example.com/resumes/diya_patel.pdf",
    history: [
      {
        stage: "Applied",
        date: "2026-10-16",
        note: "Application submitted.",
      },
      {
        stage: "Shortlisted",
        date: "2026-10-19",
        note: "Profile shortlisted by recruiters.",
      },
      {
        stage: "Technical Interview",
        date: "2026-10-24",
        note: "Cleared technical round 1.",
      },
    ],
  },
  {
    id: 3,
    studentId: 3,
    studentName: "Rohan Kulkarni",
    rollNo: "21EC025",
    department: "ECE",
    cgpa: 7.9,
    driveId: 3,
    companyName: "Amazon AWS",
    roleTitle: "SDE - 1 (AWS Platform)",
    ctcLpa: 28.5,
    appliedDate: "2026-10-18",
    stage: "Applied",
    remarks: "Application received and under recruiter review.",
    resumeUrl: "https://example.com/resumes/rohan_kulkarni.pdf",
    history: [
      {
        stage: "Applied",
        date: "2026-10-18",
        note: "Application submitted.",
      },
    ],
  },
];

// ============================================================================
// DBMS SAMPLE QUERIES (For professors / examiners query runner) - 3 queries
// ============================================================================
export const sampleQueries = [
  {
    id: 1,
    title: "Eligible Students for Super Dream Drives (CGPA >= 8.5)",
    sql: `SELECT roll_no, name, department, cgpa, status
FROM students
WHERE cgpa >= 8.50 AND active_backlogs = 0
ORDER BY cgpa DESC;`,
  },
  {
    id: 2,
    title: "Branch-Wise Placement Summary & Highest CTC",
    sql: `SELECT department, 
       COUNT(id) AS total_students,
       SUM(CASE WHEN status = 'Placed' THEN 1 ELSE 0 END) AS placed_count,
       ROUND(AVG(highest_offer_lpa), 2) AS avg_placed_ctc,
       MAX(highest_offer_lpa) AS max_ctc
FROM students
GROUP BY department
ORDER BY placed_count DESC;`,
  },
  {
    id: 3,
    title: "Live Application Pipeline by Stage",
    sql: `SELECT stage, COUNT(id) AS count,
       ROUND(AVG(ctc_lpa), 2) AS avg_package_lpa
FROM applications
GROUP BY stage
ORDER BY count DESC;`,
  },
];

// ============================================================================
// OFFER REVIEWS (Verification queue) - 2 reviews
// ============================================================================
export const initialOffersReview = [
  {
    id: "off-01",
    driveId: 1,
    title: "Software Engineer (L3)",
    company: "Google India",
    tier: "Super Dream",
    industry: "Cloud & Distributed Systems",
    location: "Bengaluru / Hyderabad",
    type: "Full-Time",
    compensation: "₹34.0 LPA",
    ctcLpa: 34.0,
    received: "2026-10-25",
    score: 95,
    status: "Accepted",
    summary: "Premier core systems engineering opportunity with top-tier compensation.",
    highlights: ["High Base Pay", "RSU Stocks", "Comprehensive Health Insurance"],
    risks: ["Demanding initial ramp-up"],
    category: "Super Dream Offer",
    minCgpa: 8.5,
    eligibleBranches: "CSE, IT",
  },
  {
    id: "off-02",
    driveId: 2,
    title: "Software Development Engineer",
    company: "Microsoft IDC",
    tier: "Super Dream",
    industry: "Enterprise Software & AI",
    location: "Hyderabad, India",
    type: "Full-Time",
    compensation: "₹31.0 LPA",
    ctcLpa: 31.0,
    received: "2026-10-28",
    score: 92,
    status: "Shortlisted",
    summary: "Generative AI developer primitives, cloud telemetry pipelines, and core Windows services.",
    highlights: ["Hybrid Flexibility", "Annual Bonus", "Learning Budget"],
    risks: ["Team allocation post joining"],
    category: "Super Dream Offer",
    minCgpa: 8.25,
    eligibleBranches: "CSE, IT, ECE",
  },
];
