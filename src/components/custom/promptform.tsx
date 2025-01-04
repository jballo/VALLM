"use client";

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
    // const [prompt, setPrompt] = useState<string>("");
    // const [url, setUrl] = useState<string>("");

    // const submitPrompt = async (e: React.FormEvent) => {
    //     e.preventDefault();

    //     try {
    //         const response = await createResponse(prompt, url);

    //         if (!response.success) {
    //             throw new Error(response.error || "Failed to generate response");
    //         }
    //         if (response.responses && response.responses.length > 0){
    //             console.log("Generated Responses: ", response.responses);
    //             const resps: LLMResponses[] = [];
    //             response.responses.map((response) => {
    //                 const res = {
    //                     llm_name: response.llm_name,
    //                     llm_response: response.llm_response,
    //                 } 
    //                 resps.push(res);
    //             })
    //             setResponses(resps)
    //         }
            
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // const submitForRag = async (e: React.FormEvent) => {
    //     e.preventDefault();

    //     try {
    //         const response = await ragRetrieval(prompt, url);
    //         if (!response.success) {
    //             throw new Error(response.error || "Failed to generate response");
    //         }
    //         const content = response.response;
    //         console.log("Content: ", content);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

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
        <div className="flex flex-col gap-4 w-full">
            <div className="w-full">
                <p>URL</p>
                <div className="flex flex-row gap-3">
                    <Input 
                        type="text"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                    />
                    <Button
                        onClick={submitUrl}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    )
}