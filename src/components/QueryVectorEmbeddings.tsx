"use client";

import { queryVectorDatabase } from "@/lib/actions";
import { useActionState, useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Loader2Icon, Eye } from "lucide-react";
import VectorPlot3D from "./VectorPlot3D";

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

  const [selectedVector, setSelectedVector] = useState<any | null>(null);
  const [showVisualization, setShowVisualization] = useState(false);

  return (
    <div className="w-full space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="w-full bg-white backdrop-blur-sm shadow-sm p-8 flex flex-col gap-6 border border-neutral-200">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold mb-4">Query Vector Embeddings</h2>
            <p className="text-neutral-600 text-base">
              Search for semantically similar content in the vector database
              using natural language.
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
                        className={`p-4 rounded-lg border transition-all cursor-pointer ${
                          selectedVector?.id === result.id
                            ? "bg-blue-50 border-blue-300 ring-2 ring-blue-100"
                            : "bg-neutral-50 border-neutral-200 hover:bg-neutral-100"
                        }`}
                        onClick={() => {
                          setSelectedVector(result);
                          setShowVisualization(true);
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-neutral-700">
                            Result #{index + 1} (ID: {result.id})
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-emerald-600">
                              {(result.similarity * 100).toFixed(1)}% Match
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedVector(result);
                                setShowVisualization(true);
                              }}
                              className="h-7 px-2"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View 3D
                            </Button>
                          </div>
                        </div>
                        <p className="text-neutral-800 line-clamp-3">
                          {result.content}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(result.content);
                          }}
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

      {/* 3D Vector Visualization Section */}
      {showVisualization && selectedVector && (
        <div className="w-full bg-white backdrop-blur-sm shadow-sm p-8 border border-neutral-200 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-neutral-900">
                3D Vector Visualization
              </h3>
              <p className="text-neutral-600 mt-1">
                Interactive 3D representation of the selected vector embedding
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowVisualization(false)}
              className="text-neutral-600 hover:text-neutral-800"
            >
              Close Visualization
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <VectorPlot3D
                embedding={(() => {
                  try {
                    console.log("=== VectorPlot3D Debug ===");
                    console.log("Full selected vector object:", selectedVector);
                    console.log(
                      "Selected vector keys:",
                      Object.keys(selectedVector)
                    );
                    console.log(
                      "Selected vector embedding type:",
                      typeof selectedVector.embedding
                    );

                    let embedding = null;

                    // Handle string format (JSON)
                    if (typeof selectedVector.embedding === "string") {
                      console.log("Parsing string embedding...");
                      embedding = JSON.parse(selectedVector.embedding);
                    }
                    // Handle array format
                    else if (Array.isArray(selectedVector.embedding)) {
                      console.log("Using array embedding...");
                      embedding = selectedVector.embedding;
                    }
                    // Handle other possible field names
                    else if (selectedVector.vector) {
                      console.log("Found vector field...");
                      embedding = Array.isArray(selectedVector.vector)
                        ? selectedVector.vector
                        : JSON.parse(selectedVector.vector);
                    } else if (selectedVector.values) {
                      console.log("Found values field...");
                      embedding = Array.isArray(selectedVector.values)
                        ? selectedVector.values
                        : JSON.parse(selectedVector.values);
                    } else {
                      console.error(
                        "No valid embedding field found. Available fields:",
                        Object.keys(selectedVector)
                      );
                      return [];
                    }

                    console.log("Final embedding length:", embedding?.length);
                    console.log("=== End VectorPlot3D Debug ===");

                    return embedding || [];
                  } catch (error) {
                    console.error("Error processing embedding:", error);
                    return [];
                  }
                })()}
                allEmbeddings={(() => {
                  // Extract all embeddings for better PCA if available
                  if (errors?.query && Array.isArray(errors.query)) {
                    try {
                      const allEmbs = errors.query
                        .map((result: any) => {
                          if (typeof result.embedding === "string") {
                            return JSON.parse(result.embedding);
                          } else if (Array.isArray(result.embedding)) {
                            return result.embedding;
                          } else if (result.vector) {
                            return Array.isArray(result.vector)
                              ? result.vector
                              : JSON.parse(result.vector);
                          } else if (result.values) {
                            return Array.isArray(result.values)
                              ? result.values
                              : JSON.parse(result.values);
                          }
                          return null;
                        })
                        .filter((emb) => emb !== null);

                      console.log(
                        "Extracted",
                        allEmbs.length,
                        "embeddings for PCA"
                      );
                      return allEmbs.length > 1 ? allEmbs : undefined;
                    } catch (error) {
                      console.error("Error extracting all embeddings:", error);
                      return undefined;
                    }
                  }
                  return undefined;
                })()}
                highlightIndex={(() => {
                  // Find the index of the selected vector in the results
                  if (errors?.query && Array.isArray(errors.query)) {
                    return errors.query.findIndex(
                      (result: any) => result.id === selectedVector.id
                    );
                  }
                  return 0;
                })()}
                className="rounded-lg overflow-hidden border border-neutral-200"
              />
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <h4 className="font-semibold text-neutral-900 mb-2">
                  Selected Content
                </h4>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {selectedVector.content}
                </p>
              </div>

              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <h4 className="font-semibold text-neutral-900 mb-2">
                  Vector Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">ID:</span>
                    <span className="font-mono">{selectedVector.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Similarity:</span>
                    <span className="font-mono text-emerald-600">
                      {(selectedVector.similarity * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Vector Length:</span>
                    <span className="font-mono">
                      {(() => {
                        try {
                          let embedding = null;

                          if (typeof selectedVector.embedding === "string") {
                            embedding = JSON.parse(selectedVector.embedding);
                          } else if (Array.isArray(selectedVector.embedding)) {
                            embedding = selectedVector.embedding;
                          } else if (selectedVector.vector) {
                            embedding = Array.isArray(selectedVector.vector)
                              ? selectedVector.vector
                              : JSON.parse(selectedVector.vector);
                          } else if (selectedVector.values) {
                            embedding = Array.isArray(selectedVector.values)
                              ? selectedVector.values
                              : JSON.parse(selectedVector.values);
                          }

                          return embedding?.length || "Unknown";
                        } catch {
                          return "Unknown";
                        }
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">
                  💡 3D Visualization Info
                </h4>
                <div className="text-sm text-blue-700 space-y-2">
                  <p>
                    <strong>Method:</strong> PCA Dimensionality Reduction
                  </p>
                  <p>
                    <strong>Conversion:</strong> 1536D → 3D projection
                  </p>
                  <div className="border-t border-blue-200 pt-2 mt-2">
                    <p>
                      <strong>Controls:</strong>
                    </p>
                    <ul className="space-y-1 ml-2">
                      <li>• Drag to rotate the view</li>
                      <li>• Scroll to zoom in/out</li>
                      <li>• Right-click drag to pan</li>
                      <li>• Points preserve semantic relationships</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
