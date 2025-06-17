import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { queryEmbedding } = await request.json() as { queryEmbedding: string };

    if (!queryEmbedding) {
        return NextResponse.json({
            success: false,
            error: {
                message: "Query is a required field"
            }
        });
    }

    try {
        const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_API_KEY!);
        const { data, error } = await supabase.rpc("match_documents", {
            query_embedding: queryEmbedding,
            match_threshold: 0.80,  // returns values that have a cosine similarity greater than 0.50
            match_count: 5
        })

        if (error) {
            console.error("Error while querying vector database: ", error);
            throw new Error("Error while querying vector database");
        }

        return NextResponse.json({
            success: true,
            data
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error,
        })
    }
}