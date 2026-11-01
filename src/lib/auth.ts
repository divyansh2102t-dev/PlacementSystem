import { User } from "@/types";
import { initialUsers } from "@/data/seedData";

export const AUTH_STORAGE_KEY = "placehub_auth_user";

export function getClientUser(): User {
  if (typeof window === "undefined") {
    // Default server fallback is demo admin or demo student
    return initialUsers[0];
  }

  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as User;
    }
  } catch (e) {
    console.error("Failed to parse user from localStorage", e);
  }

  // Default to student (Aarav Sharma) if nothing set yet
  return initialUsers[1];
}

export function setClientUser(user: User): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    // Also set a lightweight cookie for Next.js middleware / server reads
    document.cookie = `placehub_role=${user.role}; path=/; max-age=604800; SameSite=Lax`;
    document.cookie = `placehub_user_id=${user.id}; path=/; max-age=604800; SameSite=Lax`;
  }
}

export function clearClientUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    document.cookie = "placehub_role=; path=/; max-age=0";
    document.cookie = "placehub_user_id=; path=/; max-age=0";
  }
}

export function isUserAdmin(user?: User | null): boolean {
  return user?.role === "admin";
}

export function isUserStudent(user?: User | null): boolean {
  return user?.role === "student";
}
