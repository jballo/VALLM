"use server";


export async function createResponse(text: string, url: string) {
    console.log("Text in action: ", text);
    try {
        // const url = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000';
        const response_url = 'http://localhost:3000';
        const response = await fetch(`${response_url}/api/create-response/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-SECRET": process.env.API_SECRET || "",
            },
            body: JSON.stringify({ text, url })
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
                error instanceof Error ? error.message : "Failed to create response",
        }
    }
}