import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await auth.protect();
    const body = await req.json();
    const { url } = body;

    const scrape_url_endpoint = new URL(
      process.env.SCRAPE_ENDPOINT || "http://127.0.0.1:8000/api/v1/scrape"
    );

    scrape_url_endpoint.searchParams.set("url", url);

    const scrape_response = await fetch(scrape_url_endpoint.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.API_KEY || "",
      },
      body: JSON.stringify({ url }),
    });

    if (!scrape_response.ok) {
      throw new Error(`HTTPS error! status: ${scrape_response.status}`);
    }

    const scrape_result = await scrape_response.json();
    console.log("scrape_result: ", scrape_result.content);

    const embed_url_endpoint = new URL(
      process.env.CREATE_EMBEDDING_ENDPOINT ||
        "http://127.0.0.1:8000/api/v1/retrieval-augmented-generations/embed"
    );

    embed_url_endpoint.searchParams.set("url", url);

    const embed_response = await fetch(embed_url_endpoint.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.API_KEY || "",
      },
      body: JSON.stringify(scrape_result.content),
    });

    if (!embed_response.ok) {
      throw new Error(`HTTP error! status: ${embed_response.status}`);
    }

    const embed_result = await embed_response.json();
    console.log("Embed result: ", embed_result);

    return NextResponse.json(
      { content: scrape_result.content },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(
      { error: "Failed to scrape and/or embed" },
      { status: 500 }
    );
  }
}
