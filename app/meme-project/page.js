import Header from "@/components/Header";
import LearnButton from "@/components/LearnButton";
import MemeInput from "@/components/MemeInput";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#EEEEF3]">
      <Header />

      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-16">
        <LearnButton />

        <div className="w-full max-w-xl">
          <MemeInput />
        </div>

        <p className="text-center text-[11px] text-gray-400">
          Powered by Advanced Neuro-Linguistic Humor Models &bull; v2.4.0
        </p>
      </main>
    </div>
  );
}
