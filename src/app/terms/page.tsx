import Link from "next/link";

export const metadata = {
title: "Terms of Service - Owner Statement Studio",
};

export default function TermsPage() {
return (
<main className="max-w-3xl mx-auto px-6 py-12 text-slate-800 space-y-6">
  <Link href="/" className="text-xs font-semibold text-emerald-700 hover:underline">
    &larr; Back to Owner Statement Studio
  </Link>
  <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
  <p className="text-xs text-slate-500">Last Updated: November 2026</p>

  <section className="space-y-3 text-sm leading-relaxed">
    <h2 className="text-lg font-semibold text-slate-900">1. Overview &amp; Service Scope</h2>
    <p>
      Owner Statement Studio (&ldquo;Service&rdquo;) is a browser-based financial formatting and reporting utility built for short-term rental hosts, co-hosts, and property managers. By accessing or purchasing a license, you agree to these Terms.
    </p>

    <h2 className="text-lg font-semibold text-slate-900">2. Financial &amp; Tax Disclaimer</h2>
    <p>
      Calculations&mdash;including management fee splits, cleaning pass-throughs, and 15.5% host-fee reconciliations&mdash;are provided strictly as operational formatting aids. You are responsible for verifying all figures, local tax obligations, and owner agreements before disbursing funds.
    </p>

    <h2 className="text-lg font-semibold text-slate-900">3. Licenses &amp; Permitted Use</h2>
    <p>
      Single Report Passes grant one (1) watermark-free PDF export. Unlimited Co-Host Pro subscriptions (Monthly or Annual) grant unlimited statement exports for your own property management operations. Reselling, scraping, or redistributing access links is prohibited.
    </p>

    <h2 className="text-lg font-semibold text-slate-900">4. Merchant of Record &amp; Billing</h2>
    <p>
      All orders are processed by our Merchant of Record, Dodo Payments, which handles payment processing, invoicing, and applicable global sales taxes/VAT.
    </p>

    <h2 className="text-lg font-semibold text-slate-900">5. Contact</h2>
    <p>
      Questions regarding these Terms may be sent to{" "}
      <a href="mailto:support@ownerstatementstudio.com" className="text-emerald-700 underline">
        support@ownerstatementstudio.com
      </a>.
    </p>
  </section>
</main>
);
}
