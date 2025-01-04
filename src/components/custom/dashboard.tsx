"use client";

import { useState } from "react";
import Header from "./header";
import PromptForm from "./promptform";
import TextComparison from "./textComparison";

interface LLMResponses {
    llm_name: string;
    llm_response: string;
}

interface CreateResponseProps {
    createResponse: (
        text: string,
        url: string
    ) => Promise<{ success: boolean; responses?: LLMResponses[]; error?: string;}>
}

interface CreateEmbeddingProp {
    createEmbedding: (
        url: string
    ) => Promise<{ success: boolean; response?: string; error?: string }>
}

interface RagProps {
    ragRetrieval: (
        prompt: string,
        url: string
    ) => Promise<{ success: boolean; response?: string; error?: string }>
}

interface DashboardProps {
  createResponse: CreateResponseProps["createResponse"];
  createEmbedding: CreateEmbeddingProp["createEmbedding"];
  ragRetrieval: RagProps["ragRetrieval"];
}



export default function Dashboard({createResponse, createEmbedding, ragRetrieval}: DashboardProps) {
    const [responses, setResponses] = useState<LLMResponses[]>([]);


    return (
        <div className="w-full min-h-screen p-12 flex flex-col gap-6">
              <Header />
              <PromptForm createResponse={createResponse} setResponses={setResponses} createEmbedding={createEmbedding} ragRetrieval={ragRetrieval}/>
              <TextComparison responses={responses} />
        </div>
    );
}