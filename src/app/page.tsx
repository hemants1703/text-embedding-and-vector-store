import EmbedForm from "@/components/EmbedForm";

export default async function Home() {
  return (
    <main className="flex flex-col gap-10 items-start justify-center h-screen max-w-screen-md mx-auto">
      <div>
        <h1 className="text-4xl font-bold">Text Embeddings and Vector Store</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">This project is a web app that lets users input any text, generate its vector embedding using OpenAI's text embedding model, and then store that embedding in a vector database. It provides a simple, user-friendly interface for experimenting with text embeddings and vector storage, making it useful for learning, prototyping, or building AI-powered search and retrieval features.</p>
      </div>
      <EmbedForm />
    </main>
  );
}
