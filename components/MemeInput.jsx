"use client";

import { useState } from "react";
import { Image, Smile, Sparkles, Brain } from "lucide-react";

const SUGGESTIONS = ["Distracted Boyfriend AI version", "Coding at 3 AM", "Future of Work"];

export default function MemeInput() {
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col gap-3">
      {/* Input card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100">
            <Brain className="h-4 w-4 text-indigo-600" />
          </div>

          {/* Textarea */}
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type a funny meme idea here... e.g. 'A cat explaining tax returns to a goldfish'"
            rows={2}
            className="w-full resize-none bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
          />
        </div>

        {/* Toolbar */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              title="Add image"
              className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <Image alt="" className="h-4 w-4" />
            </button>
            <button
              title="Add emoji"
              className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <Smile className="h-4 w-4" />
            </button>
            <button
              title="AI suggestions"
              className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <Sparkles className="h-4 w-4" />
            </button>
          </div>

          <button
            disabled={!value.trim()}
            className="rounded-xl bg-indigo-700 px-5 py-2 text-sm font-semibold text-white transition-all duration-150 hover:bg-indigo-800 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Generate &gt;
          </button>
        </div>
      </div>

      {/* Suggestions row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          Suggestions:
        </span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setValue(s)}
            className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-indigo-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}