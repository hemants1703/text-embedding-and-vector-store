import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
    const { text, embeddingVector } = await request.json() as { text: string, embeddingVector: number[] };

    const supabase = createClient
}