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
            Search for semantically similar content in the vector database using
            natural language.
          </p>
        </div>
        <form action={queryAction}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="query"
                className="text-neutral-600 text-sm font-medium"
              >
                Search Query
              </Label>
              <Input
                type="text"
                name="query"
                id="query"
                placeholder="Enter your search query (e.g., 'Tell me about machine learning')"
                className="w-full p-2 border border-neutral-200 rounded-md focus:ring-2 focus:ring-neutral-400 transition-all"
              />
              {errors?.error && (
                <p className="text-red-500 text-sm mt-1">{errors.error}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isQueryPending}
              className="w-full sm:w-auto"
            >
              {isQueryPending ? (
                <span className="flex items-center gap-2">
                  <Loader2Icon className="w-4 h-4 animate-spin" />
                  Searching...
                </span>
              ) : (
                "Search Similar Content"
              )}
            </Button>
          </div>
        </form>
      </div>

      <div className="w-full bg-white backdrop-blur-sm shadow-sm p-8 flex flex-col gap-6 border border-neutral-200">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold mb-4">Search Results</h2>
          <p className="text-neutral-600 text-base">
            {errors?.query
              ? "Found semantically similar content based on your query"
              : "Results will appear here after you search"}
          </p>
        </div>

        <div className="flex-1 overflow-hidden">
          {errors?.query ? (
            <div className="h-full overflow-y-auto pr-2 space-y-4">
              {Array.isArray(errors.query) ? (
                <>
                  <div className="text-sm text-neutral-500 mb-2">
                    Showing {errors.query.length} most similar results
                  </div>
                  {errors.query.map((result: any, index: number) => (
                    <div
                      key={index}
                      className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 hover:bg-neutral-100 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-neutral-700">
                          Result #{index + 1}
                        </span>
                        <span className="text-sm font-medium text-emerald-600">
                          {(result.similarity * 100).toFixed(1)}% Match
                        </span>
                      </div>
                      <p className="text-neutral-800 line-clamp-3">
                        {result.content}
                      </p>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(result.content)
                        }
                        className="mt-2 text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
                      >
                        Copy Content
                      </button>
                    </div>
                  ))}
                </>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-neutral-600 text-center">
                    No similar content found. Try a different query.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-2">
                <p className="text-neutral-600">
                  Enter a search query to find similar content
                </p>
                <p className="text-sm text-neutral-500">
                  The search uses semantic similarity to find relevant content
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
