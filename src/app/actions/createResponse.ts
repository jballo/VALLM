"use server";

export async function createResponse(text: string, url: string){
    console.log("Text in action: ", text);

    try {
        // const start = new Date().getTime();
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

        if (!rag_response.ok){
            const errorText = await rag_response.text();
            console.error("Rag Response: ", errorText);
            throw new Error(`HTTP error! status: ${rag_response.status}, message: ${errorText}`);
        }

        const rag_result = await rag_response.json();
        // console.log("Rag result: ", rag_result);

        const rag_content = rag_result.content;

        const context = rag_content.augmented_query;

        const retrieval_context = rag_content.retrieval_context;

        // console.log("context: ", context);

        // console.log("retrieval_context: ", retrieval_context);


        // const context = augmented_text;
        // const retrieval_context

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

        // const response_result = await response.json();
        // // console.log("Result: ", response_result);

        // const elapsed = new Date().getTime() - start;
        // console.log("Elapsed time: ", elapsed);

        // return {
        //     success: true,
        //     response: response_result.content,
        // }


        // return {
        //     success: true,
        //     response: response
        // }

        //  Process the stream server-side

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
            throw new Error("No reader available");
        }

        while (true) {

            const { value, done } = await reader.read();
            if (done) {
                console.log("Stream complete");
                break;
            }
            console.log("Received...");
            const chunk = decoder.decode(value);
            // console.log("Chunk: ", chunk);
            const jsonString = chunk?.slice(6);
            const data = JSON.parse(jsonString || "");
            console.log("Data: ", data);
            // Return the data to the client
            return {
                success: true,
                response: data,
            }
        }


        // return {
        //     success: true,
        //     response: "",
        // }
        
    } catch (error) {
        console.error("Error: ", error);
        return {
            success: false,
            error: 
                error instanceof Error ? error.message : "Failed to create response",
        }
    }
}