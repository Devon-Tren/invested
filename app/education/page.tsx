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
import { ExternalLink } from "lucide-react";

import {
  PiggyBank,
  BarChart3,
  Shield,
  GraduationCap,
  Library,
  Zap,
  CreditCard,
  FileText,
  School,
} from "lucide-react";
import { TopNav } from "@/components/ui/top-nav";

export default function EducationPage() {
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(34,197,94,0.10),transparent),radial-gradient(800px_400px_at_-10%_10%,rgba(56,189,248,0.10),transparent)] bg-slate-950 text-slate-100">
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
            <span className="text-slate-100">budgeting</span> &{" "}
            <span className="text-slate-100">investing</span>
          </h1>
          <p className="max-w-2xl text-slate-300">
            Short, context-aware lessons. Start simple, then dive deeper. Click
            any card to expand.
          </p>
        </motion.div>
      </section>

      {/* Content Grid */}
      <section className="mx-auto mt-8 max-w-7xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-2">
          {/* --- Existing Cards --- */}
          <LessonCard
            icon={<PiggyBank className="h-5 w-5" />}
            title="Emergency Fund & HYSA"
            summary="3–6 months of expenses • Keep it in a high-yield savings account"
            bullets={[
              "Why cash beats investing here",
              "Picking a student-friendly HYSA",
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
                    "Use a no-fee HYSA with instant transfers. Keep it separate from spending to avoid temptation.",
                },
              ]}
            />
            <LearnLinks title="Emergency Fund & HYSA" />
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
                    "Dollar-cost averaging means buying on a schedule regardless of price, smoothing volatility and behavior.",
                },
              ]}
            />
            <LearnLinks title="Investing 101: Index Funds & DCA" />
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
            <LearnLinks title="Risk, Volatility & Your Profile" />
          </LessonCard>

          <LessonCard
            icon={<Library className="h-5 w-5" />}
            title="Accounts & Taxes: Brokerage vs Roth IRA"
            summary="Brokerage = flexible, taxable • Roth IRA = tax-free growth later"
            bullets={[
              "Start early if you have earned income",
              "Avoid short-term gains when possible",
            ]}
          >
            <LessonAccordion
              items={[
                {
                  id: "acct-1",
                  title: "When to use a Roth IRA",
                  content:
                    "If you have earned income, contributions grow tax-free and withdrawals in retirement are tax-free.",
                },
                {
                  id: "acct-2",
                  title: "Brokerage basics",
                  content:
                    "Fully taxable but flexible for goals before retirement. Prefer low-fee, broad-market ETFs.",
                },
              ]}
            />
            <LearnLinks title="Accounts & Taxes: Brokerage vs Roth IRA" />
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
            <LearnLinks title="Automation & Habit Building" />
          </LessonCard>

          {/* --- New Cards (Student-practical) --- */}

          <LessonCard
            icon={<CreditCard className="h-5 w-5" />}
            title="Credit & Scores (Student Edition)"
            summary="Build credit early, avoid fees, and monitor your reports"
            bullets={[
              "Utilization < 30% (ideal <10%)",
              "Pay in full + on time",
            ]}
          >
            <LessonAccordion
              items={[
                {
                  id: "cred-1",
                  title: "Start simple",
                  content:
                    "A no-annual-fee student card or secured card used for small recurring bills, paid in full every month, builds history safely.",
                },
                {
                  id: "cred-2",
                  title: "Protect your score",
                  content:
                    "Keep utilization low, avoid late payments, and check your credit reports at least yearly for errors.",
                },
              ]}
            />
            <LearnLinks title="Credit & Scores (Student Edition)" />
          </LessonCard>

          <LessonCard
            icon={<FileText className="h-5 w-5" />}
            title="Paychecks, W-4 & Taxes"
            summary="Understand pay stubs, withholding, and how to avoid big surprises"
            bullets={[
              "Use the IRS Withholding Estimator",
              "Know FICA vs federal/state taxes",
            ]}
          >
            <LessonAccordion
              items={[
                {
                  id: "tax-1",
                  title: "Dial in your W-4",
                  content:
                    "Update your W-4 when jobs change. Proper withholding reduces the chance of a big bill or over-withholding.",
                },
                {
                  id: "tax-2",
                  title: "Read your pay stub",
                  content:
                    "Track gross, net, pre-tax benefits, and FICA. Confirm hours, rate, and deductions are correct.",
                },
              ]}
            />
            <LearnLinks title="Paychecks, W-4 & Taxes" />
          </LessonCard>

          <LessonCard
            icon={<School className="h-5 w-5" />}
            title="Student Loans & Aid"
            summary="Borrow last, not first • Know interest, grace periods, and repayment"
            bullets={[
              "Complete FAFSA early",
              "Use the Loan Simulator before borrowing",
            ]}
          >
            <LessonAccordion
              items={[
                {
                  id: "loan-1",
                  title: "Borrow smart",
                  content:
                    "Prioritize grants/scholarships/work-study. If borrowing, understand subsidized vs unsubsidized, interest accrual, and fees.",
                },
                {
                  id: "loan-2",
                  title: "Repayment options",
                  content:
                    "Know IDR plans, consolidation, and servicer tools. Avoid missed payments that can damage credit.",
                },
              ]}
            />
            <LearnLinks title="Student Loans & Aid" />
          </LessonCard>
        </div>
      </section>
    </div>
  );
}

