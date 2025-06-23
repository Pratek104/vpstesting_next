// app/api/chat/route.js
import { Groq } from 'groq-sdk';

export async function POST(req) {
  const body = await req.json();
  const { message } = body;

  // Debug log to check if API key is loaded
  console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY);

  if (!process.env.GROQ_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Missing GROQ_API_KEY environment variable' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!message) {
    return new Response(
      JSON.stringify({ error: 'Message is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
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

    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error from Groq API:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
