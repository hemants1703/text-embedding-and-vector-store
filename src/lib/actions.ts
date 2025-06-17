'use server';

import { TextEmbeddingFormState } from "@/components/EmbedForm";
import textEmbedder from "./engines/textEmbedder";
import { QueryVectorEmbeddingState } from "@/components/QueryVectorEmbeddings";

export async function embedText(prevState: TextEmbeddingFormState, formData: FormData): Promise<TextEmbeddingFormState> {
  try {
    const text = formData.get('text') as string;

    if (!text) {
      return {
        error: 'Please enter some text to embed',
        message: null,
        embedding: null,
        text: null
      };
    }

    const embedding = await textEmbedder(text);

    return {
      message: 'Text successfully embedded',
      error: null,
      embedding: JSON.stringify(embedding),
      text: text
    };
  } catch (error) {
    return {
      error: 'Failed to embed text: ' + (error as Error).message,
      message: null,
      embedding: null,
      text: null
    };
  }
}

export async function queryVectorDatabase(prevState: QueryVectorEmbeddingState, formData: FormData): Promise<QueryVectorEmbeddingState> {
  const query = formData.get('query') as string;

  if (!query) {
    return {
      error: 'Please enter a query to search the vector database',
      query: null
    }
  }

  try {
    const embedding = await textEmbedder(query);

    const response = await fetch(`http://localhost:3000/api/query-vector-embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ queryEmbedding: embedding })
    });

    if (!response.ok) {
      throw new Error('Failed to query vector database')
    }

    const data = await response.json() as {
      success: boolean;
      data?: any;
      error?: { message: string }
    };

    if (!data.success) {
      throw new Error(data.error?.message || 'Failed to query vector database');
    }

    return {
      error: null,
      query: data.data
    }
  } catch (error) {
    return {
      error: 'Failed to query vector database: ' + (error as Error).message,
      query: null
    }
  }
}