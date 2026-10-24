import { NextResponse } from "next/server";
import { PlaceHubStore } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const id = searchParams.get("id");

  let user = null;
  if (email) {
    user = PlaceHubStore.getUserByEmail(email);
  } else if (id) {
    user = PlaceHubStore.getUserById(parseInt(id, 10));
  } else {
    // Default to first user (admin) or student
    user = PlaceHubStore.getUsers()[0];
  }

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let student = null;
  if (user.role === "student" && user.studentId) {
    student = PlaceHubStore.getStudentById(user.studentId);
  }

  return NextResponse.json({ user, student });
}
