import EmbedForm from "@/components/EmbedForm";

export default async function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <div className="max-w-[2000px] mx-auto px-4 py-12 lg:py-16">
        <div className="mb-8 lg:mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 mb-4">
            Text Embeddings and Vector Store
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Transform your text into vector embeddings using OpenAI's powerful model and store them in a Supabase PostgreSQL pgvector database—all in one elegant interface.
          </p>
        </div>
        <EmbedForm />
      </div>
    </main>
  );
}
