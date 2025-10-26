"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  Gauge,
  Briefcase,
  Calculator as CalcIcon,
  BarChart3,
  Layers,
  Shield,
  ExternalLink,
} from "lucide-react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TopNav } from "@/components/ui/top-nav";

/* ===========================
   Types, Data & Math Helpers
   =========================== */
type RiskLevel = "conservative" | "balanced" | "aggressive";
type Instrument = {
  ticker: string;
  name: string;
  type: "etf" | "equity" | "crypto" | "index";
  metrics: {
    cagr3: number;
    cagr5: number;
    cagr10: number;
    vol3: number;
    vol5: number;
    vol10: number;
    maxDD: number;
  };
};

const UNIVERSE: Instrument[] = [
  {
    ticker: "SPY",
    name: "S&P 500 ETF",
    type: "etf",
    metrics: {
      cagr3: 0.11,
      cagr5: 0.12,
      cagr10: 0.11,
      vol3: 0.19,
      vol5: 0.18,
      vol10: 0.17,
      maxDD: -0.34,
    },
  },
  {
    ticker: "VTI",
    name: "Total US Market",
    type: "etf",
    metrics: {
      cagr3: 0.11,
      cagr5: 0.11,
      cagr10: 0.1,
      vol3: 0.18,
      vol5: 0.17,
      vol10: 0.16,
      maxDD: -0.35,
    },
  },
  {
    ticker: "QQQ",
    name: "NASDAQ 100 ETF",
    type: "etf",
    metrics: {
      cagr3: 0.15,
      cagr5: 0.17,
      cagr10: 0.18,
      vol3: 0.25,
      vol5: 0.24,
      vol10: 0.23,
      maxDD: -0.36,
    },
  },
  {
    ticker: "BND",
    name: "US Total Bond",
    type: "etf",
    metrics: {
      cagr3: 0.0,
      cagr5: 0.01,
      cagr10: 0.02,
      vol3: 0.06,
      vol5: 0.06,
      vol10: 0.05,
      maxDD: -0.18,
    },
  },
  {
    ticker: "BTC-USD",
    name: "Bitcoin",
    type: "crypto",
    metrics: {
      cagr3: 0.3,
      cagr5: 0.35,
      cagr10: 0.85,
      vol3: 0.75,
      vol5: 0.8,
      vol10: 0.85,
      maxDD: -0.83,
    },
  },
  {
    ticker: "NVDA",
    name: "NVIDIA",
    type: "equity",
    metrics: {
      cagr3: 0.75,
      cagr5: 0.6,
      cagr10: 0.55,
      vol3: 0.65,
      vol5: 0.55,
      vol10: 0.5,
      maxDD: -0.57,
    },
  },
];

// Stable quote/learn URLs
const INVEST_LINKS: Record<string, { quote: string; learn?: string }> = {
  SPY: {
    quote: "https://finance.yahoo.com/quote/SPY",
    learn:
      "https://www.ssga.com/us/en/individual/etfs/funds/spdr-sp-500-etf-trust-spy",
  },
  VTI: {
    quote: "https://finance.yahoo.com/quote/VTI",
    learn: "https://investor.vanguard.com/investment-products/etfs/profile/vti",
  },
  QQQ: {
    quote: "https://finance.yahoo.com/quote/QQQ",
    learn:
      "https://www.invesco.com/us/financial-products/etfs/product-detail?audienceType=Investor&ticker=QQQ",
  },
  BND: {
    quote: "https://finance.yahoo.com/quote/BND",
    learn: "https://investor.vanguard.com/investment-products/etfs/profile/bnd",
  },
  NVDA: {
    quote: "https://finance.yahoo.com/quote/NVDA",
    learn: "https://www.nvidia.com/en-us/about-nvidia/investor-relations/",
  },
  "BTC-USD": {
    quote: "https://finance.yahoo.com/quote/BTC-USD",
    learn: "https://bitcoin.org",
  },
};

const fmtMoney = (n: number, digits = 0) =>
  isFinite(n)
    ? n.toLocaleString(undefined, { maximumFractionDigits: digits })
    : "—";

