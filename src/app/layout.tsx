import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { SvgBackground } from "@/components/ui/SvgBackground";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PlaceHub | University Campus Placement Portal",
  description:
    "Comprehensive university campus placement portal for students, corporate recruitment drives, dynamic selection stages, and placement analytics.",
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
    <html lang="en" className="h-full scroll-smooth">
      <body
        className={`${plusJakarta.variable} ${inter.variable} min-h-screen bg-slate-50 text-slate-800 antialiased font-sans relative`}
      >
        <SvgBackground />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
