"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

import {
  PiggyBank,
  BarChart3,
  Shield,
  GraduationCap,
  Library,
  Zap,
} from "lucide-react";
import { TopNav } from "@/components/ui/top-nav";

// If you keep your landing page in a container with max-w-7xl and a dark gradient background,
// this page mirrors that setup.
export default function EducationPage() {
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(34,197,94,0.10),transparent),radial-gradient(800px_400px_at_-10%_10%,rgba(56,189,248,0.10),transparent)] bg-slate-950 text-slate-100">
      {/* Top nav spacer (optional) */}
      <TopNav />
      <div className="h-16" />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-4 md:gap-6"
        >
          <div className="flex items-center gap-2 pb-4 text-3xl font-extrabold tracking-tight text-slate-100">
            <GraduationCap className="mr-4 h-6.5 w-6.5" />
            Education Hub
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Learn the essentials of{" "}
            <span className="text-slate-100">budgeting</span> & {""}
            <span className="text-slate-100">investing</span>
          </h1>
          <p className="max-w-2xl text-slate-300">
            Short, context‑aware lessons. Start simple, then dive deeper. Click
            any card to expand.
          </p>
        </motion.div>
      </section>

      {/* Content Grid */}
      <section className="mx-auto mt-8 max-w-7xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-2">
          <LessonCard
            icon={<PiggyBank className="h-5 w-5" />}
            title="Emergency Fund & HYSA"
            summary="3–6 months of expenses • Keep it in a high‑yield savings account"
            bullets={[
              "Why cash beats investing here",
              "Picking a student‑friendly HYSA",
            ]}
          >
            <LessonAccordion
              items={[
                {
                  id: "ef-1",
                  title: "How big should my fund be?",
                  content:
                    "Aim for 3–6 months of core expenses (rent, food, transport, insurance). Students with parental backup can start at 1–2 months and grow over time.",
                },
                {
                  id: "ef-2",
                  title: "Where to keep it",
                  content:
                    "Use a no‑fee HYSA with instant transfers. Keep it separate from spending to avoid temptation.",
                },
              ]}
            />
          </LessonCard>

          <LessonCard
            icon={<BarChart3 className="h-5 w-5" />}
            title="Investing 101: Index Funds & DCA"
            summary="Own the market via ETFs (e.g., S&P 500) • Invest a fixed amount monthly"
            bullets={["Time in market > timing", "How DCA reduces regret"]}
          >
            <LessonAccordion
              items={[
                {
                  id: "inv-1",
                  title: "Why index funds",
                  content:
                    "They provide instant diversification at low cost. Most active managers underperform after fees.",
                },
                {
                  id: "inv-2",
                  title: "What is DCA?",
                  content:
                    "Dollar‑cost averaging means buying on a schedule regardless of price, smoothing volatility and behavior.",
                },
              ]}
            />
          </LessonCard>

          <LessonCard
            icon={<Shield className="h-5 w-5" />}
            title="Risk, Volatility & Your Profile"
            summary="Know your drawdown tolerance • Longer horizon = more stocks"
            bullets={[
              "Rules prevent panic selling",
              "Volatility bands explained",
            ]}
          >
            <LessonAccordion
              items={[
                {
                  id: "risk-1",
                  title: "Drawdowns happen",
                  content:
                    "Even broad markets can fall 30–50%. Plan contributions and cash buffer so you won't need to sell low.",
                },
                {
                  id: "risk-2",
                  title: "Match risk to horizon",
                  content:
                    "The longer you can leave money invested, the more equity exposure you can usually tolerate.",
                },
              ]}
            />
          </LessonCard>

          <LessonCard
            icon={<Library className="h-5 w-5" />}
            title="Accounts & Taxes: Brokerage vs Roth IRA"
            summary="Brokerage = flexible, taxable • Roth IRA = tax‑free growth later"
            bullets={[
              "Start early if you have earned income",
              "Avoid short‑term gains when possible",
            ]}
          >
            <LessonAccordion
              items={[
                {
                  id: "acct-1",
                  title: "When to use a Roth IRA",
                  content:
                    "If you have earned income, contributions grow tax‑free and withdrawals in retirement are tax‑free.",
                },
                {
                  id: "acct-2",
                  title: "Brokerage basics",
                  content:
                    "Fully taxable but flexible for goals before retirement. Prefer low‑fee, broad‑market ETFs.",
                },
              ]}
            />
          </LessonCard>

          <LessonCard
            icon={<Zap className="h-5 w-5" />}
            title="Automation & Habit Building"
            summary="Pay yourself first • Autopilot contributions & rebalancing"
            bullets={["Reduce friction", "Set & forget with periodic reviews"]}
          >
            <LessonAccordion
              items={[
                {
                  id: "auto-1",
                  title: "Automate the boring stuff",
                  content:
                    "Set recurring transfers on payday to savings and investments. Review quarterly.",
                },
                {
                  id: "auto-2",
                  title: "Simple rules",
                  content:
                    "Use the 50/30/20 framework as a starting point and adjust to your fixed vs. variable costs.",
                },
              ]}
            />
          </LessonCard>
        </div>
      </section>
    </div>
  );
}

function LessonCard({
  icon,
  title,
  summary,
  bullets,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  summary: string;
  bullets: string[];
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35 }}
      className="h-full"
    >
      <Card className="group h-full rounded-2xl border-slate-800/60 bg-slate-900/60 shadow-[0_0_0_1px_rgba(15,23,42,0.5)] backdrop-blur">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-slate-200">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 ">
              {icon}
            </span>
            <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
          </div>
          <CardDescription className="pt-2 text-slate-300">
            {summary}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-none space-y-1 pl-6 text-sm text-slate-300">
            {bullets.map((b) => (
              <li key={b} className="relative">
                <span className="absolute -left-6 top-[0.6em] h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                {b}
              </li>
            ))}
          </ul>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function LessonAccordion({
  items,
}: {
  items: { id: string; title: string; content: string }[];
}) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((it) => (
        <AccordionItem
          key={it.id}
          value={it.id}
          className="border-slate-800/50"
        >
          <AccordionTrigger className="text-left text-slate-200 hover:no-underline">
            {it.title}
          </AccordionTrigger>
          <AccordionContent className="text-slate-300">
            {it.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
