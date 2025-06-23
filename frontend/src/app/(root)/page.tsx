"use client";

import {
  ArrowRight,
  BrainCircuit,
  ChartColumn,
  CircleCheckBig,
  FileText,
  Globe,
  LayoutDashboard,
  MessageSquare,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/atoms/button";
import { OpenAI } from "@/icons/OpenAI";
import { MistralAI } from "@/icons/MistralAI";
import { DeepSeek } from "@/icons/Deepseek";
import { Gemini } from "@/icons/Gemini";
import { Meta } from "@/icons/Meta";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col mt-6 gap-12 bg-[#011627] text-white">
      {/* Title and Basic Info */}
      <div className="flex flex-col items-center gap-10 m-6">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-[#34C5B3] to-[#7C3AED] inline-block text-transparent bg-clip-text">
          Compare LLM Performance with Confidence
        </h1>
        <h3 className="text-lg text-center">
          Test, evaluate, and compare multiple language models with a single
          URL. Make data-driven decisions about which AI models best suit your
          needs.
        </h3>
        <div className="flex flex-row gap-2">
          <Button
            className="bg-[#37C5B3] hover:bg-[#2da192]"
            onClick={() => router.push("/dashboard")}
          >
            Go to Dashboard
          </Button>
          <Button variant="ghost">View Demo</Button>
        </div>
        <Image
          src="https://gw3qhbh6tl.ufs.sh/f/Q48fIVJi2U4uX1JVn6PedDnbZviLGjTysVUKoIxg8W1uB46F"
          alt="VALLM Dashboard"
          width={800}
          height={300}
          priority
        />
      </div>
      {/* Key Features */}
      <div className="flex flex-col w-full bg-[#091931] gap-3">
        <div className="flex flex-col justify-center w-full p-6">
          <h2 className="text-2xl text-center font-bold">Key Features</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-6">
          <div className="flex flex-col gap-2 border-[1px] rounded-xl border-[#312D5C] bg-[#15253C] p-8">
            <Globe className="w-12 h-12 bg-[#193649] text-[#37C5B3] p-3 rounded-md" />
            <h4 className="text-xl font-bold">URL Content Scraping</h4>
            <p>
              Automatically extract content from any URL to use as context for
              your LLM tests.
            </p>
          </div>
          <div className="flex flex-col gap-2 border-[1px] rounded-xl border-[#312D5C] bg-[#15253C] p-8">
            <ChartColumn className="w-12 h-12 bg-[#193649] text-[#37C5B3] p-3 rounded-md" />
            <h4 className="text-xl font-bold">Comprehensive Metrics</h4>
            <p>
              Evaluate models on relevancy, coherence, bias, toxicity, and
              prompt alignment.
            </p>
          </div>
          <div className="flex flex-col gap-2 border-[1px] rounded-xl border-[#312D5C] bg-[#15253C] p-8">
            <FileText className="w-12 h-12 bg-[#193649] text-[#37C5B3] p-3 rounded-md" />
            <h4 className="text-xl font-bold">Batch Testing</h4>
            <p>
              Import multiple test cases via CSV and run them all at once to
              save time.
            </p>
          </div>
          <div className="flex flex-col gap-2 border-[1px] rounded-xl border-[#312D5C] bg-[#15253C] p-8">
            <BrainCircuit className="w-12 h-12 bg-[#193649] text-[#37C5B3] p-3 rounded-md" />
            <h4 className="text-xl font-bold">Multi-Model Support</h4>
            <p>
              Test across GPT-4, Claude, Gemini, Llama, Mistral and more in a
              single interface.
            </p>
          </div>
          <div className="flex flex-col gap-2 border-[1px] rounded-xl border-[#312D5C] bg-[#15253C] p-8">
            <Zap className="w-12 h-12 bg-[#193649] text-[#37C5B3] p-3 rounded-md" />
            <h4 className="text-xl font-bold">Real-time Results</h4>
            <p>
              Get feedback on model performance with detailed response
              analysis.
            </p>
          </div>
          <div className="flex flex-col gap-2 border-[1px] rounded-xl border-[#312D5C] bg-[#15253C] p-8">
            <LayoutDashboard className="w-12 h-12 bg-[#193649] text-[#37C5B3] p-3 rounded-md" />
            <h4 className="text-xl font-bold">Intuitive Dashboard</h4>
            <p>
              Manage all your test cases and results in a clean, user-friendly
              interface.
            </p>
          </div>
        </div>
      </div>
      {/* How It Works */}
      <div className="flex flex-col w-full justify-center  gap-8 p-6">
        <h2 className="text-2xl text-center font-bold">How It Works</h2>
        <div className="flex flex-row flex-wrap justify-center gap-5">
          <div className="flex flex-col items-center gap-2 w-full sm:w-80">
            <Globe className="w-12 h-12 text-[#37C5B3] bg-[#19364A] rounded-full p-3" />
            <h4 className="text-lg font-bold text-center">Enter a URL</h4>
            <p className="text-center">
              Provide a URL containing content you want to test LLMs against.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 w-full sm:w-80">
            <MessageSquare className="w-12 h-12 text-[#37C5B3] bg-[#19364A] rounded-full p-3" />
            <h4 className="text-lg font-bold text-center">
              Create Test Cases
            </h4>
            <p className="text-center">
              Define prompts and expected outputs for your test scenarios.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 w-full sm:w-80">
            <CircleCheckBig className="w-12 h-12 text-[#37C5B3] bg-[#19364A] rounded-full p-3" />
            <h4 className="text-lg font-bold text-center">Compare Results</h4>
            <p className="text-center">
              Analyze detailed metrics and choose the best model for your
              needs.
            </p>
          </div>
        </div>
        <div className="flex flex-row justify-center">
          <Button
            className="w-[120px] bg-[#37C5B3] hover:bg-[#2da192]"
            onClick={() => router.push("/dashboard")}
          >
            Try it Now <ArrowRight />
          </Button>
        </div>
      </div>
      {/* Supported Models */}
      <div className="flex flex-col w-full items-center bg-[#091931] p-8">
        <div className="flex flex-col p-6">
          <h2 className="text-2xl text-center font-bold">Supported Models</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full gap-14 p-7">
          <div className="text-center flex flex-col items-center bg-[#15253C] p-3 gap-4 rounded-md border-[0.5px] border-[#332E5C]">
            <div className="flex flex-col justify-center items-center bg-[#183243] text-[#0CA37F] w-10 h-10 rounded-[20px]">
              <OpenAI />
            </div>
            <div className="flex flex-col">
              <h4>GPT-4o-Mini</h4>
              <p>OpenAI</p>
            </div>
          </div>
          <div className="text-center flex flex-col items-center bg-[#15253C] p-4 gap-4 rounded-md border-[0.5px] border-[#332E5C]">
            <div className="flex flex-col justify-center items-center bg-[#21274E] text-[#7C3AED] w-10 h-10 rounded-[20px]">
              <MistralAI />
            </div>
            <div className="flex flex-col">
              <h4>Mistral Saba 24B</h4>
              <p>Mistral AI</p>
            </div>
          </div>
          <div className="text-center flex flex-col items-center bg-[#15253C] p-3 gap-4 rounded-md border-[0.5px] border-[#332E5C]">
            <div className="flex flex-col justify-center items-center bg-[#172E4E] text-[#4285F4] w-10 h-10 rounded-[20px]">
              <DeepSeek />
            </div>
            <div className="flex flex-col">
              <h4>Deepseek v3</h4>
              <p>Deepseek</p>
            </div>
          </div>
          <div className="text-center flex flex-col items-center bg-[#15253C] p-3 gap-4 rounded-md border-[0.5px] border-[#332E5C]">
            <div className="flex flex-col justify-center items-center bg-[#172E4E] text-[#4285F4] w-10 h-10 rounded-[20px]">
              <Gemini />
            </div>
            <div className="flex flex-col">
              <h4>Gemini 2.0 flash</h4>
              <p>Google</p>
            </div>
          </div>
          <div className="text-center flex flex-col items-center bg-[#15253C] p-3 gap-4 rounded-md border-[0.5px] border-[#332E5C]">
            <div className="flex flex-col justify-center items-center bg-[#172E4E] text-[#4285F4] w-10 h-10 rounded-[20px]">
              <Meta />
            </div>
            <div className="flex flex-col">
              <h4>LLAMA 3.3 70B Versatile</h4>
              <p>Meta</p>
            </div>
          </div>
          <div className="text-center flex flex-col items-center bg-[#15253C] p-3 gap-4 rounded-md border-[0.5px] border-[#332E5C]">
            <div className="flex flex-col justify-center items-center bg-[#172E4E] text-[#4285F4] w-10 h-10 rounded-[20px]">
              <Meta />
            </div>
            <div className="flex flex-col">
              <h4>LLAMA 3.1 8B Instant</h4>
              <p>Mistral AI</p>
            </div>
          </div>
        </div>
      </div>
      {/* Ready to Find Your Ideal LLM? */}
      <div className="flex flex-col w-full items-center gap-8 p-8">
        <div className="flex flex-col">
          <h2 className="text-2xl text-center font-bold">
            Ready to Find Your Ideal LLM?
          </h2>
          <p>
            Start testing and comparing language models today to make
            data-driven decisions for your AI applications.
          </p>
        </div>
        <div className="pb-6">
          <Button
            className="w-[120px] bg-[#37C5B3] hover:bg-[#2da192]"
            onClick={() => router.push("/dashboard")}
          >
            Start Testing Now
          </Button>
        </div>
      </div>
    </div >
  );
}
