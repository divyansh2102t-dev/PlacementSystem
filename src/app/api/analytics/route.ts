import { NextResponse } from "next/server";
import { PlaceHubStore, ensureNeonHydrated } from "@/lib/store";

export async function GET() {
  try {
    await ensureNeonHydrated();
    const analytics = PlaceHubStore.getAnalytics();
    return NextResponse.json(analytics);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to calculate analytics" },
      { status: 500 }
    );
  }
}
