"use client";

import { useState } from "react";
import Header from "./header";
import PromptForm from "./promptform";
import LLMResponseComparison from "./llm-response-comparison";


interface CreateEmbeddingProp {
    createEmbedding: (
        url: string
    ) => Promise<{ success: boolean; response?: string; error?: string }>
}


interface DashboardProps {
  createEmbedding: CreateEmbeddingProp["createEmbedding"];
}



export default function Dashboard({ createEmbedding}: DashboardProps) {
    const [url, setUrl] = useState<string>("");

    return (
        <div className="w-full min-h-screen p-12 flex flex-col gap-6">
              <Header />
              <PromptForm createEmbedding={createEmbedding} url={url} setUrl={setUrl}/>
              <LLMResponseComparison url={url}/>
        </div>
    );
}