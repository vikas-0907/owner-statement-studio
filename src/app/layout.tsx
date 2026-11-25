import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Owner Statement Studio — Turn Airbnb & VRBO CSVs into Branded Owner PDFs",
  description:
    "Generate executive monthly short-term rental owner statements in 60 seconds. Includes automatic Airbnb 15.5% host-fee true-up, custom branding, and zero spreadsheets.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-100">
        <div className="flex-1">{children}</div>
        <footer className="no-print bg-white border-t border-slate-200 px-6 py-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} Owner Statement Studio. All rights reserved.</p>
            <nav className="flex flex-wrap items-center gap-5">
              <Link href="/pricing" className="hover:text-slate-900">
                Pricing
              </Link>
              <Link href="/terms" className="hover:text-slate-900">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-slate-900">
                Privacy Policy
              </Link>
              <Link href="/refund-policy" className="hover:text-slate-900">
                Refund &amp; Cancellation Policy
              </Link>
              <a
                href="mailto:support@ownerstatementstudio.com"
                className="hover:text-slate-900"
              >
                Contact Support
              </a>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}