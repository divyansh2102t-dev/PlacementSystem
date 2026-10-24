import type { Metadata } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import "./globals.css";

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
  description: "College campus placement database management system for students, drives, applications, and placement analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${dmSans.variable} ${manrope.variable} min-h-screen bg-[#edf5f0] text-slate-800 antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
