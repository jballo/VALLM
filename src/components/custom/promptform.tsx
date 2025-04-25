"use client";

import { Globe } from "lucide-react";
// import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";


// interface LLMResponses {
//     llm_name: string;
//     llm_response: string;
// }

// interface CreateResponseProps {
//     createResponse: (
//         text: string,
//         url: string
//     ) => Promise<{ success: boolean; responses?: LLMResponses[]; error?: string;}>
// }

// interface SetResponesProp {
//     setResponses: (responses: LLMResponses[]) => void;
// }

interface CreateEmbeddingProp {
    createEmbedding: (
        url: string
    ) => Promise<{ success: boolean; response?: string; error?: string }>
}


interface PromptFormProps {
  createEmbedding: CreateEmbeddingProp["createEmbedding"];
  url: string;
  setUrl: (url: string) => void;
}

export default function PromptForm( { createEmbedding, url, setUrl }: PromptFormProps) {

    const submitUrl = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await createEmbedding(url);

            if (!response.success) {
                throw new Error(response.error || "Failed to create embedding of url");
            }
            console.log("Response: ", response.response);
            
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div className="flex flex-col w-full bg-[#0e2232] text-white p-4 rounded-lg">
            <div className="w-full flex flex-col gap-2">
                <div className="flex flex-row gap-6">
                    <div className="flex flex-row gap-1">
                        <Globe  className="text-[#36c5b3] w-5"/>
                        <p className="text-md"> URL Scraper</p>
                    </div>
                    <div className="flex flex-row items-end mb-0.5">
                        <p className="text-xs text-muted-foreground">Scrape content from a URL to use as context for all test cases</p>
                    </div>
                </div>
                <div className="flex flex-row gap-3">
                    <Input 
                        type="text"
                        value={url}
                        className="bg-[#213342] text-[#b1b7bd] border-[#3F4E5D]"
                        placeholder="https://example.com/page-to-scrape"
                        onChange={e => setUrl(e.target.value)}
                    />
                    <Button
                        className="bg-[#36c5b3]"
                        onClick={submitUrl}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    )
}