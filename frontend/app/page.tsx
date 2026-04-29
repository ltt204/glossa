import { Translator } from "@/components/translator";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center mesh-bg min-h-screen p-4 sm:p-8">
      {/* Sidebar-shaped container */}
      <div className="frost-panel w-full max-w-[400px] h-[680px] rounded-3xl shadow-xl shadow-primary/5 flex flex-col overflow-hidden">
        <Translator />
      </div>
    </div>
  );
}
