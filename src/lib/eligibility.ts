import { Application, CompanyDrive, EligibilityResult, Student } from "@/types";

/**
 * Validates eligibility of a student for a specific company recruitment drive.
 * Used on both Client UI and Server API endpoints to enforce zero tampering.
 */
export function checkEligibility(
  student: Student | null | undefined,
  company: CompanyDrive,
  existingApplication?: Application | null
): EligibilityResult {
  if (!student) {
    return {
      eligible: false,
      reasons: ["Student profile not found or not logged in."],
      isApplied: false,
      isExpired: false,
    };
  }

  const reasons: string[] = [];

  // 1. CGPA Cutoff
  if (student.cgpa < company.minCgpa) {
    reasons.push(
      `Minimum CGPA ${company.minCgpa.toFixed(2)} required (Your CGPA: ${student.cgpa.toFixed(2)})`
    );
  }

  // 2. Maximum Active Backlogs Allowed
  if (student.activeBacklogs > company.maxBacklogs) {
    reasons.push(
      `Max backlogs allowed: ${company.maxBacklogs} (You have: ${student.activeBacklogs} active backlogs)`
    );
  }

  // 3. Eligible Departments / Branches
  if (
    company.eligibleDepts &&
    company.eligibleDepts.length > 0 &&
    !company.eligibleDepts.includes(student.department)
  ) {
    reasons.push(
      `Department '${student.department}' is not eligible (Allowed: ${company.eligibleDepts.join(
        ", "
      )})`
    );
  }

  // 4. Batch Verification
  if (company.eligibleBatch && student.batch && company.eligibleBatch !== student.batch) {
    reasons.push(
      `Eligible batch is ${company.eligibleBatch} (Your batch: ${student.batch})`
    );
  }

  // 5. Registration Deadline
  const now = new Date();
  const deadlineDate = new Date(`${company.deadline}T23:59:59`);
  const isExpired = now > deadlineDate;
  if (isExpired) {
    reasons.push(`Registration deadline passed on ${company.deadline}`);
  }

  // 6. Already Applied Check
  const isApplied = !!existingApplication;
  if (isApplied) {
    reasons.push(`Already applied on ${existingApplication.appliedDate} (Status: ${existingApplication.stage})`);
  }

  const eligible = reasons.length === 0;

  return {
    eligible,
    reasons,
    isApplied,
    isExpired,
  };
}
