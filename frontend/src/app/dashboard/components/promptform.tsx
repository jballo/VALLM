"use client";

import { Info } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { Badge } from "@/components/ui/badge";
import UrlScraper from "./UrlScraper";

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
  const [scrapedContent, setScrapedContent] = useState<string>("");

  return (
    <div className="flex flex-col w-full text-white">
      <div className="w-full flex flex-col gap-2 p-4">
        <div className="flex flex-row gap-6">
          <div className=" w-full flex flex-row justify-between content-between gap-6">
            <div className="flex flex-row gap-6 items-center">
              <p className="text-xl"> Text Context</p>
              <Badge
                className={clsx("h-6 rounded-lg", {
                  "bg-[#042935] text-[#37C5B4]": scrapedContent,
                  "bg-[#162838] text-white": !scrapedContent,
                })}
              >
                {scrapedContent ? <>URL Content Loaded</> : <>No Context</>}
              </Badge>
            </div>
            <div className="flex flex-row mb-0.5">
              <UrlScraper
                url={url}
                setUrl={setUrl}
                createEmbedding={createEmbedding}
                scrapedContent={scrapedContent}
                setScrapedContent={setScrapedContent}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-3 bg-[#162838] rounded-lg p-3">
          <Info className="w-[20px]" />
          <div className="text-[#AEB4BA] text-xs">
            {scrapedContent ? (
              <div className="flex flex-col gap-2">
                <h3 className="flex flex-row gap-3">
                  <p>URL: </p> <p className="text-[#37C5B4]">{url}</p>
                </h3>
                <p>
                  All test cases will use this URL content as context. Your
                  prompts will be combined with this content when testing.
                </p>
              </div>
            ) : (
              <>
                No URL content loaded. Test cases will use only the prompts you
                provide. Add URL contentif you want to test LLMs against
                specific web content.
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
