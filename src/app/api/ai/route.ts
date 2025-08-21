import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);
export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json(); // Make sure the client sends { message: "..."} 

    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    return NextResponse.json({ text: completion.choices[0].message.content });
  } catch (error) {
    console.error("AI API Error:", error); // Check server console for detailed error
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
