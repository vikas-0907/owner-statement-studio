import Link from "next/link";

export const metadata = {
title: "Pricing - Owner Statement Studio",
};

export default function PricingPage() {
return (
<main className="max-w-5xl mx-auto px-6 py-12 text-slate-800 space-y-8">
  <div className="space-y-2">
    <Link href="/" className="text-xs font-semibold text-emerald-700 hover:underline">
      &larr; Back to Statement Generator
    </Link>
    <h1 className="text-3xl font-bold text-slate-900">Simple, Transparent Pricing</h1>
    <p className="text-sm text-slate-600">
      Test everything free with watermarked PDFs. Upgrade only when you are ready to send a clean statement to your property owner.
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
      <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Founder Launch Offer</p>
      <h2 className="text-lg font-bold text-slate-900">Single Report Pass</h2>
      <p className="text-3xl font-extrabold text-slate-900">
        $9 <span className="text-sm font-normal text-slate-400 line-through">$19</span>{" "}
        <span className="text-xs font-normal text-slate-500">one-time</span>
      </p>
      <p className="text-xs text-slate-600">
        1 watermark-free branded PDF export. Ideal for 1-property co-hosts on a deadline.
      </p>
      <Link href="/" className="block text-center bg-slate-900 text-white text-xs font-semibold py-2.5 rounded-lg">
        Create Statement &rarr;
      </Link>
    </div>

    <div className="bg-white border-2 border-emerald-600 rounded-xl p-6 space-y-4">
      <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Most Flexible</p>
      <h2 className="text-lg font-bold text-slate-900">Unlimited Co-Host Monthly</h2>
      <p className="text-3xl font-extrabold text-slate-900">
        $29 <span className="text-xs font-normal text-slate-500">/ month</span>
      </p>
      <p className="text-xs text-slate-600">
        Unlimited clean PDF exports, custom logos, and 15.5% fee reconciliation. Billed monthly; cancel anytime.
      </p>
      <Link href="/" className="block text-center bg-emerald-600 text-white text-xs font-semibold py-2.5 rounded-lg">
        Start Monthly Plan &rarr;
      </Link>
    </div>

    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Save $99/Year</p>
      <h2 className="text-lg font-bold text-slate-900">Unlimited Co-Host Annual</h2>
      <p className="text-3xl font-extrabold text-slate-900">
        $249 <span className="text-xs font-normal text-slate-500">/ year</span>
      </p>
      <p className="text-xs text-slate-600">
        Everything in Monthly ($20.75/mo equivalent). Billed annually; cancel anytime before renewal.
      </p>
      <Link href="/" className="block text-center bg-slate-900 text-white text-xs font-semibold py-2.5 rounded-lg">
        Start Annual Plan &rarr;
      </Link>
    </div>
  </div>
</main>
);
}
