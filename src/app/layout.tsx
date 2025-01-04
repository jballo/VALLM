import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "VaLLM",
  description: "Learn the LLM best for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}
