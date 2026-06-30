"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="min-h-screen w-full bg-[#050508] flex items-center justify-center font-mono text-zinc-500">
      <span className="animate-pulse">REDIRECTING TO AUTHENTICATION PORTAL...</span>
    </div>
  );
}
