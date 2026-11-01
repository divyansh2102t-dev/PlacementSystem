# PlaceHub - Campus Placement Management System

A production-grade **Campus Placement Portal & Database Management System (DBMS)** designed to manage, streamline, and analyze university campus recruitment drives, student eligibility, corporate applications, and placement analytics.

Built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS**, and **TypeScript**, connected to **Neon Serverless PostgreSQL** and powered by a **Third Normal Form (3NF)** relational database schema.

---

## 🌟 Demo Credentials & Quick Logins

The login portal (`/login`) includes **1-Click Demo Buttons** for instant access without typing:

| Role | Demo Account Name | Email | Password | Landing Panel |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | Tanisha Roy *(Placement Cell Head)* | `admin@placehub.edu` | *(None / Demo)* | `/admin/dashboard` |
| **Student** | Aarav Sharma *(CSE · 9.35 CGPA)* | `student@placehub.edu` | *(None / Demo)* | `/student/dashboard` |
| **Student (Candidate 2)** | Diya Patel *(CSE · 8.90 CGPA)* | `diya.patel@placehub.edu` | *(None / Demo)* | `/student/dashboard` |
| **Student (Candidate 3)** | Rohan Kulkarni *(IT · 8.65 CGPA)* | `rohan.kulkarni@placehub.edu` | *(None / Demo)* | `/student/dashboard` |

> [!NOTE]
> **Zero Manual Role Switching**: Simply logging in with your credentials directly opens the corresponding interface (`/student/*` for students, `/admin/*` for university placement officers).

---

## 📁 Standard Next.js (App Router) Project Structure

The project follows a standard Next.js TypeScript directory architecture:

```text
PlacementSystem/
├── public/                     # Static assets (PlaceHub SVG logos, icons)
│   └── logo.svg
├── dbms/                       # Relational SQL architecture, DDL scripts & query audits
│   ├── schema.sql              # 3NF Relational database schema with triggers & views
│   └── executed_queries.sql    # Persistent query audit log of all executed DDL/DML queries
├── scripts/                    # Database seeding and migration automation
│   ├── seed-neon.mjs           # Migration script creating tables, views & seeding Neon DB
│   └── seedData.clean.ts       # Clean dataset definitions (50 students, 10 drives, applications)
├── src/
│   ├── app/                    # Next.js App Router routes & route groups
│   │   ├── (auth)/             # Authentication route group
│   │   │   └── login/          # Role-based login with 1-click demo accounts
│   │   ├── (student)/          # Student user panel route group
│   │   │   └── student/
│   │   │       ├── dashboard/  # Profile completion, eligible drives, active summary
│   │   │       ├── companies/  # Vertical stack company directory & criteria
│   │   │       ├── applications/# Live milestones timeline (Applied -> Accepted)
│   │   │       ├── analytics/  # Personal status breakdown & profile strength
│   │   │       └── profile/    # Editable CGPA, branch, backlogs, skills & resume
│   │   ├── (admin)/            # Protected administrator panel route group
│   │   │   └── admin/
│   │   │       ├── dashboard/  # Placement executive desk & quick drive actions
│   │   │       ├── companies/  # Add/Edit/Delete drives, CSV import, applicant reviews
│   │   │       ├── applications/# Kanban pipeline tracker across evaluation stages
│   │   │       ├── students/   # User directory, password reset, activate/deactivate
│   │   │       ├── analytics/  # Institution KPIs, branch placements, traffic telemetry
│   │   │       └── dbms-explorer/# 3NF schema tables and interactive live SQL query runner
│   │   ├── api/                # RESTful API route endpoints
│   │   │   ├── auth/           # Login & current user profile endpoints
│   │   │   ├── companies/      # CRUD & CSV bulk import for recruitment drives
│   │   │   ├── applications/   # Apply, stage progression, & bulk accept/reject
│   │   │   ├── students/       # Directory & student profile modification
│   │   │   ├── users/          # User management, roles, & password reset
│   │   │   ├── analytics/      # Aggregate statistics and website telemetry
│   │   │   └── dbms/           # Live SQL execution endpoint on Neon with audit logging
│   │   ├── layout.tsx          # Root layout with DM Sans & Manrope fonts
│   │   ├── globals.css         # Styling, brand palettes, & custom scrollbars
│   │   └── page.tsx            # Root landing page (routes to role panel)
│   ├── components/             # Reusable UI component modules
│   │   ├── ui/                 # Toast, Modal dialogs, Badges, Skeletons
│   │   ├── layout/             # ExpandableSidebar (hover-to-expand), Header, Layout
│   │   ├── student/            # CompanyVerticalCard, ApplyModal, ApplicationsTimeline
│   │   ├── admin/              # AdminCompanyModal, AdminApplicantsModal, UserManagement, DbmsExplorer
│   │   └── charts/             # Pure SVG BarChart, DonutChart, TrendLineChart
│   ├── lib/                    # Core utilities & database connections
│   │   ├── db.ts               # Neon PostgreSQL client, DNS hooks, & query audit logger
│   │   ├── store.ts            # Hydrated data store with live Neon synchronization
│   │   ├── eligibility.ts      # Client & Server eligibility validation engine
│   │   ├── auth.ts             # Client and server session helpers
│   │   └── utils.ts            # Formatters (₹ LPA, INR stipends, dates, CSV export)
│   ├── types/                  # Domain TypeScript interfaces & models
│   ├── hooks/                  # Custom React hooks (useAuth, useToast)
│   └── data/                   # Realistic seed datasets
│       └── seedData.ts         # 5 Users, 50 Students, 10 Companies, Applications
├── .env.example                # Sample environment variables
├── package.json                # Project dependencies and run scripts
├── tailwind.config.ts          # Custom brand green palette & fonts
├── tsconfig.json               # TypeScript path alias configuration (@/* -> ./src/*)
└── README.md                   # Comprehensive project documentation
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and set your Neon PostgreSQL connection string:
```env
NEXT_PUBLIC_APP_NAME="PlaceHub Campus Placement Portal"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
AUTH_SECRET="placehub-campus-secret-key-2026"

