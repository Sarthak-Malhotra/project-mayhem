"use client";

import CaseFile08 from "@/components/case-file-08/case-file-08";
import CaseGuard from "@/components/CaseGuard";

export default function Page() {
  return (
    <CaseGuard caseId="08">
      <CaseFile08 />
    </CaseGuard>
  );
}