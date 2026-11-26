import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Airbnb 15.5% Host Fee Calculator & Cleaning True-Up Guide (2026) | Owner Statement Studio",
  description:
    "Understand how Airbnb's 15.5% host-only service fee impacts pass-through cleaning fees and co-host commission splits. Reconcile owner payouts accurately.",
};

export default function HostFeeCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        <nav className="flex items-center justify-between text-xs">
          <Link href="/" className="font-bold text-slate-900 hover:text-emerald-700">
            Owner Statement Studio
          </Link>
          <Link href="/" className="bg-emerald-600 text-white font-semibold px-3.5 py-2 rounded-lg hover:bg-emerald-700">
            Open Live Calculator &rarr;
          </Link>
        </nav>

        <header className="space-y-4">
          <span className="inline-block text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
            2026 Host-Only Fee Reconciliation
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Airbnb 15.5% Host-Only Fee &amp; Cleaning Pass-Through Calculator
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Under Airbnb&apos;s simplified 15.5% host-only fee structure, Airbnb deducts 15.5% from the entire reservation total&mdash;including the cleaning fee. If your co-host agreement passes 100% of the cleaning fee to cleaners without crediting back the 15.5% platform fee charged on that cleaning fee, your owner statement math will be off.
          </p>
        </header>

        <section className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Worked Example: $1,000 Nightly Rate + $150 Cleaning Fee</h2>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Line Item</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Amount</th>
                  <th className="py-2.5 px-4 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="py-2.5 px-4 font-medium">Gross Booking (Rent + Cleaning)</td>
                  <td className="py-2.5 px-4 text-right font-semibold">$1,150.00</td>
                  <td className="py-2.5 px-4 text-slate-500">$1,000 rent + $150 cleaning fee</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium">Airbnb 15.5% Host Service Fee</td>
                  <td className="py-2.5 px-4 text-right text-red-600">-$178.25</td>
                  <td className="py-2.5 px-4 text-slate-500">$155.00 on rent + $23.25 on cleaning</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium">Cleaning Pass-Through Deduction</td>
                  <td className="py-2.5 px-4 text-right">-$150.00</td>
                  <td className="py-2.5 px-4 text-slate-500">Paid to turnover crew</td>
                </tr>
                <tr className="bg-emerald-50/70">
                  <td className="py-2.5 px-4 font-bold text-emerald-900">15.5% Cleaning Fee True-Up Credit</td>
                  <td className="py-2.5 px-4 text-right font-bold text-emerald-700">+$23.25</td>
                  <td className="py-2.5 px-4 text-emerald-800">Prevents double-deducting the platform fee on cleaning</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-3 rounded-lg"
            >
              Run Your CSV with Automatic 15.5% True-Up &rarr;
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
