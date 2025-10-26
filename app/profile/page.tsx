"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStatsStore } from "@/lib/store";
import Link from "next/link";

export default function Profile() {
  const router = useRouter();
  const stats = useStatsStore((s) => s.stats);
  const setStatsUploaded = useStatsStore((s) => s.setStatsUploaded);
  const resetStats = useStatsStore((s) => s.resetStats);

  const [form, setForm] = React.useState({
    name: "",
    income: "",
    expenses: "",
    checking: "",
    savings: "",
    invested: "",
    debt: "",
  });

  React.useEffect(() => {
    if (stats) {
      setForm({
        name: (stats as any).name ?? "",
        income: String((stats as any).income ?? ""),
        expenses: String((stats as any).expenses ?? ""),
        checking: String((stats as any).checking ?? ""),
        savings: String((stats as any).savings ?? ""),
        invested: String((stats as any).invested ?? ""),
        debt: String((stats as any).debt ?? ""),
      });
    }
  }, [stats]);

  function setNumericField(key: keyof typeof form, value: string) {
    // keep only digits
    const cleaned = value.replace(/[^0-9]/g, "");
    setForm((p) => ({ ...p, [key]: cleaned }));
  }

  function handleSave(e?: React.FormEvent) {
    e?.preventDefault();
    setStatsUploaded({
      name: form.name,
      income: Number(form.income) || 0,
      expenses: Number(form.expenses) || 0,
      checking: Number(form.checking) || 0,
      savings: Number(form.savings) || 0,
      invested: Number(form.invested) || 0,
      debt: Number(form.debt) || 0,
    });
    // optionally persist name with stats object (store accepts the same shape)
    // navigate back to home
    router.push("/");
  }

  function handleReset() {
    resetStats();
    setForm({
      name: "",
      income: "",
      expenses: "",
      checking: "",
      savings: "",
      invested: "",
      debt: "",
    });
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <Card className="rounded-2xl border-slate-800/60 bg-slate-900/60">
          <CardHeader>
            <CardTitle>Profile & Financials</CardTitle>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSave}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <div className="md:col-span-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Alex Student"
                  className="mt-2 bg-slate-950/60 text-slate-300"
                />
              </div>

              <Field
                label="Monthly income"
                id="income"
                value={form.income}
                onChange={(v) => setNumericField("income", v)}
              />
              <Field
                label="Monthly expenses"
                id="expenses"
                value={form.expenses}
                onChange={(v) => setNumericField("expenses", v)}
              />
              <Field
                label="Checking balance"
                id="checking"
                value={form.checking}
                onChange={(v) => setNumericField("checking", v)}
              />
              <Field
                label="Savings (HYSA)"
                id="savings"
                value={form.savings}
                onChange={(v) => setNumericField("savings", v)}
              />
              <Field
                label="Invested in market"
                id="invested"
                value={form.invested}
                onChange={(v) => setNumericField("invested", v)}
              />
              <Field
                label="Total debt"
                id="debt"
                value={form.debt}
                onChange={(v) => setNumericField("debt", v)}
              />

              <div className="md:col-span-2 flex items-center justify-between pt-2">
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500"
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-2xl"
                    onClick={handleReset}
                    type="button"
                  >
                    Reset
                  </Button>
                </div>
                <Link
                  href="/"
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 inline-flex items-center justify-center px-4 py-2 text-slate-100"
                >
                  Back Home
                </Link>
              </div>
            </form>
          </CardContent>

          <CardFooter className="p-4">
            <div className="text-xs text-slate-400">
              Changes saved here update your dashboard and will hide the "Link
              Your Stats" call to action.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label htmlFor={id} className="text-slate-200">
        {label}
      </Label>
      <div className="mt-2">
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          inputMode="numeric"
          pattern="[0-9]*"
          className="border-0 bg-slate-950/60 text-white focus-visible:ring-0 placeholder:text-slate-500"
        />
      </div>
    </div>
  );
}
