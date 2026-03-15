"use client";

import { useState } from "react";

// ─── Python Syntax Highlighter ────────────────────────────────────────────────

const KEYWORD_RE  = /^(from|import|def|class|return|print|if|else|elif|for|in|while|with|as|pass|True|False|None|and|or|not)$/;
const TOKEN_RE    = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b([A-Za-z_]\w*)\b|(\d+\.?\d*)/g;
const COMMENT_RE  = /^(\s*)(#.*)$/;

function tokenColor(str, groups) {
  const [, str_lit, word, num] = groups;
  if (str_lit)                            return "#a3e635"; // string → green
  if (word && KEYWORD_RE.test(word))      return "#f472b6"; // keyword → pink
  if (word && /^[A-Z]/.test(word))        return "#67e8f9"; // class/builtin → cyan
  if (num)                                return "#fb923c"; // number → orange
  return null;
}

function highlight(line) {
  const cm = line.match(COMMENT_RE);
  if (cm) return <>{cm[1]}<span style={{ color: "#6b7280" }}>{cm[2]}</span></>;

  const tokens = [];
  let last = 0;
  let m;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(line)) !== null) {
    if (m.index > last) tokens.push(<span key={last}>{line.slice(last, m.index)}</span>);
    const color = tokenColor(m[0], m);
    tokens.push(
      color
        ? <span key={m.index} style={{ color }}>{m[0]}</span>
        : <span key={m.index}>{m[0]}</span>
    );
    last = m.index + m[0].length;
  }
  if (last < line.length) tokens.push(<span key={last}>{line.slice(last)}</span>);
  return tokens;
}

// ─── Code Editor Panel ────────────────────────────────────────────────────────

