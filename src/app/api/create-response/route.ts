import { NextResponse } from "next/server";



export async function POST(request: Request) {
    const body = await request.json();
    const { text, url } = body;
    console.log("Text in API route: ", text);
    console.log("Url in API route: ", url);

    const apiSecret = request.headers.get("X-API-SECRET");

    if (apiSecret !== process.env.API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401});
    }

    
    try {
        const rag_url = new URL(process.env.RAG_RETRIEVAL_ENDPOINT || "http://127.0.0.1:5000/rag");
        rag_url.searchParams.set("prompt", text);
        rag_url.searchParams.set("url", url);
        const rag_response = await fetch(rag_url.toString(),{
                method: "POST",
                headers: {
                    "X-API-Key": process.env.API_KEY || "",
                    Accept: "application/json"
                }
            }
        );

        if (!rag_response.ok) {
            const errorText = await rag_response.text();
            console.error("API Response: ", errorText);
            throw new Error(
                `HTTP error! status: ${rag_response.status}, message: ${errorText}`
            );
        }

        const rag_result = await rag_response.json();

        console.log("Result: ", rag_result);

        const augmented_text = rag_result.content
        console.log("Content from rag result passed onto create response: ", augmented_text)



        const response_url = new URL(process.env.GENERATE_RESPONSE_ENDPOINT || "http://127.0.0.1:5000/response");
        response_url.searchParams.set("text", augmented_text);
        const response = await fetch(response_url.toString(),{
                method: "POST",
                headers: {
                    "X-API-Key": process.env.API_KEY || "",
                    Accept: "multipart/mixed"
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
            responses: result.content
        });
    } catch (error) {
        console.error("Error processing request: ", error);
        return NextResponse.json(
            { success: false, error: "Failed to generate response."},
            { status: 500 }
        );
    }
}