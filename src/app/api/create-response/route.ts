import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    const body = await request.json();
    console.log("Body: ", body);
    const text = body.text;
    const url = body.url;

    try {
        const rag_url = new URL(process.env.RAG_RETRIEVAL_ENDPOINT || "http://127.0.0.1:8000/api/v1/retrieval-augmented-generations");

        rag_url.searchParams.set("prompt", text);
        rag_url.searchParams.set("url", url);

        const rag_response = await fetch(rag_url.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": process.env.API_KEY || "",
            }
        });

        if (!rag_response.ok) {
            const errorText = await rag_response.text();
            console.error("Rag Response: ", errorText);
            throw new Error(`HTTP error! status: ${rag_response.status}, message: ${errorText}`);
        }

        const rag_result = await rag_response.json();

        const rag_content = rag_result.content;

        const context = rag_content.augmented_query;

        const retrieval_context = rag_content.retrieval_context;

        const response_url = new URL(process.env.GENERATE_RESPONSE_ENDPOINT || "http://127.0.0.1:8000/api/v1/llm-response");
        // response_url.searchParams.set("text", augmented_text);
        // response_url.searchParams.set("context", context);

        const response = await fetch(response_url.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": process.env.API_KEY || "",
            },
            body: JSON.stringify({ 
                text: context,
                retrieval_context,
             })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Response: ", errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        // Create a TransformStream for processing the data
        const stream = new TransformStream();
        const writer = stream.writable.getWriter();

        const reader = response.body?.getReader();
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        if(!reader) {
            throw new Error("No reader available");
        }

    
        // Process the stream server-side
        (async () => {
            try {
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) {
                        console.log("Stream complete");
                        break;
                    }
                    console.log("Received...");
                    const chunk = decoder.decode(value);
                    console.log("Chunk: ", chunk);
                    // const jsonString = chunk.slice(6);
                    // const arr = chunk.split("\n");
                    // console.log("Arr: ", arr);
                    // const jsonString = 
                    // const data = JSON.parse(jsonString || "{}");
                    // console.log("Data: ", data);
                    // const data = arr;
                    // Write the processed data to the stream
                    // await writer.write(encoder.encode(JSON.stringify(data)));
                    await writer.write(encoder.encode(chunk));
                }
            } catch (error) {
                console.error("Stream processing error: ", error);
            } finally {
                await writer.close();
            }
        })();

        // return NextResponse.json({ content: "Random", }, {status: 200});

        // Return the stream to the client
        return new Response(stream.readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        console.error("Error: ", error);
        return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }
}