"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4";

const navItems = ["Home", "Studio", "About", "Journal", "Reach Us"];

export default function Home() {
  const { user, isHydrated } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const fadeWindow = 0.5;

    const step = () => {
      const currentVideo = videoRef.current;

      if (currentVideo && Number.isFinite(currentVideo.duration) && currentVideo.duration > 0) {
        const { currentTime, duration } = currentVideo;
        let opacity = 1;

        if (currentTime < fadeWindow) {
          opacity = currentTime / fadeWindow;
        } else if (duration - currentTime < fadeWindow) {
          opacity = Math.max(0, (duration - currentTime) / fadeWindow);
        }

        currentVideo.style.opacity = `${opacity}`;
      }

      frameRef.current = window.requestAnimationFrame(step);
    };

    const handleEnded = () => {
      const currentVideo = videoRef.current;

      if (!currentVideo) {
        return;
      }

      currentVideo.style.opacity = "0";

      window.setTimeout(() => {
        currentVideo.currentTime = 0;
        void currentVideo.play().catch(() => undefined);
      }, 100);
    };

    frameRef.current = window.requestAnimationFrame(step);
    video.addEventListener("ended", handleEnded);
    void video.play().catch(() => undefined);

    return () => {
      video.removeEventListener("ended", handleEnded);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#FFFFFF] font-body text-[#000000]">
      <div className="pointer-events-none absolute inset-0 z-0">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="absolute h-[62vh] w-full object-cover opacity-0"
          style={{ inset: "auto 0 0 0", top: "300px" }}
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFFFFF] via-transparent to-[#FFFFFF]" />
      </div>

      <header className="relative z-10">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-6">
          <span className="font-display text-3xl tracking-tight text-[#000000]">
            Firefly<sup className="ml-0.5 align-super text-base">®</sup>
          </span>

          <nav className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className={`text-sm transition-colors ${item === "Home" ? "text-[#000000]" : "text-[#6F6F6F] hover:text-[#000000]"}`}
              >
                {item}
              </a>
            ))}
          </nav>

          <Link
            href={isHydrated && user ? "/dashboard" : "/login"}
            className="rounded-full bg-[#000000] px-6 py-2.5 text-sm text-[#FFFFFF] transition-transform duration-300 hover:scale-[1.03]"
          >
            {isHydrated && user ? "Go to Dashboard" : "Begin Journey"}
          </Link>
        </div>
      </header>

      <section
        className="relative z-10 flex flex-col items-center justify-center px-6 pb-40 text-center"
        style={{ paddingTop: "calc(8rem - 75px)" }}
      >
        <h1 className="animate-fade-rise max-w-7xl font-display text-5xl font-normal leading-[0.95] tracking-[-2.46px] text-[#000000] sm:text-7xl md:text-8xl">
          Beyond <span className="italic text-[#6F6F6F]">silence,</span> we build <span className="italic text-[#6F6F6F]">resilience.</span>
        </h1>

        <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed text-[#6F6F6F] sm:text-lg">
          The intelligent wellbeing platform for schools. Empowering counselors, teachers, and parents
          to support every student through proactive, multi-tiered interventions and deep care.
        </p>

        <Link
          href={isHydrated && user ? "/dashboard" : "/login"}
          className="animate-fade-rise-delay-2 mt-12 rounded-full bg-[#000000] px-14 py-5 text-base text-[#FFFFFF] transition-transform duration-300 hover:scale-[1.03]"
        >
          {isHydrated && user ? "Go to Dashboard" : "Begin Journey"}
        </Link>
      </section>
    </main>
  );
}
