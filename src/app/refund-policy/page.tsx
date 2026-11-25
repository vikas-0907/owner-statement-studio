import Link from "next/link";

export const metadata = {
title: "Refund & Cancellation Policy - Owner Statement Studio",
};

export default function RefundPolicyPage() {
return (
<main className="max-w-3xl mx-auto px-6 py-12 text-slate-800 space-y-6">
  <Link href="/" className="text-xs font-semibold text-emerald-700 hover:underline">
    &larr; Back to Owner Statement Studio
  </Link>
  <h1 className="text-3xl font-bold text-slate-900">Refund &amp; Cancellation Policy</h1>
  <p className="text-xs text-slate-500">Last Updated: November 2026</p>

  <section className="space-y-3 text-sm leading-relaxed">
    <h2 className="text-lg font-semibold text-slate-900">1. Free Watermarked Preview Before Purchase</h2>
    <p>
      Every user can upload CSVs, test calculations, customize branding, and download an unlimited number of watermarked preview PDFs at zero cost before purchasing a clean export pass or subscription.
    </p>

    <h2 className="text-lg font-semibold text-slate-900">2. Single Report Pass ($9 One-Time)</h2>
    <p>
      Because Single Report Passes grant immediate digital export access, they are non-refundable once the clean PDF export credit has been redeemed. If a technical error prevents your export from generating, contact us within 7 days for a full refund or replacement credit.
    </p>

    <h2 className="text-lg font-semibold text-slate-900">3. Subscription Cancellations ($29/mo or $249/yr)</h2>
    <p>
      You may cancel your Monthly or Annual Unlimited Co-Host Pro subscription at any time via your Dodo Payments customer portal link or by emailing support. Cancellation stops future renewals immediately, and you retain Pro access through the end of your current paid billing period. Partial-period refunds are not issued for unused days.
    </p>

    <h2 className="text-lg font-semibold text-slate-900">4. How to Request Support or a Refund</h2>
    <p>
      Email your order ID and purchase email to{" "}
      <a href="mailto:support@ownerstatementstudio.com" className="text-emerald-700 underline">
        support@ownerstatementstudio.com
      </a>{" "}
      and we will respond within 1 business day.
    </p>
  </section>
</main>
);
}