/** Map lesson titles to 3 high-quality learning links (primary + 2 extras). */
function getLearnLinks(title: string): { url: string; label: string }[] | null {
  const t = title.toLowerCase();

  if (t.includes("emergency") || t.includes("hysa")) {
    return [
      {
        url: "https://www.nerdwallet.com/article/banking/how-much-should-i-have-in-emergency-fund",
        label: "NerdWallet: How large should an emergency fund be?",
      },
      {
        url: "https://www.consumerfinance.gov/consumer-tools/educator-tools/resources-for-older-adults/managing-your-money/building-your-savings/",
        label: "CFPB: Building your savings (emergency funds)",
      },
      {
        url: "https://www.fdic.gov/resources/deposit-insurance/",
        label: "FDIC: Deposit insurance basics",
      },
    ];
  }

  if (t.includes("index") || t.includes("dca") || t.includes("investing")) {
    return [
      {
        url: "https://www.vanguard.com/what-is-index-investing",
        label: "Vanguard: Index investing basics",
      },
      {
        url: "https://www.investor.gov/additional-resources/spotlight/index-funds",
        label: "Investor.gov: What to know about index funds",
      },
      {
        url: "https://www.investor.gov/introduction-investing/investing-basics/how-invest/dollar-cost-averaging",
        label: "Investor.gov: Dollar-cost averaging explained",
      },
    ];
  }

  if (t.includes("risk") || t.includes("volatility")) {
    return [
      {
        url: "https://www.investopedia.com/terms/v/volatility.asp",
        label: "Investopedia: Volatility & risk",
      },
      {
        url: "https://www.investor.gov/introduction-investing/investing-basics/risk-tolerance",
        label: "Investor.gov: Assessing your risk tolerance",
      },
      {
        url: "https://investor.vanguard.com/investor-resources-education/article/market-declines",
        label: "Vanguard: Putting market declines in perspective",
      },
    ];
  }

  if (t.includes("accounts") || t.includes("roth")) {
    return [
      {
        url: "https://www.irs.gov/retirement-plans/roth-iras",
        label: "IRS: Roth IRA basics",
      },
      {
        url: "https://www.irs.gov/publications/p590a",
        label: "IRS Pub 590-A: Roth IRA contributions",
      },
      {
        url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products",
        label: "Investor.gov: Investment accounts & products",
      },
    ];
  }

  if (t.includes("automation") || t.includes("habit")) {
    return [
      {
        url: "https://jamesclear.com/habit",
        label: "James Clear: Habit formation (practical guide)",
      },
      {
        url: "https://www.consumerfinance.gov/consumer-tools/bank-accounts/savings-accounts/",
        label: "CFPB: Automate saving with the right account",
      },
      {
        url: "https://www.consumer.gov/articles/1002-making-budget",
        label: "Consumer.gov: Making a budget (50/30/20 starter)",
      },
    ];
  }

  if (t.includes("credit")) {
    return [
      {
        url: "https://www.consumerfinance.gov/consumer-tools/credit-reports-and-scores/",
        label: "CFPB: Credit reports & scores",
      },
      {
        url: "https://www.annualcreditreport.com/",
        label: "AnnualCreditReport.com: Free reports",
      },
      {
        url: "https://www.myfico.com/credit-education/credit-scores",
        label: "FICO: How credit scores work",
      },
    ];
  }

  if (
    t.includes("w-4") ||
    t.includes("w-4") ||
    t.includes("paycheck") ||
    t.includes("taxes")
  ) {
    return [
      {
        url: "https://www.irs.gov/individuals/tax-withholding-estimator",
        label: "IRS: Tax Withholding Estimator",
      },
      {
        url: "https://www.irs.gov/forms-pubs/about-form-w-4",
        label: "IRS: About Form W-4",
      },
      {
        url: "https://www.investopedia.com/terms/p/pay-stub.asp",
        label: "Investopedia: Understanding your pay stub",
      },
    ];
  }

  if (
    t.includes("student loan") ||
    t.includes("aid") ||
    t.includes("fafta") ||
    t.includes("fafsa")
  ) {
    return [
      {
        url: "https://studentaid.gov/",
        label: "Federal Student Aid: Official site",
      },
      {
        url: "https://studentaid.gov/aid-estimator/",
        label: "FSA: Aid Estimator (FAFSA)",
      },
      {
        url: "https://studentaid.gov/loan-simulator/",
        label: "FSA: Loan Simulator",
      },
    ];
  }

  // Fallback
  return [
    {
      url: "https://www.investopedia.com/",
      label: "Investopedia: Personal finance resources",
    },
    {
      url: "https://www.consumerfinance.gov/",
      label: "CFPB: Money tools & guides",
    },
    {
      url: "https://www.investor.gov/",
      label: "Investor.gov: SEC investor education",
    },
  ];
}

/** Renders a compact list of external links for a lesson (primary + 2 extras). */
function LearnLinks({ title }: { title: string }) {
  const links = getLearnLinks(title);
  if (!links || links.length === 0) return null;

  return (
    <details className="mt-3">
      <summary className="cursor-pointer text-sm text-emerald-200 hover:text-emerald-100">
        Learn more?
      </summary>
      <div className="mt-2 space-y-2">
        {links.map((l) => (
          <div
            key={l.url}
            className="flex items-center gap-2 text-sm text-slate-300"
          >
            <ExternalLink className="h-4 w-4 text-emerald-300" />
            <a
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-300 hover:underline"
            >
              {l.label}
            </a>
          </div>
        ))}
      </div>
    </details>
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
          {/* Link block now rendered by <LearnLinks /> in each card */}
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
