// Profile discovery via Bing HTML search (DuckDuckGo's html.duckduckgo.com
// endpoint now returns a bot-check shell page for server-side requests, so
// Bing is the primary source here). Bing wraps most organic result links in
// a redirect like bing.com/ck/a?...&u=a1<base64-url>, so we decode those.

export type DiscoveredProfiles = {
  website?: string;
  facebook?: string;
  instagram?: string;
  googleBusiness?: string;
};

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept":
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Referer": "https://www.bing.com/"
};

function decodeBingRedirect(url: string): string | null {
  const match = url.match(/u=a1([A-Za-z0-9_-]+)/);
  if (!match) return null;
  try {
    let b64 = match[1].replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4 !== 0) b64 += "=";
    const decoded = Buffer.from(b64, "base64").toString("utf-8");
    return decoded.startsWith("http") ? decoded : null;
  } catch {
    return null;
  }
}

async function bingSearch(query: string): Promise<string[]> {
  try {
    const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: BROWSER_HEADERS, cache: "no-store" });
    const html = await res.text();

    console.log(`[bingSearch] "${query}" -> status ${res.status}, html length ${html.length}`);

    const rawHrefs = Array.from(html.matchAll(/href="(https?:\/\/[^"]+)"/g)).map((m) => m[1]);

    const resolved = rawHrefs
      .map((u) => {
        if (u.includes("bing.com/ck/a")) {
          return decodeBingRedirect(u);
        }
        return u;
      })
      .filter((u): u is string => !!u)
      .filter(
        (u) =>
          !u.includes("bing.com") &&
          !u.includes("microsoft.com") &&
          !u.includes("go.microsoft.com") &&
          !u.includes("javascript:")
      );

    const deduped = Array.from(new Set(resolved));

    console.log(`[bingSearch] "${query}" -> ${deduped.length} resolved urls, sample:`, deduped.slice(0, 3));

    return deduped;
  } catch (err) {
    console.error(`[bingSearch] "${query}" failed:`, err);
    return [];
  }
}

async function ddgSearch(query: string): Promise<string[]> {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: BROWSER_HEADERS, cache: "no-store" });
    const html = await res.text();
    const matches = Array.from(html.matchAll(/uddg=([^&"]+)/g)).map((m) => decodeURIComponent(m[1]));
    console.log(`[ddgSearch] "${query}" -> status ${res.status}, ${matches.length} matches`);
    return matches;
  } catch (err) {
    console.error(`[ddgSearch] "${query}" failed:`, err);
    return [];
  }
}

async function searchBoth(query: string): Promise<string[]> {
  const bingResults = await bingSearch(query);
  if (bingResults.length > 0) return bingResults;

  console.log(`[searchBoth] "${query}" -> Bing empty, trying DDG as fallback`);
  return ddgSearch(query);
}

function firstMatching(urls: string[], includes: string): string | undefined {
  return urls.find((u) => u.includes(includes));
}

function firstWebsite(urls: string[]): string | undefined {
  return urls.find(
    (u) =>
      !u.includes("facebook.com") &&
      !u.includes("instagram.com") &&
      !u.includes("google.com") &&
      !u.includes("linkedin.com") &&
      !u.includes("yelp.com") &&
      !u.includes("wikipedia.org")
  );
}

export async function discoverProfiles(companyName: string): Promise<DiscoveredProfiles> {
  const [siteResults, fbResults, igResults, gbResults] = await Promise.all([
    searchBoth(`${companyName} official website`),
    searchBoth(`${companyName} facebook page site:facebook.com`),
    searchBoth(`${companyName} instagram profile site:instagram.com`),
    searchBoth(`${companyName} google business profile maps`)
  ]);

  const result: DiscoveredProfiles = {
    website: firstWebsite(siteResults),
    facebook: firstMatching(fbResults, "facebook.com"),
    instagram: firstMatching(igResults, "instagram.com"),
    googleBusiness:
      firstMatching(gbResults, "google.com/maps") || firstMatching(gbResults, "google.com") || gbResults[0]
  };

  console.log(`[discoverProfiles] "${companyName}" ->`, result);
  return result;
}
