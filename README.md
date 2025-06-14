# Text Embeddings and Vector Store

A modern web application that demonstrates the power of text embeddings and vector databases. This project showcases the integration of OpenAI's text embedding model with Supabase's PostgreSQL pgvector database, providing a seamless interface for text-to-vector conversion and storage.

## Features

- 🔤 Text to Vector Embedding: Transform any text into vector embeddings using OpenAI's powerful model
- 🗄️ Vector Database Storage: Store embeddings in Supabase's PostgreSQL pgvector database
- 🎨 Modern UI: Built with Next.js 14, Tailwind CSS, and shadcn/ui components
- ⚡ Real-time Feedback: Instant visual feedback for all operations
- 🔒 Type Safety: Built with TypeScript for robust type checking

## Tech Stack

- **Frontend:**
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - shadcn/ui Components
  - React Server Actions

- **Backend:**
  - Next.js API Routes
  - OpenAI API (Text Embeddings)
  - Supabase (PostgreSQL with pgvector)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/text-embedding-and-vector-store.git
cd text-embedding-and-vector-store
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```env
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_API_KEY=your_supabase_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/         # React components
│   ├── lib/               # Utility functions and actions
│   └── types/             # TypeScript type definitions
├── public/                # Static assets
└── ...config files
```

## Key Features Implementation

- **Text Embedding:** Utilizes OpenAI's text-embedding-ada-002 model for generating vector embeddings
- **Vector Storage:** Implements Supabase's pgvector extension for efficient vector storage and similarity search
- **Real-time UI Updates:** Uses React Server Actions for seamless data flow
- **Responsive Design:** Fully responsive layout with modern UI components

## Contributing

Feel free to submit issues and enhancement requests!