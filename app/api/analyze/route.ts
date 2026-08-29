import { NextRequest, NextResponse } from "next/server";
import { discoverProfiles } from "@/lib/search";
import { fetchSnapshot } from "@/lib/microlink";
import { findMismatches, computeConsistencyScore } from "@/lib/compare";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { companyName } = await req.json();

    if (!companyName || typeof companyName !== "string") {
      return NextResponse.json(
        { error: "companyName is required" },
        { status: 400 }
      );
    }

    const profiles = await discoverProfiles(companyName);

    const [website, facebook, instagram, googleBusiness] = await Promise.all([
      fetchSnapshot("website", profiles.website),
      fetchSnapshot("facebook", profiles.facebook),
      fetchSnapshot("instagram", profiles.instagram),
      fetchSnapshot("googleBusiness", profiles.googleBusiness)
    ]);

    const snapshots = [website, facebook, instagram, googleBusiness];
    const mismatches = findMismatches(snapshots);
    const score = computeConsistencyScore(mismatches);

    return NextResponse.json({
      companyName,
      snapshots,
      mismatches,
      score
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Something went wrong analyzing that company." },
      { status: 500 }
    );
  }
}
