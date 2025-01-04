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
        const url_endpoint = new URL(process.env.SCRAPE_ENDPOINT || "http://127.0.0.1:5000/scrape");
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

        // console.log("Result: ", result);
        console.log("Content: ", result.content);

        const embed_url_endpoint = new URL(process.env.CREATE_EMBEDDING_ENDPOINT || "http://127.0.0.1:5000/embed");

        embed_url_endpoint.searchParams.set("url", url)
        // embed_url_endpoint.searchParams.set("content", result.content)

        const embed_response = await fetch(embed_url_endpoint.toString(), {
            method: "POST",
            headers: {
                "X-API-Key": process.env.API_KEY || "",
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(result.content)
        })

        if (!embed_response.ok) {
            const errorText = await embed_response.text();
            console.error("API Response: ", errorText);
            throw new Error(
                `HTTP error! status: ${embed_response.status}, message: ${errorText}`
            );
        }

        const embed_result = await embed_response.json();

        console.log("Embed Result: ", embed_result);

        return NextResponse.json({
            success: true,
            response: embed_result.content
        });

    } catch (error) {
        console.error("Error processing request: ", error);
        return NextResponse.json(
            { success: false, error: "Failed to generate embedding."},
            { status: 500 }
        );
    }


}