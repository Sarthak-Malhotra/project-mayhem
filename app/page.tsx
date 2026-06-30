"use client";

import { useEffect, useState } from "react";
import LandingAuth, { AuthFormValues } from "@/components/LandingAuth";
import SlideScroller from "@/components/SlideScroller";

export default function Home() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/cases/progress");
        const data = await res.json();
        if (data.success && data.authenticated) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  const handleSubmit = async (data: AuthFormValues) => {
    try {
      const res = await fetch("/hunt/case-07/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setAuthenticated(true);
      } else {
        setError(result.message || "Authentication failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during authentication.");
    }
  };

  if (authenticated === null) {
    return (
      <div className="min-h-screen w-full bg-[#050508] flex items-center justify-center font-mono text-zinc-500">
        <span className="animate-pulse">DECRYPTING ACCESS SECURITY...</span>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen w-full bg-[#050508]">
      {authenticated ? (
        <SlideScroller />
      ) : (
        <>
          <LandingAuth onSubmit={handleSubmit} />
          {error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#8B1A1A] text-white px-4 py-2 rounded shadow font-mono text-sm border border-red-500">
              {error}
            </div>
          )}
        </>
      )}
    </main>
  );
}
