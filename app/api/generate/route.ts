import OpenAI from "openai";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error("OPENAI_API_KEY is not set");
        }

        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const { prompt } = await req.json();

        if (!prompt) {
            return Response.json(
                { error: "Prompt is required" },
                { status: 400 }
            );
        }

        const response = await client.responses.create({
            model: "gpt-4.1-mini",
            input: prompt,
        });

        return Response.json({
            text: response.output_text,
        });
    } catch (err: any) {
        console.error(err);

        return Response.json(
            { error: err.message },
            { status: 500 }
        );
    }
}