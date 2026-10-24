import { NextResponse } from "next/server";
import { PlaceHubStore } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const dept = searchParams.get("department");
  const status = searchParams.get("status");
  const search = searchParams.get("search")?.toLowerCase();

  if (id) {
    const student = PlaceHubStore.getStudentById(parseInt(id, 10));
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    return NextResponse.json(student);
  }

  let students = PlaceHubStore.getStudents();

  if (dept && dept !== "All") {
    students = students.filter((s) => s.department === dept);
  }

  if (status && status !== "All") {
    students = students.filter((s) => s.status === status);
  }

  if (search) {
    students = students.filter(
      (s) =>
        s.name.toLowerCase().includes(search) ||
        s.rollNo.toLowerCase().includes(search) ||
        s.skills.some((sk) => sk.toLowerCase().includes(search))
    );
  }

  return NextResponse.json(students);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check for bulk CSV import
    if (Array.isArray(body)) {
      const created = [];
      for (const item of body) {
        if (item.rollNo && item.name) {
          const s = PlaceHubStore.addStudent({
            rollNo: item.rollNo,
            name: item.name,
            email: item.email || `${item.rollNo.toLowerCase()}@placehub.edu`,
            phone: item.phone || "+91-9876543200",
            department: item.department || "CSE",
            batch: item.batch || "2027",
            cgpa: parseFloat(item.cgpa) || 7.5,
            activeBacklogs: parseInt(item.activeBacklogs, 10) || 0,
            skills: Array.isArray(item.skills)
              ? item.skills
              : typeof item.skills === "string"
              ? item.skills.split(";").map((x: string) => x.trim())
              : ["Java", "SQL"],
            resumeUrl: `/resumes/${item.rollNo}.pdf`,
            status: item.status || "Unplaced",
            offersCount: 0,
          });
          created.push(s);
        }
      }
      return NextResponse.json({
        success: true,
        message: `Imported ${created.length} students successfully!`,
        students: created,
      });
    }

    if (!body.rollNo || !body.name) {
      return NextResponse.json(
        { error: "Roll number and name are required." },
        { status: 400 }
      );
    }

    const newStudent = PlaceHubStore.addStudent({
      rollNo: body.rollNo,
      name: body.name,
      email: body.email || `${body.rollNo.toLowerCase()}@placehub.edu`,
      phone: body.phone || "+91-9876543200",
      department: body.department || "CSE",
      batch: body.batch || "2027",
      cgpa: parseFloat(body.cgpa) || 7.5,
      activeBacklogs: parseInt(body.activeBacklogs, 10) || 0,
      skills: Array.isArray(body.skills)
        ? body.skills
        : typeof body.skills === "string"
        ? body.skills.split(",").map((s: string) => s.trim())
        : ["C++", "DSA"],
      resumeUrl: body.resumeUrl || `/resumes/${body.rollNo}.pdf`,
      status: body.status || "Unplaced",
      offersCount: 0,
    });

    return NextResponse.json({
      success: true,
      message: `Student ${newStudent.name} (${newStudent.rollNo}) registered!`,
      student: newStudent,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create student record" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    if (updates.cgpa !== undefined) {
      updates.cgpa = parseFloat(updates.cgpa);
    }
    if (updates.activeBacklogs !== undefined) {
      updates.activeBacklogs = parseInt(updates.activeBacklogs, 10);
    }

    const updated = PlaceHubStore.updateStudent(parseInt(id, 10), updates);
    if (!updated) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Updated profile for ${updated.name}`,
      student: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update student" },
      { status: 500 }
    );
  }
}
