"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isCaseCompleted } from "./case-progress";

interface CaseGuardProps {
  caseId: string;
  children: React.ReactNode;
}

export default function CaseGuard({ caseId, children }: CaseGuardProps) {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const isCompleted = isCaseCompleted(caseId);

    if (isCompleted) {
      router.replace("/hunt");
    } else {
      setIsAllowed(true);
    }
  }, [caseId, router]);

  if (!isAllowed) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center font-mono text-zinc-500">
        <span className="animate-pulse">DECRYPTING ACCESS SECURITY...</span>
      </div>
    );
  }

  return <>{children}</>;
}
