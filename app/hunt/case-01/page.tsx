import GameContainer from "@/components/case-file-01/components/GameContainer";
import CaseGuard from "@/components/CaseGuard";

export default function Case01Page() {
  return (
    <CaseGuard caseId="01">
      <main className="min-h-screen w-full bg-black">
        <GameContainer />
      </main>
    </CaseGuard>
  );
}