# Neon Serverless PostgreSQL Connection String
DATABASE_URL="postgresql://<user>:<password>@<endpoint>.neon.tech/<dbname>?sslmode=require"
```

### 3. Seed Neon Database
Run the automated migration and seed script to create all 3NF tables, analytical views, and populate 50 students, 10 companies, drives, and applications:
```bash
npm run db:seed
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser. You will be automatically redirected to `/login` where you can pick a 1-click demo role or sign in.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 🗄️ Database Architecture & Query Audit Log

### 1. 3NF Relational Tables
- **`users`**: System credentials, avatars, and RBAC roles (*Admin*, *Student*).
- **`students`**: Academic profile, branch, CGPA, backlogs, skills, placement status, and offers.
- **`companies`**: Recruiter corporate profiles, industry classification, recruitment tiers (*Super Dream*, *Dream*, *Core*, *Mass Recruiter*), eligibility rules, CTC packages, and drive deadlines.
- **`applications`**: Junction table recording student applications, evaluation milestones, remarks, and timestamped history.
- **`vw_placed_students_summary`**: Analytical view aggregating placed students with company tiers and packages.
- **`vw_branch_wise_placement_stats`**: Analytical view computing total students, placed count, placement percentage %, average CTC, and highest CTC grouped by engineering branch.

