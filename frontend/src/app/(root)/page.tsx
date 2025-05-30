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

// import * as React from "react";
import type { SVGProps } from "react";
import { useRouter } from "next/navigation";
// import Header from "@/components/header";
import { Button } from "@/atoms/button";
const OpenAI = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    preserveAspectRatio="xMidYMid"
    viewBox="0 0 256 260"
    {...props}
  >
    <path
      fill="#fff"
      d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z"
    />
  </svg>
);
// export default OpenAI;

// import * as React from "react";
// import type { SVGProps } from "react";
const Meta = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    preserveAspectRatio="xMidYMid"
    viewBox="0 0 256 171"
    {...props}
  >
    <defs>
      <linearGradient
        id="a"
        x1="13.878%"
        x2="89.144%"
        y1="55.934%"
        y2="58.694%"
      >
        <stop offset="0%" stopColor="#0064E1" />
        <stop offset="40%" stopColor="#0064E1" />
        <stop offset="83%" stopColor="#0073EE" />
        <stop offset="100%" stopColor="#0082FB" />
      </linearGradient>
      <linearGradient
        id="b"
        x1="54.315%"
        x2="54.315%"
        y1="82.782%"
        y2="39.307%"
      >
        <stop offset="0%" stopColor="#0082FB" />
        <stop offset="100%" stopColor="#0064E0" />
      </linearGradient>
    </defs>
    <path
      fill="#0081FB"
      d="M27.651 112.136c0 9.775 2.146 17.28 4.95 21.82 3.677 5.947 9.16 8.466 14.751 8.466 7.211 0 13.808-1.79 26.52-19.372 10.185-14.092 22.186-33.874 30.26-46.275l13.675-21.01c9.499-14.591 20.493-30.811 33.1-41.806C161.196 4.985 172.298 0 183.47 0c18.758 0 36.625 10.87 50.3 31.257C248.735 53.584 256 81.707 256 110.729c0 17.253-3.4 29.93-9.187 39.946-5.591 9.686-16.488 19.363-34.818 19.363v-27.616c15.695 0 19.612-14.422 19.612-30.927 0-23.52-5.484-49.623-17.564-68.273-8.574-13.23-19.684-21.313-31.907-21.313-13.22 0-23.859 9.97-35.815 27.75-6.356 9.445-12.882 20.956-20.208 33.944l-8.066 14.289c-16.203 28.728-20.307 35.271-28.408 46.07-14.2 18.91-26.324 26.076-42.287 26.076-18.935 0-30.91-8.2-38.325-20.556C2.973 139.413 0 126.202 0 111.148l27.651.988Z"
    />
    <path
      fill="url(#a)"
      d="M21.802 33.206C34.48 13.666 52.774 0 73.757 0 85.91 0 97.99 3.597 110.605 13.897c13.798 11.261 28.505 29.805 46.853 60.368l6.58 10.967c15.881 26.459 24.917 40.07 30.205 46.49 6.802 8.243 11.565 10.7 17.752 10.7 15.695 0 19.612-14.422 19.612-30.927l24.393-.766c0 17.253-3.4 29.93-9.187 39.946-5.591 9.686-16.488 19.363-34.818 19.363-11.395 0-21.49-2.475-32.654-13.007-8.582-8.083-18.615-22.443-26.334-35.352l-22.96-38.352C118.528 64.08 107.96 49.73 101.845 43.23c-6.578-6.988-15.036-15.428-28.532-15.428-10.923 0-20.2 7.666-27.963 19.39L21.802 33.206Z"
    />
    <path
      fill="url(#b)"
      d="M73.312 27.802c-10.923 0-20.2 7.666-27.963 19.39-10.976 16.568-17.698 41.245-17.698 64.944 0 9.775 2.146 17.28 4.95 21.82L9.027 149.482C2.973 139.413 0 126.202 0 111.148 0 83.772 7.514 55.24 21.802 33.206 34.48 13.666 52.774 0 73.757 0l-.445 27.802Z"
    />
  </svg>
);
// export default Meta;

