import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
    try {
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
            text: `Mock response for prompt: ${prompt}`,
        });
    } catch (err: any) {
        console.error(err);

        return Response.json(
            { error: err.message },
            { status: 500 }
        );
    }
}