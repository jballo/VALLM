"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/atoms/accordion";
import { Button } from "@/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/atoms/dialog";
import { Input } from "@/atoms/input";
import { Globe } from "lucide-react";
import { useState } from "react";

interface CreateEmbeddingProp {
  createEmbedding: (
    url: string
  ) => Promise<{ success: boolean; response?: string; error?: string }>;
}

interface UrlScraperProps {
  url: string;
  setUrl: (url: string) => void;
  createEmbedding: CreateEmbeddingProp["createEmbedding"];
  scrapedContent: string;
  setScrapedContent: (content: string) => void;
}

export default function UrlScraper({
  url,
  setUrl,
  createEmbedding,
  scrapedContent,
  setScrapedContent,
}: UrlScraperProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      console.log("Note valid url: Error: ", error);
      return false;
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidUrl(url)) return;

    try {
      const response = await createEmbedding(url);

      if (!response.success) {
        throw new Error(response.error || "Failed to create embedding of url");
      }
      console.log("Response: ", response.response);
      setScrapedContent(response.response || "");
      setTimeout(() => {
        setDialogOpen(false);
      }, 3000);
    } catch (error) {
      console.error(error);
    }
  };

  const clearUrlContent = () => {
    setUrl("");
    setScrapedContent("");
  };

  return (
    <div className="flex flex-row gap-2">
      {scrapedContent && (
        <Button
          variant="outline"
          className="bg-[#011628] hover:bg-[#111C3A] border-[#1E293B] text-[#9D4EDE] hover:text-[#9D4EDE]"
          onClick={clearUrlContent}
        >
          Clear URL Content
        </Button>
      )}
      <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(!dialogOpen)}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-[#011628] hover:bg-[#37C5B3] border-[#1E293B] hover:text-white"
            onClick={() => setDialogOpen(true)}
          >
            <Globe className="w-5" />
            {scrapedContent ? <p>Change URL Source</p> : <p>Add URL Source</p>}
          </Button>
        </DialogTrigger>
        <DialogContent className="text-white bg-[#0E2233] p-8 border-none w-2/5">
          <DialogHeader>
            <DialogTitle>URL Content Scraper</DialogTitle>
            <DialogDescription>
              Add web content as context for your test cases
            </DialogDescription>
          </DialogHeader>
          <h2>URL to Scrape</h2>
          <div className="w-full h-full flex flex-row gap-2">
            <Input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="www.example.com..."
              className="pl-6 bg-[#223342] text-[#B0B7BD] border-none focus:border-[#36c5b3] focus:ring-2 focus:ring-[#36c5b3] focus-visible:ring-white"
            />
            <Button
              className="bg-[#36c5b3] hover:bg-[#278f81]"
              onClick={onSubmit}
            >
              Scrape URL
            </Button>
          </div>
          <div className="bg-[#223342] text-[#B0B7BD] p-6 rounded-lg text-sm">
            <p>
              Why use URL scraping? When you scrape a URL, the content from that
              webpage will be used as context for all your test cases. This is
              useful when you want to test how LLMs handle specific web content.
            </p>
            <br />
            <p>
              Is this required? No. URL scraping is completely optional. If you
              don&apos;t provide a URL, your test cases will use only the
              prompts you write.
            </p>
          </div>
          {scrapedContent && (
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger>
                  Scraped Content. Click to View!
                </AccordionTrigger>
                <AccordionContent className=" h-36 overflow-auto">
                  {scrapedContent}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
