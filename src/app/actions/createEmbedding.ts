"use server";


export async function createEmbedding(url: string) {
    console.log("Url in actions: ", url);

    try {
        const url_endpoint = process.env.NEXT_API_URL ||'http://localhost:3000';
        const response = await fetch(`${url_endpoint}/api/create-embedding/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-SECRET": process.env.API_SECRET || "",
            },
            body: JSON.stringify({ url })
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
                error instanceof Error ? error.message : "Failed to create embedding",
        }
    }
}