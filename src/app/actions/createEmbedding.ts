"use server";


export async function createEmbedding(url: string) {
    console.log("Url in actions: ", url);

    try {
        const scrape_url_endpoint = new URL(process.env.SCRAPE_ENDPOINT || "http://127.0.0.1:5000/api/v1/scrape");

        scrape_url_endpoint.searchParams.set("url", url);

        const scrape_response = await fetch(scrape_url_endpoint.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": process.env.API_KEY || "",
            },
            body: JSON.stringify({ url })
        });

        if(!scrape_response.ok) {
            throw new Error(`HTTPS error! status: ${scrape_response.status}`);
        }

        const scrape_result = await scrape_response.json();
        console.log("scrape_result: ", scrape_result.content);

        const embed_url_endpoint = new URL(process.env.CREATE_EMBEDDING_ENDPOINT || "http://127.0.0.1:5000/api/v1/retrieval-augmented-generations/embed");

        embed_url_endpoint.searchParams.set("url", url);

        const embed_response = await fetch(embed_url_endpoint.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": process.env.API_KEY || "",
            },
            body: JSON.stringify(scrape_result.content)
        });

        if (!embed_response.ok) {
            const errorText = await embed_response.text();
            console.error("API Response: ", errorText);
            throw new Error(`HTTP error! status: ${embed_response.status}, message: ${errorText}`);
        }

        const embed_result = await embed_response.json();

        console.log("Embed result: ", embed_result);


        return {
            success: true,
            response: embed_result.content,
        }
    } catch (error) {
        console.error("Error: ", error);
        return {
            success: false,
            error: 
                error instanceof Error ? error.message : "Failed to create embedding",
        }
    }
}