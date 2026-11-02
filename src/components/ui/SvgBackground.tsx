"use client";

import React, { useEffect, useState } from "react";

export function SvgBackground({ className = "" }: { className?: string }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to range [-1, 1] relative to center
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const updateParallax = () => {
      // Smooth lerp interpolation for silky motion
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      setMousePos({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    animationFrameId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none [perspective:1400px] ${className}`}
    >
      {/* =========================================================================
          LAYER 1: Distant 3D Ambient Light Washes (Slow negative parallax)
      ========================================================================== */}
      <div
        className="absolute inset-0 transition-transform duration-75 will-change-transform"
        style={{
          transform: `translate3d(${mousePos.x * -18}px, ${mousePos.y * -18}px, -120px)`,
        }}
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-emerald-100/60 via-teal-50/40 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-[25%] -left-36 w-[480px] h-[480px] bg-emerald-200/30 blur-3xl rounded-full" />
        <div className="absolute top-[50%] -right-36 w-[520px] h-[520px] bg-teal-200/30 blur-3xl rounded-full" />
        <div className="absolute bottom-10 left-1/3 w-[620px] h-[360px] bg-emerald-100/35 blur-3xl rounded-full" />
      </div>

      {/* =========================================================================
          LAYER 2: Middle Organic Wave Ribbons (Subtle positive parallax)
      ========================================================================== */}
      <div
        className="absolute inset-0 transition-transform duration-75 will-change-transform"
        style={{
          transform: `translate3d(${mousePos.x * 22}px, ${mousePos.y * 22}px, 0px)`,
        }}
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 960"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="ph-wave-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
            </linearGradient>

            <linearGradient id="ph-wave-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.16" />
              <stop offset="60%" stopColor="#0d9488" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="ph-stroke-grad-1" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.38" />
              <stop offset="35%" stopColor="#14b8a6" stopOpacity="0.55" />
              <stop offset="70%" stopColor="#0d9488" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.06" />
            </linearGradient>

            <linearGradient id="ph-stroke-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.12" />
              <stop offset="50%" stopColor="#34d399" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.12" />
            </linearGradient>

            <linearGradient id="ph-circle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0.06" />
            </linearGradient>
          </defs>

          {/* Top Floating SVG Ribbon Waves */}
          <path
            d="M0,0 L1440,0 L1440,240 C1200,320 980,140 720,220 C460,300 240,160 0,260 Z"
            fill="url(#ph-wave-grad-1)"
          />
          <path
            d="M0,80 C320,190 540,60 820,150 C1100,240 1280,120 1440,180"
            stroke="url(#ph-stroke-grad-1)"
            strokeWidth="2.5"
            fill="none"
          />
          <path
            d="M0,140 C280,240 580,120 900,210 C1220,300 1340,190 1440,230"
            stroke="url(#ph-stroke-grad-2)"
            strokeWidth="1.5"
            strokeDasharray="8 10"
            fill="none"
          />

          {/* Mid-Page Flowing Curves */}
          <path
            d="M-100,480 C260,380 620,620 1020,440 C1280,320 1400,520 1540,460"
            stroke="url(#ph-stroke-grad-1)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M-50,540 C340,440 700,680 1100,500 C1320,400 1460,560 1560,510"
            stroke="url(#ph-stroke-grad-2)"
            strokeWidth="1.2"
            fill="none"
          />

          {/* Lower Fluid Wave Section */}
          <path
            d="M0,740 C300,660 620,840 980,720 C1240,640 1380,780 1440,750 L1440,960 L0,960 Z"
            fill="url(#ph-wave-grad-2)"
          />
          <path
            d="M0,720 C360,640 700,810 1060,700 C1300,620 1400,740 1440,710"
            stroke="url(#ph-stroke-grad-1)"
            strokeWidth="2"
            fill="none"
          />

          {/* Floating Concentric Vector Orbs */}
          <circle cx="160" cy="220" r="90" fill="url(#ph-circle-grad)" />
          <circle cx="160" cy="220" r="130" stroke="#10b981" strokeOpacity="0.18" strokeWidth="1" strokeDasharray="6 6" fill="none" />

          <circle cx="1320" cy="380" r="110" fill="url(#ph-circle-grad)" />
          <circle cx="1320" cy="380" r="160" stroke="#0d9488" strokeOpacity="0.14" strokeWidth="1" fill="none" />

          <circle cx="720" cy="640" r="75" stroke="#34d399" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="4 8" fill="none" />
        </svg>
      </div>

      {/* =========================================================================
          LAYER 3: Foreground 3D Floating Geometry Elements (Active 3D Parallax)
      ========================================================================== */}
      <div
        className="absolute inset-0 [transform-style:preserve-3d] transition-transform duration-75 will-change-transform"
        style={{
          transform: `translate3d(${mousePos.x * -42}px, ${mousePos.y * -42}px, 60px)`,
        }}
      >
        {/* 3D Floating Ring 1 (Top Right) */}
        <div
          className="absolute top-24 right-[12%] w-48 h-48 rounded-full border border-emerald-400/35 border-dashed animate-spin shadow-lg shadow-emerald-500/5"
          style={{
            animationDuration: "28s",
            transform: `rotateX(62deg) rotateY(18deg) translateZ(40px)`,
          }}
        >
          <div className="absolute inset-4 rounded-full border border-teal-400/25 border-dotted animate-ping" style={{ animationDuration: "6s" }} />
          <div className="absolute top-2 left-1/2 h-3 w-3 rounded-full bg-emerald-400/80 shadow-md shadow-emerald-400/60 blur-[0.5px]" />
        </div>

        {/* 3D Floating Ring 2 (Mid Left) */}
        <div
          className="absolute top-[42%] left-[6%] w-60 h-60 rounded-full border-2 border-emerald-500/20 shadow-xl shadow-teal-500/5"
          style={{
            transform: `rotateX(55deg) rotateY(-32deg) translateZ(80px)`,
          }}
        >
          <div
            className="absolute inset-6 rounded-full border border-emerald-400/25 animate-spin"
            style={{ animationDuration: "20s", animationDirection: "reverse" }}
          >
            <div className="absolute bottom-1 right-1/2 h-3.5 w-3.5 rounded-full bg-teal-400/70 shadow-md shadow-teal-400/50" />
          </div>
        </div>

        {/* 3D Floating Diamond Prism (Bottom Right) */}
        <div
          className="absolute bottom-32 right-[8%] w-36 h-36 border border-emerald-300/30 rounded-3xl backdrop-blur-[2px] bg-gradient-to-br from-emerald-200/10 to-teal-300/5"
          style={{
            transform: `rotateX(45deg) rotateY(45deg) rotateZ(${mousePos.x * 20}deg) translateZ(60px)`,
            boxShadow: "0 20px 40px -15px rgba(16, 185, 129, 0.15)",
          }}
        />

        {/* 3D Floating Spheres with Glass Glow */}
        <div
          className="absolute top-[18%] left-[22%] h-7 w-7 rounded-full bg-gradient-to-tr from-emerald-500/40 via-teal-300/60 to-white/80 shadow-lg shadow-emerald-500/30 backdrop-blur-xs animate-bounce"
          style={{
            animationDuration: "7s",
            transform: "translateZ(100px)",
          }}
        />

        <div
          className="absolute bottom-[24%] left-[45%] h-5 w-5 rounded-full bg-gradient-to-tr from-teal-500/30 via-emerald-300/50 to-white/70 shadow-md shadow-teal-500/20 backdrop-blur-xs animate-pulse"
          style={{
            transform: "translateZ(70px)",
          }}
        />

        <div
          className="absolute top-[68%] right-[28%] h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400/25 to-teal-500/20 border border-emerald-300/40 shadow-lg shadow-emerald-500/15"
          style={{
            transform: `translate3d(${mousePos.x * 15}px, ${mousePos.y * 15}px, 90px)`,
          }}
        />
      </div>
    </div>
  );
}
