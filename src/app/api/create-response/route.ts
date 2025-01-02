import { NextResponse } from "next/server";



export async function POST(request: Request) {
    const body = await request.json();
    const { text } = body;
    console.log("Text in API route: ", text);

    const apiSecret = request.headers.get("X-API-SECRET");

    if (apiSecret !== process.env.API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401});
    }

    
    try {
        const url = new URL(process.env.GENERATE_RESPONSE_ENDPOINT || "http://127.0.0.1:5000/response");
        url.searchParams.set("text", text);
        const response = await fetch(url.toString(),{
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