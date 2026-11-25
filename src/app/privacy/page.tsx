import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Owner Statement Studio",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-slate-800 space-y-6">
      <Link href="/" className="text-xs font-semibold text-emerald-700 hover:underline">
        ? Back to Owner Statement Studio
      </Link>
      <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
      <p className="text-xs text-slate-500">Last Updated: November 2026</p>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-slate-900">1. Browser-Local CSV Processing</h2>
        <p>
          Your uploaded Airbnb, VRBO, or spreadsheet CSV files and custom logos are parsed and rendered 100% locally inside your web browser. We do not upload, store, or sell your guest names, property addresses, or payout figures on external servers.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">2. Payment & Order Data</h2>
        <p>
          When you purchase a Single Report Pass or Unlimited Pro subscription, billing information (such as your name, email address, and payment method) is collected and processed securely by Dodo Payments as our Merchant of Record. We do not store raw credit card numbers.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">3. Local Storage</h2>
        <p>
          We use browser local storage solely to remember your unlocked export credits or Pro status on your device.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">4. Data Requests & Contact</h2>
        <p>
          To request access to or deletion of order records, email{" "}
          <a href="mailto:support@ownerstatementstudio.com" className="text-emerald-700 underline">
            support@ownerstatementstudio.com
          </a>.
        </p>
      </section>
    </main>
  );
}
