"use client";

import { queryVectorDatabase } from "@/lib/actions";
import { useActionState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Loader2Icon } from "lucide-react";

export type QueryVectorEmbeddingState = {
  error?: string | null;
  query: any | null;
};

export default function QueryVectorEmbeddings() {
  const [errors, queryAction, isQueryPending] = useActionState<
    QueryVectorEmbeddingState,
    FormData
  >(queryVectorDatabase, {
    error: null,
    query: null,
  });

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="w-full bg-white backdrop-blur-sm shadow-sm p-8 flex flex-col gap-6 border border-neutral-200">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold mb-4">Query Vector Embeddings</h2>
          <p className="text-neutral-600 text-base">
            Query the vector embedding from Supabase pgvector database.
          </p>
        </div>
        <form action={queryAction}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="query" className="text-neutral-600 text-sm">
                Query
              </Label>
              <Input
                type="text"
                name="query"
                id="query"
                placeholder="Enter a query to search the vector database"
                className="w-full p-2 border border-neutral-200 rounded-md"
              />
              {errors?.error && (
                <p className="text-red-500 text-sm">{errors.error}</p>
              )}
            </div>
            <Button type="submit" disabled={isQueryPending}>
              {isQueryPending ? (
                <span className="flex items-center gap-2">
                  <Loader2Icon className="w-4 h-4 animate-spin" />
                  Querying Vector Database...
                </span>
              ) : (
                "Query"
              )}
            </Button>
          </div>
        </form>
      </div>

      <div className="w-full bg-white backdrop-blur-sm shadow-sm p-8 flex flex-col gap-6 border border-neutral-200">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold mb-4">Search Results</h2>
          <p className="text-neutral-600 text-base">
            View the most similar documents from the vector database.
          </p>
        </div>

        <div className="flex-1 overflow-hidden">
          {errors?.query ? (
            <div className="h-full overflow-y-auto pr-2 space-y-4">
              {Array.isArray(errors.query) ? (
                errors.query.map((result: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 truncate"
                  >
                    <p className="text-neutral-800">{result.content}</p>
                    <p className="text-sm text-neutral-500 mt-2">
                      Similarity: {(result.similarity * 100).toFixed(2)}%
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-neutral-600">No results found</p>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-neutral-600 text-center">
                Enter a query to see similar documents
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
