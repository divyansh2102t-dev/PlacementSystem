import { NextResponse } from "next/server";
import { PlaceHubStore, ensureNeonHydrated } from "@/lib/store";
import { StudentDepartment, UserRole } from "@/types";

export async function POST(request: Request) {
  try {
    await ensureNeonHydrated();
    const body = await request.json();
    const { name, email, department, rollNo, cgpa, phone, role } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required fields." },
        { status: 400 }
      );
    }

    const existing = PlaceHubStore.getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in." },
        { status: 409 }
      );
    }

    const assignedRole: UserRole = role === "admin" ? "admin" : "student";
    let studentId: number | undefined = undefined;
    let student = null;

    if (assignedRole === "student") {
      const parsedCgpa = parseFloat(cgpa) || 8.0;
      const dept: StudentDepartment = (department as StudentDepartment) || "CSE";
      const studentRoll = rollNo || `21${dept}0${Math.floor(10 + Math.random() * 89)}`;

      student = PlaceHubStore.addStudent({
        name,
        email,
        rollNo: studentRoll,
        department: dept,
        cgpa: parsedCgpa,
        phone: phone || "+91 98765 00000",
        batch: "2027",
        activeBacklogs: 0,
        skills: ["Data Structures", "Problem Solving", "Web Development"],
        resumeUrl: "https://example.com/resumes/student_profile.pdf",
        status: "Unplaced",
        offersCount: 0,
      });
      studentId = student.id;
    }

    const newUser = PlaceHubStore.addUser({
      name,
      email,
      role: assignedRole,
      studentId,
      active: true,
      avatar: name[0].toUpperCase(),
    });

    return NextResponse.json({
      success: true,
      message: `Registration successful! Welcome to PlaceHub, ${newUser.name}.`,
      user: newUser,
      student,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create account" },
      { status: 500 }
    );
  }
}

