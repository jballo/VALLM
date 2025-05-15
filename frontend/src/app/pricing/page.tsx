"use client";

import Header from "@/components/header";
import FreeCard from "./components/free-card";
import HobbyCard from "./components/hobby-card";
import CustomCard from "./components/custom-card";

export default function PricingPage() {
  return (
    <div className="w-full min-h-screen p-12 flex flex-col gap-14 bg-[#011627]">
      <Header />
      <div className="flex flex-col w-full text-center  text-white gap-5">
        <h1 className="text-5xl">Flexible Pricing</h1>
        <p>At VALLM, we appreciate transparency</p>
        <p className="text-[#79c8bf]">
          CURRENTLY NOT OPEN FOR PUBLIC
          <br />* * * COST MAY CHANGE * * *
        </p>
      </div>
      <div className="w-full h-full grid grid-cols-3 gap-8">
        <FreeCard />
        <HobbyCard />
        <CustomCard />
      </div>
      <div>
        <div className="flex flex-col w-full text-center text-white gap-5">
          <h2 className="text-3xl">Cost Per Token</h2>
          <div className="bg-gradient-to-r from-[#79c8bf] via-[#5682CE] to-[#7A3BEB] rounded-lg p-6">
            <div className="grid grid-cols-3">
              <div>
                <h3 className="text-xl font-bold mb-3">Input Tokens</h3>
                <p className="text-2xl">$0.0015</p>
                <p className="text-sm mt-2">per 1K tokens</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Output Tokens</h3>
                <p className="text-2xl">$0.002</p>
                <p className="text-sm mt-2">per 1K tokens</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">More Options</h3>
                <p className="text-2xl">TBD</p>
                <p className="text-sm mt-2">Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
