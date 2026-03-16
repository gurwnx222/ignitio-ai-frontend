"use client";

import { useState, useEffect, useRef } from "react";

const PHASES = [
  { from: 0,  label: "Initializing humor engine..." },
  { from: 15, label: "Scanning meme databases..." },
  { from: 35, label: "Analyzing humor patterns..." },
  { from: 60, label: "Crafting the perfect caption..." },
  { from: 82, label: "Polishing your masterpiece..." },
];

const DURATION = 7000;

function SpinnerCircle() {
  return (
    <div className="relative flex items-center justify-center w-[88px] h-[88px] mb-6">
      <svg
        className="absolute inset-0 w-full h-full animate-[spin_1.4s_linear_infinite]"
        viewBox="0 0 88 88"
        fill="none"
      >
        <circle cx="44" cy="44" r="38" stroke="#e5e2f5" strokeWidth="3.5" />
        <circle
          cx="44"
          cy="44"
          r="38"
          stroke="#3730D4"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="80 160"
          strokeDashoffset="20"
        />
      </svg>

      <div className="flex items-center justify-center w-[64px] h-[64px] rounded-full bg-white shadow-[0_2px_12px_rgba(55,48,212,0.10)]">
        <span className="text-[28px] leading-none select-none" role="img" aria-label="meme face">😊</span>
      </div>
    </div>
  );
}

function ProgressBar({ percent, phase }) {
  return (
    <div className="w-full mt-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] font-semibold text-[#3730D4]">{phase}</span>
        <span className="text-[13px] font-bold text-[#3730D4]">{percent}%</span>
      </div>
      <div className="w-full h-[5px] bg-[#e5e2f5] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#3730D4] rounded-full transition-[width] duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default function MemeLoader({ topic, onCancel }) {
  const [percent, setPercent] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    setPercent(0);
    startRef.current = null;

    const tick = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const raw = Math.min((ts - startRef.current) / DURATION, 1);
      const eased = 1 - Math.pow(1 - raw, 2.4);
      const next = Math.min(Math.round(eased * 95), 95);
      setPercent(next);
      if (next < 95) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [topic]);

  const phase =
    [...PHASES].reverse().find((p) => percent >= p.from)?.label ?? PHASES[0].label;

  return (
    <div className="w-full max-w-xl animate-[fadeUp_0.35s_ease_both]">
      <div
        className="w-full rounded-2xl bg-white px-8 py-8 flex flex-col items-center text-center"
        style={{
          border: "1.5px dashed #c5bfea",
          boxShadow: "0 2px 16px rgba(55,48,212,0.05)",
        }}
      >
        <SpinnerCircle />

        <h2 className="text-[22px] font-extrabold tracking-[-0.4px] text-[#12102b] mb-2">
          Cooking your masterpiece...
        </h2>

        <p className="text-[13.5px] leading-[1.6] text-[#6b6880] max-w-[340px] mb-1">
          Our AI is analyzing humor trends and generating
          <br />
          the perfect caption for your prompt.
        </p>

        <ProgressBar percent={percent} phase={phase} />

        <button
          onClick={onCancel}
          className="mt-6 rounded-lg border border-gray-300 bg-white px-5 py-2 text-[13px] font-medium text-gray-600 transition-all duration-150 hover:border-gray-400 hover:bg-gray-50 active:scale-[0.97]"
        >
          Cancel Generation
        </button>
      </div>
    </div>
  );
}
