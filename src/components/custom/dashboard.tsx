"use client";

import { useState } from "react";
import Header from "./header";
import PromptForm from "./promptform";
// import TextComparison from "./textComparison";
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
//   ragRetrieval: RagProps["ragRetrieval"];
}



export default function Dashboard({createResponse, createEmbedding}: DashboardProps) {
    const [url, setUrl] = useState<string>("");
    // const [responses, setResponses] = useState<LLMResponses[]>([]);

    return (
        <div className="w-full min-h-screen p-12 flex flex-col gap-6">
              <Header />
              <PromptForm createEmbedding={createEmbedding} url={url} setUrl={setUrl}/>
              {/* <TextComparison responses={responses} /> */}
              <LLMResponseComparison url={url} createResponse={createResponse}/>
        </div>
    );
}