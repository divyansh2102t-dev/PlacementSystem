import type { Metadata } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PlaceHub | Campus Placement Management System (DBMS)",
  description:
    "University campus placement database management system for students, drives, applications, and placement analytics.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${dmSans.variable} ${manrope.variable} min-h-screen bg-[#edf5f0] text-slate-800 antialiased font-sans`}
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
