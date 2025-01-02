"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";


interface LLMResponses {
    llm_name: string;
    llm_response: string;
}

interface CreateResponseProps {
    createResponse: (
        text: string
    ) => Promise<{ success: boolean; responses?: LLMResponses[]; error?: string;}>
}

interface SetResponesProp {
    setResponses: (responses: LLMResponses[]) => void;
}

interface PromptFormProps {
  createResponse: CreateResponseProps["createResponse"];
  setResponses: SetResponesProp["setResponses"];
}

export default function PromptForm( {createResponse, setResponses}: PromptFormProps) {
    const [prompt, setPrompt] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await createResponse(prompt);

            if (!response.success) {
                throw new Error(response.error || "Failed to generate response");
            }
            if (response.responses && response.responses.length > 0){
                console.log("Generated Responses: ", response.responses);
                const resps: LLMResponses[] = [];
                response.responses.map((response) => {
                    const res = {
                        llm_name: response.llm_name,
                        llm_response: response.llm_response,
                    } 
                    resps.push(res);
                })
                setResponses(resps)
            }
            
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div className="flex flex-row gap-3">
            <Input
                type="text"
                value={prompt} 
                onChange={e => setPrompt(e.target.value)}
            />
            <Button
                onClick={handleSubmit}
            >
                Submit
            </Button>
        </div>
    )
}