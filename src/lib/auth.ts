import { User } from "@/types";

export const AUTH_STORAGE_KEY = "placehub_auth_user";
export const AUTH_CHANGE_EVENT = "placehub_auth_changed";

export function getClientUser(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as User;
    }
  } catch (e) {
    console.error("Failed to parse user from localStorage", e);
  }

  return null;
}

export function setClientUser(user: User): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    // Set lightweight cookies for Next.js middleware / server reads
    document.cookie = `placehub_role=${user.role}; path=/; max-age=604800; SameSite=Lax`;
    document.cookie = `placehub_user_id=${user.id}; path=/; max-age=604800; SameSite=Lax`;
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
}

export function clearClientUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    document.cookie = "placehub_role=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "placehub_user_id=; path=/; max-age=0; SameSite=Lax";
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
}

export function isUserAdmin(user?: User | null): boolean {
  return user?.role === "admin";
}

export function isUserStudent(user?: User | null): boolean {
  return user?.role === "student";
}
