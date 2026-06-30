"use client";

import CaseFile02 from "@/components/case-file-02/case-file-02";
import CaseGuard from "@/components/CaseGuard";

export default function Page() {
  return (
    <CaseGuard caseId="02">
      <CaseFile02 />
    </CaseGuard>
  );
}