// import * as React from "react";
// import type { SVGProps } from "react";
const MistralAI = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid"
    viewBox="0 0 256 233"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="M186.18182 0h46.54545v46.54545h-46.54545z" />
    <path fill="#F7D046" d="M209.45454 0h46.54545v46.54545h-46.54545z" />
    <path d="M0 0h46.54545v46.54545H0zM0 46.54545h46.54545V93.0909H0zM0 93.09091h46.54545v46.54545H0zM0 139.63636h46.54545v46.54545H0zM0 186.18182h46.54545v46.54545H0z" />
    <path fill="#F7D046" d="M23.27273 0h46.54545v46.54545H23.27273z" />
    <path
      fill="#F2A73B"
      d="M209.45454 46.54545h46.54545V93.0909h-46.54545zM23.27273 46.54545h46.54545V93.0909H23.27273z"
    />
    <path d="M139.63636 46.54545h46.54545V93.0909h-46.54545z" />
    <path
      fill="#F2A73B"
      d="M162.90909 46.54545h46.54545V93.0909h-46.54545zM69.81818 46.54545h46.54545V93.0909H69.81818z"
    />
    <path
      fill="#EE792F"
      d="M116.36364 93.09091h46.54545v46.54545h-46.54545zM162.90909 93.09091h46.54545v46.54545h-46.54545zM69.81818 93.09091h46.54545v46.54545H69.81818z"
    />
    <path d="M93.09091 139.63636h46.54545v46.54545H93.09091z" />
    <path
      fill="#EB5829"
      d="M116.36364 139.63636h46.54545v46.54545h-46.54545z"
    />
    <path
      fill="#EE792F"
      d="M209.45454 93.09091h46.54545v46.54545h-46.54545zM23.27273 93.09091h46.54545v46.54545H23.27273z"
    />
    <path d="M186.18182 139.63636h46.54545v46.54545h-46.54545z" />
    <path
      fill="#EB5829"
      d="M209.45454 139.63636h46.54545v46.54545h-46.54545z"
    />
    <path d="M186.18182 186.18182h46.54545v46.54545h-46.54545z" />
    <path fill="#EB5829" d="M23.27273 139.63636h46.54545v46.54545H23.27273z" />
    <path
      fill="#EA3326"
      d="M209.45454 186.18182h46.54545v46.54545h-46.54545zM23.27273 186.18182h46.54545v46.54545H23.27273z"
    />
  </svg>
);

const DeepSeek = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style={{
      flex: "none",
      lineHeight: 1,
    }}
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    {...props}
  >
    <path
      fill="#4D6BFE"
      d="M23.748 4.482c-.254-.124-.364.113-.512.234-.051.039-.094.09-.137.136-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.156-.708-.311-.955-.65-.172-.241-.219-.51-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.217-.329.14a5.526 5.526 0 0 1-1.736-1.18c-.857-.828-1.631-1.742-2.597-2.458a11.365 11.365 0 0 0-.689-.471c-.985-.957.13-1.743.388-1.836.27-.098.093-.432-.779-.428-.872.004-1.67.295-2.687.684a3.055 3.055 0 0 1-.465.137 9.597 9.597 0 0 0-2.883-.102c-1.885.21-3.39 1.102-4.497 2.623C.082 8.606-.231 10.684.152 12.85c.403 2.284 1.569 4.175 3.36 5.653 1.858 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.133-.284 4.994-1.86.47.234.962.327 1.78.397.63.059 1.236-.03 1.705-.128.735-.156.684-.837.419-.961-2.155-1.004-1.682-.595-2.113-.926 1.096-1.296 2.746-2.642 3.392-7.003.05-.347.007-.565 0-.845-.004-.17.035-.237.23-.256a4.173 4.173 0 0 0 1.545-.475c1.396-.763 1.96-2.015 2.093-3.517.02-.23-.004-.467-.247-.588zM11.581 18c-2.089-1.642-3.102-2.183-3.52-2.16-.392.024-.321.471-.235.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.167-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.592a4.696 4.696 0 0 1 1.529-.039c2.132.312 3.946 1.265 5.468 2.774.868.86 1.525 1.887 2.202 2.891.72 1.066 1.494 2.082 2.48 2.914.348.292.625.514.891.677-.802.09-2.14.11-3.054-.614zm1-6.44a.306.306 0 0 1 .415-.287.302.302 0 0 1 .2.288.306.306 0 0 1-.31.307.303.303 0 0 1-.304-.308zm3.11 1.596c-.2.081-.399.151-.59.16a1.245 1.245 0 0 1-.798-.254c-.274-.23-.47-.358-.552-.758a1.73 1.73 0 0 1 .016-.588c.07-.327-.008-.537-.239-.727-.187-.156-.426-.199-.688-.199a.559.559 0 0 1-.254-.078.253.253 0 0 1-.114-.358c.028-.054.16-.186.192-.21.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.391.451.462.576.685.914.176.265.336.537.445.848.067.195-.019.354-.25.452z"
    />
  </svg>
);

