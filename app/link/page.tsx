"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useStatsStore } from "@/lib/store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Link as LinkIcon,
  Wallet,
  PiggyBank,
  BarChart3,
  DollarSign,
  CreditCard,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TopNav } from "@/components/ui/top-nav";

export default function LinkYourStuffPage() {
  const router = useRouter();
  const setStatsUploaded = useStatsStore((state) => state.setStatsUploaded);
  const [formData, setFormData] = React.useState({
    name: "",
    income: "",
    expenses: "",
    checking: "",
    savings: "",
    invested: "",
    debt: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setStatsUploaded({
      income: Number(formData.income),
      expenses: Number(formData.expenses),
      savings: Number(formData.savings),
      invested: Number(formData.invested),
      debt: Number(formData.debt),
    });

    router.push("/analytics");
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(34,197,94,0.10),transparent),radial-gradient(800px_400px_at_-10%_10%,rgba(56,189,248,0.10),transparent)] text-slate-100">
      <TopNav />
      <div className="h-16" />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col gap-4 md:gap-6"
        >
          <div className="flex items-center gap-2 pb-4 text-3xl font-extrabold tracking-tight text-slate-100">
            <LinkIcon className="mr-4 h-6.5 w-6.5" />
            Link Your Stats
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Personalize your advice
          </h1>
          <p className="max-w-2xl text-slate-300">
            Enter a few numbers—income, expenses, savings, investments, and
            debt. We'll use them to tailor your budget and learning journey.
          </p>
        </motion.div>
      </section>

      {/* Form + Preview */}
      <section className="mx-auto mt-8 max-w-7xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-5">
          {/* Left: form */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="md:col-span-3"
          >
            <Card className="rounded-2xl border-slate-800/60 bg-slate-900/60 shadow-[0_0_0_1px_rgba(15,23,42,0.5)] backdrop-blur">
              <CardHeader>
                <CardTitle className="text-slate-300">
                  Tell us about your finances
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Manual-first. You can link accounts later for auto-updates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 gap-5 md:grid-cols-2"
                >
                  <div className="md:col-span-2">
                    <Label className="text-slate-300" htmlFor="name">
                      Full name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Alex Student"
                      className="mt-2 bg-slate-950/60 text-slate-300"
                    />
                  </div>

                  <Field
                    id="income"
                    label="Monthly income"
                    value={formData.income}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, income: value }))
                    }
                    icon={<DollarSign className="h-4 w-4" />}
                    placeholder="2500"
                  />
                  <Field
                    id="expenses"
                    label="Monthly expenses"
                    value={formData.expenses}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, expenses: value }))
                    }
                    icon={<Wallet className="h-4 w-4" />}
                    placeholder="1800"
                  />
                  <Field
                    id="checking"
                    label="Checking balance"
                    value={formData.checking}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, checking: value }))
                    }
                    icon={<Wallet className="h-4 w-4" />}
                    placeholder="1200"
                  />
                  <Field
                    id="savings"
                    label="Savings (HYSA)"
                    value={formData.savings}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, savings: value }))
                    }
                    icon={<PiggyBank className="h-4 w-4" />}
                    placeholder="3000"
                  />
                  <Field
                    id="invested"
                    label="Invested in market"
                    value={formData.invested}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, invested: value }))
                    }
                    icon={<BarChart3 className="h-4 w-4" />}
                    placeholder="4500"
                  />
                  <Field
                    id="debt"
                    label="Total debt"
                    value={formData.debt}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, debt: value }))
                    }
                    icon={<CreditCard className="h-4 w-4" />}
                    placeholder="15000"
                  />

                  <div className="md:col-span-2 flex items-center justify-between pt-2">
                    <p className="text-sm text-slate-400">
                      Values are estimates; update anytime.
                    </p>
                    <Button
                      type="submit"
                      className="cursor-pointer rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 hover:bg-emerald-500"
                    >
                      Save & Continue
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right: placeholder insights */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="md:col-span-2"
          >
            <Card className="rounded-2xl border-slate-800/60 bg-slate-900/60 shadow-[0_0_0_1px_rgba(15,23,42,0.5)] backdrop-blur">
              <CardHeader>
                <CardTitle>Personalized Advice (Preview)</CardTitle>
                <CardDescription className="text-slate-300">
                  This panel will render AI‑generated guidance once the form is
                  submitted.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <SkeletonLine label="Emergency runway" />
                <SkeletonLine label="Suggested monthly split" />
                <SkeletonLine label="Risk band & drawdown comfort" />
                <SkeletonLine label="Debt payoff suggestion" />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  icon,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id} className="text-slate-200">
        {label}
      </Label>
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-800/60 bg-slate-900/60 px-3 focus-within:border-slate-700 transition-colors">
        {icon ? <span className="text-slate-400">{icon}</span> : null}
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
          }}
          className="border-0 bg-transparent focus-visible:ring-0 placeholder:text-slate-500 text-white"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

function SkeletonLine({ label }: { label: string }) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-slate-400">{label}</div>
      <div className="space-y-1">
        <Skeleton className="h-4 w-[60%] bg-slate-800/50" />
        <Skeleton className="h-4 w-[80%] bg-slate-800/50" />
      </div>
    </div>
  );
}
