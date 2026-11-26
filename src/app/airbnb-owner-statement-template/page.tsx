import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Airbnb Owner Statement Template & CSV Generator (2026) | Owner Statement Studio",
  description:
    "Stop formatting Airbnb payouts manually in Excel. Convert your Airbnb transaction CSV into a branded, executive monthly owner statement PDF in 60 seconds.",
};

export default function AirbnbTemplatePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        <nav className="flex items-center justify-between text-xs">
          <Link href="/" className="font-bold text-slate-900 hover:text-emerald-700">
            Owner Statement Studio
          </Link>
          <Link href="/" className="bg-emerald-600 text-white font-semibold px-3.5 py-2 rounded-lg hover:bg-emerald-700">
            Open Statement Generator &rarr;
          </Link>
        </nav>

        <header className="space-y-4">
          <span className="inline-block text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
            2026 Co-Host Edition
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Airbnb Owner Statement Template - Automated from Your CSV
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Static Excel and Google Sheets templates break the moment you add pass-through cleaning fees, maintenance receipts, or Airbnb&apos;s 15.5% host-only service fee. Upload your raw Airbnb payout CSV and generate an executive-ready PDF statement in under 60 seconds.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/"
              className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-3 rounded-lg"
            >
              Generate Your Airbnb Statement Free &rarr;
            </Link>
            <Link
              href="/pricing"
              className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-sm font-semibold px-5 py-3 rounded-lg"
            >
              View Pricing ($9 Single Pass)
            </Link>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
            <h2 className="font-bold text-sm text-slate-900">1. Auto-Maps Airbnb Columns</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automatically detects Guest Name, Check-In Date, Nights, Gross Earnings, Cleaning Fees, and Host Service Fees from standard Airbnb CSV exports.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
            <h2 className="font-bold text-sm text-slate-900">2. 15.5% Host Fee True-Up</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Credits back the 15.5% platform fee deducted on pass-through cleaning fees so property owners never dispute your payout math.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
            <h2 className="font-bold text-sm text-slate-900">3. 100% Browser-Private</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your guest names, property addresses, and payout figures stay locally in your browser. Zero PMS lock-in or monthly data syncing required.
            </p>
          </div>
        </section>

        <section className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">What Every Co-Host Owner Statement Should Include</h2>
          <ul className="space-y-2.5 text-sm text-slate-700 list-disc pl-5">
            <li><strong>Executive KPI Summary:</strong> Gross bookings, platform/cleaning deductions, management commission, and net owner disbursement at a glance.</li>
            <li><strong>Reservation-by-Reservation Ledger:</strong> Transparent breakdown of every stay, check-in date, night count, and channel fee.</li>
            <li><strong>Itemized Maintenance &amp; Reimbursements:</strong> Clear line items for plumber visits, restocks, and smart lock batteries.</li>
            <li><strong>Monthly Operations Note:</strong> Space to highlight 5-star guest reviews, occupancy wins, and preventative maintenance.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
