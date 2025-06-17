"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { embedText } from "@/lib/actions";
import { CheckIcon, LoaderCircleIcon } from "lucide-react";
import { useActionState, useState, useEffect } from "react";

export type TextEmbeddingFormState =
  | {
      message?: string | null;
      error?: string | null;
      embedding?: string | null;
      text?: string | null;
    }
  | undefined;

export interface VectorDatabaseData {
  id: number;
  content: string;
  embedding: string;
}

export default function EmbedForm() {
  const [state, formAction, isEmbedPending] = useActionState<
    TextEmbeddingFormState,
    FormData
  >(embedText, undefined);
  const [pushingToVectorDatabase, setPushingToVectorDatabase] = useState(false);
  const [text, setText] = useState("");
  const [vectorDatabaseData, setVectorDatabaseData] =
    useState<VectorDatabaseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (state?.embedding) {
      setText(state.embedding);
    }
  }, [state?.embedding]);

  useEffect(() => {
    if (state?.error) {
      setError(state.error);
    }
  }, [state?.error]);

  const handlePushToVectorDatabase = async () => {
    if (!state?.embedding) {
      setError("Please embed the text first");
      return;
    }

    setPushingToVectorDatabase(true);

    try {
      const response = await fetch("/api/push-to-vector-database", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: state.text,
          embeddingVector: JSON.parse(state.embedding),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to push to vector database");
      }

      const data = (await response.json()) as VectorDatabaseData;
      setVectorDatabaseData(data);
      setPushingToVectorDatabase(false);
      setText(state?.text || "");
      setSuccessMessage("Text pushed to vector database successfully");
      setError(null);
    } catch (error) {
      console.error("Error pushing to vector database: ", error);
      setPushingToVectorDatabase(false);
      setError("Failed to push to vector database");
      setSuccessMessage(null);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="w-full bg-white dark:bg-neutral-900 backdrop-blur-sm shadow-sm p-8 flex flex-col gap-6 border border-neutral-200 dark:border-neutral-800">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400">
              Text to Embedding
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-base">
              Transform your text into powerful vector embeddings with a single
              click.
            </p>
          </div>
          <form action={formAction} className="flex flex-col gap-6 w-full">
            <div className="flex gap-4">
              <div className="flex flex-col gap-3 w-full">
                <Label
                  htmlFor="embed-textarea"
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-base"
                >
                  Your Text
                </Label>
                <Textarea
                  id="embed-textarea"
                  name="text"
                  rows={10}
                  placeholder="Enter your text here to generate its vector embedding using OpenAI's text embedding model and push it to the vector database"
                  className="w-full min-h-40 resize-y rounded-xl border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all"
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            </div>
            {error && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {error}
                </p>
              </div>
            )}
            {successMessage && (
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900">
                <p className="text-green-600 dark:text-green-400 text-sm">
                  {successMessage}
                </p>
              </div>
            )}
            {state?.embedding && (
              <div className="mt-2 w-full">
                <h3 className="font-semibold mb-3 text-neutral-800 dark:text-neutral-200 text-lg">
                  Embedding Result:
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                  Embed vector length: {JSON.parse(state.embedding).length}
                </p>
                <pre className="font-mono bg-neutral-50 dark:bg-neutral-800 text-sm p-6 rounded-xl overflow-x-auto text-neutral-800 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800 max-h-[200px] overflow-y-auto">
                  {JSON.stringify(state.embedding, null, 2)}
                </pre>
              </div>
            )}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={isEmbedPending || !state?.embedding}
                className="px-8 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                onClick={() => {
                  if (!vectorDatabaseData) {
                    handlePushToVectorDatabase();
                  }
                }}
              >
                {pushingToVectorDatabase ? (
                  vectorDatabaseData ? (
                    <div>
                      <CheckIcon className="w-4 h-4" />
                      Pushed to Vector Database
                    </div>
                  ) : (
                    <div className="flex justify-center items-center gap-2">
                      <LoaderCircleIcon className="w-4 h-4 animate-spin" />
                      Pushing to Vector Database...
                    </div>
                  )
                ) : (
                  "Push to Vector Database"
                )}
              </Button>
              <Button
                type="submit"
                disabled={isEmbedPending}
                className="px-8 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900 transition-colors"
              >
                {isEmbedPending ? (
                  <div className="flex justify-center items-center gap-2">
                    <LoaderCircleIcon className="w-4 h-4 animate-spin" />
                    Embedding...
                  </div>
                ) : (
                  "Embed Text"
                )}
              </Button>
            </div>
          </form>
        </div>

        <div className="w-full bg-white dark:bg-neutral-900 backdrop-blur-sm shadow-sm p-8 flex flex-col gap-6 border border-neutral-200 dark:border-neutral-800">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400">
              Vector Embedding Database Response
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-base">
              View the stored vector embedding from Supabase pgvector database.
            </p>
          </div>

          {vectorDatabaseData ? (
            <div className="space-y-6">
              <div className="p-6 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Stored Content
                </h3>
                <p className="text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap">
                  {vectorDatabaseData.content}
                </p>
              </div>

              <div className="p-6 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Vector Embedding
                </h3>
                <pre className="font-mono text-sm overflow-x-auto text-neutral-800 dark:text-neutral-200 max-h-[200px] overflow-y-auto">
                  {JSON.stringify(vectorDatabaseData.embedding, null, 2)}
                </pre>
              </div>

              <div className="p-6 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Record ID
                </h3>
                <p className="text-neutral-800 dark:text-neutral-200">
                  #{vectorDatabaseData.id}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-neutral-600 dark:text-neutral-400 text-center">
                Push text to vector database to see the stored data here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
