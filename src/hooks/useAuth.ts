"use client";

import { useState, useEffect } from "react";
import { User, Student } from "@/types";
import { getClientUser, setClientUser, clearClientUser, AUTH_CHANGE_EVENT } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = () => {
    const active = getClientUser();
    setUser(active);

    if (active && active.role === "student" && active.studentId) {
      fetch(`/api/students?id=${active.studentId}`)
        .then((r) => r.json())
        .then((data) => {
          if (!data.error) setStudent(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setStudent(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();

    window.addEventListener(AUTH_CHANGE_EVENT, loadUser);
    window.addEventListener("storage", loadUser);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, loadUser);
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  const login = (newUser: User) => {
    setClientUser(newUser);
    setUser(newUser);
  };

  const logout = () => {
    clearClientUser();
    setUser(null);
    setStudent(null);
  };

  return {
    user,
    student,
    loading,
    isAdmin: user?.role === "admin",
    isStudent: user?.role === "student",
    login,
    logout,
  };
}
