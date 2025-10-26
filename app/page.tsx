"use client";
import { motion } from "framer-motion";
import {
  UploadCloud,
  TrendingUp,
  School,
  PiggyBank,
  Wallet,
  CircleUser,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useStatsStore } from "@/lib/store";
import Link from "next/link";

export default function LandingPage() {
  const { hasUploadedStats, stats } = useStatsStore();

  const getInvestmentProfile = (stats: any) => {
    const emergencyRatio = stats.savings / stats.expenses;
    const debtToIncomeRatio = stats.debt / stats.income;
    if (emergencyRatio < 3 || debtToIncomeRatio > 0.5) return "safety";
    if (emergencyRatio > 6 && debtToIncomeRatio < 0.3) return "aggressively";
    return "moderately";
  };

  const netWorth = (s: any) => {
    if (!s) return 0;
    return (
      Number(s.savings || 0) + Number(s.invested || 0) - Number(s.debt || 0)
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(34,197,94,0.10),transparent),radial-gradient(800px_400px_at_-10%_10%,rgba(56,189,248,0.10),transparent)] text-slate-100">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="px-8 py-8 border-b border-white/5"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="pb-4 text-3xl font-extrabold tracking-tight text-slate-100">
              InvestEd
            </h1>
            <p className="text-slate-200">
              Smart Student Budgeting & Investing
            </p>
          </div>

          {/* Profile section with name */}
          <div className="flex items-center gap-3">
            <p className="text-lg text-slate-400 pr-4 hidden md:block">
              {(stats as any)?.name || "Set up your profile →"}
            </p>
            <Link
              href="/link"
              aria-label="Open profile"
              className="inline-flex"
            >
              <CircleUser
                className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-slate-100"
                aria-hidden
              />
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Main */}
      <main className="px-8 py-10">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-4 auto-rows-fr"
        >
          {/* HYSA Finder */}
          <FeatureCard
            icon={<PiggyBank className="h-5 w-5" />}
            title="Best Savings Accounts"
            description="Find top student-friendly high-yield savings accounts by APY, fees, and flexibility."
            bullets={[
              "Live APY updates",
              "No/low fees filter",
              "Best-ranked badges",
            ]}
            cta={{ href: "/hysa", label: "Explore HYSAs" }}
          />

          {/* Analytics Dashboard */}
          <FeatureCard
            icon={<TrendingUp className="h-5 w-5" />}
            title="Investing 101"
            description="Learn to invest through simulating DCA into SPY, Tech, or Crypto with risk-adjusted projections."
            bullets={[
              "What's DCA?",
              "Volatility bands",
              "Best ETF's, indexes, crypto...",
            ]}
            cta={{ href: "/analytics", label: "Learn about Investing " }}
          />

          {/* Education Hub */}
          <FeatureCard
            icon={<School className="h-5 w-5" />}
            title="Education Hub"
            description="Still confused? Learn more through short, context-aware lessons on key topics covered and more."
            bullets={[
              "Simple explanations",
              "5-minute reads",
              "In depth articles",
            ]}
            cta={{ href: "/education", label: "Start Learning" }}
          />

          {/* Student Budgeting */}
          <FeatureCard
            icon={<Wallet className="h-5 w-5" />}
            title="Student Budgeting"
            description="Plan your spending with our student-focused 50/30/20 budget calculator and expense tracker."
            bullets={[
              "Flexible ratios",
              "Category insights",
              "Auto-adjusting goals",
            ]}
            cta={{ href: "/budget", label: "Plan Budget" }}
          />
        </motion.section>

        {/* Secondary band */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="max-w-6xl mx-auto mt-10"
        >
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              {!hasUploadedStats ? (
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Your next best step
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      Finish onboarding by importing your latest statement so we
                      can estimate your emergency buffer and monthly investable
                      amount.
                    </p>
                  </div>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white"
                  >
                    <a href="/link">
                      <UploadCloud className="mr-2 h-4 w-4" />
                      Get Started
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-white">
                      Your Financial Summary
                    </h3>
                    <Badge
                      variant="secondary"
                      className="bg-emerald-500/10 text-emerald-200"
                    >
                      {getInvestmentProfile(stats)} investor
                    </Badge>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <StatsCard
                      label="Monthly Cash Flow"
                      value={
                        Number(stats?.income || 0) -
                        Number(stats?.expenses || 0)
                      }
                      prefix="$"
                      trend={
                        Number(stats?.income || 0) >
                        Number(stats?.expenses || 0)
                          ? "up"
                          : "down"
                      }
                    />
                    <StatsCard
                      label="Current debt"
                      value={Number(stats?.debt || 0)}
                      prefix="$"
                    />
                    <StatsCard
                      label="Net worth"
                      value={netWorth(stats)}
                      prefix="$"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>
      </main>
    </div>
  );
}

function StatsCard({
  label,
  value,
  prefix = "",
  suffix = "",
  trend,
}: {
  label: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  trend?: "up" | "down";
}) {
  const trendColor = trend === "up" ? "text-emerald-400" : "text-red-400";
  const display =
    typeof value === "number"
      ? Number.isInteger(value)
        ? String(value)
        : Number(value).toLocaleString()
      : String(value);

  return (
    <div className="rounded-xl bg-slate-800/50 p-4">
      <div className="text-sm text-slate-400">{label}</div>
      <div
        className={`text-xl font-semibold mt-1 ${
          trend ? trendColor : "text-white"
        }`}
      >
        {prefix}
        {display}
        {suffix}
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  bullets,
  cta,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  bullets: string[];
  cta: { href: string; label: string };
  badge?: string;
}) {
  return (
    <Card className="h-full flex flex-col bg-white/5 border-white/10 hover:border-white/20 transition-colors">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="inline-grid place-items-center rounded-md size-7 bg-white/10 text-slate-100">
            {icon}
          </span>
          <CardTitle className="text-slate-100 text-lg">{title}</CardTitle>
          {badge ? (
            <Badge className="ml-auto" variant="secondary">
              {badge}
            </Badge>
          ) : null}
        </div>
        <CardDescription className="text-slate-400">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-slate-300 flex-1">
        <ul className="space-y-2">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <Separator className="bg-white/10" />
      <CardFooter className="p-4 mt-auto">
        <Button asChild variant="secondary" className="w-full">
          <a href={cta.href}>{cta.label}</a>
        </Button>
      </CardFooter>
    </Card>
  );
}