### 2. Query Audit Log (`dbms/executed_queries.sql`)
All SQL statements executed against the database are automatically audited and logged with ISO timestamps in:
- [**`dbms/executed_queries.sql`**](file:///d:/Projects/DBMS_Project/dbms/executed_queries.sql)

This includes:
- Schema migrations and table creations (`CREATE TABLE`, `CREATE VIEW`)
- Database seed operations (`INSERT INTO users`, `students`, `companies`, `applications`)
- Profile updates, applications, and drive edits performed in the portal
- Custom queries executed from the **Interactive DBMS Explorer**

---

## ✨ Key Features & Optimizations

### 1. Interactive DBMS Explorer & Live SQL Runner
- **Live Neon Execution:** Navigate to `/admin/dbms-explorer` to run ad-hoc SQL queries directly against your Neon PostgreSQL database.
- **Real-Time Tuple Output:** Displays actual returned rows, columns, and execution latency in milliseconds.
- **Query Logging:** Every query executed from the explorer is automatically saved to `dbms/executed_queries.sql`.
- **Pre-Loaded Professor Evaluation Queries:** 1-click query buttons to test Super Dream eligibility (CGPA $\ge$ 8.5), branch placement percentages, recruiter package rankings, and analytical views.

### 2. Hover-To-Expand Slim Sidebar
- **Default State:** A slim 64px collapsed sidebar showing icons only.
- **Hover/Focus State:** Expands smoothly to 240px with a 200ms ease transition, revealing full labels (*Dashboard, Companies, Applications, Students, Analytics, DBMS Explorer*).
- **Zero Layout Jump:** Positioned without causing layout flickers or content shifts.
- **Accessibility:** Fully keyboard navigable with tooltips on collapsed focus and mobile bottom navigation on smaller screens.

### 3. Full-Width Vertical Company Cards
- **Vertical Stack:** Replaces cluttered multi-column rows with clean, full-width stacked cards.
- **Eligibility Chips:** Prominently highlights **Minimum CGPA**, **Allowed Branches**, **Max Backlogs**, **Graduating Batch**, and **Required Skills**.
- **Live Status Badges:** Displays an active `Eligible` or `Not Eligible` badge with the exact reason (e.g., *"Minimum CGPA 8.5 required, current: 8.1"* or *"Allowed: CSE, IT"*).
- **Multi-Facet Filters:** Filter by Recruitment Tier (*Super Dream, Dream, Core, Mass*), Engineering Branch, Search queries, and an **"Eligible Only For Me"** toggle.

### 4. Comprehensive Student User Panel
1. **Dashboard:** Profile completion progress bar, count of eligible companies, application summary, and upcoming drive deadlines.
2. **Companies:** Vertical list of all companies with student-specific eligibility evaluations.
3. **Apply Flow:** Students can only apply if eligible, before the deadline, and if not already applied. Features a confirmation modal with server credential validation and a success toast.
4. **My Applications:** Live stage progression timeline (*Applied ➔ Under Review ➔ Shortlisted ➔ Accepted / Rejected*) with dates and administrative remarks.
5. **Analytics:** Total applied, accepted, rejected, pending breakdown chart, and recruiter competitiveness index.
6. **Profile:** Directly edit branch, CGPA, backlogs, skills, and resume upload (which dynamically updates company eligibility in real time!).

### 5. Administrator TPO Management Panel
1. **Companies Management:** Add, edit, and delete corporate drives, configure eligibility rules, and import via CSV/Excel.
2. **Review Applicants Per Drive:** Open any drive to inspect all candidate profiles, CGPAs, branches, and resume PDFs. Accept or Reject applications individually or in bulk with remarks.
3. **User Management:** Manage all students and admins, activate/deactivate accounts, reset passwords, assign roles, and import cohorts via CSV.
4. **Institutional Analytics:** Placement rate %, branch-wise distributions, recruiter packages, application trends over time, and web traffic telemetry.
5. **Interactive DBMS Explorer:** Relational table attributes, PK/FK constraints, and a live SQL query runner for professors and examiners.

---

## 🔒 Relational Constraints & Server-Side Security
- **Unique Application Constraint:** Enforces that a student can only apply to a specific company drive once (`UNIQUE (student_id, drive_id)`).
- **Server-Side Eligibility Enforcement:** In addition to UI disables, the `/api/applications` endpoint programmatically re-evaluates student CGPA, department, backlogs, and deadline before inserting any tuple.
- **Relational Integrity:** Automatically synchronizes student placement status and highest offer packages upon acceptance of an offer.
- **Query Audit Trail:** Maintains transparency for academic assessment through timestamped query logs in `dbms/executed_queries.sql`.