/* math */
function fvWithPMT(
  P: number,
  rAnnual: number,
  years: number,
  PMT: number,
  periodsPerYear: number
) {
  const r = rAnnual / periodsPerYear;
  const n = Math.max(0, Math.round(periodsPerYear * Math.max(0, years)));
  const growth = Math.pow(1 + r, n);
  const future = P * growth + (PMT * (growth - 1)) / (r || 1e-12);
  return { future, n };
}
function buildSeries(
  P: number,
  rAnnual: number,
  years: number,
  PMT: number,
  periodsPerYear: number
) {
  const Nyears = Math.max(0, years);
  const n = Math.max(1, Math.round(periodsPerYear * Nyears));
  const r = rAnnual / periodsPerYear;
  const series: { p: number }[] = [];
  for (let k = 0; k <= n; k++) {
    const growth = Math.pow(1 + r, k);
    const value = P * growth + (PMT * (growth - 1)) / (r || 1e-12);
    series.push({ p: value });
  }
  return series;
}
function irrFromSchedule(
  P: number,
  PMT: number,
  rAnnual: number,
  years: number,
  periodsPerYear: number
) {
  const Nyears = Math.max(0, years);
  const n = Math.max(1, Math.round(periodsPerYear * Nyears));
  const msPerYear = 365 * 24 * 3600 * 1000;
  const t0 = Date.now();
  const cashflows: { t: number; amt: number }[] = [];
  cashflows.push({ t: t0, amt: -P });
  for (let i = 1; i <= n; i++)
    cashflows.push({ t: t0 + (i * msPerYear) / periodsPerYear, amt: -PMT });
  const fv = fvWithPMT(P, rAnnual, Nyears, PMT, periodsPerYear).future;
  cashflows.push({ t: t0 + (n * msPerYear) / periodsPerYear, amt: fv });
  const f = (rate: number) =>
    cashflows.reduce(
      (acc, cf) => acc + cf.amt / Math.pow(1 + rate, (cf.t - t0) / msPerYear),
      0
    );
  let lo = -0.99,
    hi = 5;
  if (f(lo) * f(hi) > 0) return null;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    const v = f(mid);
    if (Math.abs(v) < 1e-8) return mid;
    v > 0 ? (lo = mid) : (hi = mid);
  }
  return (lo + hi) / 2;
}
function rateInstruments(
  universe: Instrument[],
  horizonYears: 3 | 5 | 10,
  risk: RiskLevel
) {
  const rows = universe.map((ins) => {
    const m = ins.metrics;
    const cagr =
      horizonYears === 3
        ? m.cagr3
        : horizonYears === 5
        ? m.cagr5
        : m.cagr10 || m.cagr5;
    const vol =
      horizonYears === 3
        ? m.vol3
        : horizonYears === 5
        ? m.vol5
        : m.vol10 || m.vol5;
    const rf = 0.02;
    const sharpe = (cagr - rf) / Math.max(vol, 1e-6);
    const penalty =
      risk === "conservative"
        ? vol * 0.7
        : risk === "balanced"
        ? vol * 0.45
        : vol * 0.25;
    const compositeRaw = sharpe - penalty;
    return { ins, cagr, vol, compositeRaw };
  });
  const comps = rows.map((r) => r.compositeRaw);
  const mean = comps.reduce((a, b) => a + b, 0) / Math.max(comps.length, 1);
  const sd =
    Math.sqrt(
      rows.reduce((acc, r) => acc + Math.pow(r.compositeRaw - mean, 2), 0) /
        Math.max(rows.length, 1)
    ) || 1;
  const standardized = rows.map((r) => ({
    ...r,
    composite: (r.compositeRaw - mean) / sd,
  }));
  const sortedVals = [...standardized]
    .map((r) => r.composite)
    .sort((a, b) => a - b);
  return standardized
    .map((r) => {
      const idx = sortedVals.findIndex((x) => x === r.composite);
      const quant = sortedVals.length > 1 ? idx / (sortedVals.length - 1) : 1;
      const stars = Math.max(1, Math.min(5, Math.ceil((quant * 100) / 20)));
      return { ...r, stars };
    })
    .sort((a, b) => b.stars - a.stars || b.composite - a.composite);
}

/* ===========================
   Responsive Sparkline (no overflow)
   =========================== */
