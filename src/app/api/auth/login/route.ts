import { NextResponse } from "next/server";
import { PlaceHubStore } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = PlaceHubStore.getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "User not found with this email" },
        { status: 404 }
      );
    }

    if (!user.active) {
      return NextResponse.json(
        { error: "This account has been deactivated. Contact Placement Cell." },
        { status: 403 }
      );
    }

    // Attach student profile if role is student
    let student = null;
    if (user.role === "student" && user.studentId) {
      student = PlaceHubStore.getStudentById(user.studentId);
    }

    return NextResponse.json({
      success: true,
      user,
      student,
      message: `Welcome back, ${user.name}!`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Login failed" },
      { status: 500 }
    );
  }
}
