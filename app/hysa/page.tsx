"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { PiggyBank, Star, ExternalLink, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TopNav } from "@/components/ui/top-nav";

/* ---------- Inline HYSA Data ---------- */
type HYSA = {
  id: string;
  bank: string;
  product: string;
  apy: number;
  minDeposit: number;
  monthlyFee: number;
  instantTransfers: boolean;
  notes: string;
  url: string;
};

const HYSA_DATA: HYSA[] = [
  { id: "axos-one", bank: "Axos Bank", product: "ONE Savings", apy: 0.0451, minDeposit: 0, monthlyFee: 0, instantTransfers: true, notes: "Top APY with no monthly fee and no minimum.", url: "https://www.axosbank.com/" },
  { id: "sofi-savings", bank: "SoFi", product: "Savings", apy: 0.045, minDeposit: 0, monthlyFee: 0, instantTransfers: true, notes: "High APY and simple app experience.", url: "https://www.sofi.com/" },
  { id: "wealthfront-cash", bank: "Wealthfront", product: "Cash Account", apy: 0.04, minDeposit: 0, monthlyFee: 0, instantTransfers: true, notes: "Great UX, no minimum deposit.", url: "https://www.wealthfront.com/" },
  { id: "lendingclub-hysa", bank: "LendingClub", product: "High Yield Savings", apy: 0.042, minDeposit: 100, monthlyFee: 0, instantTransfers: true, notes: "Good rate with a small minimum deposit.", url: "https://www.lendingclub.com/" },
  { id: "ally-online", bank: "Ally", product: "Online Savings", apy: 0.0435, minDeposit: 0, monthlyFee: 0, instantTransfers: true, notes: "Trusted all-rounder with buckets and tools.", url: "https://www.ally.com/" },
  { id: "salliemae-hysa", bank: "Sallie Mae", product: "High Yield Savings", apy: 0.039, minDeposit: 0, monthlyFee: 0, instantTransfers: true, notes: "Solid APY and easy account opening.", url: "https://www.salliemae.com/" },
  { id: "discover-online", bank: "Discover", product: "Online Savings", apy: 0.0385, minDeposit: 0, monthlyFee: 0, instantTransfers: true, notes: "Strong service and no fees.", url: "https://www.discover.com/online-banking/savings/" },
  { id: "synchrony-hysa", bank: "Synchrony", product: "High Yield Savings", apy: 0.038, minDeposit: 0, monthlyFee: 0, instantTransfers: true, notes: "Decent rate with simple setup.", url: "https://www.synchronybank.com/banking/high-yield-savings/" },
  { id: "pnc-hysa", bank: "PNC Bank", product: "High Yield Savings", apy: 0.0395, minDeposit: 0, monthlyFee: 0, instantTransfers: false, notes: "Traditional bank option; fewer perks.", url: "https://www.pnc.com/" },
  { id: "usbank-smartly", bank: "U.S. Bank", product: "Smartly Savings", apy: 0.004, minDeposit: 100, monthlyFee: 10, instantTransfers: false, notes: "Low APY and possible monthly fee.", url: "https://www.usbank.com/" },
  { id: "chime-savings", bank: "Chime", product: "Savings", apy: 0.0125, minDeposit: 0, monthlyFee: 0, instantTransfers: true, notes: "Very low APY compared to top HYSAs.", url: "https://www.chime.com/" },
  { id: "boa-regular", bank: "Bank of America", product: "Regular Savings", apy: 0.0001, minDeposit: 100, monthlyFee: 8, instantTransfers: false, notes: "Low APY and monthly fee—what to avoid.", url: "https://www.bankofamerica.com/" },
];

