// Thin wrapper around the free Microlink.io API for OG metadata + a
// dominant color palette for any public URL (works well for websites,
// public Facebook pages, and public Instagram profiles).

export type ProfileSnapshot = {
  platform: "website" | "facebook" | "instagram" | "googleBusiness";
  url?: string;
  title?: string;
  description?: string;
  logo?: string;
  colors: string[];
};

const MICROLINK_BASE = "https://api.microlink.io";

export async function fetchSnapshot(
  platform: ProfileSnapshot["platform"],
  url?: string
): Promise<ProfileSnapshot> {
  if (!url) {
    return { platform, colors: [] };
  }

  try {
    const key = process.env.MICROLINK_API_KEY;
    const endpoint = `${MICROLINK_BASE}/?url=${encodeURIComponent(
      url
    )}&palette=true&audio=false&video=false${key ? `&x-api-key=${key}` : ""}`;

    const res = await fetch(endpoint);
    const json = await res.json();
    const data = json?.data || {};

    const colors: string[] =
      data?.palette?.map((c: { color: string }) => c.color) || [];

    return {
      platform,
      url,
      title: data?.title,
      description: data?.description,
      logo: data?.logo?.url || data?.image?.url,
      colors
    };
  } catch {
    return { platform, url, colors: [] };
  }
}
