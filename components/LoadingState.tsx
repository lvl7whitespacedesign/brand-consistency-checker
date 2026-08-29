"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "Searching for your website...",
  "Pulling your Google Business Profile...",
  "Scanning your Facebook page...",
  "Scanning your Instagram profile...",
  "Comparing logos and colors...",
  "Checking bio & tagline consistency...",
  "Finalizing your Brand Consistency Report..."
];

export default function LoadingState() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => (i + 1 < STEPS.length ? i + 1 : i));
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  const progress = Math.round(((stepIndex + 1) / STEPS.length) * 100);

  return (
    <div className="max-w-lg mx-auto text-center py-16">
      <div className="w-full bg-white/10 rounded-full h-2 mb-6 overflow-hidden">
        <div
          className="h-2 bg-brand-primary transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-brand-light/80 text-sm animate-pulse">
        {STEPS[stepIndex]}
      </p>
    </div>
  );
}
