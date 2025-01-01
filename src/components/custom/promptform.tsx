"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";




export default function PromptForm() {
    const [prompt, setPrompt] = useState<string>("");

    return (
        <div className="flex flex-row gap-3">
            <Input
                type="text"
                value={prompt} 
                onChange={e => setPrompt(e.target.value)}
            />
            <Button>Submit</Button>
        </div>
    )
}