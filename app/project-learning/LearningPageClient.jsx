"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

// ─── Helper to read tutor response from sessionStorage ─────────────────────────

function getTutorResponse() {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem("tutorResponse");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="10" fill="#3730D4" />
    <path d="M5.5 10.5L8.5 13.5L14.5 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Concept Sidebar ────────────────────────────────────────────────────────

function ConceptSidebar({ concepts, activeIndex, onSelectConcept }) {
  const conceptList = Object.entries(concepts || {});
  const progress = Math.round(((activeIndex + 1) / Math.max(conceptList.length, 1)) * 100);

  return (
    <aside className="w-[260px] shrink-0 flex flex-col">
      <p className="text-[10px] font-bold tracking-[1.2px] text-[#9896b0] uppercase mb-1">
        Current Topic
      </p>
      <h1 className="text-[22px] font-extrabold tracking-[-0.5px] text-[#12102b] leading-tight mb-3">
        Learning Concepts
      </h1>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-[5px] bg-[#e4e1f0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#3730D4] rounded-full transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[12px] font-semibold text-[#3730D4] shrink-0">
          {progress}% Done
        </span>
      </div>

      <ul className="flex flex-col relative">
        {conceptList.map(([key, concept], i) => {
          const isActive = i === activeIndex;
          const isCompleted = i < activeIndex;
          const isLast = i === conceptList.length - 1;

          return (
            <li key={key} className="relative flex gap-3">
              {!isLast && (
                <div className="absolute left-[14px] top-[28px] w-[2px] bottom-0 bg-[#e4e1f0]" />
              )}

              <div className="shrink-0 flex flex-col items-center pt-1 z-10">
                {isCompleted ? (
                  <div className="w-7 h-7 rounded-full bg-[#3730D4] flex items-center justify-center">
                    <CheckCircleIcon />
                  </div>
                ) : isActive ? (
                  <div className="w-7 h-7 rounded-full bg-[#3730D4] flex items-center justify-center">
                    <CheckCircleIcon />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full border-2 border-[#3730D4] flex items-center justify-center">
                    <span className="text-[12px] font-bold text-[#3730D4]">{i + 1}</span>
                  </div>
                )}
              </div>

              <div
                className={`flex-1 mb-3 rounded-xl p-3 cursor-pointer transition-all duration-150 ${
                  isActive
                    ? "bg-white border border-[#e4e1f0] shadow-sm"
                    : "hover:bg-white hover:border hover:border-[#e4e1f0]"
                }`}
                onClick={() => onSelectConcept(i)}
              >
                <p className="text-[14px] font-bold leading-tight text-[#12102b]">
                  {concept.name}
                </p>
                <p className="text-[11.5px] text-[#9896b0] mt-0.5 line-clamp-2">
                  {concept.description?.slice(0, 50)}...
                </p>
                {isActive && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-[#3730D4] text-white text-[9px] font-bold tracking-[0.8px] px-2 py-0.5 rounded-full uppercase">
                      Current
                    </span>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

// ─── Explanation Card ────────────────────────────────────────────────────────

function ExplanationCard({ explanation }) {
  if (!explanation) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#e4e1f0] shadow-[0_2px_16px_rgba(55,48,212,0.06)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#f0eef8]">
        <h3 className="text-[18px] font-extrabold text-[#12102b]">
          {explanation.name}
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Simple Definition */}
        <div>
          <h4 className="text-[13px] font-bold text-[#3730D4] uppercase tracking-[0.8px] mb-2">
            Simple Definition
          </h4>
          <p className="text-[15px] leading-[1.7] text-[#5a586e]">
            {explanation.simple_definition}
          </p>
        </div>

        {/* Analogy */}
        <div className="bg-[#f9f8fc] rounded-xl p-4">
          <h4 className="text-[13px] font-bold text-[#3730D4] uppercase tracking-[0.8px] mb-2">
            Analogy
          </h4>
          <p className="text-[15px] leading-[1.7] text-[#5a586e]">
            {explanation.analogy}
          </p>
        </div>

        {/* How it works */}
        {explanation.how_it_works && explanation.how_it_works.length > 0 && (
          <div>
            <h4 className="text-[13px] font-bold text-[#3730D4] uppercase tracking-[0.8px] mb-3">
              How It Works
            </h4>
            <ul className="space-y-2">
              {explanation.how_it_works.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#3730D4] text-white text-[12px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-[15px] text-[#5a586e] leading-[1.6]">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* In Our Project */}
        {explanation.in_our_project && (
          <div className="bg-[#ede9f6] rounded-xl p-4 border border-[#d8d5ee]">
            <h4 className="text-[13px] font-bold text-[#3730D4] uppercase tracking-[0.8px] mb-2">
              In Our Project
            </h4>
            <p className="text-[15px] leading-[1.7] text-[#5a586e]">
              {explanation.in_our_project}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Code Example Card ────────────────────────────────────────────────────────

const KEYWORD_RE = /^(from|import|def|class|return|print|if|else|elif|for|in|while|with|as|pass|True|False|None|and|or|not)$/;
const TOKEN_RE = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b([A-Za-z_]\w*)\b|(\d+\.?\d*)/g;
const COMMENT_RE = /^(\s*)(#.*)$/;

function tokenColor(_str, groups) {
  const [, str_lit, word, num] = groups;
  if (str_lit) return "#a3e635";
  if (word && KEYWORD_RE.test(word)) return "#f472b6";
  if (word && /^[A-Z]/.test(word)) return "#67e8f9";
  if (num) return "#fb923c";
  return null;
}

function highlight(line) {
  const cm = line.match(COMMENT_RE);
  if (cm) return <>{cm[1]}<span style={{ color: "#6b7280" }}>{cm[2]}</span></>;
  const tokens = [];
  let last = 0; let m;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(line)) !== null) {
    if (m.index > last) tokens.push(<span key={last}>{line.slice(last, m.index)}</span>);
    const color = tokenColor(m[0], m);
    tokens.push(color ? <span key={m.index} style={{ color }}>{m[0]}</span> : <span key={m.index}>{m[0]}</span>);
    last = m.index + m[0].length;
  }
  if (last < line.length) tokens.push(<span key={last}>{line.slice(last)}</span>);
  return tokens;
}

function CodeExampleCard({ codeExample }) {
  const [copied, setCopied] = useState(false);
  if (!codeExample) return null;

  const lines = codeExample.code?.split("\n") || [];
  const lineByLine = codeExample.line_by_line || {};

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <div className="relative rounded-2xl overflow-hidden mt-6" style={{ background: "#0f1117", border: "1px solid #1e2130" }}>
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-3" style={{ background: "#161822", borderBottom: "1px solid #1e2130" }}>
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
            <span className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
            <span className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md" style={{ background: "#0f1117" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="1" y="1" width="10" height="10" rx="1.5" stroke="#6b7280" strokeWidth="1" />
              <path d="M3.5 4.5h5M3.5 6.5h3.5" stroke="#6b7280" strokeWidth="1" strokeLinecap="round" />
            </svg>
            <span className="text-[12px] font-medium" style={{ color: "#9ca3af" }}>{codeExample.name}.py</span>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-150 hover:opacity-80 active:scale-95"
          style={{ background: "#1e2130", color: "#9ca3af" }}
        >
          {copied ? (
            <>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 7L5 10L11 3" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[11px]" style={{ color: "#34d399" }}>Copied!</span>
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <rect x="4" y="1" width="8" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                <rect x="1" y="4" width="8" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              <span className="text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code lines */}
      <div className="flex overflow-x-auto" style={{ padding: "20px 0" }}>
        <div className="shrink-0 select-none pr-4 pl-4 text-right" style={{ color: "#374151", minWidth: "48px" }}>
          {lines.map((_, i) => (
            <div key={i} className="text-[13px] leading-[24px] font-mono">{i + 1}</div>
          ))}
        </div>
        <pre className="flex-1 pr-6 overflow-x-auto" style={{ margin: 0 }}>
          {lines.map((line, i) => (
            <div key={i} className="text-[13px] leading-[24px] font-mono whitespace-pre" style={{ color: "#e5e7eb" }}>
              {highlight(line)}
            </div>
          ))}
        </pre>
      </div>

      {/* Description */}
      <div className="px-4 py-3" style={{ background: "#161822", borderTop: "1px solid #1e2130" }}>
        <p className="text-[13px] leading-[1.6] text-[#9ca3af]">{codeExample.description}</p>
      </div>

      {/* Line by line explanation */}
      {Object.keys(lineByLine).length > 0 && (
        <div className="px-4 py-4" style={{ background: "#0f1117", borderTop: "1px solid #1e2130" }}>
          <p className="text-[11px] font-bold tracking-[1px] text-[#9896b0] uppercase mb-3">Line by Line</p>
          <div className="space-y-2">
            {Object.entries(lineByLine).map(([key, explanation]) => (
              <div key={key} className="flex gap-3">
                <span className="text-[12px] font-mono text-[#3730D4] shrink-0">
                  {key.replace("line_", "L")}:
                </span>
                <span className="text-[12px] text-[#9ca3af]">{explanation}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function LearningPageClient() {
  const [data, setData] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // ─── Sync data with sessionStorage ────────────────────────────────────────────

  const syncData = useCallback(() => {
    setIsLoading(true);
    const parsed = getTutorResponse();
    if (parsed) {
      setData(parsed);
      setError(null);
    } else {
      setError("No learning data found. Please start from the home page.");
    }
    setIsLoading(false);
  }, []);

  // Initial load
  useEffect(() => {
    syncData();
  }, [syncData]);

  // Reset activeIndex when data changes (e.g., new meme generated)
  useEffect(() => {
    if (data) {
      setActiveIndex(0);
    }
  }, [data?.session_id]); // Reset only when session changes, not on every data update

  // Listen for visibility changes (user navigates back to this tab/page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Only reload if data has changed
        const parsed = getTutorResponse();
        if (parsed && JSON.stringify(parsed) !== JSON.stringify(data)) {
          syncData();
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [syncData, data]);

  // Listen for custom event dispatched when new data is stored
  useEffect(() => {
    const handleTutorDataUpdate = () => {
      syncData();
    };
    window.addEventListener("tutorResponseUpdated", handleTutorDataUpdate);
    return () => window.removeEventListener("tutorResponseUpdated", handleTutorDataUpdate);
  }, [syncData]);

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    } else {
      router.push("/");
    }
  };

  const handleNext = () => {
    const conceptKeys = Object.keys(data?.explanation || {});
    if (activeIndex < conceptKeys.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      // All concepts completed, go to quiz
      router.push("/quiz");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f4f3f8]">
        <Header />
        <main className="flex-1 flex items-center justify-center p-12">
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

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f4f3f8]">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-12 gap-4">
          <div className="animate-[spin_1s_linear_infinite] w-8 h-8 border-2 border-[#3730D4] border-t-transparent rounded-full" />
          <p className="text-[14px] text-[#9896b0]">Loading learning content...</p>
        </main>
      </div>
    );
  }

  const conceptKeys = Object.keys(data.explanation || {});
  const currentConceptKey = conceptKeys[activeIndex];
  const currentExplanation = data.explanation?.[currentConceptKey];
  const currentCodeExample = data.code_examples?.[currentConceptKey];
  const totalConcepts = conceptKeys.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f3f8]">
      <Header />
      <main className="flex-1 flex flex-col">
        <div className="flex gap-8 px-8 py-8 max-w-[1100px] mx-auto w-full animate-[fadeUp_0.3s_ease_both]">
          {/* Sidebar */}
          <ConceptSidebar
            concepts={data.concept_map}
            activeIndex={activeIndex}
            onSelectConcept={setActiveIndex}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[12px] font-bold text-[#9896b0] uppercase tracking-[1px]">
                  Concept {activeIndex + 1} of {totalConcepts}
                </p>
                <h2 className="text-[24px] font-extrabold tracking-[-0.4px] text-[#12102b]">
                  {currentExplanation?.name || "Loading..."}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#e4e1f0] text-[13px] font-semibold text-[#5a586e] bg-white transition-all duration-150 hover:border-[#c5bfea] hover:text-[#12102b] active:scale-[0.97]"
                >
                  <ArrowLeftIcon />
                  {activeIndex === 0 ? "Back" : "Prev"}
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#3730D4] text-[13.5px] font-bold text-white transition-all duration-150 hover:bg-[#2e28b8] active:scale-[0.97]"
                >
                  {activeIndex === totalConcepts - 1 ? "Finish" : "Next"}
                  <ArrowRightIcon />
                </button>
              </div>
            </div>

            {/* Explanation */}
            <ExplanationCard explanation={currentExplanation} />

            {/* Code Example */}
            <CodeExampleCard codeExample={currentCodeExample} />
          </div>
        </div>
      </main>
    </div>
  );
}