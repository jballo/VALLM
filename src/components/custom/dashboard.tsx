"use client";

import { useEffect, useState } from "react";
import Header from "./header";
import PromptForm from "./promptform";
import LLMResponseComparison from "./llm-response-comparison";
import Sidebar from "./sidebar";
import { v4 as uuidv4 } from "uuid";


interface TestCase {
  id: string;
  prompt: string;
  expectedOutput: string;
}

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
    const [testCases, setTestCases] = useState<TestCase[]>([]);
    const [currentTestCase, setCurrentTestCase] = useState<string>("");

    const addTestCase = () => {
        const id = uuidv4();
        // setTestCases([...testCases, { id: id, prompt: "", expectedOutput: "" }]);
        setTestCases((prev) => [...prev, { id: id, prompt: "", expectedOutput: "" }]);
        // setTabVal(id);
        setCurrentTestCase(id);
    };

    useEffect(() => {
        addTestCase();
    }, []);
    
    useEffect(() => {
        console.log("Test cases: ", testCases);
    }, [testCases]);

    useEffect(() => {
        console.log("Current test case: ", currentTestCase);
    }, [currentTestCase]);

    return (
        <div className="w-full min-h-screen p-12 flex flex-col gap-6">
              <Header />
              <div className="flex flex-row h-full">
                <Sidebar testCases={testCases} addTestCase={addTestCase} setCurrentTestCase={setCurrentTestCase}/>
                <div className="w-full">
                    <PromptForm createEmbedding={createEmbedding} url={url} setUrl={setUrl}/>
                    <LLMResponseComparison 
                        // url={url}
                    />
                </div>
              </div>
        </div>
    );
}