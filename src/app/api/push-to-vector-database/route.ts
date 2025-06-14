import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { VectorDatabaseData } from "@/components/EmbedForm";

export async function POST(request: NextRequest, response: NextResponse) {
    const { text, embeddingVector } = await request.json() as { text: string, embeddingVector: number[] };

    try {
        const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_API_KEY!);
        
        const { data, error } = await supabase
            .from('documents')
            .insert([
                { content: text, embedding: embeddingVector },
            ])
            .select();

        if (error) throw new Error(error.message);

        return NextResponse.json(data[0]);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}