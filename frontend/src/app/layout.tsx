import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "VaLLM",
  description: "Learn the LLM best for you.",
  icons:
    "https://gw3qhbh6tl.ufs.sh/f/Q48fIVJi2U4uBSKDllQILryJKSD3OdXv0UQio5Eaezxjcbhl",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <div className="w-full min-h-screen bg-[#011627] text-white p-6">
            <Header />
            {children}
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
