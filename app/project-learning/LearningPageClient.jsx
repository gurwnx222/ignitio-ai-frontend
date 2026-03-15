"use client";

import { useState } from "react";
import Link from "next/link";
import CodeLessonView from "./CodeLessonView";

// ─── Icons ────────────────────────────────────────────────────────────────────

const LockIcon = () => (
  <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
    <rect x="1" y="6" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="10" fill="#3730D4" />
    <path d="M5.5 10.5L8.5 13.5L14.5 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckBulletIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 mt-0.5">
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

const OrchestrationIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="2" y="8" width="7" height="7" rx="1.5" fill="#3730D4" />
    <rect x="19" y="2" width="7" height="7" rx="1.5" fill="#3730D4" fillOpacity="0.6" />
    <rect x="19" y="19" width="7" height="7" rx="1.5" fill="#3730D4" fillOpacity="0.6" />
    <path d="M9 11.5H14C16 11.5 19 9.5 19 5.5" stroke="#3730D4" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9 11.5H14C16 11.5 19 13.5 19 22.5" stroke="#3730D4" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const DataIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <ellipse cx="14" cy="7" rx="9" ry="4" stroke="#3730D4" strokeWidth="1.8" />
    <path d="M5 7v7c0 2.2 4 4 9 4s9-1.8 9-4V7" stroke="#3730D4" strokeWidth="1.8" />
    <path d="M5 14v7c0 2.2 4 4 9 4s9-1.8 9-4v-7" stroke="#3730D4" strokeWidth="1.8" />
  </svg>
);

const DocIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="1" width="10" height="14" rx="1.5" stroke="#6b6880" strokeWidth="1.3" />
    <path d="M5 5h6M5 8h6M5 11h4" stroke="#6b6880" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const CodeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M5 4L1 8L5 12M11 4L15 8L11 12" stroke="#6b6880" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ForumIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="10" height="8" rx="2" stroke="#6b6880" strokeWidth="1.3" />
    <path d="M3 13l2-4" stroke="#6b6880" strokeWidth="1.3" strokeLinecap="round" />
    <rect x="5" y="7" width="10" height="7" rx="2" stroke="#6b6880" strokeWidth="1.3" />
  </svg>
);

