import { convertToModelMessages, streamText } from "ai";
import type { UIMessage } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const systemPrompt = `You are an expert React UI builder.\n\nRules:\n- First provide a brief explanation of the design decisions (2-4 sentences).\n- Then provide one or more fenced code blocks.\n- Each code block MUST start with a filename after the backticks, for example: \`\`\`/App.js\n...\n\`\`\`.\n- Only include files needed for the UI (e.g. /App.js, /App.css).\n- The /App.js code must be valid React (JavaScript) and export a default component.\n- Do not include any additional markdown outside the explanation and code fences.\n- Prefer Tailwind CSS classes for styling when possible.`;

export async function POST(req: Request) {
  const { messages, model } = await req.json();

  const rawMessages = Array.isArray(messages) ? messages : [];
  const uiMessages = rawMessages as UIMessage[];
  const modelMessages = await convertToModelMessages(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    uiMessages.map(({ id, ...rest }) => rest),
  );

  const provider = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
    name: process.env.OPENAI_PROVIDER_NAME,
  });

  const allowedModels = (process.env.OPENAI_MODELS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const requestedModel = typeof model === "string" ? model : undefined;
  const modelId =
    requestedModel &&
    (allowedModels.length === 0 || allowedModels.includes(requestedModel))
      ? requestedModel
      : process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

  const result = streamText({
    model: provider.chat(modelId),
    system: systemPrompt,
    messages: modelMessages,
    temperature: 0.3,
  });

  return result.toTextStreamResponse();
}
