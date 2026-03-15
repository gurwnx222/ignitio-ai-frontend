import { Lightbulb, ArrowRight } from "lucide-react";

export default function LearnButton() {
  return (
    <button className="flex items-center gap-3 rounded-full bg-indigo-700 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-indigo-800 hover:shadow-lg active:scale-[0.98]">
      <Lightbulb className="h-4 w-4 shrink-0" />
      <span>Let&apos;s Learn: How AI Humor Works</span>
      <ArrowRight className="h-4 w-4 shrink-0" />
    </button>
  );
}