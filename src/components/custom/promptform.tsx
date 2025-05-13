"use client";

import { Globe, Info, TriangleAlert, X } from "lucide-react";
// import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { Alert, AlertDescription } from "../ui/alert";
import { Badge } from "../ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import UrlScraper from "./UrlScraper";

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
  ) => Promise<{ success: boolean; response?: string; error?: string }>;
}

interface PromptFormProps {
  createEmbedding: CreateEmbeddingProp["createEmbedding"];
  url: string;
  setUrl: (url: string) => void;
}

export default function PromptForm({
  createEmbedding,
  url,
  setUrl,
}: PromptFormProps) {
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

    if (!isValidUrl(url)) {
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
  };
  return (
    <div className="flex flex-col w-full text-white">
      <div className="w-full flex flex-col gap-2 p-4">
        <div className="flex flex-row gap-6">
          <div className=" w-full flex flex-row justify-between content-between gap-6">
            <div className="flex flex-row gap-6 items-center">
              <p className="text-xl"> Text Context</p>
              <Badge className="h-4 bg-[#162838]">No External Context</Badge>
            </div>
            <div className="flex flex-row mb-0.5">
              <UrlScraper />
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-3 bg-[#162838] rounded-lg p-3">
          <Info className="w-[20px]" />
          <p className="text-[#AEB4BA] text-sm">
            No URL content loaded. Test cases will use only the prompts you
            provide. Add URL contentif you want to test LLMs against specific
            web content.
          </p>
        </div>
        {urlAlert && (
          <div className="flex flex-row justify-center w-full">
            <Alert
              variant="destructive"
              className="flex flex-row justify-between items-center w-full h-[40px]"
            >
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
  );
}