function Sparkline({
  data,
  height = 118,
}: {
  data: { p: number }[];
  height?: number;
}) {
  if (!data?.length) return null;
  const min = Math.min(...data.map((d) => d.p));
  const max = Math.max(...data.map((d) => d.p));
  const normY = (p: number) =>
    ((p - min) / Math.max(max - min, 1e-9)) * (height - 6) + 3;
  const stepX = 100 / Math.max(1, data.length - 1);
  const path = data
    .map((d, i) => `${i === 0 ? "M" : "L"}${i * stepX},${height - normY(d.p)}`)
    .join(" ");
  return (
    <svg
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      className="w-full h-[118px] overflow-hidden text-emerald-400/90"
    >
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={path} fill="none" stroke="currentColor" strokeWidth={2} />
      <path
        d={`${path} L 100,${height} L 0,${height} Z`}
        fill="url(#grad)"
        stroke="none"
      />
    </svg>
  );
}

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex gap-1 text-amber-400" aria-label={`${stars} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          className={i < stars ? "opacity-100" : "opacity-30"}
        >
          <path
            d="M12 .587l3.668 7.431L24 9.748l-6 5.847 1.417 8.268L12 19.771l-7.417 4.092L6 15.595 0 9.748l8.332-1.73z"
            fill="currentColor"
          />
        </svg>
      ))}
    </div>
  );
}

/* ===========================
   Analytics Page
   =========================== */
