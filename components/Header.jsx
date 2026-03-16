import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white px-8 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <span className="text-[15px] font-semibold text-gray-900">
          Ignitio Learning Lab
        </span>
      </div>
    </header>
  );
}