/* ---------- Main Component ---------- */
export default function HysaPage() {
  const [selected, setSelected] = useState<HYSA | null>(null);
  const ranked = useMemo(() => rankHysas(HYSA_DATA), []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(34,197,94,0.10),transparent),radial-gradient(800px_400px_at_-10%_10%,rgba(56,189,248,0.10),transparent)]">
      <TopNav />
      <div className="h-6" />

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 pb-2 text-3xl font-extrabold tracking-tight text-slate-100">
            <PiggyBank className="mr-3 h-6 w-6" />
            Smart HYSA Finder
          </div>
          <p className="text-slate-300 max-w-3xl">
            A High-Yield Savings Account can earn many times more interest than a regular savings account.
            Use it for your emergency fund and short-term goals where safety and quick access matter.
          </p>
        </motion.header>

        {/* Info Box: What is a HYSA?  —— moved INSIDE the component */}
        <section className="mx-auto mt-6">
          <Card className="bg-slate-900/50 border-white/10">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                  <PiggyBank className="h-4 w-4" />
                </span>
                <CardTitle className="text-xl">What is a HYSA?</CardTitle>
              </div>
              <p className="mt-2 text-sm text-slate-300">
                <span className="font-semibold">HYSA</span> ={" "}
                <span className="font-semibold">High-Yield Savings Account</span>. It’s a
                savings account with a much higher interest rate (what your money earns). While regular savings might pay about{" "}
                <span className="font-semibold">0.01%</span> APY, many HYSAs pay{" "}
                <span className="font-semibold">4%+</span> APY. Great for emergency funds and near-term goals.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Why it matters */}
              <div>
                <h3 className="text-sm font-semibold text-slate-200">Why it matters</h3>
                <ul className="mt-2 grid gap-2 text-sm text-slate-300 md:grid-cols-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                    Earns way more interest than a regular savings account.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                    Money stays safe and easy to access when you need it.
                  </li>
                </ul>
                <div className="mt-3 rounded-lg border border-white/10 bg-slate-950/50 p-3 text-xs text-slate-300">
                  Example: $2,000 at 0.01% ≈ <span className="font-medium">$0.20</span>/yr.  
                  At 4.25% ≈ <span className="font-medium">$85</span>/yr (before taxes).
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* APY + How to open */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">What does APY mean?</h3>
                  <p className="mt-2 text-sm text-slate-300">
                    <span className="font-semibold">APY</span> = Annual Percentage Yield, the total interest you’ll earn in a year
                    including compounding. Higher APY means more earnings. If the APY changes, your future earnings change too.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">How to open (quick)</h3>
                  <ol className="mt-2 space-y-2 text-sm text-slate-300 list-decimal list-inside">
                    <li>Pick a bank below and click <span className="font-medium">Sign up</span>.</li>
                    <li>Verify identity (SSN/ITIN) and link your checking account.</li>
                    <li>Transfer your first deposit (many have $0 minimums).</li>
                  </ol>
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* What to look for */}
              <div>
                <h3 className="text-sm font-semibold text-slate-200">What to look for</h3>
                <div className="mt-2 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                      <span className="font-medium">High APY</span> (compare badges on each card).
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                      <span className="font-medium">No monthly fees</span> and low/no minimum deposits.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                      <span className="font-medium">Fast transfers</span> back to checking.
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                      <span className="font-medium">FDIC/NCUA insurance</span>up to legal limits.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                      Good app/website UX and clear terms (beware promo APYs that drop later).
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Ranked list */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="space-y-4 mt-8"
        >
          <h2 className="text-xl font-semibold">Best accounts (ranked)</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {ranked.map(({ row, stars }) => (
              <HysaCard key={row.id} row={row} stars={stars} onSelect={() => setSelected(row)} />
            ))}
          </div>
        </motion.section>
      </div>

      {selected && <DetailsModal row={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

/* ---------- Ranking ---------- */
function rankHysas(items: HYSA[]) {
  if (!items.length) return [];
  const maxApy = items.reduce((m, r) => Math.max(m, r.apy), 0);
  return items
    .map((r) => {
      const apyScore = r.apy / maxApy;
      const feeScore = clamp01(1 - r.monthlyFee / 10);
      const minScore = clamp01(1 - r.minDeposit / 1000);
      const instantBonus = r.instantTransfers ? 0.1 : 0;
      const weighted = 0.6 * apyScore + 0.25 * feeScore + 0.15 * minScore + instantBonus;
      const score = clamp01(weighted);
      const stars = Math.round(score * 5);
      return { row: r, stars, score };
    })
    .sort((a, b) => (b.score === a.score ? b.row.apy - a.row.apy : b.score - a.score));
}

/* ---------- Card ---------- */
function HysaCard({
  row,
  stars,
  onSelect,
}: {
  row: HYSA;
  stars: number;
  onSelect: () => void;
}) {
  const apyPct = (row.apy * 100).toFixed(2);
  return (
    <Card className="bg-white/5 border-white/10 hover:border-white/20 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="bg-emerald-600/80">APY {apyPct}%</Badge>
          {row.monthlyFee === 0 && <Badge variant="secondary">No fee</Badge>}
          {row.minDeposit === 0 && <Badge variant="secondary">No minimum</Badge>}
          {row.instantTransfers && <Badge variant="secondary">Instant</Badge>}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-white">{row.bank}</CardTitle>
            <CardDescription className="text-slate-300">{row.product}</CardDescription>
          </div>
          <StarBar value={stars} />
        </div>
      </CardHeader>
      <CardFooter className="flex items-center justify-between">
        <Button variant="secondary" onClick={onSelect}>See details</Button>
        <Button asChild>
          <a href={row.url} target="_blank" rel="noreferrer" className="inline-flex items-center">
            Sign up <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

/* ---------- Modal ---------- */
function DetailsModal({ row, onClose }: { row: HYSA; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 max-w-lg w-[90%] border border-white/10 shadow-xl relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-bold mb-2">{row.bank}</h2>
        <p className="text-slate-200 mb-4">{row.product}</p>
        <Separator className="my-2 bg-white/10" />
        <div className="space-y-2 text-sm">
          <p><span className="text-slate-400">APY:</span> {(row.apy * 100).toFixed(2)}%</p>
          <p><span className="text-slate-400">Monthly Fee:</span> ${row.monthlyFee}</p>
          <p><span className="text-slate-400">Minimum Deposit:</span> ${row.minDeposit}</p>
          <p><span className="text-slate-400">Transfers:</span> {row.instantTransfers ? "Instant" : "Standard"}</p>
          <p><span className="text-slate-400">Why ranked:</span> {row.notes}</p>
        </div>
        <div className="mt-4 text-right">
          <Button asChild>
            <a href={row.url} target="_blank" rel="noreferrer" className="inline-flex items-center">
              Go to signup <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Stars ---------- */
function StarBar({ value }: { value: number }) {
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${i < value ? "text-yellow-400 fill-yellow-400" : "text-slate-600"}`}
        />
      ))}
    </div>
  );
}

/* ---------- Helpers ---------- */
function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}
