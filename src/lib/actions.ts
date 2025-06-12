'use server';

import { TextEmbeddingFormState } from "@/components/EmbedForm";
import textEmbedder from "./engines/textEmbedder";

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