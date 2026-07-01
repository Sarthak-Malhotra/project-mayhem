"use client";

// Call API to mark case completed and also set client-side cookies/localStorage
export async function markCaseCompleted(caseNum: string) {
  if (typeof window === "undefined") return;

  const key = `case-${caseNum}-completed`;
  const alreadyCompleted = document.cookie.includes(`${key}=true`);

  document.cookie = `${key}=true; path=/; max-age=31536000; SameSite=Lax`;

  const caseInt = parseInt(caseNum, 10);
  if (!alreadyCompleted && caseInt >= 1 && caseInt <= 8) {
    sessionStorage.setItem("just-solved-case", caseNum);
  }

  try {
    await fetch("/api/cases/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ caseId: caseNum }),
    });
  } catch (error) {
    console.error("Failed to report case progress to API:", error);
  }
}

// Client-side quick check
export function isCaseCompleted(caseNum: string): boolean {
  if (typeof window === "undefined") return false;

  const key = `case-${caseNum}-completed`;
  return document.cookie.includes(`${key}=true`);
}
