import EmbedForm from "@/components/EmbedForm";
import QueryVectorEmbeddings from "@/components/QueryVectorEmbeddings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-cyan-950 to-white">
      <div className="max-w-[2000px] mx-auto px-4 py-12 lg:py-16">
        <div className="mb-8 lg:mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-50 to-cyan-200 mb-4">
            Text Embeddings and Vector Store
          </h1>
          <p className="text-white">
            Transform your text into vector embeddings using OpenAI's powerful
            model and store them in a Supabase PostgreSQL pgvector database—all
            in one elegant interface.
          </p>
        </div>
        <Tabs defaultValue="embed" className="w-full">
          <TabsList>
            <TabsTrigger value="embed">Embed</TabsTrigger>
            <TabsTrigger value="query">Query (Similarity Search)</TabsTrigger>
          </TabsList>
          <TabsContent value="embed">
            <EmbedForm />
          </TabsContent>
          <TabsContent value="query">
            <QueryVectorEmbeddings />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
