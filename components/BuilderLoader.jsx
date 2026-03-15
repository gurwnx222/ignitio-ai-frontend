"use client";

import { useState, useEffect, useRef } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    className="shrink-0"
  >
    <circle cx="8.5" cy="8.5" r="8.5" fill="#3730D4" />
    <path
      d="M4.8 8.8L7.3 11.3L12.2 5.8"
      stroke="white"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Config ───────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Analyzing requirements", doneAt: 28 },
  { id: 2, label: "Structuring modules", doneAt: 58 },
  { id: 3, label: "Optimizing learning paths", doneAt: 82 },
  { id: 4, label: "Finalizing workspace", doneAt: 97 },
];

const PHASE_LABELS = [
  { from: 0, text: "Initializing build environment..." },
  { from: 18, text: "Generating concept map to teach..." },
  { from: 52, text: "Crafting your learning roadmap..." },
  { from: 78, text: "Almost there, polishing details..." },
];

const LOG_LINES = [
  "> Initializing LangGraph runtime...",
  "> Loading Nova Pro model weights...",
  "> Building concept graph nodes...",
  "> Streaming builder agent output...",
  "> Teaching agent processing state...",
];

const DURATION = 6200; // ms to reach ~97%

// ─── Sub-components ───────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div
      className="w-[120px] h-[120px] rounded-full flex items-center justify-center mb-7 shrink-0 animate-[pulseRing_2.8s_ease-in-out_infinite]"
      style={{
        background: "radial-gradient(circle, #e9e5f8 0%, #ddd8f5 100%)",
      }}
    >
      <div className="w-[76px] h-[76px] rounded-full bg-white shadow-[0_4px_20px_rgba(55,48,212,0.1),0_1px_4px_rgba(0,0,0,0.06)] flex items-center justify-center">
        <svg
          className="w-11 h-11 overflow-visible animate-[spin_1.1s_linear_infinite]"
          viewBox="0 0 44 44"
          fill="none"
        >
          <circle cx="22" cy="22" r="18" stroke="#ebe8f8" strokeWidth="3" />
          <circle
            cx="22"
            cy="22"
            r="18"
            stroke="#3730D4"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="56 57"
            strokeDashoffset="14"
          />
        </svg>
      </div>
    </div>
  );
}

function ProgressBar({ percent }) {
  return (
    <div className="w-full mb-6 animate-[fadeUp_0.4s_0.1s_ease_both]">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[11px] font-bold tracking-[0.9px] text-[#b0afc0] uppercase">
          SYSTEM STATUS
        </span>
        <span className="text-[13px] font-bold text-[#3730d4]">{percent}%</span>
      </div>
      <div className="w-full h-1.5 bg-[#e4e1f0] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#4f46e5] via-[#3730d4] to-[#5b54e8] rounded-full transition-[width] duration-[280ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] animate-[progressGlow_2s_ease_infinite]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function StepList({ percent }) {
  return (
    <ul className="list-none w-full flex flex-col items-center gap-[11px] mb-8 animate-[fadeUp_0.4s_0.15s_ease_both]">
      {STEPS.map((step, i) => {
        const done = percent >= step.doneAt;
        const active = !done && percent >= (STEPS[i - 1]?.doneAt ?? 0);
        return (
          <li
            key={step.id}
            className={`flex items-center gap-2 animate-[stepIn_0.3s_ease_both] ${
              done || active ? "text-[#12102b]" : "text-[#b0afc0]"
            }`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {done ? (
              <CheckIcon />
            ) : (
              <span
                className={`w-[17px] h-[17px] rounded-full shrink-0 transition-[background] duration-300 ${
                  active
                    ? "bg-[#3730d4] shadow-[0_0_0_3px_rgba(55,48,212,0.2)] animate-[pulseRing_1.6s_ease_infinite]"
                    : "bg-[#d8d5ee]"
                }`}
              />
            )}
            <span className="text-sm font-medium">{step.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

function LogTerminal({ percent }) {
  const visible = Math.max(1, Math.ceil((percent / 100) * LOG_LINES.length));
  return (
    <div className="w-full bg-[rgba(237,233,246,0.55)] border border-[rgba(200,195,225,0.5)] rounded-[14px] py-4 px-[18px] text-left min-h-[96px] animate-[fadeUp_0.4s_0.25s_ease_both]">
      {LOG_LINES.slice(0, visible - 1).map((line, i) => (
        <p
          key={i}
          className="text-xs font-mono leading-[1.75] text-[#8c89ae] animate-[fadeIn_0.25s_ease_both]"
        >
          {line}
        </p>
      ))}
      <p className="text-xs font-mono leading-[1.75] text-[#3730d4] font-medium">
        {LOG_LINES[Math.min(visible - 1, LOG_LINES.length - 1)]}
        <span className="inline-block ml-0.5 animate-[blink_0.8s_step-end_infinite] text-[#3730d4]">
          █
        </span>
      </p>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function BuilderLoader({ topic }) {
  const [percent, setPercent] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    // Reset if topic changes
    setPercent(0);
    startRef.current = null;

    const tick = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const raw = Math.min((ts - startRef.current) / DURATION, 1);
      const eased = 1 - Math.pow(1 - raw, 2.6);
      const next = Math.min(Math.round(eased * 97), 97);
      setPercent(next);
      if (next < 97) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [topic]);

  const phase =
    [...PHASE_LABELS].reverse().find((p) => percent >= p.from)?.text ??
    PHASE_LABELS[0].text;

  return (
    <div className="w-full max-w-[440px] flex flex-col items-center text-center animate-[fadeUp_0.4s_ease_both]">
      <Spinner />

      <h2 className="text-2xl font-extrabold tracking-[-0.6px] text-[#12102b] mb-2 animate-[fadeUp_0.4s_0.05s_ease_both]">
        Building the project...
      </h2>

      {/* key forces re-mount → re-triggers phaseFade animation on text change */}
      <p
        className="text-[14.5px] font-medium text-[#3730d4] mb-7 animate-[phaseFade_0.5s_ease_both]"
        key={phase}
      >
        {phase}
      </p>

      <ProgressBar percent={percent} />

      <StepList percent={percent} />

      <p className="text-[13px] text-[#b0afc0] mb-5 animate-[fadeUp_0.4s_0.2s_ease_both]">
        This usually takes a few seconds. Do not refresh.
      </p>

      <LogTerminal percent={percent} />
    </div>
  );
}
