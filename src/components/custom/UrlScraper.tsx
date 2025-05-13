"use client";

import { Globe } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useState } from "react";

export default function UrlScraper() {
  const [url, setUrl] = useState<string>("");
  const [scrapedContent, setScrapedContent] = useState<string>("");
  const onSubmit = () => {
    console.log("url: ", url);
    setTimeout(() => {
      setScrapedContent("Bunch of text");
    }, 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-[#011628] hover:bg-[#37C5B3] border-[#1E293B] hover:text-white"
        >
          <Globe className="w-5" />
          Add URL Source
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
            don&apos;t provide a URL, your test cases will use only the prompts
            you write.
          </p>
        </div>
        {scrapedContent && (
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger>
                Scraped Content. Click to View!
              </AccordionTrigger>
              <AccordionContent>{scrapedContent}</AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </DialogContent>
    </Dialog>
  );
}
