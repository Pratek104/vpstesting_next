import { Groq } from 'groq-sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: 'user', content: message }
    ],
    model: 'deepseek-r1-distill-llama-70b',
    temperature: 0.6,
    max_completion_tokens: 4096,
    top_p: 0.95,
    stream: false  // Use false for easier response handling in frontend
  });

  const reply = chatCompletion.choices[0].message.content;
  res.status(200).json({ reply });
}
