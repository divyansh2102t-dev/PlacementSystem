"use client";

import { useState, useEffect } from "react";
import { User, Student } from "@/types";
import { getClientUser, setClientUser, clearClientUser } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const active = getClientUser();
    setUser(active);

    if (active.role === "student" && active.studentId) {
      fetch(`/api/students?id=${active.studentId}`)
        .then((r) => r.json())
        .then((data) => {
          if (!data.error) setStudent(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
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
