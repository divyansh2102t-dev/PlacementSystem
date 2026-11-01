import { NextRequest, NextResponse } from "next/server";
import { PlaceHubStore, ensureNeonHydrated } from "@/lib/store";
import { HeadlineStatsConfig } from "@/types";

export async function GET() {
  try {
    await ensureNeonHydrated();
    const stats = PlaceHubStore.getHeadlineStats();
    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch headline stats" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureNeonHydrated();
    const body = (await req.json()) as HeadlineStatsConfig;

    if (!body || !body.highestPackage || !body.averageCtc || !body.placementRate || !body.recruitingPartners) {
      return NextResponse.json(
        { error: "Invalid headline stats payload. All 4 metrics required." },
        { status: 400 }
      );
    }

    const updated = await PlaceHubStore.updateHeadlineStats(body);
    return NextResponse.json({
      success: true,
      message: "Headline statistics updated and synced to database!",
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update headline stats" },
      { status: 500 }
    );
  }
}

