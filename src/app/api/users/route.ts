import { NextResponse } from "next/server";
import { PlaceHubStore } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");
  const search = searchParams.get("search")?.toLowerCase();

  let users = PlaceHubStore.getUsers();

  if (role && role !== "All") {
    users = users.filter((u) => u.role === role);
  }

  if (search) {
    users = users.filter(
      (u) =>
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search)
    );
  }

  return NextResponse.json(users);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.email || !body.name || !body.role) {
      return NextResponse.json(
        { error: "Name, email, and role are required." },
        { status: 400 }
      );
    }

    const existing = PlaceHubStore.getUserByEmail(body.email);
    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists." },
        { status: 409 }
      );
    }

    const newUser = PlaceHubStore.addUser({
      name: body.name,
      email: body.email,
      role: body.role,
      studentId: body.studentId ? parseInt(body.studentId, 10) : undefined,
      active: true,
      avatar: body.name[0].toUpperCase(),
    });

    return NextResponse.json({
      success: true,
      message: `User ${newUser.name} created!`,
      user: newUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, action, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (action === "toggleActive") {
      const user = PlaceHubStore.getUserById(parseInt(id, 10));
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      const updated = PlaceHubStore.updateUser(user.id, { active: !user.active });
      return NextResponse.json({
        success: true,
        message: `User ${user.name} is now ${updated?.active ? "Active" : "Deactivated"}!`,
        user: updated,
      });
    }

    if (action === "resetPassword") {
      const user = PlaceHubStore.getUserById(parseInt(id, 10));
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: `Temporary password reset link dispatched to ${user.email}.`,
      });
    }

    const updated = PlaceHubStore.updateUser(parseInt(id, 10), updates);
    return NextResponse.json({
      success: true,
      message: "User updated successfully.",
      user: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update user" },
      { status: 500 }
    );
  }
}