function CodeEditor({ filename, code, explanation }) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  function renderBody(text) {
    return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i} style={{ color: "#67e8f9" }}>
          {part.slice(2, -2)}
        </strong>
      ) : (
        part
      )
    );
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{ background: "#0f1117", border: "1px solid #1e2130" }}
    >
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
            <span className="text-[12px] font-medium" style={{ color: "#9ca3af" }}>{filename}</span>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-150 hover:opacity-80 active:scale-95"
          style={{ background: "#1e2130", color: "#9ca3af" }}
          title="Copy code"
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
        {/* Line numbers */}
        <div className="shrink-0 select-none pr-4 pl-4 text-right" style={{ color: "#374151", minWidth: "48px" }}>
          {lines.map((_, i) => (
            <div key={i} className="text-[13px] leading-[24px] font-mono">{i + 1}</div>
          ))}
        </div>

        {/* Code */}
        <pre className="flex-1 pr-6 overflow-x-auto" style={{ margin: 0 }}>
          {lines.map((line, i) => (
            <div key={i} className="text-[13px] leading-[24px] font-mono whitespace-pre" style={{ color: "#e5e7eb" }}>
              {highlight(line)}
            </div>
          ))}
        </pre>
      </div>

      {/* Explanation callout */}
      <div
        className="absolute top-[56px] right-5 w-[260px] rounded-xl p-4 shadow-xl animate-[fadeUp_0.3s_ease_both]"
        style={{ background: "#ffffff", border: "1px solid #e4e1f0", zIndex: 10 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#3730D4" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="white" strokeWidth="1.2" />
              <path d="M6 5v4M6 3.5v.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-[13px] font-extrabold text-[#12102b]">{explanation.title}</span>
        </div>
        <p className="text-[12px] leading-[1.65] text-[#5a586e] mb-3">
          {renderBody(explanation.body)}
        </p>
        <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid #f0eef8" }}>
          <span className="text-[10px] font-bold tracking-[0.8px] text-[#9896b0]">{explanation.tip}</span>
          <button className="text-[11px] font-semibold text-[#3730D4] hover:underline">
            {explanation.tipDetail}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Info Cards ───────────────────────────────────────────────────────────────

function InfoCards({ concepts, quickTip }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
      <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#e4e1f0]">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#e8f0fe" }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="1" width="12" height="16" rx="2" stroke="#3730D4" strokeWidth="1.4" />
            <path d="M5 6h8M5 9h6M5 12h4" stroke="#3730D4" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <h4 className="text-[14px] font-bold text-[#12102b] mb-1">Concepts covered</h4>
          <p className="text-[13px] leading-[1.6] text-[#6b6880]">{concepts}</p>
        </div>
      </div>

      <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#e4e1f0]">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#dcfce7" }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 1C6 1 3.5 3.5 3.5 6.5c0 2 1 3.7 2.5 4.7V13h6v-1.8C13.5 10.2 14.5 8.5 14.5 6.5 14.5 3.5 12 1 9 1z" stroke="#16a34a" strokeWidth="1.4" />
            <path d="M6 13h6M7 15.5h4" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <h4 className="text-[14px] font-bold text-[#12102b] mb-1">Quick Tip</h4>
          <p className="text-[13px] leading-[1.6] text-[#6b6880]">{quickTip}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Code Sidebar ─────────────────────────────────────────────────────────────

function CodeSidebar({ codeLesson, activeStepIdx, onSelectStep, onAskAI }) {
  return (
    <aside className="w-[240px] shrink-0 flex flex-col justify-between min-h-0">
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#12102b" }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2C7 2 5 4.5 5 7c0 1.8.9 3.3 2.2 4.2V13h5.6v-1.8C14.1 10.3 15 8.8 15 7c0-2.5-2-5-5-5z" stroke="white" strokeWidth="1.4" />
              <path d="M7 13h6M8 15.5h4" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-[15px] font-extrabold text-[#12102b] leading-tight">{codeLesson.title}</p>
            <p className="text-[11px] text-[#9896b0]">{codeLesson.subtitle}</p>
          </div>
        </div>

        {/* Overall progress */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold tracking-[1px] text-[#9896b0] uppercase">Overall Progress</span>
            <span className="text-[12px] font-bold text-[#3730D4]">{codeLesson.overallProgress}%</span>
          </div>
          <div className="w-full h-[5px] bg-[#e4e1f0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#3730D4] rounded-full transition-[width] duration-500"
              style={{ width: `${codeLesson.overallProgress}%` }}
            />
          </div>
        </div>

        {/* Step list */}
        <ul className="flex flex-col gap-1">
          {codeLesson.steps.map((step, i) => {
            const isActive  = i === activeStepIdx;
            const isLocked  = i > activeStepIdx;
            return (
              <li key={i}>
                <button
                  onClick={() => !isLocked && onSelectStep(i)}
                  disabled={isLocked}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${
                    isActive
                      ? "bg-[#3730D4] text-white"
                      : isLocked
                      ? "opacity-40 cursor-not-allowed text-[#9896b0]"
                      : "hover:bg-[#f0eef8] text-[#5a586e]"
                  }`}
                >
                  {isActive ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                      <path d="M4 2L10 7L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : isLocked ? (
                    <svg width="12" height="13" viewBox="0 0 12 13" fill="none" className="shrink-0">
                      <rect x="1" y="5" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M3 5V3.5a3 3 0 0 1 6 0V5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                      <circle cx="7" cy="7" r="6" fill="#3730D4" />
                      <path d="M4 7.5L6 9.5L10 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  <span className={`text-[13px] font-semibold`}>
                    {step.stepNumber}. {step.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* AI Help card */}
      <div className="mt-6 rounded-2xl border border-[#e4e1f0] bg-white p-4">
        <p className="text-[12px] text-[#9896b0] mb-3">Need help with this step?</p>
        <button
          onClick={onAskAI}
          className="w-full rounded-xl border border-[#e4e1f0] py-2.5 text-[13px] font-semibold text-[#12102b] transition-all duration-150 hover:border-[#3730D4] hover:text-[#3730D4] active:scale-[0.97]"
        >
          Ask AI Assistant
        </button>
      </div>
    </aside>
  );
}

// ─── Footer Bar ───────────────────────────────────────────────────────────────

function FooterBar({ count }) {
  const avatarColors = ["#3730D4", "#7c3aed", "#0ea5e9"];
  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-8 py-3 bg-white z-20"
      style={{ borderTop: "1px solid #e4e1f0" }}
    >
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          {avatarColors.map((c, i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white"
              style={{ background: c }}
            >
              {["A", "B", "C"][i]}
            </div>
          ))}
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white bg-[#e4e1f0] text-[#6b6880]">
            +12
          </div>
        </div>
        <span className="text-[12px] text-[#9896b0]">{count} developers are currently learning this</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[12px] text-[#9896b0] font-medium">Support:</span>
        <button className="text-[#9896b0] hover:text-[#3730D4] transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="10" height="9" rx="2" stroke="currentColor" strokeWidth="1.3" />
            <path d="M3 14l2-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </button>
        <button className="text-[#9896b0] hover:text-[#3730D4] transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="13" cy="3" r="2" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="3" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="13" cy="13" r="2" stroke="currentColor" strokeWidth="1.3" />
            <path d="M5 7L11 4M5 9L11 12" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function CodeLessonView({ codeLesson, onBack }) {
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  const step      = codeLesson.steps[activeStepIdx];
  const isLast    = activeStepIdx === codeLesson.steps.length - 1;
  const isFirst   = activeStepIdx === 0;

  return (
    <div className="flex gap-8 px-8 pt-8 pb-24 max-w-[1100px] mx-auto w-full animate-[fadeUp_0.3s_ease_both]">
      <CodeSidebar
        codeLesson={codeLesson}
        activeStepIdx={activeStepIdx}
        onSelectStep={setActiveStepIdx}
        onAskAI={() => {}}
      />

      <div className="flex-1 min-w-0">
        {/* Step header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="text-[22px] font-extrabold tracking-[-0.4px] text-[#12102b]">
              Step {step.stepNumber}: {step.title}
            </h2>
            <p className="text-[14px] text-[#9896b0] mt-0.5">{step.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={isFirst ? onBack : () => setActiveStepIdx((i) => i - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#e4e1f0] text-[13px] font-semibold text-[#5a586e] bg-white transition-all duration-150 hover:border-[#c5bfea] hover:text-[#12102b] active:scale-[0.97]"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Prev
            </button>
            <button
              onClick={() => !isLast && setActiveStepIdx((i) => i + 1)}
              disabled={isLast}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#3730D4] text-[13.5px] font-bold text-white transition-all duration-150 hover:bg-[#2e28b8] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next Step
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2L10 7L5 12" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Code editor */}
        <CodeEditor
          filename={step.filename}
          code={step.code}
          explanation={step.explanation}
        />

        {/* Info cards */}
        <InfoCards concepts={step.concepts} quickTip={step.quickTip} />
      </div>

      <FooterBar count={codeLesson.activeStepCount} />
    </div>
  );
}
