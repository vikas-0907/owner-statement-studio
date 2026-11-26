"use client";

import React, { useState, useMemo, useEffect } from "react";
import Papa from "papaparse";
import {
  Upload,
  FileSpreadsheet,
  Printer,
  Plus,
  Trash2,
  Building2,
  CheckCircle2,
  Sparkles,
  Download,
  ImagePlus,
  SlidersHorizontal,
  Lock,
  Unlock,
  X,
  ShieldCheck,
  Zap,
  Check,
} from "lucide-react";

interface BookingRow {
  id: string;
  guest: string;
  checkIn: string;
  nights: number;
  grossAmount: number;
  cleaningFee: number;
  platformFee: number;
}

interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
}

interface ColumnMapping {
  guest: string;
  checkIn: string;
  nights: string;
  gross: string;
  cleaning: string;
  platformFee: string;
}

const SINGLE_PASS_CHECKOUT_URL = "https://test.checkout.dodopayments.com/buy/pdt_0NsmNPqCSRRSTda6Wo1Ms?quantity=1&redirect_url=https://owner-statement-studio-lyart.vercel.app%2F%3Funlocked%3Dsingle_2026";
const MONTHLY_PRO_CHECKOUT_URL = "https://test.checkout.dodopayments.com/buy/pdt_0NsmTUOzTTGlH1NxwbzNA?quantity=1&redirect_url=https://owner-statement-studio-lyart.vercel.app%2F%3Funlocked%3Dpro_2026";
const ANNUAL_PRO_CHECKOUT_URL = "https://test.checkout.dodopayments.com/buy/pdt_0NsmTZigzfV2c16JHvPRK?quantity=1&redirect_url=https://owner-statement-studio-lyart.vercel.app%2F%3Funlocked%3Dpro_2026";

const SAMPLE_BOOKINGS: BookingRow[] = [
  { id: "1", guest: "Marcus Vance", checkIn: "2026-10-03", nights: 4, grossAmount: 1120, cleaningFee: 150, platformFee: 173.6 },
  { id: "2", guest: "Elena Rostova", checkIn: "2026-10-10", nights: 3, grossAmount: 870, cleaningFee: 150, platformFee: 134.85 },
  { id: "3", guest: "David & Sarah Chen", checkIn: "2026-10-16", nights: 5, grossAmount: 1450, cleaningFee: 150, platformFee: 224.75 },
  { id: "4", guest: "Liam O'Connor", checkIn: "2026-10-24", nights: 6, grossAmount: 1680, cleaningFee: 150, platformFee: 260.4 },
];

const BRAND_SWATCHES = [
  { name: "Executive Slate", hex: "#0f172a" },
  { name: "Royal Navy", hex: "#1e3a8a" },
  { name: "Forest Emerald", hex: "#065f46" },
  { name: "Terracotta", hex: "#9a3412" },
  { name: "Deep Plum", hex: "#581c87" },
];

const CURRENCIES = [
  { code: "USD", label: "USD ($)" },
  { code: "GBP", label: "GBP (£)" },
  { code: "EUR", label: "EUR (€)" },
  { code: "AUD", label: "AUD (A$)" },
  { code: "CAD", label: "CAD (C$)" },
  { code: "INR", label: "INR (₹)" },
];

