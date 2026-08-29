"use client";

import { useState } from "react";
import LoadingState from "@/components/LoadingState";
import ResultsGrid from "@/components/ResultsGrid";
import CTAButton from "@/components/CTAButton";

const COMPANY = process.env.NEXT_PUBLIC_COMPANY_NAME || "LVL7";
const LOGO_URL = process.env.NEXT_PUBLIC_LOGO_URL;

type AnalyzeResponse = {
  companyName: string;
  snapshots: any[];
  mismatches: any[];
  score: number;
  error?: string;
};

export default function HomePage() {
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!companyName.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName })
      });
      const data: AnalyzeResponse = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setResult(data);
        (window as any).fbq?.("track", "CompleteRegistration");
        (window as any).dataLayer?.push({ event: "analysis_complete" });
      }
    } catch {
      setError("Network error -- please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <header className="flex items-center justify-center gap-3 mb-10">
        {LOGO_URL && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={LOGO_URL} alt={COMPANY} className="h-8" />
        )}
        <span className="text-sm tracking-widest uppercase text-brand-light/60">
          {COMPANY} Brand Consistency Checker
        </span>
      </header>

      {!result && !loading && (
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Is your brand telling the same story everywhere?
          </h1>
          <p className="text-brand-light/70 mb-8">
            Enter your company name and we&apos;ll pull your website, Google
            Business Profile, Facebook, and Instagram side by side -- and show
            you exactly where they don&apos;t match. Takes under 60 seconds.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <input
              type="text"
              placeholder="e.g. Riverstone Family Therapy"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="flex-1 px-5 py-4 rounded-full bg-white/5 border border-white/10
                         focus:outline-none focus:border-brand-primary text-brand-light
                         placeholder:text-brand-light/40"
            />
            <button
              type="submit"
              className="px-8 py-4 rounded-full bg-brand-primary text-brand-bg font-semibold
                         hover:opacity-90 transition-opacity"
            >
              Check My Brand
            </button>
          </form>

          {error && <p className="text-brand-danger mt-4 text-sm">{error}</p>}
        </div>
      )}

      {loading && <LoadingState />}

      {result && !loading && (
        <div>
          <div className="text-center mb-10">
            <p className="text-brand-light/60 mb-1">
              Consistency score for {result.companyName}
            </p>
            <div className="text-6xl font-extrabold text-brand-primary">
              {result.score}
              <span className="text-2xl text-brand-light/40">/100</span>
            </div>
          </div>

          <ResultsGrid snapshots={result.snapshots} mismatches={result.mismatches} />

          <div className="text-center py-10">
            <p className="text-brand-light/70 mb-6 max-w-xl mx-auto">
              Want these fixed and kept consistent across every platform?
              We&apos;ll rebuild your brand system once, and keep it aligned
              everywhere your business shows up online.
            </p>
            <CTAButton label="Book a Free Strategy Call" />
          </div>
        </div>
      )}
    </main>
  );
}
