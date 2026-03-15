"use client";

import { useState } from "react";
import BuilderLoader from "@/components/BuilderLoader";
import Header from "@/components/Header";

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

const LogoIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="28" height="28" rx="6" fill="#3730D4" />
    <rect x="6" y="6" width="7" height="7" rx="1.5" fill="white" />
    <rect
      x="15"
      y="6"
      width="7"
      height="7"
      rx="1.5"
      fill="white"
      fillOpacity="0.5"
    />
    <rect
      x="6"
      y="15"
      width="7"
      height="7"
      rx="1.5"
      fill="white"
      fillOpacity="0.5"
    />
    <rect x="15" y="15" width="7" height="7" rx="1.5" fill="white" />
  </svg>
);

// ─── Shared Footer ────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="flex items-center justify-center gap-5 px-6 py-6 text-[13px] text-[#b0afc0] flex-wrap">
      <span>© 2024 Ignitio AI Lab</span>
      <a
        href="#"
        className="text-[#b0afc0] no-underline transition-colors duration-150 hover:text-[#5a586e]"
      >
        Privacy Policy
      </a>
      <a
        href="#"
        className="text-[#b0afc0] no-underline transition-colors duration-150 hover:text-[#5a586e]"
      >
        Documentation
      </a>
      <a
        href="#"
        className="text-[#b0afc0] no-underline transition-colors duration-150 hover:text-[#5a586e]"
      >
        Support
      </a>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [topic, setTopic] = useState(null);
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    if (query.trim()) setTopic(query.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
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
        {topic ? (
          // ── Loader view ──────────────────────────────────────────────────
          <BuilderLoader topic={topic} />
        ) : (
          // ── Home view ────────────────────────────────────────────────────
          <div className="w-full max-w-[660px] flex flex-col items-center text-center">
            <h1 className="text-[clamp(36px,5.5vw,54px)] font-extrabold leading-[1.15] tracking-[-1.5px] text-[#12102b] mb-3">
              Master the Art of LLM
              <br />
              Orchestration
            </h1>
            <p className="text-base leading-[1.65] text-[#5a586e] max-w-[440px] mb-6">
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
              />
              <div className="flex items-center justify-end mt-2 pt-2 border-t border-[#f0eef8]">
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-xl border-0 bg-[#3730d4] text-white cursor-pointer transition-all duration-[180ms] shrink-0 hover:bg-[#2e28b8] hover:scale-[1.04] active:scale-[0.97] disabled:opacity-[0.45] disabled:cursor-not-allowed disabled:scale-100"
                  aria-label="Submit"
                  onClick={handleSubmit}
                  disabled={!query.trim()}
                >
                  <ArrowRightIcon />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
