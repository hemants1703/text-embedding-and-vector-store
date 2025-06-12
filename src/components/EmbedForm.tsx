"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { embedText } from "@/lib/actions";
import { LoaderCircleIcon } from "lucide-react";
import { useActionState, useState } from "react";

export type TextEmbeddingFormState = {
  message?: string | null;
  error?: string | null;
  embedding?: string | null;
  text?: string | null;
} | undefined;

export default function EmbedForm() {
  const [state, formAction, isEmbedPending] = useActionState<TextEmbeddingFormState, FormData>(embedText, undefined);
  const [pushingToVectorDatabase, setPushingToVectorDatabase] = useState(false);

  const handlePushToVectorDatabase = async () => {
    setPushingToVectorDatabase(true);
  }

  return (
    <div className="w-full flex justify-center items-center px-2">
      <div className="w-full bg-white dark:bg-zinc-900 shadow-sm p-6 md:p-10 flex flex-col gap-6 border border-zinc-200 dark:border-zinc-800">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100">Text to Embedding</h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base">Paste or type your text below to generate its vector embedding.</p>
        </div>
        <form
          action={formAction}
          className="flex flex-col gap-4 w-full"
        >
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="embed-textarea" className="font-medium text-zinc-800 dark:text-zinc-200 text-sm md:text-base">Your Text</Label>
            <Textarea
              id="embed-textarea"
              name="text"
              rows={10}
              placeholder="Enter your text here to generate its vector embedding using OpenAI's text embedding model and push it to the vector database"
              className="w-full min-h-32 md:min-h-40 resize-y"
              value={state?.text || ""}
            />
          </div>
          {state?.error && <p className="text-red-500 text-sm mt-1">{state.error}</p>}
          {state?.message && <p className="text-green-500 text-sm mt-1">{state.message}</p>}
          {state?.embedding && (
            <div className="mt-2 w-full">
              <h3 className="font-semibold mb-2 text-zinc-800 dark:text-zinc-200">Embedding Result:</h3>
              <pre className="font-mono bg-gray-100 dark:bg-zinc-800 text-xs md:text-sm p-4 rounded-md overflow-x-auto text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700">
                {JSON.stringify(state.embedding, null, 2)}
              </pre>
            </div>
          )}
          <div className="flex gap-2 justify-between">
            <Button type="button" variant={"outline"} disabled={isEmbedPending || !state?.embedding} className="flex-1 hover:cursor-pointer" onClick={handlePushToVectorDatabase}>
              {pushingToVectorDatabase ? <div className="flex justify-center items-center gap-2"><LoaderCircleIcon className="w-4 h-4 animate-spin" /> Pushing to Vector Database...</div> : "Push to Vector Database"}
            </Button>
            <Button type="submit" disabled={isEmbedPending} className="flex-1 hover:cursor-pointer">
              {isEmbedPending ? <div className="flex justify-center items-center gap-2"><LoaderCircleIcon className="w-4 h-4 animate-spin" /> Embedding...</div> : "Embed Text"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
