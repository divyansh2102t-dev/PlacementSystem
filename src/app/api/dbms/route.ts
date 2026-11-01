import { NextResponse } from "next/server";
import { getDb, logExecutedQuery } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Missing SQL query" }, { status: 400 });
    }

    const sql = getDb();
    if (!sql) {
      return NextResponse.json(
        { error: "Neon database is not configured. Check DATABASE_URL in .env." },
        { status: 503 }
      );
    }

    const startTime = Date.now();
    // Execute query on Neon
    const rows = (await sql.query(query)) as any[];
    const executionTimeMs = Date.now() - startTime;

    // Log query execution to dbms/executed_queries.sql
    logExecutedQuery("Interactive DBMS Explorer Query", query);

    const fields = rows && rows.length > 0 ? Object.keys(rows[0]) : [];

    return NextResponse.json({
      success: true,
      executionTimeMs,
      rowCount: rows ? rows.length : 0,
      fields,
      rows: rows || [],
    });
  } catch (err: any) {
    console.error("DBMS Query Execution Error:", err);
    return NextResponse.json(
      {
        error: err.message || "Failed to execute SQL query on Neon database.",
      },
      { status: 400 }
    );
  }
}
