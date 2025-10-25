"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // replace with your own cn util if different
import { Home, BarChart3, GraduationCap, Banknote, Link2 } from "lucide-react";
import * as React from "react";

type NavLink = {
  href: string;
  label: string;
  icon?: React.ReactNode;
};

type TopNavProps = {
  links?: NavLink[];
  rightSlot?: React.ReactNode; // e.g., profile/menu/CTA
};

const defaultLinks: NavLink[] = [
  { href: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
  {
    href: "/analytics",
    label: "Analytics",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    href: "/education",
    label: "Education",
    icon: <GraduationCap className="h-4 w-4" />,
  },
  {
    href: "/hysa",
    label: "HYSA Finder",
    icon: <Banknote className="h-4 w-4" />,
  },
  {
    href: "/link",
    label: "Link Your Stats",
    icon: <Link2 className="h-4 w-4" />,
  },
];

export function TopNav({ links = defaultLinks, rightSlot }: TopNavProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/70 backdrop-blur supports-[backdrop-filter]:bg-slate-950/50">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-70 px-4">
        {/* Brand (replace with your logo) */}
        <Link
          href="/"
          className="mr-1 select-none text-lg font-semibold tracking-tight text-slate-100"
        >
          InvestEd
        </Link>

        {/* Links (borderless) */}
        <nav className="flex min-w-0 flex-1 overflow-x-auto">
          <ul className="flex items-center gap-1.5">
            {links.map(({ href, label, icon }) => {
              const active =
                href === "/"
                  ? pathname === "/"
                  : pathname === href || pathname.startsWith(href + "/");

              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-300",
                      "transition-colors hover:text-slate-100 hover:bg-slate-800/40",
                      active && "text-slate-100 bg-slate-800/60"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {icon}
                    <span className="whitespace-nowrap">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Optional right side slot (e.g., Import button / avatar) */}
        {rightSlot ? <div className="ml-auto">{rightSlot}</div> : null}
      </div>
    </header>
  );
}
