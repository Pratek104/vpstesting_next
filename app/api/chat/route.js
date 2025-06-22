// app/api/chat/route.js
import { Groq } from 'groq-sdk';

export async function POST(req) {
  const body = await req.json();
  const { message } = body;

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: message }],
    model: 'deepseek-r1-distill-llama-70b',
    temperature: 0.6,
    max_completion_tokens: 4096,
    top_p: 0.95,
    stream: false,
  });

  const reply = chatCompletion.choices[0].message.content;

  return new Response(JSON.stringify({ reply }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
