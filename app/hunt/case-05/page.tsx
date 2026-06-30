import { Metadata } from "next";
import { CaseFileProvider } from "@/components/case-file-05/CaseFileProvider";
import { CaseFileLayout }   from "@/components/case-file-05/CaseFileLayout";
import { PuzzleHub }        from "@/components/case-file-05/components/PuzzleHub";
import CaseGuard from "@/components/CaseGuard";

export const metadata: Metadata = {
  title: "The Blue Ledger",
  description: "Investigate and resolve time anomalies to stabilize the timeline core.",
};

export default function CaseFile05Page() {
  return (
    <CaseGuard caseId="05">
      <CaseFileProvider>
        <CaseFileLayout>
          <PuzzleHub />
        </CaseFileLayout>
      </CaseFileProvider>
    </CaseGuard>
  );
}
