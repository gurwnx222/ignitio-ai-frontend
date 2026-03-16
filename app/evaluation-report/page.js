import { Suspense } from "react";
import Header from "@/components/Header";
import EvaluationReportClient from "./EvaluationReportClient";

function ReportFallback() {
  return (
    <div className="max-w-[800px] mx-auto w-full px-4 py-8 animate-pulse">
      <div className="bg-white rounded-2xl border border-[#e4e1f0] p-6 mb-4 h-48" />
      <div className="bg-white rounded-2xl border border-[#e4e1f0] p-6 h-64" />
    </div>
  );
}

export default function EvaluationReportPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f3f8]">
      <Header />
      <main className="flex-1 flex flex-col items-center py-8">
        <Suspense fallback={<ReportFallback />}>
          <EvaluationReportClient />
        </Suspense>
      </main>
    </div>
  );
}