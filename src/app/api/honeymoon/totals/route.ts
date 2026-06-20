import { NextResponse } from "next/server";
import { getRaisedTotals } from "@/lib/contributions";

// Live totals for the honeymoon progress bars. The page fetches this on load
// and when the tab regains focus, so a returning guest sees their gift land
// without a hard refresh. Never cached — always reflects the latest DB state.
export const dynamic = "force-dynamic";

export async function GET() {
  const raised = await getRaisedTotals();
  return NextResponse.json(
    { raised },
    { headers: { "Cache-Control": "no-store" } }
  );
}
