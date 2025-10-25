import {
  LayoutDashboard,
  Upload,
  Target,
  BarChart3,
  BookOpen,
  Sun,
  UploadCloud,
} from "lucide-react";

export default function LandingSkeleton() {
  return (
    <div className="min-h-screen bg-[#0e1a2a] text-slate-200">
      {/* Shell */}
      <div className="grid grid-cols-[260px_1fr] grid-rows-[auto_1fr] min-h-screen">
        {/* Sidebar */}
        <aside className="row-span-2 bg-[#0b1624] border-r border-white/5 flex flex-col">
          {/* Brand */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
            <div className="size-9 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 grid place-items-center shadow-inner shadow-black/20">
              <span className="text-xl font-black text-white">G</span>
            </div>
            <div className="leading-tight">
              <p className="font-semibold text-slate-100">InvestMate</p>
              <p className="text-xs text-slate-400">Smart Student Investing</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="px-3 py-4 space-y-1 flex-1">
            <NavItem
              icon={<LayoutDashboard className="size-4" />}
              label="Dashboard"
              active
            />
            <NavItem icon={<Upload className="size-4" />} label="Import Data" />
            <NavItem
              icon={<Target className="size-4" />}
              label="Financial Plan"
            />
            <NavItem
              icon={<BarChart3 className="size-4" />}
              label="Analytics"
            />
            <NavItem icon={<BookOpen className="size-4" />} label="Education" />
          </nav>

          {/* Sidebar footer widget */}
          <div className="mt-auto p-4 border-t border-white/5">
            <div className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-2">
              <span className="inline-grid place-items-center size-5 rounded-full bg-blue-500/20 text-blue-300">
                i
              </span>
              50/30/20 Budget Rule
            </div>
            <div className="space-y-2">
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-[50%] bg-cyan-400/80" />
              </div>
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-[30%] bg-indigo-400/80" />
              </div>
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-[20%] bg-emerald-400/80" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Needs</span>
                <span>Wants</span>
                <span>Savings</span>
              </div>
            </div>
          </div>

          {/* Theme button placeholder */}
          <div className="p-3">
            <button className="flex items-center gap-2 w-full text-left text-xs px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition">
              <Sun className="size-4" />
              Appearance
            </button>
          </div>
        </aside>

        {/* Header */}
        <header className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-transparent">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
              Financial Dashboard
            </h1>
            <p className="text-slate-400 text-sm">
              Track your spending and stay within budget
            </p>
          </div>

          <button className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow hover:opacity-95 transition">
            <UploadCloud className="size-4" />
            Import Bank Data
          </button>
        </header>

        {/* Main content */}
        <main className="p-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 size-16 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 grid place-items-center shadow-lg shadow-emerald-900/20">
              <UploadCloud className="size-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Welcome to InvestMate!
            </h2>
            <p className="mt-2 text-slate-400">
              Start by importing your bank transaction data to get personalized
              insights and budget tracking.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button className="rounded-lg px-5 py-3 text-sm font-semibold bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow hover:opacity-95 transition inline-flex items-center gap-2">
                <span className="text-lg">＋</span>
                Get Started
              </button>
              <button className="rounded-lg px-5 py-3 text-sm font-medium bg-white/5 text-slate-200 hover:bg-white/10 transition">
                Learn more
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={[
        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition",
        active
          ? "bg-white/10 text-white"
          : "text-slate-300 hover:bg-white/5 hover:text-white",
      ].join(" ")}
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
}
