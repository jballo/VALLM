"use client";

import { Card, CardContent, CardHeader } from "../ui/card";


interface LLMResponses {
    llm_name: string;
    llm_response: string;
}

interface TextComparisonProps {
    responses: LLMResponses[];
}


export default function TextComparison({responses}: TextComparisonProps){
    return(
        <div className=" w-full h-full grid sm:grid-cols-1 md:grid-cols-2  place-items-center gap-3">
            {responses && (
                responses.map((response, index) => (
                    <Card key={index} className="w-full h-full bg-black text-white">
                        <CardHeader>{response.llm_name}</CardHeader>
                        <CardContent>{response.llm_response}</CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}