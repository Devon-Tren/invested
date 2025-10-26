"use client";
import React from "react";
import { motion } from "framer-motion";
import { useStatsStore } from "@/lib/store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TopNav } from "@/components/ui/top-nav";

type Bucket = "Needs" | "Wants" | "Savings";

function formatCurrency(n: number) {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

/* ---------------- Donut (high-contrast) ---------------- */
function DonutChart({
  segments,
  size = 220,
}: {
  segments: { color: string; value: number; label?: string }[];
  size?: number;
}) {
  const total = Math.max(
    segments.reduce((s, seg) => s + seg.value, 0),
    1
  );
  let cumulative = 0;
  const radius = size / 2;
  const thickness = Math.floor(size / 6);
  const r = radius - thickness / 2;

  const track = (
    <circle
      cx={radius}
      cy={radius}
      r={r}
      stroke="rgba(148,163,184,0.18)"
      strokeWidth={thickness}
      fill="none"
      strokeLinecap="round"
    />
  );

  const paths = segments.map((seg, i) => {
    const start = (cumulative / total) * Math.PI * 2 - Math.PI / 2;
    cumulative += seg.value;
    const end = (cumulative / total) * Math.PI * 2 - Math.PI / 2;
    const large = end - start > Math.PI ? 1 : 0;
    const x1 = radius + Math.cos(start) * r;
    const y1 = radius + Math.sin(start) * r;
    const x2 = radius + Math.cos(end) * r;
    const y2 = radius + Math.sin(end) * r;
    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;

    return (
      <path
        key={i}
        d={d}
        stroke={seg.color}
        strokeWidth={thickness}
        fill="none"
        strokeLinecap="round"
      />
    );
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {track}
      {paths}
    </svg>
  );
}

/* ======================== Page ======================== */
export default function Budget() {
  const stats = useStatsStore((s) => s.stats);
  const setStatsUploaded = useStatsStore((s) => s.setStatsUploaded);

  const income = stats?.income ?? 0;

  // 50/30/20 targets
  const targets = React.useMemo(
    () => ({
      Needs: income * 0.5,
      Wants: income * 0.3,
      Savings: income * 0.2,
    }),
    [income]
  );

  // defaults
  const initialItems = React.useMemo(() => {
    if (income === 0) return [];
    return [
      {
        id: "housing",
        name: "Housing",
        bucket: "Needs" as Bucket,
        amount: Math.round(income * 0.3),
      },
      {
        id: "food",
        name: "Food",
        bucket: "Needs" as Bucket,
        amount: Math.round(income * 0.1),
      },
      {
        id: "transport",
        name: "Transport",
        bucket: "Needs" as Bucket,
        amount: Math.round(income * 0.05),
      },
      {
        id: "utilities",
        name: "Utilities",
        bucket: "Needs" as Bucket,
        amount: Math.round(income * 0.05),
      },
      {
        id: "entertainment",
        name: "Entertainment",
        bucket: "Wants" as Bucket,
        amount: Math.round(income * 0.15),
      },
      {
        id: "subscriptions",
        name: "Subscriptions",
        bucket: "Wants" as Bucket,
        amount: Math.round(income * 0.05),
      },
      {
        id: "shopping",
        name: "Shopping",
        bucket: "Wants" as Bucket,
        amount: Math.round(income * 0.1),
      },
      {
        id: "emergency",
        name: "Emergency savings",
        bucket: "Savings" as Bucket,
        amount: Math.round(income * 0.15),
      },
      {
        id: "investing",
        name: "Investing",
        bucket: "Savings" as Bucket,
        amount: Math.round(income * 0.05),
      },
    ];
  }, [income]);

  const [items, setItems] = React.useState(() => initialItems);

  React.useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  function updateItem(
    id: string,
    patch: Partial<{ name: string; amount: number; bucket: Bucket }>
  ) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch } : it))
    );
  }

  function addItem(name: string, amount: number, bucket: Bucket) {
    const id = `${name}-${Date.now()}`.replace(/\s+/g, "-").toLowerCase();
    setItems((p) => [...p, { id, name, amount: Math.round(amount), bucket }]);
  }

  function removeItem(id: string) {
    setItems((p) => p.filter((it) => it.id !== id));
  }

  const totals = React.useMemo(() => {
    const t = { Needs: 0, Wants: 0, Savings: 0 } as Record<Bucket, number>;
    items.forEach((it) => {
      t[it.bucket] = (t[it.bucket] || 0) + (Number(it.amount) || 0);
    });
    return t;
  }, [items]);

  // status: ONLY ok or over
  const isOver = (b: Bucket) => totals[b] > targets[b] + 1e-6;

  const overages = (["Needs", "Wants", "Savings"] as Bucket[])
    .map((b) => ({ b, over: totals[b] - targets[b] }))
    .filter(({ over }) => over > 0);

  function handleSave() {
    const expenses = (totals.Needs || 0) + (totals.Wants || 0);
    const savings = totals.Savings || 0;
    setStatsUploaded({
      ...stats,
      income,
      expenses,
      savings,
    });
    alert("Budget saved — totals updated in your profile.");
  }

  // donut
  const segments = [
    { color: "#10b981", value: totals.Savings, label: "Savings" },
    { color: "#3b82f6", value: totals.Needs, label: "Needs" },
    { color: "#f97316", value: totals.Wants, label: "Wants" },
  ];

  // add form
  const [newName, setNewName] = React.useState("");
  const [newAmount, setNewAmount] = React.useState("");
  const [newBucket, setNewBucket] = React.useState<Bucket>("Needs");

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(34,197,94,0.10),transparent),radial-gradient(800px_400px_at_-10%_10%,rgba(56,189,248,0.10),transparent)] text-slate-200">
      <TopNav />
      <div className="h-5" />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3 px-6 pb-10"
      >
        {/* ===== Left: Planner ===== */}
        <div className="pt-10 md:col-span-2">
          <Card className="rounded-2xl bg-slate-900/80 border-slate-800/70 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Budget Planner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-sm text-slate-300">
                This page builds a standard 50/30/20 budget from the income in
                your profile. Edit line items below or add new ones to match
                reality. When you save, totals (expenses & savings) will be
                updated in your profile.
              </p>

              {/* Targets + Income */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-slate-800/60 p-3">
                  <div className="text-xs text-slate-400">Income</div>
                  <div className="text-3xl font-semibold mt-1 text-white">
                    {formatCurrency(income)}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-800/60 p-3">
                  <div className="text-xs text-slate-400">
                    Targets (50/30/20)
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 text-sm">
                    <Chip
                      label={`Needs: ${formatCurrency(targets.Needs)}`}
                      over={isOver("Needs")}
                      base="blue"
                    />
                    <Chip
                      label={`Wants: ${formatCurrency(targets.Wants)}`}
                      over={isOver("Wants")}
                      base="orange"
                    />
                    <Chip
                      label={`Savings: ${formatCurrency(targets.Savings)}`}
                      over={isOver("Savings")}
                      base="emerald"
                    />
                  </div>
                </div>
              </div>

              {/* Warning banner only when over */}
              {overages.length > 0 && (
                <WarningBanner
                  messages={overages.map(
                    ({ b, over }) =>
                      `${b} is ${formatCurrency(
                        Math.ceil(over)
                      )} over its target. Try readjusting your budget.`
                  )}
                />
              )}

              {/* Line items */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">
                  Line items
                </h4>
                <div className="space-y-2">
                  {items.map((it) => (
                    <div
                      key={it.id}
                      className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-800/60 p-2"
                    >
                      <div className="w-40 text-sm text-slate-200">
                        {it.name}
                      </div>

                      <select
                        value={it.bucket}
                        onChange={(e) =>
                          updateItem(it.id, {
                            bucket: e.target.value as Bucket,
                          })
                        }
                        className="rounded-md border border-slate-700 bg-slate-900/80 px-2 py-1 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option className="bg-slate-900">Needs</option>
                        <option className="bg-slate-900">Wants</option>
                        <option className="bg-slate-900">Savings</option>
                      </select>

                      <Input
                        className="ml-auto w-36 text-right bg-slate-900/80 text-slate-100 border-slate-700 focus-visible:ring-2 focus-visible:ring-emerald-500"
                        value={String(it.amount)}
                        onChange={(e) =>
                          updateItem(it.id, {
                            amount: Number(e.target.value || 0),
                          })
                        }
                      />
                      <Button
                        variant="ghost"
                        className="text-slate-300 hover:bg-white/10"
                        onClick={() => removeItem(it.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add item */}
              <div className="pt-4 border-t border-white/10">
                <h5 className="text-sm font-semibold text-white">Add item</h5>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Input
                    placeholder="Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="bg-slate-900/80 text-slate-100 placeholder:text-slate-500 border-slate-700 focus-visible:ring-2 focus-visible:ring-emerald-500"
                  />
                  <Input
                    placeholder="Amount"
                    inputMode="numeric"
                    value={newAmount}
                    onChange={(e) =>
                      setNewAmount(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    className="bg-slate-900/80 text-slate-100 placeholder:text-slate-500 border-slate-700 focus-visible:ring-2 focus-visible:ring-emerald-500"
                  />
                  <select
                    value={newBucket}
                    onChange={(e) => setNewBucket(e.target.value as Bucket)}
                    className="rounded-md border border-slate-700 bg-slate-900/80 px-2 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option className="bg-slate-900">Needs</option>
                    <option className="bg-slate-900">Wants</option>
                    <option className="bg-slate-900">Savings</option>
                  </select>
                  <Button
                    onClick={() => {
                      if (!newName || !newAmount)
                        return alert("Provide name and amount");
                      addItem(newName, Number(newAmount), newBucket);
                      setNewName("");
                      setNewAmount("");
                    }}
                    className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <div className="flex w-full items-center justify-between">
                <div className="text-sm text-slate-300">
                  Totals — Needs: {formatCurrency(totals.Needs)} • Wants:{" "}
                  {formatCurrency(totals.Wants)} • Savings:{" "}
                  {formatCurrency(totals.Savings)}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-slate-100 text-slate-900 hover:bg-white"
                    onClick={() => {
                      setItems(initialItems);
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white"
                  >
                    Save Budget
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* ===== Right: Overview ===== */}
        <div className="pt-10">
          <Card className="rounded-2xl bg-slate-900/80 border-slate-800/70 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-4">
                <DonutChart segments={segments} size={220} />
              </div>

              <div className="space-y-2 text-sm">
                <Row
                  label="Needs"
                  value={`${formatCurrency(totals.Needs)} / ${formatCurrency(
                    targets.Needs
                  )}`}
                  dotClass="bg-blue-500"
                  over={isOver("Needs")}
                />
                <Row
                  label="Wants"
                  value={`${formatCurrency(totals.Wants)} / ${formatCurrency(
                    targets.Wants
                  )}`}
                  dotClass="bg-orange-500"
                  over={isOver("Wants")}
                />
                <Row
                  label="Savings"
                  value={`${formatCurrency(totals.Savings)} / ${formatCurrency(
                    targets.Savings
                  )}`}
                  dotClass="bg-emerald-500"
                  over={isOver("Savings")}
                />
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-slate-400">
                Tip: Tweak line items to better match real spending. Saving the
                budget updates your profile totals.
              </div>
            </CardFooter>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------------- UI bits ---------------- */
function WarningBanner({ messages }: { messages: string[] }) {
  return (
    <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 text-rose-200 p-3 text-sm">
      <div className="font-semibold mb-1">Over budget</div>
      <ul className="list-disc pl-5 space-y-1">
        {messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    </div>
  );
}

/** Neutral chip; turns red only when over */
function Chip({
  label,
  over,
  base,
}: {
  label: string;
  over: boolean;
  base: "blue" | "orange" | "emerald";
}) {
  const baseText =
    base === "blue"
      ? "text-blue-200"
      : base === "orange"
      ? "text-orange-200"
      : "text-emerald-200";

  const neutral = `bg-white/10 border-white/10 ${baseText}`;
  const danger = "bg-rose-500/15 border-rose-400/30 text-rose-200";

  return (
    <span
      className={`rounded-md px-2 py-1 text-xs font-medium border ${
        over ? danger : neutral
      }`}
    >
      {label}
    </span>
  );
}

/** Neutral row; turns red only when over */
function Row({
  label,
  value,
  dotClass,
  over,
}: {
  label: string;
  value: string;
  dotClass: string;
  over: boolean;
}) {
  const border = over ? "border-rose-400/30" : "border-white/10";
  const bg = over ? "bg-rose-500/10" : "bg-slate-800/60";

  return (
    <div
      className={`flex items-center justify-between rounded-md border ${border} ${bg} px-3 py-2`}
    >
      <div className="flex items-center gap-2 text-slate-200">
        <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
        {label}
      </div>
      <div className="text-slate-100">{value}</div>
    </div>
  );
}
