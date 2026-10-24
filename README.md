# PlaceHub - Campus Placement Management System

A production-grade **Campus Placement Portal & Database Management System (DBMS)** designed to manage, streamline, and analyze university campus recruitment drives, student eligibility, corporate applications, and placement analytics.

Built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS**, and **TypeScript**, powered by a **Third Normal Form (3NF)** relational database schema.

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
├── dbms/                       # Relational SQL architecture & DDL scripts
│   └── schema.sql              # 3NF Relational database schema with triggers & views
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
│   │   │       └── dbms-explorer/# 3NF schema tables and interactive SQL query runner
│   │   ├── api/                # RESTful API route endpoints
│   │   │   ├── auth/           # Login & current user profile endpoints
│   │   │   ├── companies/      # CRUD & CSV bulk import for recruitment drives
│   │   │   ├── applications/   # Apply, stage progression, & bulk accept/reject
│   │   │   ├── students/       # Directory & student profile modification
│   │   │   ├── users/          # User management, roles, & password reset
│   │   │   └── analytics/      # Aggregate statistics and website telemetry
│   │   ├── layout.tsx          # Root layout with DM Sans & Manrope fonts
│   │   ├── globals.css         # Styling, brand palettes, & custom scrollbars
│   │   └── page.tsx            # Root landing page (routes to role panel)
│   ├── components/             # Reusable UI component modules
│   │   ├── ui/                 # Toast, Modal dialogs, Badges, Skeletons
│   │   ├── layout/             # ExpandableSidebar (hover-to-expand), Header, Layout
│   │   ├── student/            # CompanyVerticalCard, ApplyModal, ApplicationsTimeline
│   │   ├── admin/              # AdminCompanyModal, AdminApplicantsModal, UserManagement
│   │   └── charts/             # Pure SVG BarChart, DonutChart, TrendLineChart
│   ├── lib/                    # Core utilities & server storage
│   │   ├── store.ts            # Global server singleton store with relational logic
│   │   ├── eligibility.ts      # Client & Server eligibility validation engine
│   │   ├── auth.ts             # Client and server session helpers
│   │   └── utils.ts            # Formatters (₹ LPA, INR stipends, dates, CSV export)
│   ├── types/                  # Domain TypeScript interfaces & models
│   ├── hooks/                  # Custom React hooks (useAuth, useToast)
│   └── data/                   # Realistic seed datasets
│       └── seedData.ts         # 1 Admin, 50 Students, 10 Companies, Applications
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

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser. You will be automatically redirected to `/login` where you can pick a 1-click demo role or sign in.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## ✨ Key Features & Optimizations

### 1. Hover-To-Expand Slim Sidebar
- **Default State:** A slim 64px collapsed sidebar showing icons only.
- **Hover/Focus State:** Expands smoothly to 240px with a 200ms ease transition, revealing full labels (*Dashboard, Companies, Applications, Students, Analytics, DBMS Explorer*).
- **Zero Layout Jump:** Positioned without causing layout flickers or content shifts.
- **Accessibility:** Fully keyboard navigable with tooltips on collapsed focus and mobile bottom navigation on smaller screens.

### 2. Full-Width Vertical Company Cards
- **Vertical Stack:** Replaces cluttered multi-column rows with clean, full-width stacked cards.
- **Eligibility Chips:** Prominently highlights **Minimum CGPA**, **Allowed Branches**, **Max Backlogs**, **Graduating Batch**, and **Required Skills**.
- **Live Status Badges:** Displays an active `Eligible` or `Not Eligible` badge with the exact reason (e.g., *"Minimum CGPA 8.5 required, current: 8.1"* or *"Allowed: CSE, IT"*).
- **Multi-Facet Filters:** Filter by Recruitment Tier (*Super Dream, Dream, Core, Mass*), Engineering Branch, Search queries, and an **"Eligible Only For Me"** toggle.

### 3. Comprehensive Student User Panel
1. **Dashboard:** Profile completion progress bar, count of eligible companies, application summary, and upcoming drive deadlines.
2. **Companies:** Vertical list of all companies with student-specific eligibility evaluations.
3. **Apply Flow:** Students can only apply if eligible, before the deadline, and if not already applied. Features a confirmation modal with server credential validation and a success toast.
4. **My Applications:** Live stage progression timeline (*Applied ➔ Under Review ➔ Shortlisted ➔ Accepted / Rejected*) with dates and administrative remarks.
5. **Analytics:** Total applied, accepted, rejected, pending breakdown chart, and recruiter competitiveness index.
6. **Profile:** Directly edit branch, CGPA, backlogs, skills, and resume upload (which dynamically updates company eligibility in real time!).

### 4. Administrator TPO Management Panel
1. **Companies Management:** Add, edit, and delete corporate drives, configure eligibility rules, and import via CSV/Excel.
2. **Review Applicants Per Drive:** Open any drive to inspect all candidate profiles, CGPAs, branches, and resume PDFs. Accept or Reject applications individually or in bulk with remarks.
3. **User Management:** Manage all students and admins, activate/deactivate accounts, reset passwords, assign roles, and import cohorts via CSV.
4. **Institutional Analytics:** Placement rate %, branch-wise distributions, recruiter packages, application trends over time, and web traffic telemetry.
5. **Interactive DBMS Explorer:** Relational table attributes, PK/FK constraints, and a live SQL query runner for professors and examiners.

---

## 🔒 Relational Constraints & Server-Side Security
- **Unique Application Constraint:** Enforces that a student can only apply to a specific company drive once.
- **Server-Side Eligibility Enforcement:** In addition to UI disables, the `/api/applications` endpoint programmatically re-evaluates student CGPA, department, backlogs, and deadline before inserting any tuple.
- **Relational Integrity:** Automatically synchronizes student placement status and highest offer packages upon acceptance of an offer.
