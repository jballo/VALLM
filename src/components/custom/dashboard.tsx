"use client";

import { useState } from "react";
import Header from "./header";
import PromptForm from "./promptform";
import LLMResponseComparison from "./llm-response-comparison";

interface LLMResponses {
    llm_name: string;
    llm_response: string;
    llm_relevancy_score: number;
}

interface CreateResponseProps {
    createResponse: (
        text: string,
        url: string
    ) => Promise<{ success: boolean; response?: LLMResponses[]; error?: string;}>
}

interface CreateEmbeddingProp {
    createEmbedding: (
        url: string
    ) => Promise<{ success: boolean; response?: string; error?: string }>
}


interface DashboardProps {
  createResponse: CreateResponseProps["createResponse"];
  createEmbedding: CreateEmbeddingProp["createEmbedding"];
}



export default function Dashboard({createResponse, createEmbedding}: DashboardProps) {
    const [url, setUrl] = useState<string>("");

    return (
        <div className="w-full min-h-screen p-12 flex flex-col gap-6">
              <Header />
              <PromptForm createEmbedding={createEmbedding} url={url} setUrl={setUrl}/>
              <LLMResponseComparison url={url} createResponse={createResponse}/>
        </div>
    );
}