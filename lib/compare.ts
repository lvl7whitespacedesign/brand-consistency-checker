import { ProfileSnapshot } from "./microlink";

export type Mismatch = {
  field: "logo" | "color" | "bio";
  platforms: string[];
  detail: string;
};

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return null;
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function colorDistance(a: string, b: string): number {
  const rgbA = hexToRgb(a);
  const rgbB = hexToRgb(b);
  if (!rgbA || !rgbB) return 999;
  return Math.sqrt(
    (rgbA[0] - rgbB[0]) ** 2 + (rgbA[1] - rgbB[1]) ** 2 + (rgbA[2] - rgbB[2]) ** 2
  );
}

function textSimilarity(a?: string, b?: string): number {
  if (!a || !b) return 0;
  const wordsA = new Set(a.toLowerCase().split(/\W+/).filter(Boolean));
  const wordsB = new Set(b.toLowerCase().split(/\W+/).filter(Boolean));
  const intersection = [...wordsA].filter((w) => wordsB.has(w)).length;
  const union = new Set([...wordsA, ...wordsB]).size || 1;
  return intersection / union;
}

export function findMismatches(snapshots: ProfileSnapshot[]): Mismatch[] {
  const withData = snapshots.filter((s) => s.url);
  const mismatches: Mismatch[] = [];

  for (let i = 0; i < withData.length; i++) {
    for (let j = i + 1; j < withData.length; j++) {
      const a = withData[i];
      const b = withData[j];

      const colorA = a.colors[0];
      const colorB = b.colors[0];
      if (colorA && colorB && colorDistance(colorA, colorB) > 120) {
        mismatches.push({
          field: "color",
          platforms: [a.platform, b.platform],
          detail: `Dominant color differs noticeably between ${a.platform} (${colorA}) and ${b.platform} (${colorB}).`
        });
      }

      const similarity = textSimilarity(a.title, b.title);
      if (similarity < 0.3 && a.title && b.title) {
        mismatches.push({
          field: "bio",
          platforms: [a.platform, b.platform],
          detail: `Name/tagline wording differs between ${a.platform} ("${a.title}") and ${b.platform} ("${b.title}").`
        });
      }

      if (a.logo && b.logo && a.logo !== b.logo) {
        mismatches.push({
          field: "logo",
          platforms: [a.platform, b.platform],
          detail: `${a.platform} and ${b.platform} appear to be using different logo/profile images.`
        });
      }
    }
  }

  return mismatches;
}

export function computeConsistencyScore(mismatches: Mismatch[]): number {
  const penalty = mismatches.length * 12;
  return Math.max(0, 100 - penalty);
}
