import OpenAI from "openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export default async function textEmbedder(inputText: string) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const chunks = await splitTextIntoChunks(inputText, 1000);

  const embedding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: chunks,
    encoding_format: "float",
  });

  return embedding.data[0].embedding;
}

async function splitTextIntoChunks(inputText: string, chunkSize: number) {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap: chunkSize * 0.2,
  });

  const chunks = await textSplitter.splitText(inputText);

  return chunks;
}