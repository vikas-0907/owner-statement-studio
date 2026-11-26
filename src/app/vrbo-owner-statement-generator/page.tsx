import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VRBO Owner Statement Generator - Turn Payout CSVs into PDFs | Owner Statement Studio",
  description:
    "Create branded monthly vacation rental owner statements from VRBO, Airbnb, or direct booking spreadsheets. Custom logo, commission splits, and clean PDF export.",
};

export default function VrboGeneratorPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        <nav className="flex items-center justify-between text-xs">
          <Link href="/" className="font-bold text-slate-900 hover:text-emerald-700">
            Owner Statement Studio
          </Link>
          <Link href="/" className="bg-emerald-600 text-white font-semibold px-3.5 py-2 rounded-lg hover:bg-emerald-700">
            Launch Generator &rarr;
          </Link>
        </nav>

        <header className="space-y-4">
          <span className="inline-block text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            Built for 3-30 Unit Boutique Managers
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            VRBO &amp; Vacation Rental Owner Statement Generator
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Managing 3 to 30 vacation rentals across VRBO and Airbnb shouldn&apos;t require a $300/month enterprise PMS just to send clean monthly owner payouts. Map any VRBO payout CSV, apply your management commission percentage, and export a custom-branded PDF in seconds.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-block bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-3 rounded-lg"
            >
              Build Your VRBO Owner Report &rarr;
            </Link>
          </div>
        </header>

        <section className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Why Boutique Co-Hosts Switch from Manual Spreadsheets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700">
            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-900">Flexible Column Mapping</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                VRBO payment reports use different headers than Airbnb. Our interactive mapper lets you assign Gross Payout, Cleaning, Host Fees, and Nights in two clicks.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-900">Custom Agency Branding</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload your property management logo, pick your brand hex color, and format payouts in USD, GBP, EUR, AUD, CAD, or INR.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-900">Pre-Split Cleaning Pass-Through</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Toggle whether cleaning fees pass directly to your cleaning crew before calculating your co-host management commission.
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-900">Pay Per Report or Go Unlimited</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Start with a free watermarked preview, unlock a single report for $9, or run unlimited doors for $29/month.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
