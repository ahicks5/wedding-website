import { NextResponse } from "next/server";

// TEMPORARY diagnostic endpoint to debug admin login. Returns NO secrets —
// only metadata about what the running deployment sees. Delete after use.
export const dynamic = "force-dynamic";

export async function GET() {
  const raw = process.env.ADMIN_PASSWORD;

  return NextResponse.json({
    // Is the env var present in THIS running deployment at all?
    configured: typeof raw === "string",
    // Length reveals stray whitespace ("dumptruck" should be 9).
    rawLength: raw ? raw.length : 0,
    trimmedLength: raw ? raw.trim().length : 0,
    // Confirms whether the running code includes the trim fix / this deploy.
    build: "debug-v1",
  });
}
