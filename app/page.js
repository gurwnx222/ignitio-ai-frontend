"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BuilderLoader from "@/components/BuilderLoader";
import Header from "@/components/Header";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// ─── Icons ────────────────────────────────────────────────────────────────────

const ArrowRightIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const BrainIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M14 2C10 2 7 5.5 7 9.5c0 2.5 1.2 4.5 3 5.8V18h8v-2.7c1.8-1.3 3-3.3 3-5.8C21 5.5 18 2 14 2z" stroke="#3730D4" strokeWidth="1.5" fill="none"/>
    <path d="M9 18h10M10 20h8" stroke="#3730D4" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M11 9c0-1.7 1.3-3 3-3M8 10c0-1.1.9-2 2-2" stroke="#3730D4" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ─── Shared Footer ────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="flex items-center justify-center gap-5 px-6 py-6 text-[13px] text-[#b0afc0] flex-wrap">
      <span>© 2026 Ignitio AI Lab</span>
    </footer>
  );
}

// ─── Input View ──────────────────────────────────────────────────────────────

function InputView({ query, setQuery, onSubmit, isDisabled }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="w-full max-w-[580px] flex flex-col items-center text-center animate-[fadeUp_0.35s_ease_both]">
      <h1 className="text-[clamp(36px,5.5vw,54px)] font-extrabold leading-[1.15] tracking-[-1.5px] text-[#12102b] mb-3">
        Master the Art of LLM
        <br />
        Orchestration
      </h1>
      <p className="text-base leading-[1.65] text-[#5a586e] max-w-[420px] mb-6">
        The most intuitive way to learn, prototype, and build production-
        <br className="hidden sm:inline" />
        ready AI applications.
      </p>

      <div className="w-full bg-white rounded-[18px] border border-[#e6e4ee] shadow-[0_2px_24px_0_rgba(80,60,180,0.07),0_1px_4px_0_rgba(60,40,140,0.05)] px-6 pt-5 pb-4 transition-shadow duration-200 focus-within:shadow-[0_4px_32px_0_rgba(80,60,180,0.12),0_0_0_2px_rgba(55,48,212,0.08)]">
        <textarea
          className="w-full resize-none border-0 outline-none bg-transparent text-[15px] leading-relaxed text-[#12102b] font-[inherit] min-h-[72px] placeholder:text-[#b0afc0] px-3 py-2"
          placeholder="Write the topic you wanted to generate the meme..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          disabled={isDisabled}
        />
        <div className="flex items-center justify-end mt-2 pt-2 border-t border-[#f0eef8]">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-xl border-0 bg-[#3730d4] text-white cursor-pointer transition-all duration-180ms shrink-0 hover:bg-[#2e28b8] hover:scale-[1.04] active:scale-[0.97] disabled:opacity-[0.45] disabled:cursor-not-allowed disabled:scale-100"
            aria-label="Submit"
            onClick={onSubmit}
            disabled={!query.trim() || isDisabled}
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Meme Response View ─────────────────────────────────────────────────────────

function MemeResponseView({ data, onLearnMore, onGenerateNew, isGenerating }) {
  const [newQuery, setNewQuery] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (newQuery.trim() && !isGenerating) {
        onGenerateNew(newQuery.trim());
      }
    }
  };

  const handleSubmit = () => {
    if (newQuery.trim() && !isGenerating) {
      onGenerateNew(newQuery.trim());
    }
  };

  return (
    <div className="w-full max-w-[580px] flex flex-col items-center text-center animate-[fadeUp_0.35s_ease_both]">
      {/* Meme Card */}
      <div className="w-full bg-white rounded-2xl border border-[#e6e4ee] shadow-[0_4px_24px_rgba(55,48,212,0.08)] overflow-hidden">
        {/* Meme Image */}
        {data?.meme_url && (
          <div className="relative w-full">
            <img
              src={data.meme_url}
              alt={data.meme_text || "Generated meme"}
              className="w-full h-auto object-contain max-h-[350px]"
            />
          </div>
        )}

        {/* Meme Text */}
        {data?.meme_text && (
          <div className="px-5 py-4 border-t border-[#f0eef8]">
            <p className="text-[15px] text-[#12102b] font-semibold">
              {data.meme_text}
            </p>
          </div>
        )}

        {/* Concepts Preview */}
        {data?.concept_map && (
          <div className="px-5 py-3 bg-[#f9f8fc] border-t border-[#f0eef8]">
            <div className="flex flex-wrap gap-2 justify-center">
              {Object.entries(data.concept_map).map(([key, concept]) => (
                <span
                  key={key}
                  className="px-2.5 py-1 rounded-full bg-[#ede9f6] text-[#3730d4] text-[12px] font-medium"
                >
                  {concept.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Learn More Button */}
      <button
        onClick={onLearnMore}
        className="mt-5 flex items-center gap-2.5 rounded-xl bg-[#3730d4] px-7 py-3.5 text-[15px] font-bold text-white shadow-[0_4px_14px_rgba(55,48,212,0.25)] transition-all duration-200 hover:bg-[#2e28b8] hover:shadow-[0_6px_20px_rgba(55,48,212,0.35)] active:scale-[0.97]"
      >
        <BrainIcon />
        <span>Let&apos;s Learn</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 3L11 8L6 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Generate New Section */}
      <div className="w-full mt-6">
        <p className="text-[12px] text-[#9896b0] mb-2">Generate another meme:</p>
        <div className="w-full bg-white rounded-xl border border-[#e6e4ee] shadow-[0_2px_12px_rgba(55,48,212,0.05)] px-4 py-3">
          <textarea
            className="w-full resize-none border-0 outline-none bg-transparent text-[14px] leading-relaxed text-[#12102b] font-[inherit] min-h-[60px] placeholder:text-[#b0afc0]"
            placeholder="Enter a new topic..."
            value={newQuery}
            onChange={(e) => setNewQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            disabled={isGenerating}
          />
          <div className="flex items-center justify-end mt-2 pt-2 border-t border-[#f0eef8]">
            <button
              onClick={handleSubmit}
              disabled={!newQuery.trim() || isGenerating}
              className="flex items-center gap-1.5 rounded-lg bg-[#3730d4] px-4 py-2 text-[13px] font-semibold text-white transition-all duration-150 hover:bg-[#2e28b8] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>Generate</span>
                  <ArrowRightIcon />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Error View ────────────────────────────────────────────────────────────────

function ErrorView({ error, onRetry }) {
  return (
    <div className="w-full max-w-[420px] text-center animate-[fadeUp_0.35s_ease_both]">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-4">
        <p className="text-red-600 font-medium mb-2">Failed to generate content</p>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
      <button
        onClick={onRetry}
        className="rounded-xl bg-[#3730d4] px-6 py-2.5 text-[13.5px] font-bold text-white transition-all duration-150 hover:bg-[#2e28b8] active:scale-[0.97]"
      >
        Try Again
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const router = useRouter();
  const [status, setStatus] = useState("input"); // "input" | "loading" | "result" | "error"
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async () => {
    if (!query.trim()) return;

    setStatus("loading");
    setError(null);

    try {
      // Call FastAPI backend
      const response = await fetch(`${API_BASE_URL}/api/v1/tutor/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_query: query.trim() }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const responseData = await response.json();

      // Store response in sessionStorage for learning page
      sessionStorage.setItem("tutorResponse", JSON.stringify(responseData));
      // Dispatch custom event to notify learning page of data update
      window.dispatchEvent(new CustomEvent("tutorResponseUpdated"));

      setData(responseData);
      setStatus("result");
    } catch (err) {
      console.error("API call failed:", err);
      setError(err.message);
      setStatus("error");
    }
  };

  const handleNewTopic = () => {
    setQuery("");
    setData(null);
    setStatus("input");
  };

  const handleGenerateNew = async (newQuery) => {
    if (!newQuery.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/tutor/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_query: newQuery }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const responseData = await response.json();
      sessionStorage.setItem("tutorResponse", JSON.stringify(responseData));
      // Dispatch custom event to notify learning page of data update
      window.dispatchEvent(new CustomEvent("tutorResponseUpdated"));
      setData(responseData);
    } catch (err) {
      console.error("API call failed:", err);
      setError(err.message);
      setStatus("error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLearnMore = () => {
    router.push("/project-learning");
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 20% -10%, rgba(140,120,220,0.13) 0%, transparent 60%), " +
          "radial-gradient(ellipse 60% 50% at 80% 110%, rgba(160,140,230,0.09) 0%, transparent 55%), " +
          "linear-gradient(170deg, #ede9f6 0%, #f5f4f8 100%)",
      }}
    >
      <Header />

      <main className="flex-1 flex items-center justify-center px-5 sm:px-10 py-10">
        {status === "input" && (
          <InputView
            query={query}
            setQuery={setQuery}
            onSubmit={handleSubmit}
            isDisabled={false}
          />
        )}

        {status === "loading" && (
          <BuilderLoader topic={query} />
        )}

        {status === "result" && (
          <MemeResponseView
            data={data}
            onLearnMore={handleLearnMore}
            onGenerateNew={handleGenerateNew}
            isGenerating={isGenerating}
          />
        )}

        {status === "error" && (
          <ErrorView
            error={error}
            onRetry={handleNewTopic}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}