const RESOURCE_ICONS = { doc: DocIcon, code: CodeIcon, forum: ForumIcon };
const FEATURE_ICONS  = { orchestration: OrchestrationIcon, data: DataIcon };

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ course, activeLessonIdx, onSelectLesson }) {
  return (
    <aside className="w-[260px] shrink-0 flex flex-col">
      <p className="text-[10px] font-bold tracking-[1.2px] text-[#9896b0] uppercase mb-1">
        Current Course
      </p>
      <h1 className="text-[22px] font-extrabold tracking-[-0.5px] text-[#12102b] leading-tight mb-3">
        {course.title}
      </h1>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-[5px] bg-[#e4e1f0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#3730D4] rounded-full transition-[width] duration-500"
            style={{ width: `${course.overallProgress}%` }}
          />
        </div>
        <span className="text-[12px] font-semibold text-[#3730D4] shrink-0">
          {course.overallProgress}% Done
        </span>
      </div>

      <ul className="flex flex-col relative">
        {course.lessons.map((lesson, i) => {
          const isActive = i === activeLessonIdx;
          const isLast   = i === course.lessons.length - 1;
          return (
            <li key={lesson.id} className="relative flex gap-3">
              {/* Vertical connector */}
              {!isLast && (
                <div className="absolute left-[14px] top-[28px] w-[2px] bottom-0 bg-[#e4e1f0]" />
              )}

              {/* Circle indicator */}
              <div className="shrink-0 flex flex-col items-center pt-1 z-10">
                {lesson.locked ? (
                  <div className="w-7 h-7 rounded-full bg-[#e4e1f0] flex items-center justify-center text-[#9896b0]">
                    <LockIcon />
                  </div>
                ) : isActive ? (
                  <div className="w-7 h-7 rounded-full bg-[#3730D4] flex items-center justify-center">
                    <CheckCircleIcon />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full border-2 border-[#3730D4] flex items-center justify-center">
                    <CheckCircleIcon />
                  </div>
                )}
              </div>

              {/* Lesson card */}
              <div
                className={`flex-1 mb-3 rounded-xl p-3 cursor-pointer transition-all duration-150 ${
                  lesson.locked
                    ? "opacity-50 cursor-not-allowed"
                    : isActive
                    ? "bg-white border border-[#e4e1f0] shadow-sm"
                    : "hover:bg-white hover:border hover:border-[#e4e1f0]"
                }`}
                onClick={() => !lesson.locked && onSelectLesson(i)}
              >
                <p className={`text-[14px] font-bold leading-tight ${lesson.locked ? "text-[#9896b0]" : "text-[#12102b]"}`}>
                  {lesson.title}
                </p>
                <p className="text-[11.5px] text-[#9896b0] mt-0.5">{lesson.subtitle}</p>
                {isActive && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-[#3730D4] text-white text-[9px] font-bold tracking-[0.8px] px-2 py-0.5 rounded-full uppercase">
                      Current
                    </span>
                    <span className="text-[10px] text-[#9896b0]">
                      Step {lesson.currentStep} of {lesson.totalSteps}
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

// ─── Step Card ────────────────────────────────────────────────────────────────

function StepCard({ lesson, step, onPrev, onNext }) {
  const FeatureIcon = (type) => {
    const Icon = FEATURE_ICONS[type] ?? OrchestrationIcon;
    return <Icon />;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#e4e1f0] shadow-[0_2px_16px_rgba(55,48,212,0.06)] overflow-hidden">
      {/* Step progress bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#f0eef8]">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold text-[#12102b]">
            STEP {step.stepNumber} OF {lesson.totalSteps}
          </span>
          <span className="text-[#c5bfea] mx-1">/</span>
          <span className="text-[12px] font-semibold text-[#3730D4] tracking-[0.6px]">
            {step.sectionTitle}
          </span>
          <div className="ml-3 w-32 h-[4px] bg-[#e4e1f0] rounded-full overflow-hidden hidden sm:block">
            <div
              className="h-full bg-[#3730D4] rounded-full transition-[width] duration-500"
              style={{ width: `${step.progress}%` }}
            />
          </div>
        </div>
        <span className="text-[12px] font-semibold text-[#9896b0]">{step.progress}% Complete</span>
      </div>

      {/* Content */}
      <div className="px-8 py-7">
        <h2 className="text-[26px] font-extrabold tracking-[-0.5px] text-[#12102b] mb-4">
          {step.title}
        </h2>
        <p className="text-[15px] leading-[1.7] text-[#5a586e] mb-7">{step.description}</p>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {step.features.map((feature, i) => (
            <div
              key={i}
              className="rounded-xl border border-[#e4e1f0] p-5 hover:border-[#c5bfea] transition-colors duration-150"
            >
              <div className="mb-3">{FeatureIcon(feature.icon)}</div>
              <h3 className="text-[15px] font-bold text-[#12102b] mb-2">{feature.title}</h3>
              <p className="text-[13px] leading-[1.65] text-[#6b6880]">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#f0eef8]">
          <button
            onClick={onPrev}
            disabled={step.stepNumber === 1}
            className="flex items-center gap-2 text-[13px] font-semibold text-[#6b6880] transition-all duration-150 hover:text-[#12102b] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeftIcon /> Previous
          </button>
          {step.stepNumber === lesson.totalSteps ? (
            <button
              onClick={onNext}
              className="flex items-center gap-2 rounded-xl bg-[#3730D4] px-5 py-2.5 text-[13.5px] font-bold text-white transition-all duration-150 hover:bg-[#2e28b8] active:scale-[0.97]"
            >
              Start Code Examples <ArrowRightIcon />
            </button>
          ) : (
            <button
              onClick={onNext}
              className="flex items-center gap-2 rounded-xl bg-[#3730D4] px-5 py-2.5 text-[13.5px] font-bold text-white transition-all duration-150 hover:bg-[#2e28b8] active:scale-[0.97]"
            >
              Continue to Step {step.stepNumber + 1} <ArrowRightIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Objectives & Resources ───────────────────────────────────────────────────

function ObjectivesAndResources({ step }) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 mt-6">
      {/* Objectives */}
      <div className="flex-1 animate-[fadeUp_0.35s_0.1s_ease_both]">
        <div className="flex items-center gap-2 mb-4">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1" y="1" width="16" height="16" rx="3" stroke="#3730D4" strokeWidth="1.5" />
            <path d="M4 5h10M4 9h8M4 13h6" stroke="#3730D4" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <h3 className="text-[15px] font-extrabold text-[#12102b]">Lesson Objectives</h3>
        </div>
        <ul className="flex flex-col gap-3">
          {step.objectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckBulletIcon />
              <span className="text-[14px] leading-[1.6] text-[#5a586e]">{obj}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Resources */}
      <div className="w-full sm:w-[240px] shrink-0 animate-[fadeUp_0.35s_0.15s_ease_both]">
        <p className="text-[10px] font-bold tracking-[1.2px] text-[#9896b0] uppercase mb-3">
          Resources
        </p>
        <ul className="flex flex-col gap-1">
          {step.resources.map((res, i) => {
            const Icon = RESOURCE_ICONS[res.icon] ?? DocIcon;
            return (
              <li key={i}>
                <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13.5px] font-medium text-[#5a586e] transition-colors duration-150 hover:bg-white hover:text-[#3730D4] group">
                  <span className="text-[#9896b0] group-hover:text-[#3730D4] transition-colors duration-150">
                    <Icon />
                  </span>
                  {res.title}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export default function LearningPageClient({ course }) {
  const [activeLessonIdx, setActiveLessonIdx] = useState(
    course.lessons.findIndex((l) => l.current) ?? 0
  );
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [mode, setMode] = useState("theory"); // "theory" | "code"

  const lesson = course.lessons[activeLessonIdx];
  const step   = lesson?.steps?.[activeStepIdx];

  const handleSelectLesson = (idx) => {
    setActiveLessonIdx(idx);
    setActiveStepIdx(0);
    setMode("theory");
  };

  const handleNext = () => {
    const isLastStep = activeStepIdx === lesson.steps.length - 1;
    if (isLastStep && lesson.codeLesson) {
      setMode("code");
    } else if (!isLastStep) {
      setActiveStepIdx((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (activeStepIdx > 0) {
      setActiveStepIdx((s) => s - 1);
    }
  };

  if (mode === "code" && lesson?.codeLesson) {
    return (
      <div className="min-h-screen bg-[#f4f3f8]">
        <CodeLessonView
          codeLesson={lesson.codeLesson}
          onBack={() => setMode("theory")}
        />
      </div>
    );
  }

  return (
    <div className="flex gap-8 px-8 py-8 max-w-[1100px] mx-auto w-full">
      <Sidebar
        course={course}
        activeLessonIdx={activeLessonIdx}
        onSelectLesson={handleSelectLesson}
      />

      <div className="flex-1 min-w-0 animate-[fadeUp_0.3s_ease_both]">
        {step ? (
          <>
            <StepCard
              lesson={lesson}
              step={step}
              onPrev={handlePrev}
              onNext={handleNext}
            />
            <ObjectivesAndResources step={step} />
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-[#e4e1f0] p-12 text-center text-[#9896b0]">
            <p className="text-[15px]">This lesson is locked. Complete the previous lesson to unlock it.</p>
          </div>
        )}
      </div>
    </div>
  );
}
