# Campus Placement Management System (DBMS Project)

A complete **Database Management System (DBMS)** web application designed to manage, streamline, and analyze university campus placements, student applications, and company recruitment drives.

Built with **Next.js (App Router)**, **Tailwind CSS**, and **TypeScript**, powered by a **Third Normal Form (3NF)** relational database schema.

---

## 🌟 Features

- **📊 Placement Dashboard:** Real-time KPIs (Total Registered, Participating Recruiters, Placement Rate %, Highest & Average CTC, Branch-Wise Breakdown).
- **💼 Offer & Drive Review:** Interactive decision desk to evaluate campus offers, eligibility criteria, CTC breakdown, and risk notes.
- **🏢 Companies & Recruitment Drives:** Comprehensive company directory with Tiers (*Super Dream*, *Dream*, *Core*, *Mass Recruiter*), eligibility rules (CGPA, Backlogs, Branches), and new drive registration.
- **👥 Students Directory:** Student records with Roll No, CGPA, department, active backlogs, skills tags, and placement status tracking.
- **📄 Application Pipeline:** Visual stage tracking (*Applied* ➔ *Shortlisted* ➔ *OA* ➔ *Tech Interview* ➔ *HR Round* ➔ *Offered*).
- **📈 Placement Analytics:** Branch-wise statistics, package tier distributions, and institutional evaluation reports.
- **🗄️ Interactive DBMS Explorer:** Live schema viewer displaying all 6 relational tables with Primary Keys, Foreign Keys, constraints, and an interactive SQL query runner.

---

## 🛠️ Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with curated themes and Dark Mode support
- **Icons:** [Lucide React](https://lucide.dev/)
- **Language:** TypeScript
- **Database (DBMS):** Relational SQL Schema (`MySQL 8.0+` / `PostgreSQL` / `MariaDB` compatible)

---

## 🗃️ Relational Database Schema (`dbms/schema.sql`)

The database model includes 6 interconnected relational tables adhering to 3NF standards:

1. `Companies` (`company_id` PK, `company_name`, `tier`, `industry`, `headquarters`, `hr_contact_email`)
2. `Students` (`student_id` PK, `roll_no` UK, `full_name`, `department`, `cgpa`, `active_backlogs`, `placement_status`)
3. `JobDrives` (`drive_id` PK, `company_id` FK, `job_title`, `ctc_lpa`, `min_cgpa`, `max_backlogs_allowed`, `drive_date`)
4. `Applications` (`application_id` PK, `student_id` FK, `drive_id` FK, `applied_date`, `application_status`)
5. `InterviewSchedules` (`interview_id` PK, `application_id` FK, `round_name`, `scheduled_at`, `mode`, `result`)
6. `PlacementOffers` (`offer_id` PK, `student_id` FK, `company_id` FK, `drive_id` FK, `ctc_lpa`, `acceptance_status`)

Includes stored procedures, relational triggers (e.g. automatic student status updates on offer acceptance), and analytical views.

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/divyansh2102t-dev/PlacementSystem.git
cd PlacementSystem
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

### 5. Database Setup (Optional MySQL)
To run the schema on a live MySQL instance:
```bash
mysql -u root -p < dbms/schema.sql
```
