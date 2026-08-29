"use client";

type Snapshot = {
  platform: "website" | "facebook" | "instagram" | "googleBusiness";
  url?: string;
  title?: string;
  description?: string;
  logo?: string;
  colors: string[];
};

type Mismatch = {
  field: "logo" | "color" | "bio";
  platforms: string[];
  detail: string;
};

const PLATFORM_LABELS: Record<Snapshot["platform"], string> = {
  website: "Website",
  facebook: "Facebook",
  instagram: "Instagram",
  googleBusiness: "Google Business"
};

export default function ResultsGrid({
  snapshots,
  mismatches
}: {
  snapshots: Snapshot[];
  mismatches: Mismatch[];
}) {
  const platformsWithIssues = new Set(
    mismatches.flatMap((m) => m.platforms)
  );

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {snapshots.map((s) => {
          const flagged = platformsWithIssues.has(s.platform);
          return (
            <div
              key={s.platform}
              className={`card p-4 flex flex-col gap-3 ${flagged ? "mismatch" : ""}`}
            >
              <span className="text-xs uppercase tracking-wide text-brand-light/50">
                {PLATFORM_LABELS[s.platform]}
              </span>

              {s.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.logo}
                  alt={`${PLATFORM_LABELS[s.platform]} logo`}
                  className="w-16 h-16 object-cover rounded-lg bg-white/5"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center text-xs text-brand-light/40">
                  No image found
                </div>
              )}

              <p className="text-sm font-medium line-clamp-2">
                {s.title || "Not found"}
              </p>

              <div className="flex gap-1">
                {s.colors.slice(0, 5).map((c, i) => (
                  <span
                    key={i}
                    className="w-5 h-5 rounded-full border border-white/10"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              {s.url && (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-primary underline underline-offset-2"
                >
                  View source
                </a>
              )}
            </div>
          );
        })}
      </div>

      {mismatches.length > 0 && (
        <div className="card p-6 mb-10">
          <h3 className="font-semibold mb-4 text-brand-danger">
            {mismatches.length} inconsistenc{mismatches.length === 1 ? "y" : "ies"} found
          </h3>
          <ul className="space-y-2">
            {mismatches.map((m, i) => (
              <li key={i} className="text-sm text-brand-light/80 flex gap-2">
                <span className="text-brand-danger">●</span>
                {m.detail}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
