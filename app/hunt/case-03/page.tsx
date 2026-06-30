import GameContainer from "@/components/case-file-03/components/GameContainer";
import CaseGuard from "@/components/CaseGuard";

export default function Case03Page() {
  return (
    <CaseGuard caseId="03">
      <main className="min-h-screen w-full bg-black">
        <GameContainer />
      </main>
    </CaseGuard>
  );
}
