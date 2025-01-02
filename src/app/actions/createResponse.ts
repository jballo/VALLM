"use server";


export async function createResponse(text: string) {
    console.log(text);
    try {
        const url = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000';
        const response = await fetch(`${url}/create-response/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-SECRET": process.env.API_SECRET || "",
            },
            body: JSON.stringify({ text })
        });

        const result = await response.json();
        console.log("Result: ", result);

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