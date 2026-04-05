import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt } from '@/lib/prompts';
import { ChapterKey } from '@/lib/types';

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: 'no_api_key', message: 'ANTHROPIC_API_KEY is not configured' },
      { status: 501 }
    );
  }

  const { messages, chapter, name } = (await request.json()) as {
    messages: { role: 'user' | 'assistant'; content: string }[];
    chapter: ChapterKey;
    name: string;
  };

  const client = new Anthropic({ apiKey });
  const systemPrompt = buildSystemPrompt(chapter, name);

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}
