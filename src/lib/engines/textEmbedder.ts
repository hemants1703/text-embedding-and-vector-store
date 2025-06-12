import OpenAI from "openai";

export default async function textEmbedder(text: string) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const embedding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
    encoding_format: "float",
  });

  return embedding.data[0].embedding;
}
