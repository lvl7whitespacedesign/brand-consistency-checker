export default function CTAButton({ label }: { label: string }) {
  const calendarLink =
    process.env.NEXT_PUBLIC_CALENDAR_LINK || "https://calendly.com/lvl7hub/strategy-call";

  return (
    <a
      href={calendarLink}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        // Fire pixel/GTM events for retargeting on CTA click
        (window as any).fbq?.("track", "Lead");
        (window as any).dataLayer?.push({ event: "cta_click", label });
      }}
      className="inline-block px-8 py-4 rounded-full bg-brand-primary text-brand-bg font-semibold text-lg
                 hover:opacity-90 transition-opacity shadow-lg shadow-brand-primary/20"
    >
      {label}
    </a>
  );
}