export default function AnalyticsPage() {
  // Calculator
  const [risk, setRisk] = useState<RiskLevel>("balanced");
  const [horizon, setHorizon] = useState<3 | 5 | 10>(5);
  const [startBalance, setStartBalance] = useState(10000);
  const [annualRate, setAnnualRate] = useState(7);
  const [years, setYears] = useState(20);
  const [periodic, setPeriodic] = useState(500);
  const [freq, setFreq] = useState<
    "weekly" | "monthly" | "quarterly" | "yearly"
  >("monthly");
  const [hasRun, setHasRun] = useState(false);

  const nPerYear =
    freq === "yearly"
      ? 1
      : freq === "quarterly"
      ? 4
      : freq === "monthly"
      ? 12
      : 52;
  const rDec = annualRate / 100;
  const PMT = periodic;

  const exact = useMemo(
    () => fvWithPMT(startBalance, rDec, years, PMT, nPerYear),
    [startBalance, rDec, years, PMT, nPerYear]
  );
  const finalValue = exact.future;
  const totalContrib = PMT * exact.n;
  const scheduleSeries = useMemo(
    () => buildSeries(startBalance, rDec, years, PMT, nPerYear),
    [startBalance, rDec, years, PMT, nPerYear]
  );
  const irrValue = useMemo(
    () => irrFromSchedule(startBalance, PMT, rDec, years, nPerYear),
    [startBalance, PMT, rDec, years, nPerYear]
  );
  const chartData = hasRun ? scheduleSeries : [{ p: startBalance }];
  const rated = useMemo(
    () => rateInstruments(UNIVERSE, horizon, risk),
    [horizon, risk]
  );

  // Retirement / Coast-FIRE
  const [age, setAge] = useState(22);
  const [retireAge, setRetireAge] = useState(60);
  const [currentPortfolio, setCurrentPortfolio] = useState(5000);
  const [monthlyContrib, setMonthlyContrib] = useState(500);
  const [expMonthly, setExpMonthly] = useState(2000);
  const [swr, setSWR] = useState(4);
  const [retReturn, setRetReturn] = useState(7);

  const yearsToRetire = Math.max(0, retireAge - age);
  const FInumber = (expMonthly * 12) / (Math.max(swr, 0.1) / 100);
  const coastNeededNow =
    FInumber / Math.pow(1 + retReturn / 100, yearsToRetire);
  const projAtRetire = useMemo(() => {
    const r = retReturn / 100;
    const n = yearsToRetire;
    const pmt = monthlyContrib * 12;
    return (
      currentPortfolio * Math.pow(1 + r, n) +
      (pmt * (Math.pow(1 + r, n) - 1)) / (r || 1e-12)
    );
  }, [currentPortfolio, monthlyContrib, retReturn, yearsToRetire]);
  const onTrack = projAtRetire >= FInumber;
  const coastMet = currentPortfolio >= coastNeededNow;

  // ===== Modals (click to expand) =====
  const [modalOpen, setModalOpen] = useState(false);
  const [modal, setModal] = useState<{
    title: string;
    desc?: string;
    bullets?: string[];
    href?: string;
  } | null>(null);
  const openModal = (m: {
    title: string;
    desc?: string;
    bullets?: string[];
    href?: string;
  }) => {
    setModal(m);
    setModalOpen(true);
  };

  const explainers = {
    why: [
      {
        label: "Compounding snowball",
        detail:
          "Earnings generate their own earnings. Small, steady contributions can grow non-linearly over long horizons.",
      },
      {
        label: "DCA lowers timing risk",
        detail:
          "Buy a fixed dollar amount on a schedule. You buy more shares when prices are low and fewer when high.",
      },
      {
        label: "Missing up-days hurts",
        detail:
          "A handful of strong days can drive long-term returns. Staying invested helps you capture them.",
      },
    ],
    types: [
      {
        label: "ETFs / Index",
        detail:
          "Low cost, diversified baskets that track an index. Great as a core.",
      },
      {
        label: "S&P 500",
        detail:
          "Broad US large-caps. Simple core holding; still volatile in recessions.",
      },
      {
        label: "Crypto / Tech",
        detail: "Higher potential growth with higher volatility and drawdowns.",
      },
    ],
    brokerage: [
      {
        label: "Taxable vs IRA vs 401(k)",
        detail:
          "Taxable: flexible but taxable. IRAs/401(k): tax advantages; contribution rules apply.",
      },
      {
        label: "Roth: tax-free growth",
        detail:
          "Contribute after-tax; qualified withdrawals are tax-free in retirement.",
      },
      {
        label: "401(k) match first",
        detail:
          "Employer match = instant return. Try to capture it before anything else.",
      },
    ],
    retire: [
      {
        label: "FI = expenses / SWR",
        detail:
          "Financial Independence target equals annual expenses divided by a safe withdrawal rate.",
      },
      {
        label: "Coast amount today",
        detail:
          "Lump sum that can grow to your FI target without further contributions.",
      },
      {
        label: "Are you on track?",
        detail:
          "Compare projected portfolio at target age with your FI number.",
      },
    ],
  } as const;

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(34,197,94,0.10),transparent),radial-gradient(800px_400px_at_-10%_10%,rgba(56,189,248,0.10),transparent)] text-slate-200">
      <TopNav />
      {/* Header */}
      <header className="px-8 py-8 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="pb-1 text-3xl font-extrabold tracking-tight text-slate-100">
              Investing 101
            </h1>
            <p className="text-slate-400">
              Risk-aware projections, compounding sims, and retirement planning.
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="px-8 py-10">
        {/* Top grid (clickable “mini cards”) */}
        <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            icon={<BarChart3 className="h-5 w-5" />}
            title="Why Invest?"
            description="Compounding + DCA + time in market. Consistency beats timing."
            bullets={explainers.why}
            badge="Primer"
            onBulletClick={(b) => openModal({ title: b.label, desc: b.detail })}
          />
          <InfoCard
            icon={<Layers className="h-5 w-5" />}
            title="Investment Types"
            description="ETFs/Index, S&P 500, Bonds, Tech growth, Crypto."
            bullets={explainers.types}
            badge="Pros & Cons"
            onBulletClick={(b) => openModal({ title: b.label, desc: b.detail })}
          />
          <InfoCard
            icon={<Briefcase className="h-5 w-5" />}
            title="Brokerage & Accounts"
            description="Fidelity / Schwab / Vanguard and the right account for taxes."
            bullets={explainers.brokerage}
            badge="Setup"
            onBulletClick={(b) => openModal({ title: b.label, desc: b.detail })}
          />
          <InfoCard
            icon={<Shield className="h-5 w-5" />}
            title="Retirement & Coast-FIRE"
            description="Estimate FI number, coast amount, and on-track status."
            bullets={explainers.retire}
            badge="Plan"
            onBulletClick={(b) => openModal({ title: b.label, desc: b.detail })}
          />
        </div>

        {/* Calculators & suggestions */}
        <section className="max-w-6xl mx-auto mt-10 grid gap-6 lg:grid-cols-3">
          {/* Compound calculator */}
          <Card className="lg:col-span-2 bg-white/5 border-white/10 lg:h-[560px] flex flex-col">
            <CardHeader className="py-4">
              <div className="flex items-center gap-2">
                <span className="inline-grid place-items-center rounded-md size-7 bg-white/10 text-slate-100">
                  <CalcIcon className="h-4 w-4" />
                </span>
                <CardTitle className="text-slate-100">
                  Compound Interest Simulator
                </CardTitle>
                <Badge className="ml-auto" variant="secondary">
                  DCA
                </Badge>
              </div>
              <CardDescription className="text-slate-400">
                Project balance with steady contributions. Change frequency,
                rate, and time.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 flex flex-col gap-4 pt-0">
              <div className="grid md:grid-cols-3 gap-3">
                <LabeledInput label="Starting Balance ($)">
                  <input
                    type="number"
                    min={0}
                    className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-slate-100 outline-none"
                    value={startBalance}
                    onChange={(e) =>
                      setStartBalance(
                        Math.max(0, parseFloat(e.target.value || "0"))
                      )
                    }
                  />
                </LabeledInput>
                <LabeledInput label="Expected Return (%/yr)">
                  <input
                    type="number"
                    className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-slate-100 outline-none"
                    value={annualRate}
                    onChange={(e) =>
                      setAnnualRate(parseFloat(e.target.value || "0"))
                    }
                  />
                </LabeledInput>
                <LabeledInput label="Years">
                  <input
                    type="number"
                    min={0}
                    className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-slate-100 outline-none"
                    value={years}
                    onChange={(e) =>
                      setYears(Math.max(0, parseFloat(e.target.value || "0")))
                    }
                  />
                </LabeledInput>
                <LabeledInput label="Contribution ($)">
                  <input
                    type="number"
                    min={0}
                    className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-slate-100 outline-none"
                    value={periodic}
                    onChange={(e) =>
                      setPeriodic(
                        Math.max(0, parseFloat(e.target.value || "0"))
                      )
                    }
                  />
                </LabeledInput>
                <LabeledInput label="Frequency">
                  <Select value={freq} onValueChange={(v) => setFreq(v as any)}>
                    <SelectTrigger className="w-full bg-white/5 border border-white/10 text-slate-100">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0e1a2a] text-slate-100 border-white/10">
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </LabeledInput>

                <div className="flex items-end">
                  <Button
                    onClick={() => setHasRun(true)}
                    className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white"
                  >
                    Run Simulation
                  </Button>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-4 flex-1 min-h-0">
                <div className="lg:col-span-2 rounded-md border border-white/10 bg-white/5 p-4 overflow-hidden flex flex-col min-h-0">
                  <div className="text-sm text-slate-400 mb-2">
                    Projected Balance
                  </div>
                  <div className="flex-1 min-h-0">
                    <Sparkline
                      data={hasRun ? chartData : [{ p: startBalance }]}
                    />
                  </div>
                </div>
                <div className="grid gap-3">
                  <StatBox
                    label="Total Contributions"
                    value={`$${fmtMoney(totalContrib, 0)}`}
                  />
                  <StatBox
                    label="Projected Final Value"
                    value={`$${fmtMoney(finalValue, 0)}`}
                  />
                  <StatBox
                    label="Implied IRR (approx)"
                    value={
                      irrValue === null
                        ? "—"
                        : `${(irrValue * 100).toFixed(2)}%`
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suggestions by Risk */}
          <Card className="bg-white/5 border-white/10 lg:h-[560px] flex flex-col">
            <CardHeader className="py-4">
              <div className="flex items-center gap-2">
                <span className="inline-grid place-items-center rounded-md size-7 bg-white/10 text-slate-100">
                  <TrendingUp className="h-4 w-4" />
                </span>
                <CardTitle className="text-slate-100">
                  Suggestions by Risk
                </CardTitle>
                <Badge className="ml-auto" variant="secondary">
                  3 / 5 / 10-yr
                </Badge>
              </div>
              <CardDescription className="text-slate-400">
                Rated by risk-adjusted return and volatility penalty.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 flex flex-col gap-3 pt-0">
              <div className="grid grid-cols-2 gap-3">
                <LabeledInput label="Risk">
                  <Select
                    value={risk}
                    onValueChange={(v) => setRisk(v as RiskLevel)}
                  >
                    <SelectTrigger className="w-full bg-white/5 border border-white/10 text-slate-100">
                      <SelectValue placeholder="Risk" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0e1a2a] text-slate-100 border-white/10">
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </LabeledInput>

                <LabeledInput label="Return Window">
                  <Select
                    value={String(horizon)}
                    onValueChange={(v) => setHorizon(parseInt(v) as 3 | 5 | 10)}
                  >
                    <SelectTrigger className="w-full bg-white/5 border border-white/10 text-slate-100">
                      <SelectValue placeholder="Window" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0e1a2a] text-slate-100 border-white/10">
                      <SelectItem value="3">3-year</SelectItem>
                      <SelectItem value="5">5-year</SelectItem>
                      <SelectItem value="10">10-year</SelectItem>
                    </SelectContent>
                  </Select>
                </LabeledInput>
              </div>

              <Separator className="bg-white/10" />

              <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-3">
                {rated.map((r) => {
                  const m = r.ins.metrics;
                  const cagr =
                    horizon === 3
                      ? m.cagr3
                      : horizon === 5
                      ? m.cagr5
                      : m.cagr10 || m.cagr5;
                  const vol =
                    horizon === 3
                      ? m.vol3
                      : horizon === 5
                      ? m.vol5
                      : m.vol10 || m.vol5;
                  const links = INVEST_LINKS[r.ins.ticker] || null;
                  return (
                    <div
                      key={r.ins.ticker}
                      className="rounded-md border border-white/10 bg-white/5 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-slate-100 font-semibold">
                          {r.ins.ticker}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase">
                          {r.ins.type}
                        </span>
                        <span className="ml-auto">
                          <StarRating stars={r.stars} />
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-slate-300 truncate">
                        {r.ins.name}
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-[11px] flex-wrap">
                        <Badge
                          variant="secondary"
                          className="bg-emerald-400/10 text-emerald-200 border-emerald-400/20"
                        >
                          CAGR {(cagr * 100).toFixed(1)}%
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="bg-blue-400/10 text-blue-200 border-blue-400/20"
                        >
                          Vol {(vol * 100).toFixed(1)}%
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="bg-rose-400/10 text-rose-200 border-rose-400/20"
                        >
                          MaxDD {(m.maxDD * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      {links && (
                        <div className="mt-2 flex items-center gap-4 text-[11px]">
                          <a
                            href={links.quote}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200 underline"
                          >
                            View on Yahoo Finance{" "}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                          {links.learn && (
                            <a
                              href={links.learn}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-slate-300 hover:text-slate-100 underline"
                            >
                              Learn / Issuer{" "}
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Education rows + Brokerage cards */}
        <section className="max-w-6xl mx-auto mt-10 grid gap-6 lg:grid-cols-3">
          {/* Types quick takes */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-grid place-items-center rounded-md size-7 bg-white/10 text-slate-100">
                  <Layers className="h-4 w-4" />
                </span>
                <CardTitle className="text-slate-100">
                  Types: Pros & Cons
                </CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                Tap a chip above for a deeper explainer.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {[
                [
                  "ETFs / Index",
                  "Low cost, diversified",
                  "Market drawdowns still apply",
                ],
                ["S&P 500", "Strong, simple core", "US-centric risk"],
                ["Bonds", "Lower volatility, income", "Lower long-term return"],
                [
                  "Tech / QQQ",
                  "High growth exposure",
                  "Higher volatility & concentration",
                ],
                [
                  "Crypto",
                  "Asymmetric upside",
                  "Extreme volatility / regulatory",
                ],
              ].map(([label, pro, con]) => (
                <div
                  key={label}
                  className="rounded-md border border-white/10 bg-white/5 p-3"
                >
                  <div className="text-slate-100 font-medium">{label}</div>
                  <div className="mt-1 text-xs text-emerald-200/90">
                    Pro: {pro}
                  </div>
                  <div className="text-xs text-rose-200/90">Con: {con}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Brokerage & Accounts – company cards open modal with link */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-grid place-items-center rounded-md size-7 bg-white/10 text-slate-100">
                  <Briefcase className="h-4 w-4" />
                </span>
                <CardTitle className="text-slate-100">
                  Brokerage & Accounts
                </CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                Pick a broker; choose tax wrapper wisely.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    name: "Fidelity",
                    note: "Great app, fractional, $0 commissions",
                    href: "https://www.fidelity.com",
                  },
                  {
                    name: "Schwab",
                    note: "Service, $0 commissions, solid ETFs",
                    href: "https://www.schwab.com",
                  },
                  {
                    name: "Vanguard",
                    note: "Index pioneer, rock-bottom fees",
                    href: "https://investor.vanguard.com",
                  },
                ].map((b) => (
                  <button
                    key={b.name}
                    onClick={() =>
                      openModal({ title: b.name, desc: b.note, href: b.href })
                    }
                    className="text-left rounded-md border border-white/10 bg-white/5 p-3 hover:border-white/20 transition-colors"
                  >
                    <div className="text-slate-100 font-medium flex items-center gap-1">
                      {b.name}
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{b.note}</div>
                  </button>
                ))}
              </div>

              <Separator className="bg-white/10" />

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md border border-white/10 bg-white/5 p-3">
                  <div className="text-slate-100 font-medium mb-1">
                    Account Types
                  </div>
                  <ul className="text-sm text-slate-300 space-y-1 list-disc pl-5">
                    <li>
                      <b>Brokerage:</b> flexible, taxable.
                    </li>
                    <li>
                      <b>Roth IRA:</b> post-tax in, tax-free out.
                    </li>
                    <li>
                      <b>Traditional IRA:</b> pre-tax in, taxed later.
                    </li>
                    <li>
                      <b>401(k):</b> employer plan — get the <b>match</b>.
                    </li>
                  </ul>
                </div>
                <div className="rounded-md border border-white/10 bg-white/5 p-3">
                  <div className="text-slate-100 font-medium mb-1">
                    Quick Guidance
                  </div>
                  <ol className="text-sm text-slate-300 space-y-1 list-decimal pl-5">
                    <li>Grab the 401(k) match first.</li>
                    <li>Max a Roth IRA if eligible.</li>
                    <li>Then build a taxable ETF core.</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Retirement / Coast-FIRE */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-grid place-items-center rounded-md size-7 bg-white/10 text-slate-100">
                  <Shield className="h-4 w-4" />
                </span>
                <CardTitle className="text-slate-100">
                  Retirement & Coast-FIRE
                </CardTitle>
                <Badge className="ml-auto" variant="secondary">
                  Planner
                </Badge>
              </div>
              <CardDescription className="text-slate-400">
                Estimate FI number and whether you’re on track.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Age now", age, setAge],
                  ["Target retire age", retireAge, setRetireAge],
                  [
                    "Current portfolio ($)",
                    currentPortfolio,
                    setCurrentPortfolio,
                  ],
                  [
                    "Monthly contribution ($)",
                    monthlyContrib,
                    setMonthlyContrib,
                  ],
                  [
                    "Monthly expenses in retirement ($)",
                    expMonthly,
                    setExpMonthly,
                  ],
                  ["Safe withdrawal rate (%)", swr, setSWR],
                  ["Expected return pre-ret (%)", retReturn, setRetReturn],
                ].map(([label, val, set]: any) => (
                  <LabeledInput key={label} label={label}>
                    <input
                      type="number"
                      className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-slate-100 outline-none"
                      value={val}
                      onChange={(e) => set(parseFloat(e.target.value || "0"))}
                    />
                  </LabeledInput>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <StatBox
                  label="FI Number"
                  value={`$${fmtMoney(FInumber, 0)}`}
                />
                <StatBox
                  label="Coast-FIRE Needed Today"
                  value={`$${fmtMoney(coastNeededNow, 0)}`}
                />
                <StatBox
                  label="Projected at Retirement"
                  value={`$${fmtMoney(projAtRetire, 0)}`}
                />
              </div>

              <div className="text-sm">
                {onTrack ? (
                  <div className="text-emerald-300">
                    ✅ On track: projection meets or exceeds FI by age{" "}
                    {retireAge}.
                  </div>
                ) : (
                  <div className="text-rose-300">
                    ⚠️ Short: raise contributions, extend timeline, or adjust
                    assumptions.
                  </div>
                )}
                <div
                  className={coastMet ? "text-emerald-300" : "text-slate-300"}
                >
                  🌊{" "}
                  {coastMet
                    ? "You’ve met Coast-FIRE: compounding alone should reach FI."
                    : "Not at Coast-FIRE yet: the shown lump sum today would coast to FI."}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer CTA */}
        <section className="max-w-6xl mx-auto mt-10">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Need a walkthrough?
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Ask the built-in tutor anything about DCA, IRAs, risk, or this
                  dashboard.
                </p>
              </div>
              <Button
                className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("invested:open-chat"))
                }
                aria-label="Open InvestEd chat"
              >
                <Gauge className="mr-2 h-4 w-4" />
                Open the Chat (bottom-right)
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Chat Dock (unchanged behavior except event listener) */}
      <ChatDock />

      {/* Global Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-[#0e1a2a] text-slate-200 border-white/10 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">{modal?.title}</DialogTitle>
            {modal?.desc && (
              <DialogDescription className="text-slate-400">
                {modal.desc}
              </DialogDescription>
            )}
          </DialogHeader>
          {modal?.href ? (
            <div className="mt-3">
              <a
                href={modal.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200 underline"
              >
                Visit website <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          ) : null}
          <DialogFooter>
            <Button
              onClick={() => setModalOpen(false)}
              variant="secondary"
              className="ml-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ===========================
   Small UI helpers
   =========================== */
function LabeledInput({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="text-sm">
      <div className="mb-1 text-slate-300">{label}</div>
      {children}
    </label>
  );
}
function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/5 p-3 overflow-hidden">
      <div className="text-xs text-slate-400 whitespace-nowrap">{label}</div>
      <div className="text-lg font-semibold text-slate-100 whitespace-nowrap overflow-hidden text-ellipsis">
        {value}
      </div>
    </div>
  );
}

/* Clickable InfoCard */
function InfoCard({
  icon,
  title,
  description,
  bullets,
  badge,
  onBulletClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  bullets: readonly { label: string; detail?: string }[];
  badge?: string;
  onBulletClick?: (b: { label: string; detail?: string }) => void;
}) {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="inline-grid place-items-center rounded-md size-7 bg-white/10 text-slate-100">
            {icon}
          </span>
          <CardTitle className="text-slate-100">{title}</CardTitle>
          {badge && (
            <Badge className="ml-auto" variant="secondary">
              {badge}
            </Badge>
          )}
        </div>
        <CardDescription className="text-slate-400">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {bullets.map((b) => (
          <button
            key={b.label}
            onClick={() => onBulletClick?.(b)}
            className="text-left rounded-md border border-white/10 bg-white/5 p-2 text-sm text-slate-300 hover:border-white/20 transition-colors"
          >
            {b.label}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

/* ===========================
   Chat Dock — now listens for "invested:open-chat"
   =========================== */
function ChatDock() {
  type Msg = { role: "user" | "assistant"; content: string };
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm InvestEd's tutor. Ask about compounding, DCA, IRAs/401(k)s, fees, or this dashboard.",
    },
  ]);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // NEW: Open-on-event so any CTA can trigger this exact dock
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("invested:open-chat", onOpen);
    return () => window.removeEventListener("invested:open-chat", onOpen);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => textareaRef.current?.focus(), 0);
  }, [open]);

  async function fetchJSON(url: string, init: RequestInit, ms = 20000) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    try {
      const res = await fetch(url, { ...init, signal: ctrl.signal });
      let json: any = null;
      try {
        json = await res.json();
      } catch {}
      return { ok: res.ok, status: res.status, json };
    } finally {
      clearTimeout(t);
    }
  }
  function normalizeReply(json: any): string | null {
    if (!json) return null;
    if (typeof json.reply === "string") return json.reply;
    if (typeof json.text === "string") return json.text;
    if (Array.isArray(json.output) && typeof json.output[0] === "string")
      return json.output[0];
    if (typeof json.message === "string") return json.message;
    if (typeof json.answer === "string") return json.answer;
    return null;
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setLoading(true);
    try {
      const { ok, status, json } = await fetchJSON("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!ok) {
        let friendly =
          (json && (json.error || json.message)) ||
          (status === 405
            ? "The chat route isn’t exporting a POST handler. Make sure app/api/ai-chat/route.ts exports `export async function POST(...)`."
            : status === 500
            ? "Server error. If you’re using Gemini, confirm GEMINI_API_KEY is set in .env.local and the dev server was restarted."
            : `Request failed (HTTP ${status}).`);
        setMessages((m) => [...m, { role: "assistant", content: friendly }]);
        return;
      }
      const reply = normalizeReply(json) ?? "No response";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e: any) {
      const abort = e?.name === "AbortError";
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: abort
            ? "The request timed out. Try again."
            : "I'm having trouble connecting right now. If you’re using Gemini, make sure GEMINI_API_KEY is set in .env.local and restart the dev server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }
  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open ? (
        <Button
          onClick={() => setOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-emerald-500 text-black font-semibold shadow-xl"
        >
          Ask InvestEd
        </Button>
      ) : (
        <div className="w-[448px] max-w-[90vw] rounded-2xl border border-white/10 bg-[#0e1a2a] text-slate-200 shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="font-semibold text-white">InvestEd Chat</div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          </div>
          <div className="max-h-[50vh] overflow-y-auto px-4 py-3 space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "text-right" : "text-left"}
              >
                <div
                  className={
                    "inline-block rounded-xl px-3 py-2 max-w-[80%] break-words " +
                    (m.role === "user"
                      ? "bg-emerald-400/20 text-emerald-100"
                      : "bg-white/10 text-slate-100")
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-slate-400">Thinking…</div>}
          </div>
          <div className="px-3 pb-3 pt-2 border-t border-white/10">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              rows={2}
              placeholder="Ask about DCA, IRAs, compounding, fees…"
              className="w-full resize-none rounded-lg bg-white/10 text-white p-2 outline-none border-0"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-slate-400">
                Powered by Gemini AI
              </span>
              <Button
                onClick={send}
                disabled={loading}
                className="bg-emerald-400 text-black font-semibold"
              >
                {loading ? "Sending…" : "Send"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
