"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// ─── Icons ────────────────────────────────────────────────────────────────────

const CheckCircleIcon = ({ size = 24, color = "#16a34a" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill={color} fillOpacity="0.1" />
    <path
      d="M7 12.5L10.5 16L17 9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const XCircleIcon = ({ size = 24, color = "#dc2626" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill={color} fillOpacity="0.1" />
    <path
      d="M8 8L16 16M16 8L8 16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M10 3L5 8L10 13"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TrophyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M10 3C8 2 5 2 3 4V12C5 10 8 10 10 12C12 10 15 10 17 12V4C15 2 12 2 10 3Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M10 3V12" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 17V15M14 17V15M8 17H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const BookOpenIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M9 3C7 1 4 1 2 3V13C4 11 7 11 9 13C11 11 14 11 16 13V3C14 1 11 1 9 3Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M9 3V13" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

// ─── Python Syntax Highlighter ──────────────────────────────────────────────────

const KEYWORD_RE = /^(from|import|def|class|return|print|if|else|elif|for|in|while|with|as|pass|True|False|None|and|or|not)$/;
const TOKEN_RE = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b([A-Za-z_]\w*)\b|(\d+\.?\d*)/g;
const COMMENT_RE = /^(\s*)(#.*)$/;

function highlightPython(line) {
  const cm = line.match(COMMENT_RE);
  if (cm) return <>{cm[1]}<span style={{ color: "#6b7280" }}>{cm[2]}</span></>;
  const tokens = [];
  let last = 0; let m;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(line)) !== null) {
    if (m.index > last) tokens.push(<span key={last}>{line.slice(last, m.index)}</span>);
    const strLit = m[1];
    const word = m[2];
    const num = m[3];
    let color = null;
    if (strLit) color = "#a3e635";
    else if (word && KEYWORD_RE.test(word)) color = "#f472b6";
    else if (word && /^[A-Z]/.test(word)) color = "#67e8f9";
    else if (num) color = "#fb923c";
    tokens.push(color ? <span key={m.index} style={{ color }}>{m[0]}</span> : <span key={m.index}>{m[0]}</span>);
    last = m.index + m[0].length;
  }
  if (last < line.length) tokens.push(<span key={last}>{line.slice(last)}</span>);
  return tokens;
}

// ─── Skeleton Loader ─────────────────────────────────────────────────────────────

function ReportSkeleton() {
  return (
    <div className="max-w-[800px] mx-auto w-full px-4 py-8 animate-pulse">
      <div className="bg-white rounded-2xl border border-[#e4e1f0] p-8 mb-4">
        <div className="h-6 w-32 bg-[#e4e1f0] rounded mb-4" />
        <div className="flex gap-8 mb-6">
          <div className="h-20 w-32 bg-[#e4e1f0] rounded" />
          <div className="h-20 w-32 bg-[#e4e1f0] rounded" />
        </div>
        <div className="h-16 w-full bg-[#e4e1f0] rounded" />
      </div>
      <div className="bg-white rounded-2xl border border-[#e4e1f0] p-6">
        <div className="h-4 w-48 bg-[#e4e1f0] rounded mb-4" />
        <div className="space-y-3">
          <div className="h-24 w-full bg-[#e4e1f0] rounded-xl" />
          <div className="h-24 w-full bg-[#e4e1f0] rounded-xl" />
          <div className="h-24 w-full bg-[#e4e1f0] rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Score Ring ─────────────────────────────────────────────────────────────────

function ScoreRing({ score, passed }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = passed ? "#16a34a" : "#dc2626";

  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 140 140" className="transform -rotate-90">
        <circle cx="70" cy="70" r={radius} stroke="#e4e1f0" strokeWidth="10" fill="none" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke={color}
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[32px] font-extrabold text-[#12102b]">{score}%</span>
        <span className="text-[11px] font-semibold text-[#9896b0] uppercase tracking-[0.5px]">
          Score
        </span>
      </div>
    </div>
  );
}

// ─── Concept Result Card ────────────────────────────────────────────────────────

function ConceptResultCard({ conceptKey, conceptName, score, passed, feedback, userAnswer }) {
  const [expanded, setExpanded] = useState(false);
  const lines = (userAnswer || "").split("\n");
  const isCorrect = passed || score >= 70;

  return (
    <div className="bg-white rounded-xl border border-[#e4e1f0] overflow-hidden mb-3 shadow-sm">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-[#f9f8fc] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: isCorrect ? "#dcfce7" : "#fef2f2",
            }}
          >
            {isCorrect ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 9.5L7.5 13L14 6" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M5.5 5.5L12.5 12.5M12.5 5.5L5.5 12.5" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <div>
            <p className="text-[14px] font-bold text-[#12102b]">
              {conceptName || conceptKey}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[12px] text-[#9896b0]">Score: {score}%</span>
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: isCorrect ? "#dcfce7" : "#fef2f2",
                  color: isCorrect ? "#16a34a" : "#dc2626",
                }}
              >
                {isCorrect ? "Passed" : "Needs Work"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right mr-2">
            <p className="text-[18px] font-extrabold" style={{ color: isCorrect ? "#16a34a" : "#dc2626" }}>
              {score}%
            </p>
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          >
            <path d="M4 6L8 10L12 6" stroke="#9896b0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-[#f0eef8] animate-[fadeUp_0.2s_ease_both]">
          {/* Your Answer */}
          {userAnswer && (
            <div className="mt-4 mb-4">
              <p className="text-[12px] font-semibold text-[#3730D4] uppercase tracking-[0.8px] mb-2">
                Your Answer
              </p>
              <div
                className="rounded-xl border border-[#e4e1f0] overflow-hidden"
                style={{ background: "#0f1117" }}
              >
                <div className="flex items-center justify-between px-3 py-2 border-b border-[#1e2130]" style={{ background: "#161822" }}>
                  <div className="flex items-center gap-1.5">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ background: "#ff5f57" }} />
                      <span className="w-2 h-2 rounded-full" style={{ background: "#febc2e" }} />
                      <span className="w-2 h-2 rounded-full" style={{ background: "#28c840" }} />
                    </div>
                    <span className="text-[10px] text-[#9ca3af] ml-2">answer.py</span>
                  </div>
                  <span className="text-[10px] text-[#6b7280]">{lines.length} lines</span>
                </div>
                <div className="flex overflow-x-auto py-3">
                  <div className="shrink-0 select-none text-right px-3 text-[#374151]" style={{ minWidth: "36px" }}>
                    {lines.map((_, i) => (
                      <div key={i} className="text-[11px] leading-[18px] font-mono">{i + 1}</div>
                    ))}
                  </div>
                  <pre className="flex-1 pr-4">
                    {lines.map((line, i) => (
                      <div key={i} className="text-[11px] leading-[18px] font-mono whitespace-pre" style={{ color: "#e5e7eb" }}>
                        {highlightPython(line)}
                      </div>
                    ))}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div className={`p-3 rounded-xl ${isCorrect ? "bg-[#dcfce7]" : "bg-[#fef2f2]"}`}>
              <p className="text-[12px] font-semibold mb-1" style={{ color: isCorrect ? "#16a34a" : "#dc2626" }}>
                Feedback
              </p>
              <p className="text-[13px] leading-[1.5]" style={{ color: isCorrect ? "#15803d" : "#b91c1c" }}>
                {feedback}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function EvaluationReportClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [retakeLoading, setRetakeLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);

  // Get parameters from URL or sessionStorage
  useEffect(() => {
    async function loadReport() {
      try {
        // Try to get data from sessionStorage first
        const stored = sessionStorage.getItem("evaluationReport");
        if (stored) {
          const data = JSON.parse(stored);
          setReportData(data);
          setLoading(false);
          return;
        }

        // If no stored data, check URL params
        const sessionId = searchParams.get("session_id");
        if (!sessionId) {
          setError("No evaluation data found. Please complete a quiz first.");
          setLoading(false);
          return;
        }

        // Fetch report from backend
        const response = await fetch(
          `${API_BASE_URL}/api/v1/tutor/test/report?session_id=${sessionId}`
        );

        if (!response.ok) {
          throw new Error("Failed to load evaluation report");
        }

        const data = await response.json();
        setReportData(data);
      } catch (e) {
        console.error("Report load error:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [searchParams]);

  // Handle retake test - triggers simpler explanations
  const handleRetakeTest = async () => {
    if (!reportData?.session_id) return;
    setRetakeLoading(true);

    try {
      // Call backend to get simpler explanations
      const response = await fetch(
        `${API_BASE_URL}/api/v1/tutor/retake?session_id=${reportData.session_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to prepare simpler explanations");
      }

      const newData = await response.json();

      // Update sessionStorage with new simpler content
      sessionStorage.setItem("tutorResponse", JSON.stringify(newData));
      window.dispatchEvent(new Event("tutorResponseUpdated"));

      // Navigate to learning page
      router.push("/project-learning");
    } catch (e) {
      console.error("Retake error:", e);
      setError(e.message);
      setRetakeLoading(false);
    }
  };

  // Handle back to learning (without retake)
  const handleBackToLearning = () => {
    router.push("/project-learning");
  };

  // Handle go home
  const handleGoHome = () => {
    router.push("/");
  };

  if (loading) {
    return <ReportSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-[500px] mx-auto w-full px-4 py-12">
        <div className="bg-white rounded-2xl border border-[#e4e1f0] p-8 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <XCircleIcon size={32} color="#dc2626" />
          </div>
          <h2 className="text-[20px] font-bold text-[#12102b] mb-2">
            Unable to Load Report
          </h2>
          <p className="text-[14px] text-[#6b6880] mb-6">
            {error}
          </p>
          <button
            onClick={handleGoHome}
            className="px-6 py-2.5 rounded-xl bg-[#3730D4] text-[13.5px] font-bold text-white hover:bg-[#2e28b8] transition-all duration-150"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="max-w-[500px] mx-auto w-full px-4 py-12">
        <div className="bg-white rounded-2xl border border-[#e4e1f0] p-8 text-center shadow-sm">
          <p className="text-[14px] text-[#6b6880]">No report data available.</p>
          <button
            onClick={handleGoHome}
            className="mt-4 px-6 py-2.5 rounded-xl bg-[#3730D4] text-[13.5px] font-bold text-white"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Parse data from new format
  const {
    session_id,
    passed,
    test_result,
    score,
    feedback,
    results,
    user_answers,
    retry_available,
  } = reportData;

  // Parse results - format: { concept_1: { passed, score, feedback, concept_name }, ... }
  const resultsList = results
    ? Object.entries(results).map(([key, data]) => ({
        conceptKey: key,
        ...data,
      }))
    : [];

  // Get user answers for each concept
  const userAnswersMap = user_answers || {};

  // Calculate passed/failed count
  const passedCount = resultsList.filter((r) => r.passed).length;
  const totalConcepts = resultsList.length;

  // Determine display score
  const displayScore = score ?? Math.round(resultsList.reduce((sum, r) => sum + (r.score || 0), 0) / Math.max(totalConcepts, 1));

  return (
    <div className="max-w-[800px] mx-auto w-full px-4 py-8">
      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-[#e4e1f0] shadow-sm overflow-hidden mb-6 animate-[fadeUp_0.3s_ease_both]">
        {/* Top Section */}
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[11px] font-bold text-[#9896b0] uppercase tracking-[1px] mb-1">
                Evaluation Report
              </p>
              <h1 className="text-[28px] font-extrabold text-[#12102b] tracking-[-0.5px]">
                {passed ? "Great Work!" : "Keep Practicing"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-[12px] font-bold px-3 py-1.5 rounded-full"
                style={{
                  background: passed ? "#dcfce7" : "#fef2f2",
                  color: passed ? "#16a34a" : "#dc2626",
                }}
              >
                {test_result || (passed ? "PASS" : "FAIL")}
              </span>
            </div>
          </div>

          {/* Score & Stats */}
          <div className="flex items-center gap-8">
            <ScoreRing score={displayScore} passed={passed} />

            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#f9f8fc] rounded-xl p-4 border border-[#e4e1f0]">
                  <p className="text-[11px] font-semibold text-[#9896b0] uppercase tracking-[0.5px] mb-1">
                    Concepts Passed
                  </p>
                  <p className="text-[24px] font-extrabold" style={{ color: passed ? "#16a34a" : "#dc2626" }}>
                    {passedCount} / {totalConcepts}
                  </p>
                </div>
                <div className="bg-[#f9f8fc] rounded-xl p-4 border border-[#e4e1f0]">
                  <p className="text-[11px] font-semibold text-[#9896b0] uppercase tracking-[0.5px] mb-1">
                    Average Score
                  </p>
                  <p className="text-[24px] font-extrabold text-[#12102b]">
                    {displayScore}%
                  </p>
                </div>
              </div>

              {/* Feedback Message */}
              {feedback && (
                <div className={`mt-4 p-4 rounded-xl ${passed ? "bg-[#dcfce7]" : "bg-[#fef2f2]"}`}>
                  <p className="text-[13px] leading-[1.5]" style={{ color: passed ? "#15803d" : "#b91c1c" }}>
                    {feedback}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pass/Fail Banner */}
        <div
          className="px-8 py-4 border-t"
          style={{
            background: passed ? "#dcfce7" : "#fef2f2",
            borderColor: passed ? "#bbf7d0" : "#fecaca",
          }}
        >
          <div className="flex items-center gap-3">
            {passed ? (
              <>
                <CheckCircleIcon size={24} color="#16a34a" />
                <div>
                  <p className="text-[14px] font-bold text-[#15803d]">
                    Congratulations! You passed the learning test.
                  </p>
                  <p className="text-[12px] text-[#16a34a]">
                    You&apos;ve demonstrated a solid understanding of the LangChain concepts.
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircleIcon size={24} color="#dc2626" />
                <div>
                  <p className="text-[14px] font-bold text-[#b91c1c]">
                    You need more practice with these concepts.
                  </p>
                  <p className="text-[12px] text-[#dc2626]">
                    {retry_available
                      ? "Review the material and try again with simpler explanations."
                      : "Review the learning material and practice more."}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Concept Results Section */}
      <div className="bg-white rounded-2xl border border-[#e4e1f0] shadow-sm overflow-hidden mb-6 animate-[fadeUp_0.4s_ease_both]">
        <div className="px-6 py-4 border-b border-[#f0eef8]">
          <h2 className="text-[16px] font-bold text-[#12102b]">
            Concept Results
          </h2>
          <p className="text-[13px] text-[#9896b0] mt-0.5">
            Review your score and feedback for each concept
          </p>
        </div>

        <div className="p-4">
          {resultsList.map((result, i) => (
            <ConceptResultCard
              key={result.conceptKey}
              conceptKey={result.conceptKey}
              conceptName={result.concept_name}
              score={result.score}
              passed={result.passed}
              feedback={result.feedback}
              userAnswer={userAnswersMap[result.conceptKey]}
            />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 animate-[fadeUp_0.5s_ease_both]">
        <button
          onClick={handleBackToLearning}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#e4e1f0] text-[13px] font-semibold text-[#5a586e] bg-white hover:border-[#c5bfea] hover:text-[#12102b] transition-all duration-150 active:scale-[0.97]"
        >
          <ArrowLeftIcon />
          Back to Learning
        </button>

        {!passed && retry_available && (
          <button
            onClick={handleRetakeTest}
            disabled={retakeLoading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3730D4] text-[13.5px] font-bold text-white hover:bg-[#2e28b8] active:scale-[0.97] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {retakeLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Preparing...
              </>
            ) : (
              <>
                <BookOpenIcon />
                Retake with Simpler Explanations
              </>
            )}
          </button>
        )}

        {passed && (
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#16a34a] text-[13.5px] font-bold text-white hover:bg-[#15803d] active:scale-[0.97] transition-all duration-150"
          >
            <TrophyIcon />
            Complete & Go Home
          </button>
        )}
      </div>

      {/* Help Text */}
      <p className="text-center text-[12px] text-[#9896b0] mt-6">
        {passed
          ? "You can review the concepts anytime by going back to the learning page."
          : retry_available
            ? "The retake option will provide simpler explanations to help you understand better."
            : "Review the learning material and try again later."}
      </p>
    </div>
  );
}