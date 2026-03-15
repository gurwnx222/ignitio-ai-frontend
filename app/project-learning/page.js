import Header from "@/components/Header";
import LearningPageClient from "./LearningPageClient";

/**
 * PSEUDO CODE — Server-side data fetching
 * ─────────────────────────────────────────────────────────────────────────────
 * This page is a Next.js Server Component. It fetches course data on the
 * server before rendering, so the user always receives fully hydrated HTML.
 *
 * To wire up a real backend, replace the fetch URL below with your actual
 * API endpoint and pass any required auth headers:
 *
 *   const res = await fetch(`${process.env.API_BASE_URL}/courses/${courseId}`, {
 *     headers: { Authorization: `Bearer ${session.accessToken}` },
 *     next: { revalidate: 60 },   // ISR: revalidate every 60 s
 *   });
 *
 * The component receives the fully shaped `course` object from the API and
 * passes it down to the interactive client component.
 * ─────────────────────────────────────────────────────────────────────────────
 */

async function getCourse() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:5000";
  const res = await fetch(`${baseUrl}/api/course`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch course data");
  const data = await res.json();
  return data.course;
}

export default async function ProjectLearningPage() {
  const course = await getCourse();

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f3f8]">
      <Header />
      <main className="flex-1 flex flex-col">
        <LearningPageClient course={course} />
      </main>
    </div>
  );
}
