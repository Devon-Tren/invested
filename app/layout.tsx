// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatDockClient from "@/components/chat/ChatDockClient";

// Mount the chat dock client-side only so it persists and avoids SSR mismatches

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Prefer setting this in your env (project settings) for canonical/OG URLs
// e.g. NEXT_PUBLIC_SITE_URL=https://invested.yourdomain.com
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://invested.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "InvestEd",
    template: "InvestEd — %s",
  },
  description:
    "Smart student budgeting & investing: HYSA finder, DCA sims, risk-aware projections, and education hub.",
  applicationName: "InvestEd",
  keywords: [
    "investing",
    "students",
    "budgeting",
    "DCA",
    "ETF",
    "HYSA",
    "personal finance",
  ],
  authors: [{ name: "InvestEd Team" }],
  creator: "InvestEd",
  publisher: "InvestEd",
  openGraph: {
    type: "website",
    url: "/",
    title: "InvestEd",
    description:
      "Smart student budgeting & investing: HYSA finder, DCA sims, risk-aware projections, and education hub.",
    siteName: "InvestEd",
    images: [
      {
        url: "/og.png", // put a 1200x630 image in public/og.png
        width: 1200,
        height: 630,
        alt: "InvestEd — Student Budgeting & Investing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InvestEd",
    description:
      "Smart student budgeting & investing: HYSA finder, DCA sims, risk-aware projections, and education hub.",
    images: ["/og.png"],
    creator: "@yourhandle", // optional
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/site.webmanifest", // optional; add to /public if you have one
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "finance",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#020617" }, // slate-950
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ChatDockClient />
      </body>
    </html>
  );
}
