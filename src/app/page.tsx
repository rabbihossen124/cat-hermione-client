import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center space-y-6">
      <div className="card-breeds p-8 max-w-md w-full bg-[var(--card)] border border-[var(--border)] space-y-4">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-[#FF6B00] to-[#FFA04D] flex items-center justify-center text-white text-2xl shadow-md">
          🤝
        </div>
        <h1 className="text-2xl font-black text-[var(--foreground)]">
          Unity<span className="text-[var(--primary)]">Aid</span> Platform
        </h1>
        <p className="text-xs text-[var(--muted)]">
          Theme customization active. Test switching between Light & Dark themes:
        </p>
        <div className="flex justify-center pt-2">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