export default function OwnerStatementStudio() {
  const [companyName, setCompanyName] = useState("Apex Stays Management");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [propertyName, setPropertyName] = useState("Villa Sol - Lakeview Loft");
  const [ownerName, setOwnerName] = useState("Jonathan Mercer");
  const [statementPeriod, setStatementPeriod] = useState("October 2026");
  const [accentColor, setAccentColor] = useState("#1e3a8a");
  const [currency, setCurrency] = useState("USD");

  const [isUnlimitedPro, setIsUnlimitedPro] = useState<boolean>(false);
  const [singleCredits, setSingleCredits] = useState<number>(0);
  const [showPaywallModal, setShowPaywallModal] = useState<boolean>(false);
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");

  const hasCleanExportAccess = isUnlimitedPro || singleCredits > 0;

  useEffect(() => {
    if (localStorage.getItem("oss_pro_unlocked") === "true") {
      setIsUnlimitedPro(true);
    }
    const savedCredits = parseInt(localStorage.getItem("oss_single_credits") || "0", 10);
    if (savedCredits > 0) setSingleCredits(savedCredits);

    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get("payment_id");
    const subscriptionId = params.get("subscription_id");
    const txId = paymentId || subscriptionId;

    if (!txId) return;

    window.history.replaceState({}, "", window.location.pathname);

    const redeemedRaw = localStorage.getItem("oss_redeemed_ids") || "[]";
    const redeemedIds: string[] = JSON.parse(redeemedRaw);
    if (redeemedIds.includes(txId)) return;

    const query = paymentId
      ? `payment_id=${encodeURIComponent(paymentId)}`
      : `subscription_id=${encodeURIComponent(subscriptionId!)}`;

    fetch(`/api/verify-payment?${query}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.verified) return;

        const updatedIds = [...redeemedIds, txId];
        localStorage.setItem("oss_redeemed_ids", JSON.stringify(updatedIds));

        if (data.tier === "pro") {
          localStorage.setItem("oss_pro_unlocked", "true");
          setIsUnlimitedPro(true);
        } else {
          const current = parseInt(localStorage.getItem("oss_single_credits") || "0", 10);
          const next = current + 1;
          localStorage.setItem("oss_single_credits", String(next));
          setSingleCredits(next);
        }
      })
      .catch(() => {});
  }, []);

  const simulateUnlock = (tier: "single" | "pro") => {
    if (tier === "pro") {
      localStorage.setItem("oss_pro_unlocked", "true");
      setIsUnlimitedPro(true);
    } else {
      const next = singleCredits + 1;
      localStorage.setItem("oss_single_credits", String(next));
      setSingleCredits(next);
    }
    setShowPaywallModal(false);
  };

  const resetLockLocally = () => {
    localStorage.removeItem("oss_pro_unlocked");
    localStorage.removeItem("oss_single_credits");
    setIsUnlimitedPro(false);
    setSingleCredits(0);
  };

  const [rawCsvRows, setRawCsvRows] = useState<Record<string, any>[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({
    guest: "",
    checkIn: "",
    nights: "",
    gross: "",
    cleaning: "",
    platformFee: "",
  });

  const [commissionRate, setCommissionRate] = useState<number>(20);
  const [deductCleaningBeforeSplit, setDeductCleaningBeforeSplit] = useState<boolean>(true);
  const [reconcile155FeeOnCleaning, setReconcile155FeeOnCleaning] = useState<boolean>(true);

  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: "e1", description: "HVAC filter replacement & smart lock batteries", amount: 65 },
    { id: "e2", description: "Welcome basket & coffee pods restock", amount: 42 },
  ]);
  const [newExpDesc, setNewExpDesc] = useState("");
  const [newExpAmount, setNewExpAmount] = useState("");
  const [ownerNotes, setOwnerNotes] = useState(
    "Strong October performance with 18 booked nights and two 5-star guest reviews mentioning spotless cleanliness. Scheduled preventative HVAC check ahead of winter bookings."
  );

  const handleExportClick = () => {
    if (isUnlimitedPro) {
      setTimeout(() => window.print(), 100);
    } else if (singleCredits > 0) {
      setTimeout(() => {
        window.print();
        const remaining = Math.max(0, singleCredits - 1);
        localStorage.setItem("oss_single_credits", String(remaining));
        setSingleCredits(remaining);
      }, 100);
    } else {
      setShowPaywallModal(true);
    }
  };

  const handleWatermarkedDownload = () => {
    setShowPaywallModal(false);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setLogoUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const downloadSampleCsv = () => {
    const csvContent = [
      "Start date,Nights,Guest,Gross earnings,Cleaning fee,Host service fee",
      "2026-10-03,4,Marcus Vance,1120.00,150.00,173.60",
      "2026-10-10,3,Elena Rostova,870.00,150.00,134.85",
      "2026-10-16,5,David & Sarah Chen,1450.00,150.00,224.75",
      "2026-10-24,6,Liam O'Connor,1680.00,150.00,260.40",
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sample-airbnb-october-2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as Record<string, any>[];
        const headers = results.meta.fields || [];
        if (rows.length === 0 || headers.length === 0) return;

        const detect = (patterns: string[]) =>
          headers.find((h) => patterns.some((p) => h.toLowerCase().includes(p))) || "";

        setRawCsvRows(rows);
        setCsvHeaders(headers);
        setMapping({
          guest: detect(["guest", "name", "traveler"]),
          checkIn: detect(["start", "check-in", "checkin", "date"]),
          nights: detect(["nights", "duration"]),
          gross: detect(["gross", "amount", "paid out", "total", "earnings"]),
          cleaning: detect(["cleaning"]),
          platformFee: detect(["service fee", "host fee", "commission", "platform"]),
        });
      },
    });
  };

  const bookings: BookingRow[] = useMemo(() => {
    if (rawCsvRows.length === 0) return SAMPLE_BOOKINGS;

    const parseMoney = (val: any) => {
      if (val === undefined || val === null || val === "") return 0;
      const num = parseFloat(String(val).replace(/[^0-9.-]+/g, ""));
      return isNaN(num) ? 0 : Math.abs(num);
    };

    return rawCsvRows
      .map((row, idx) => ({
        id: String(idx + 1),
        guest: (mapping.guest && row[mapping.guest]) || `Reservation #${idx + 1}`,
        checkIn: (mapping.checkIn && row[mapping.checkIn]) || "-",
        nights: (mapping.nights && parseInt(String(row[mapping.nights]))) || 1,
        grossAmount: mapping.gross ? parseMoney(row[mapping.gross]) : 0,
        cleaningFee: mapping.cleaning ? parseMoney(row[mapping.cleaning]) : 0,
        platformFee: mapping.platformFee ? parseMoney(row[mapping.platformFee]) : 0,
      }))
      .filter((b) => b.grossAmount > 0);
  }, [rawCsvRows, mapping]);

  const financials = useMemo(() => {
    const totalNights = bookings.reduce((sum, b) => sum + b.nights, 0);
    const grossRevenue = bookings.reduce((sum, b) => sum + b.grossAmount, 0);
    const totalCleaning = bookings.reduce((sum, b) => sum + b.cleaningFee, 0);
    const totalPlatformFees = bookings.reduce((sum, b) => sum + b.platformFee, 0);

    const cleaningFeeTrueUp = reconcile155FeeOnCleaning ? totalCleaning * 0.155 : 0;

    const baseForCommission = deductCleaningBeforeSplit
      ? Math.max(0, grossRevenue - totalCleaning - totalPlatformFees)
      : Math.max(0, grossRevenue - totalPlatformFees);

    const managementFee = baseForCommission * (commissionRate / 100);
    const totalMaintenance = expenses.reduce((sum, e) => sum + e.amount, 0);

    const netOwnerPayout =
      grossRevenue -
      totalPlatformFees -
      (deductCleaningBeforeSplit ? totalCleaning - cleaningFeeTrueUp : 0) -
      managementFee -
      totalMaintenance;

    return {
      totalNights,
      grossRevenue,
      totalCleaning,
      totalPlatformFees,
      cleaningFeeTrueUp,
      managementFee,
      totalMaintenance,
      netOwnerPayout,
    };
  }, [bookings, expenses, commissionRate, deductCleaningBeforeSplit, reconcile155FeeOnCleaning]);

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newExpAmount);
    if (!newExpDesc.trim() || isNaN(amt) || amt <= 0) return;
    setExpenses([...expenses, { id: String(Date.now()), description: newExpDesc.trim(), amount: amt }]);
    setNewExpDesc("");
    setNewExpAmount("");
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(n);
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="no-print bg-white border-b border-slate-200 px-6 py-3.5 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="text-white p-2 rounded-lg transition-colors" style={{ backgroundColor: accentColor }}>
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg leading-tight">Owner Statement Studio</h1>
                {isUnlimitedPro && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Pro Unlimited
                  </span>
                )}
                {!isUnlimitedPro && singleCredits > 0 && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    {singleCredits} Clean Export Credit
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">CSV to Branded STR Owner Report in 60 Seconds</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {hasCleanExportAccess && (
              <button
                onClick={resetLockLocally}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                title="Reset unlock status for testing"
              >
                <Unlock className="w-3.5 h-3.5" />
                Lock (Test)
              </button>
            )}
            <button
              onClick={downloadSampleCsv}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"
            >
              <Download className="w-3.5 h-3.5" />
              Sample Airbnb CSV
            </button>
            <button
              onClick={handleExportClick}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow-sm transition"
            >
              {hasCleanExportAccess ? <Printer className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              {hasCleanExportAccess ? "Download Clean PDF" : "Export Owner PDF"}
            </button>
          </div>
        </div>
      </header>

      <section className="no-print bg-slate-900 text-white border-b border-slate-800 px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold tracking-tight">
              Stop losing 3 hours every month formatting owner payouts in Excel.
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1">
              Drop your Airbnb or VRBO export, auto-reconcile the 2026{" "}
              <span className="text-amber-300 font-medium">15.5% host fee split</span>, and send an executive PDF owners actually trust.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 shrink-0">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% Browser-Private
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              No PMS Lock-In
            </span>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="no-print lg:col-span-5 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                1. Import Payout CSV
              </h2>
              {rawCsvRows.length > 0 && (
                <button
                  onClick={() => {
                    setRawCsvRows([]);
                    setCsvHeaders([]);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  Reset to Demo Data
                </button>
              )}
            </div>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-lg p-5 cursor-pointer bg-slate-50 transition">
              <Upload className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-sm font-medium text-slate-700">Upload Airbnb / VRBO / Excel CSV</span>
              <span className="text-xs text-slate-400 mt-0.5">Auto-detects Gross, Nights, Cleaning &amp; Service Fees</span>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>

            {csvHeaders.length > 0 && (
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2.5">
                <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
                  Verify Column Mapping ({bookings.length} rows detected)
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(
                    [
                      ["gross", "Gross Payout *"],
                      ["cleaning", "Cleaning Fee"],
                      ["platformFee", "Host Service Fee"],
                      ["nights", "Nights"],
                      ["guest", "Guest Name"],
                      ["checkIn", "Check-In Date"],
                    ] as [keyof ColumnMapping, string][]
                  ).map(([field, label]) => (
                    <div key={field}>
                      <label className="block text-[11px] text-slate-500 mb-0.5">{label}</label>
                      <select
                        value={mapping[field]}
                        onChange={(e) => setMapping({ ...mapping, [field]: e.target.value })}
                        className="w-full border border-slate-300 rounded px-2 py-1 bg-white text-xs"
                      >
                        <option value="">-- Ignore --</option>
                        {csvHeaders.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-500">2. Statement Branding</h2>

            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2.5">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Brand logo"
                    className="h-9 w-9 object-contain rounded bg-white border border-slate-200 p-0.5"
                  />
                ) : (
                  <div className="h-9 w-9 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                    <ImagePlus className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium text-slate-700">Company Logo</p>
                  <p className="text-[11px] text-slate-400">PNG or JPG (optional)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {logoUrl && (
                  <button onClick={() => setLogoUrl(null)} className="text-xs text-red-500 hover:underline">
                    Remove
                  </button>
                )}
                <label className="text-xs font-medium bg-white border border-slate-300 hover:bg-slate-100 px-2.5 py-1.5 rounded-md cursor-pointer">
                  Upload
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Brand Accent Color</label>
              <div className="flex items-center gap-2">
                {BRAND_SWATCHES.map((swatch) => (
                  <button
                    key={swatch.hex}
                    type="button"
                    title={swatch.name}
                    onClick={() => setAccentColor(swatch.hex)}
                    className={`w-7 h-7 rounded-full border-2 transition ${
                      accentColor.toLowerCase() === swatch.hex ? "border-slate-900 scale-110" : "border-transparent"
                    }`}
                    style={{ backgroundColor: swatch.hex }}
                  />
                ))}
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="ml-auto w-24 text-xs font-mono border border-slate-300 rounded-lg px-2 py-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Your Co-Host Brand</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-1.5"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-1.5 bg-white"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Property Name</label>
                <input
                  type="text"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-1.5"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Owner Name</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-1.5"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Statement Period</label>
                <input
                  type="text"
                  value={statementPeriod}
                  onChange={(e) => setStatementPeriod(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-1.5"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              3. Commission &amp; Fee Reconciliation
            </h2>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Co-Host Management Fee (%)</label>
              <input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-1.5"
              />
            </div>

            <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={deductCleaningBeforeSplit}
                onChange={(e) => setDeductCleaningBeforeSplit(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600"
              />
              <span>Pass-through cleaning fees to co-host/cleaners before calculating owner split</span>
            </label>

            <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              <input
                type="checkbox"
                checked={reconcile155FeeOnCleaning}
                onChange={(e) => setReconcile155FeeOnCleaning(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600"
              />
              <span>
                <strong>Airbnb 15.5% Host-Fee True-Up:</strong> Credit back the 15.5% platform fee charged on pass-through cleaning fees so owner isn&apos;t over-deducted.
              </span>
            </label>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-500">
              4. Maintenance &amp; Reimbursements
            </h2>
            <form onSubmit={addExpense} className="flex gap-2">
              <input
                type="text"
                placeholder="Item (e.g. Plumber visit)"
                value={newExpDesc}
                onChange={(e) => setNewExpDesc(e.target.value)}
                className="flex-1 text-xs border border-slate-300 rounded-lg px-2.5 py-1.5"
              />
              <input
                type="number"
                placeholder="Amt"
                value={newExpAmount}
                onChange={(e) => setNewExpAmount(e.target.value)}
                className="w-20 text-xs border border-slate-300 rounded-lg px-2.5 py-1.5"
              />
              <button
                type="submit"
                className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-800"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-1.5">
              {expenses.map((exp) => (
                <div key={exp.id} className="flex items-center justify-between text-xs bg-slate-50 px-3 py-2 rounded-lg">
                  <span className="text-slate-700">{exp.description}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{fmt(exp.amount)}</span>
                    <button
                      onClick={() => setExpenses(expenses.filter((x) => x.id !== exp.id))}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-500">5. Monthly Manager Note</h2>
            <textarea
              rows={3}
              value={ownerNotes}
              onChange={(e) => setOwnerNotes(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
            />
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="print-area relative overflow-hidden bg-white rounded-xl border border-slate-200 shadow-lg p-8 md:p-10">
            {!hasCleanExportAccess && (
              <div className="pointer-events-none select-none fixed inset-0 flex items-center justify-center z-50">
                <p className="text-3xl md:text-4xl font-extrabold uppercase tracking-widest text-slate-400/30 -rotate-30 border-4 border-slate-400/30 px-6 py-3 rounded-xl">
                  DRAFT PREVIEW - OWNER STATEMENT STUDIO
                </p>
              </div>
            )}

            <div className="flex flex-wrap justify-between items-start pb-6 border-b-2" style={{ borderColor: accentColor }}>
              <div className="flex items-start gap-3.5">
                {logoUrl && (
                  <img src={logoUrl} alt={companyName} className="h-12 w-12 object-contain rounded-lg" />
                )}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: accentColor }}>
                    {companyName}
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900">Monthly Owner Statement</h2>
                  <p className="text-sm text-slate-500 mt-0.5">{propertyName}</p>
                </div>
              </div>
              <div className="text-right text-sm">
                <p className="font-semibold text-slate-800">{statementPeriod}</p>
                <p className="text-slate-500">Prepared for: {ownerName}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {bookings.length} Reservations - {financials.totalNights} Nights Booked
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <p className="text-[11px] uppercase tracking-wider text-slate-500">Gross Bookings</p>
                <p className="text-lg font-bold text-slate-900 mt-0.5">{fmt(financials.grossRevenue)}</p>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <p className="text-[11px] uppercase tracking-wider text-slate-500">Platform &amp; Cleaning</p>
                <p className="text-lg font-bold text-slate-700 mt-0.5">
                  -
                  {fmt(
                    financials.totalPlatformFees +
                      (deductCleaningBeforeSplit ? financials.totalCleaning - financials.cleaningFeeTrueUp : 0)
                  )}
                </p>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <p className="text-[11px] uppercase tracking-wider text-slate-500">Mgmt &amp; Repairs</p>
                <p className="text-lg font-bold text-slate-700 mt-0.5">
                  -{fmt(financials.managementFee + financials.totalMaintenance)}
                </p>
              </div>
              <div className="p-3.5 rounded-lg text-white transition-colors" style={{ backgroundColor: accentColor }}>
                <p className="text-[11px] uppercase tracking-wider opacity-80">Net Owner Payout</p>
                <p className="text-lg font-bold mt-0.5">{fmt(financials.netOwnerPayout)}</p>
              </div>
            </div>

            {ownerNotes && (
              <div className="bg-slate-50 border-l-4 p-4 rounded-r-lg mb-6" style={{ borderLeftColor: accentColor }}>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Property Performance &amp; Operations Note
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">{ownerNotes}</p>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">Reservation Breakdown</h3>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Guest</th>
                      <th className="py-2.5 px-3 font-semibold">Check-In</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Nights</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Gross</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Cleaning</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Host Fee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {bookings.map((b) => (
                      <tr key={b.id}>
                        <td className="py-2 px-3 font-medium text-slate-800">{b.guest}</td>
                        <td className="py-2 px-3 text-slate-500">{b.checkIn}</td>
                        <td className="py-2 px-3 text-right">{b.nights}</td>
                        <td className="py-2 px-3 text-right font-medium">{fmt(b.grossAmount)}</td>
                        <td className="py-2 px-3 text-right text-slate-500">{fmt(b.cleaningFee)}</td>
                        <td className="py-2 px-3 text-right text-slate-500">-{fmt(b.platformFee)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Gross Reservation Revenue</span>
                <span className="font-medium text-slate-900">{fmt(financials.grossRevenue)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Less: Channel / Platform Host Service Fees</span>
                <span>-{fmt(financials.totalPlatformFees)}</span>
              </div>
              {deductCleaningBeforeSplit && (
                <div className="flex justify-between text-slate-600">
                  <span>Less: Cleaning Fee Pass-Through</span>
                  <span>-{fmt(financials.totalCleaning)}</span>
                </div>
              )}
              {deductCleaningBeforeSplit && reconcile155FeeOnCleaning && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Plus: 15.5% Platform Fee Credit on Cleaning Pass-Through
                  </span>
                  <span>+{fmt(financials.cleaningFeeTrueUp)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Less: Co-Host Management Commission ({commissionRate}%)</span>
                <span>-{fmt(financials.managementFee)}</span>
              </div>
              {expenses.map((exp) => (
                <div key={exp.id} className="flex justify-between text-slate-600">
                  <span>Less: {exp.description}</span>
                  <span>-{fmt(exp.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-300">
                <span>Total Net Owner Disbursement</span>
                <span>{fmt(financials.netOwnerPayout)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showPaywallModal && (
        <div className="no-print fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowPaywallModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Less than 1 hour of admin - Ready for {ownerName}
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">Export Your Owner Statement</h3>
              <p className="text-sm text-slate-500 mt-1">
                Download a free watermarked preview to check print quality, or unlock clean, unbranded PDFs ready for your property owners.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 bg-slate-100 p-1 rounded-lg mb-5 w-fit mx-auto">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-md transition ${
                  billingCycle === "monthly" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
                  billingCycle === "annual" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Annual
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  Save $99
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div className="border-2 border-slate-200 hover:border-slate-900 rounded-xl p-4 flex flex-col justify-between transition">
                <div>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded mb-1.5">
                    Founder Launch Offer
                  </span>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Single Report Pass</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extrabold text-slate-900">$9</span>
                    <span className="text-sm font-semibold text-slate-400 line-through">$19</span>
                    <span className="text-xs text-slate-500">1 export</span>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />1 watermark-free owner PDF
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />Custom logo &amp; brand colors
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />No recurring subscription
                    </li>
                  </ul>
                </div>
                <a
                  href={SINGLE_PASS_CHECKOUT_URL}
                  onClick={(e) => {
                    if (SINGLE_PASS_CHECKOUT_URL.startsWith("#") || SINGLE_PASS_CHECKOUT_URL.startsWith("PASTE_")) {
                      e.preventDefault();
                      simulateUnlock("single");
                    }
                  }}
                  className="mt-4 block text-center bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 rounded-lg transition"
                >
                  Unlock 1 Clean PDF ($9)
                </a>
              </div>

              <div className="border-2 border-emerald-600 bg-emerald-50/40 rounded-xl p-4 flex flex-col justify-between relative">
                <span className="absolute -top-2.5 right-3 bg-emerald-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                  Best for 2+ Doors
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Unlimited Co-Host Pro</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-extrabold text-slate-900">
                      {billingCycle === "annual" ? "$249" : "$29"}
                    </span>
                    <span className="text-xs text-slate-500">{billingCycle === "annual" ? "/ year" : "/ month"}</span>
                  </div>
                  {billingCycle === "annual" && (
                    <p className="text-[11px] font-medium text-emerald-700 mt-0.5">Equals $20.75/mo (2 months free)</p>
                  )}
                  <ul className="mt-3 space-y-1.5 text-xs text-slate-700">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />Unlimited properties &amp; PDFs
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />15.5% fee true-up engine
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />Cancel anytime in 1 click
                    </li>
                  </ul>
                </div>
                <a
                  href={billingCycle === "annual" ? ANNUAL_PRO_CHECKOUT_URL : MONTHLY_PRO_CHECKOUT_URL}
                  onClick={(e) => {
                    const url = billingCycle === "annual" ? ANNUAL_PRO_CHECKOUT_URL : MONTHLY_PRO_CHECKOUT_URL;
                    if (url.startsWith("#") || url.startsWith("PASTE_")) {
                      e.preventDefault();
                      simulateUnlock("pro");
                    }
                  }}
                  className="mt-4 block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 rounded-lg transition"
                >
                  {billingCycle === "annual" ? "Go Unlimited ($249/yr)" : "Go Unlimited ($29/mo)"}
                </a>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 text-center sm:text-left">
              <button
                onClick={handleWatermarkedDownload}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 underline"
              >
                Download free preview with watermark instead &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
