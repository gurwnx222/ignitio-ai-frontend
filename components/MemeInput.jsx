"use client";

import { useState } from "react";
import { Sparkles, Brain, Loader2 } from "lucide-react";

const SUGGESTIONS = ["Distracted Boyfriend AI version", "Coding at 3 AM", "Future of Work"];

export default function MemeInput({ onGenerate, isLoading = false }) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (value.trim() && !isLoading) {
      onGenerate?.(value.trim());
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Input card */}
      <div className="rounded-2xl border border-[#e6e4ee] bg-white p-5 shadow-[0_4px_24px_rgba(55,48,212,0.08)]">
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100">
            <Brain className="h-4 w-4 text-indigo-600" />
          </div>

          {/* Textarea */}
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Type a funny meme idea here... e.g. 'A cat explaining tax returns to a goldfish'"
            rows={2}
            disabled={isLoading}
            className="w-full resize-none bg-transparent text-[15px] text-gray-700 placeholder:text-gray-400 focus:outline-none disabled:opacity-50"
          />
        </div>

        {/* Toolbar */}
        <div className="mt-4 flex items-center justify-between border-t border-[#f0eef8] pt-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-500">
              <Sparkles className="h-3.5 w-3.5" />
              Try a suggestion
            </span>
          </div>

          <button
            disabled={!value.trim() || isLoading}
            onClick={handleSubmit}
            className="flex items-center gap-2 rounded-xl bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-150 hover:bg-indigo-800 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                Generate Meme
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Suggestions row */}
      <div className="flex flex-wrap items-center gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => !isLoading && setValue(s)}
            disabled={isLoading}
            className="rounded-full border border-[#e6e4ee] bg-white px-4 py-1.5 text-xs font-medium text-indigo-600 transition-all hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}