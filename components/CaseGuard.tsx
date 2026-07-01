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
      if (caseId === "09") {
        const allOthersCompleted = Array.from({ length: 8 }, (_, i) => String(i + 1).padStart(2, "0"))
          .every((num) => isCaseCompleted(num));
        if (!allOthersCompleted) {
          router.replace("/hunt");
          return;
        }
      }
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
