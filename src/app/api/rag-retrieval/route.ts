"use server";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    const body = await request.json();
    const { prompt, url } = body;
    console.log("Prompt in API route: ", prompt);

    const apiSecret = request.headers.get("X-API-SECRET");

    if (apiSecret !== process.env.API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401});
    }

    try {
        const rag_url = new URL(process.env.RAG_RETRIEVAL_ENDPOINT || "http://127.0.0.1:5000/rag");
        rag_url.searchParams.set("prompt", prompt);
        rag_url.searchParams.set("url", url);
        const response = await fetch(rag_url.toString(),{
                method: "POST",
                headers: {
                    "X-API-Key": process.env.API_KEY || "",
                    Accept: "application/json"
                }
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Response: ", errorText);
            throw new Error(
                `HTTP error! status: ${response.status}, message: ${errorText}`
            );
        }

        const result = await response.json();

        console.log("Result: ", result);



        return NextResponse.json({
            success: true,
            response: result
        });

    } catch (error) {
        console.error("Error processing request: ", error);
        return NextResponse.json(
            { success: false, error: "Failed to generate response."},
            { status: 500 }
        );
    }
}