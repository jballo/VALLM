"use server";

export async function ragRetrieval(prompt: string, url: string){
    console.log("Prompt in action: ", prompt);

    try {
        const rag_url = 'http://localhost:3000';
        const response = await fetch(`${rag_url}/api/rag-retrieval/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-SECRET": process.env.API_SECRET || "",
            },
            body: JSON.stringify({ prompt, url })
        });

        if(!response.ok) {
            throw new Error(`HTTPS error! status: ${response.status}`);
        }

        const result = response.json();

        return result;
    } catch (error) {
        console.error("Error: ", error);
        return {
            success: false,
            error: 
                error instanceof Error ? error.message : "Failed to retrieve rag result",
        }
    }
}