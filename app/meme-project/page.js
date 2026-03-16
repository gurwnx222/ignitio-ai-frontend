"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import MemeLoader from "@/components/MemeLoader";
import MemeInput from "@/components/MemeInput";
import { Lightbulb, ArrowRight, RefreshCw } from "lucide-react";

export default function MemePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Get response data from sessionStorage
    const stored = sessionStorage.getItem("tutorResponse");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setData(parsed);
        // Simulate a brief loading for smooth transition
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
      } catch (e) {
        setError("Failed to parse response data");
        setLoading(false);
      }
    } else {
      setError("No data found. Please start from the home page.");
      setLoading(false);
    }
  }, []);

  const handleLearnMore = () => {
    router.push("/project-learning");
  };

  const handleGenerateNew = async (newTopic) => {
    setIsGenerating(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiUrl}/api/v1/tutor/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_query: newTopic }),
      });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const newData = await response.json();
      sessionStorage.setItem("tutorResponse", JSON.stringify(newData));
      // Dispatch custom event to notify learning page of data update
      window.dispatchEvent(new CustomEvent("tutorResponseUpdated"));
      setData(newData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#EEEEF3]">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-16">
          <MemeLoader topic="Loading your meme..." />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-[#EEEEF3]">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-16">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md text-center">
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button
              onClick={() => router.push("/")}
              className="rounded-xl bg-[#3730d4] px-6 py-2.5 text-[13.5px] font-bold text-white"
            >
              Go Home
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#EEEEF3]">
      <Header />

      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-8">
        {/* Meme Display */}
        <div className="w-full max-w-xl animate-[fadeUp_0.35s_ease_both]">
          <div className="bg-white rounded-2xl border border-[#e6e4ee] shadow-[0_4px_24px_rgba(55,48,212,0.08)] overflow-hidden relative">
            {/* Loading overlay */}
            {isGenerating && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-3 border-indigo-200 border-t-indigo-600" />
                  <p className="text-sm font-medium text-indigo-600">Generating new meme...</p>
                </div>
              </div>
            )}
            {/* Meme Image */}
            {data?.meme_url && (
              <div className="relative w-full">
                <img
                  src={data.meme_url}
                  alt={data.meme_text || "Generated meme"}
                  className="w-full h-auto object-contain max-h-[400px]"
                />
              </div>
            )}

            {/* Meme Text */}
            {data?.meme_text && (
              <div className="px-6 py-4 border-t border-[#f0eef8]">
                <p className="text-[15px] text-[#12102b] font-semibold text-center">
                  {data.meme_text}
                </p>
              </div>
            )}

            {/* Concepts Preview */}
            {data?.concept_map && (
              <div className="px-6 py-4 bg-[#f9f8fc] border-t border-[#f0eef8]">
                <p className="text-[11px] font-bold tracking-[1px] text-[#9896b0] uppercase mb-3">
                  Concepts Covered
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(data.concept_map).map(([key, concept]) => (
                    <span
                      key={key}
                      className="px-3 py-1.5 rounded-full bg-[#ede9f6] text-[#3730d4] text-[13px] font-medium"
                    >
                      {concept.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2 animate-[fadeUp_0.35s_0.1s_ease_both]">
          <button
            onClick={handleLearnMore}
            className="flex items-center gap-2.5 rounded-full bg-indigo-700 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-indigo-800 hover:shadow-lg active:scale-[0.98]"
          >
            <Lightbulb className="h-4 w-4 shrink-0" />
            <span>Let&apos;s Learn: How AI Humor Works</span>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </button>
        </div>

        {/* Generate New Meme Input */}
        <div className="w-full max-w-xl mt-8 animate-[fadeUp_0.35s_0.2s_ease_both]">
          <div className="flex items-center justify-center gap-2 mb-4">
            <RefreshCw className="h-4 w-4 text-indigo-500" />
            <p className="text-[13px] font-medium text-[#6b68a0]">Generate another meme</p>
          </div>
          <MemeInput onGenerate={handleGenerateNew} isLoading={isGenerating} />
        </div>

        <p className="text-center text-[11px] text-gray-400">
          Powered by Advanced Neuro-Linguistic Humor Models &bull; v2.4.0
        </p>
      </main>
    </div>
  );
}