const Gemini = (props: SVGProps<SVGSVGElement>) => (
  <svg
    height="1em"
    style={{
      flex: "none",
      lineHeight: 1,
    }}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    {...props}
  >
    <title>{"Gemini"}</title>
    <defs>
      <linearGradient
        id="lobe-icons-gemini-fill"
        x1="0%"
        x2="68.73%"
        y1="100%"
        y2="30.395%"
      >
        <stop offset="0%" stopColor="#1C7DFF" />
        <stop offset="52.021%" stopColor="#1C69FF" />
        <stop offset="100%" stopColor="#F0DCD6" />
      </linearGradient>
    </defs>
    <path
      d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12"
      fill="url(#lobe-icons-gemini-fill)"
      fillRule="nonzero"
    />
  </svg>
);

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen flex flex-col gap-12 bg-[#011627] text-white">
      <div className="flex flex-col w-full h-full gap-4">
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
        <div className="flex flex-col w-screen bg-[#091931] gap-3">
          <div className="flex flex-col justify-center w-full m-6">
            <h2 className="text-2xl text-center font-bold">Key Features</h2>
          </div>
          <div className="grid grid-cols-3 gap-8 mx-6">
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
        <div className="flex flex-col justify-center w-full gap-8 p-6">
          <h2 className="text-2xl text-center font-bold">How It Works</h2>
          <div className="flex flex-row justify-center gap-5">
            <div className="flex flex-col items-center gap-2">
              <Globe className="w-12 h-12 text-[#37C5B3] bg-[#19364A] rounded-full p-3" />
              <h4 className="text-lg font-bold text-center">Enter a URL</h4>
              <p className="text-center w-[320px]">
                Provide a URL containing content you want to test LLMs against.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MessageSquare className="w-12 h-12 text-[#37C5B3] bg-[#19364A] rounded-full p-3" />
              <h4 className="text-lg font-bold text-center">
                Create Test Cases
              </h4>
              <p className="text-center w-[320px]">
                Define prompts and expected outputs for your test scenarios.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CircleCheckBig className="w-12 h-12 text-[#37C5B3] bg-[#19364A] rounded-full p-3" />
              <h4 className="text-lg font-bold text-center">Compare Results</h4>
              <p className="text-center w-[320px]">
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
        <div className="w-screen flex flex-col items-center bg-[#091931] p-8">
          <div className="flex flex-col p-6">
            <h2 className="text-2xl text-center font-bold">Supported Models</h2>
          </div>
          <div className="grid grid-cols-6 w-3/4 gap-14 p-7">
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
        <div className="w-screen flex flex-col items-center gap-8 p-8">
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
      </div>
    </div>
  );
}
