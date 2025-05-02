"use client";

import { Globe, TriangleAlert, X } from "lucide-react";
// import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { Alert, AlertDescription } from "../ui/alert";


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
    const [urlAlert, setUrlAlert] = useState<boolean>(false);


    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch (error) {
            console.log("Note valid url: Error: ", error);
            return false;
        }
        // const pattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*$/;
        // const valid = pattern.test(url);
        // console.log(`Valid URL (${url}): `, valid);
        // return valid;
    };

    const submitUrl = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValidUrl(url)){
            setUrlAlert(true);
            return;
        }

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
                { urlAlert && (
                    <div className="flex flex-row justify-center w-full">
                        <Alert variant="destructive" className="flex flex-row justify-between items-center w-full h-[40px]">
                            <AlertDescription className="flex flex-row items-center text-center gap-3">
                                <TriangleAlert />
                                Invalid URL Submitted
                            </AlertDescription>
                            <Button 
                                variant="destructive" 
                                className="w-7 h-7"
                                onClick={() => setUrlAlert(false)}
                            >
                                <X />
                            </Button>
                        </Alert>
                    </div>
                )}
            </div>
        </div>
    )
}