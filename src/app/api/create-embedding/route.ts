"use server";

import { NextResponse } from "next/server";

export async function POST(request: Request){
    const body = await request.json();
    const { url } = body;
    console.log("Url in API route: ", url);
    
    const apiSecret = request.headers.get("X-API-SECRET");
    
    if (apiSecret !== process.env.API_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401});
    }

    try {
        const url_endpoint = new URL(process.env.GENERATE_EMBEDDING_ENDPOINT || "http://127.0.0.1:5000/scrape");
        url_endpoint.searchParams.set("url", url);
        const scrape_response = await fetch(url_endpoint.toString(), {
            method: "POST",
            headers: {
                "X-API-Key": process.env.API_KEY || "",
            }
        });

        if (!scrape_response.ok) {
            const errorText = await scrape_response.text();
            console.error("API Response: ", errorText);
            throw new Error(
                `HTTP error! status: ${scrape_response.status}, message: ${errorText}`
            );
        }

        const result = await scrape_response.json();

        console.log("Result: ", result);

        return NextResponse.json({
            success: true,
            response: "Embedding was created."
        });

    } catch (error) {
        console.error("Error processing request: ", error);
        return NextResponse.json(
            { success: false, error: "Failed to generate embedding."},
            { status: 500 }
        );
    }


}