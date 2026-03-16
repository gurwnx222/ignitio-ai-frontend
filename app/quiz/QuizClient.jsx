"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// ─── Icons ────────────────────────────────────────────────────────────────────

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

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M3 8.5L6.5 12L13 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CodeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M4 4L1 7L4 10M10 4L13 7L10 10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function QuizSkeleton() {
  return (
    <div className="max-w-[680px] mx-auto w-full px-4 py-8 animate-pulse">
      <div className="bg-white rounded-2xl border border-[#e4e1f0] p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="h-3 w-48 bg-[#e4e1f0] rounded" />
          <div className="h-3 w-28 bg-[#e4e1f0] rounded" />
        </div>
        <div className="h-2 w-full bg-[#e4e1f0] rounded-full" />
      </div>
      <div className="bg-white rounded-2xl border border-[#e4e1f0] p-6 mb-4">
        <div className="h-4 w-32 bg-[#e4e1f0] rounded mb-4" />
        <div className="h-6 w-3/4 bg-[#e4e1f0] rounded mb-6" />
        <div className="h-32 w-full bg-[#e4e1f0] rounded-xl" />
      </div>
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ current, total, title }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="bg-white rounded-2xl border border-[#e4e1f0] p-5 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] font-semibold text-[#12102b]">
          {title}
        </span>
        <span className="text-[13px] font-bold text-[#3730D4]">
          Question {current} of {total}
        </span>
      </div>
      <div className="w-full h-[6px] bg-[#e4e1f0] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#3730D4] rounded-full transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Code Question Card ───────────────────────────────────────────────────────

function CodeQuestionCard({ question, answer, onChange, instructions }) {
  const lines = (answer || "").split("\n");

  return (
    <div className="bg-white rounded-2xl border border-[#e4e1f0] shadow-sm p-6 mb-4 animate-[fadeUp_0.3s_ease_both]">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[1.2px] text-[#e8730e] bg-[#fef3e2] px-2.5 py-1 rounded-full uppercase">
          <CodeIcon />
          {question.concept_name}
        </span>
      </div>

      <h2 className="text-[17px] font-bold text-[#12102b] leading-[1.6] mb-5 whitespace-pre-wrap">
        {question.question}
      </h2>

      <div
        className="rounded-xl border border-[#e4e1f0] overflow-hidden"
        style={{ background: "#f9f8fc" }}
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-[#f0eef8] border-b border-[#e4e1f0]">
          <CodeIcon />
          <span className="text-[12px] font-medium text-[#6b6880]">
            Your Answer
          </span>
        </div>
        <div className="flex">
          <div
            className="shrink-0 select-none text-right px-3 pt-3 pb-3 text-[13px] font-mono text-[#c5bfea] leading-[22px]"
            style={{ minWidth: "36px" }}
          >
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <textarea
            className="flex-1 bg-transparent text-[13px] font-mono text-[#12102b] leading-[22px] resize-none outline-none px-2 pt-3 pb-3 min-h-[120px]"
            placeholder="Write your code answer here..."
            value={answer || ""}
            onChange={(e) => onChange(e.target.value)}
            rows={Math.max(4, lines.length)}
            spellCheck={false}
          />
        </div>
      </div>

      {instructions && (
        <div className="flex items-start gap-2 mt-4 p-3 bg-[#f9f8fc] rounded-xl border border-[#e4e1f0]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="shrink-0 mt-0.5"
          >
            <circle cx="8" cy="8" r="7" stroke="#9896b0" strokeWidth="1.2" />
            <path
              d="M8 5v6M8 4v.5"
              stroke="#9896b0"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          <p className="text-[12px] text-[#6b6880] leading-[1.5]">
            {instructions}
          </p>
        </div>
      )}
    </div>
  );
}

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

// ─── Code Preview ──────────────────────────────────────────────────────────────

function CodePreview({ code, maxHeight = 200 }) {
  if (!code) return null;
  const lines = code.split("\n");
  const lineCount = lines.length;
  const needsScroll = lineCount > 8;

  return (
    <div
      className="rounded-xl overflow-hidden border border-[#e4e1f0]"
      style={{ background: "#0f1117" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2" style={{ background: "#161822" }}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
          </div>
          <span className="text-[11px] font-medium text-[#9ca3af]">answer.py</span>
        </div>
        <span className="text-[10px] text-[#6b7280]">{lineCount} lines</span>
      </div>

      {/* Code */}
      <div
        className="overflow-auto"
        style={{ maxHeight: needsScroll ? maxHeight : "none" }}
      >
        <div className="flex">
          <div
            className="shrink-0 select-none text-right px-3 py-3"
            style={{ color: "#374151", minWidth: "40px" }}
          >
            {lines.map((_, i) => (
              <div key={i} className="text-[11px] leading-[18px] font-mono">{i + 1}</div>
            ))}
          </div>
          <pre className="flex-1 py-3 pr-4 m-0">
            {lines.map((line, i) => (
              <div key={i} className="text-[11px] leading-[18px] font-mono whitespace-pre" style={{ color: "#e5e7eb" }}>
                {highlightPython(line)}
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ─── Answer Review Card ────────────────────────────────────────────────────────

function AnswerReviewCard({ conceptKey, conceptName, answer, isCorrect }) {
  return (
    <div className="bg-white rounded-xl border border-[#e4e1f0] overflow-hidden mb-3">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0eef8]">
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
            <p className="text-[13px] font-bold text-[#12102b]">{conceptName || conceptKey}</p>
            <p className="text-[11px] text-[#9896b0]">Your Code Answer</p>
          </div>
        </div>
        <span
          className="text-[11px] font-bold px-2.5 py-1 rounded-full"
          style={{
            background: isCorrect ? "#dcfce7" : "#fef2f2",
            color: isCorrect ? "#16a34a" : "#dc2626",
          }}
        >
          {isCorrect ? "Correct" : "Needs Improvement"}
        </span>
      </div>

      {/* Code Preview */}
      <div className="p-4">
        <CodePreview code={answer} maxHeight={180} />
      </div>
    </div>
  );
}

// ─── Results Screen ───────────────────────────────────────────────────────────
// Note: Results are now displayed on the dedicated Evaluation Report page

// ─── Main Quiz Client ─────────────────────────────────────────────────────────

export default function QuizClient() {
  const router = useRouter();
  const initCalledRef = useRef(false);
  const [sessionId, setSessionId] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Load session_id from sessionStorage and fetch quiz.
  // The initCalledRef guard prevents React Strict Mode's double-invoke
  // from firing the non-idempotent /test/start call twice, which would
  // transition the session state to 'testing' on the first call and then
  // 400 on the second because it's no longer in 'test_ready' state.
  useEffect(() => {
    if (initCalledRef.current) return;
    initCalledRef.current = true;

    async function initQuiz() {
      try {
        const stored = sessionStorage.getItem("tutorResponse");
        if (!stored) {
          setError("No session found. Please start from the home page.");
          setLoading(false);
          return;
        }

        const data = JSON.parse(stored);
        const sid = data.session_id;

        if (!sid) {
          setError("No session ID found. Please start from the home page.");
          setLoading(false);
          return;
        }
        setSessionId(sid);

        const response = await fetch(
          `${API_BASE_URL}/api/v1/tutor/test/start?session_id=${sid}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ session_id: sid }),
          },
        );
        const quizData = await response.json();
        console.log("Quiz data:", quizData);
        if (!response.ok) {
          throw new Error(quizData.error || "Failed to load quiz");
        }

        setQuiz(quizData);
      } catch (e) {
        console.error("Quiz init error:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    initQuiz();
  }, []);

  const handleAnswer = (value) => {
    if (!quiz || !quiz.questions) return;
    const currentQuestion = quiz.questions[currentIdx];
    setAnswers((prev) => ({ ...prev, [currentQuestion.concept_key]: value }));
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx((i) => i - 1);
  };

  const handleNext = () => {
    if (quiz && currentIdx < quiz.questions.length - 1) {
      setCurrentIdx((i) => i + 1);
    }
  };

  const handleSubmit = async () => {
    if (!sessionId || !quiz) return;
    setSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/tutor/test/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            answers: answers,
          }),
        },
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || data.detail || "Failed to submit quiz");

      // Calculate overall score from results
      const resultsData = data.results || {};
      const conceptKeys = Object.keys(resultsData);
      const totalScore = conceptKeys.reduce((sum, key) => sum + (resultsData[key]?.score || 0), 0);
      const avgScore = conceptKeys.length > 0 ? Math.round(totalScore / conceptKeys.length) : 0;

      // Store the complete evaluation report data in sessionStorage
      const reportData = {
        session_id: data.session_id || sessionId,
        passed: data.passed ?? false,
        test_result: data.test_result || (data.passed ? "PASS" : "FAIL"),
        score: avgScore,
        feedback: data.feedback ?? null,
        results: data.results || {},
        questions: quiz.questions || [],
        user_answers: answers,
        retry_available: data.retry_available ?? false,
        new_explanation: data.new_explanation ?? null,
      };

      sessionStorage.setItem("evaluationReport", JSON.stringify(reportData));

      // Navigate to the evaluation report page
      router.push("/evaluation-report");
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <QuizSkeleton />;

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 rounded-xl bg-[#3730D4] text-white text-[13px] font-semibold"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-center">
        <div className="bg-white border border-[#e4e1f0] rounded-2xl p-6 max-w-md">
          <p className="text-[#5a586e] mb-4">No quiz questions available.</p>
          <button
            onClick={() => router.push("/project-learning")}
            className="px-4 py-2 rounded-xl bg-[#3730D4] text-white text-[13px] font-semibold"
          >
            Back to Learning
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIdx];
  const isLast = currentIdx === quiz.questions.length - 1;
  const currentAnswer = answers[currentQuestion.concept_key];
  const hasAnswer = Boolean(currentAnswer && currentAnswer.trim().length > 0);

  return (
    <div className="max-w-[680px] mx-auto w-full px-4 py-8">
      <ProgressBar
        current={currentIdx + 1}
        total={quiz.questions.length}
        title={quiz.instructions?.slice(0, 50) || "Learning Test"}
      />

      <CodeQuestionCard
        question={currentQuestion}
        answer={currentAnswer}
        onChange={handleAnswer}
        instructions={quiz.instructions}
      />

      <div className="flex items-center justify-between mt-2">
        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#e4e1f0] text-[13px] font-semibold text-[#5a586e] bg-white transition-all duration-150 hover:border-[#c5bfea] hover:text-[#12102b] disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.97]"
        >
          <ArrowLeftIcon />
          Previous
        </button>

        {isLast ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3730D4] text-[13.5px] font-bold text-white transition-all duration-150 hover:bg-[#2e28b8] active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Submit Test <CheckIcon />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3730D4] text-[13.5px] font-bold text-white transition-all duration-150 hover:bg-[#2e28b8] active:scale-[0.97]"
          >
            Next
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M5 2L10 7L5 12"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
