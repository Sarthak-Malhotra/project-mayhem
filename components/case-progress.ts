"use client";

// Call API to mark case completed and also set client-side cookies/localStorage
export async function markCaseCompleted(caseNum: string) {
  if (typeof window === "undefined") return;

  const key = `case-${caseNum}-completed`;
  const alreadyCompleted =
    localStorage.getItem(key) === "true" ||
    document.cookie.includes(`${key}=true`);

  localStorage.setItem(key, "true");
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
  let isCompleted =
    localStorage.getItem(key) === "true" ||
    document.cookie.includes(`${key}=true`);

  // Special check for Case 5's Zustand store
  if (caseNum === "05" && !isCompleted) {
    const saved = localStorage.getItem("ch-case-05");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.state?.solved?.length === 8) {
          isCompleted = true;
        }
      } catch (e) {}
    }
  }

  // Special check for Case 7's internal acts progress key
  if (caseNum === "07" && !isCompleted) {
    const saved = localStorage.getItem("aetherion-operation-deadlight-acts");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (Array.isArray(data) && data.includes("act-8")) {
          isCompleted = true;
        }
      } catch (e) {}
    }
  }

  return isCompleted;
}
