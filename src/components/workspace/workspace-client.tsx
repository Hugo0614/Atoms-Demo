'use client';

import * as React from "react";
import { TextStreamChatTransport, type UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SandpackPreview, {
  SandpackFiles,
  starterCode,
} from "@/components/workspace/sandpack-preview";

type WorkspaceClientProps = {
  userEmail: string | null;
  onSignOut: () => void;
};

function extractLatestCode(content: string) {
  const codeBlockRegex = /```(?:tsx|jsx|ts|js)?\n([\s\S]*?)```/g;
  const blocks: string[] = [];
  let match = codeBlockRegex.exec(content);

  while (match) {
    blocks.push(match[1].trim());
    match = codeBlockRegex.exec(content);
  }

  if (blocks.length > 0) {
    return blocks[blocks.length - 1];
  }

  return content.trim();
}

function getMessageText(message: UIMessage) {
  if (!message.parts) {
    return "";
  }

  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export default function WorkspaceClient({ userEmail, onSignOut }: WorkspaceClientProps) {
  const [overrideCode, setOverrideCode] = React.useState<string | null>(null);

  const transport = React.useMemo(
    () => new TextStreamChatTransport({ api: "/api/chat" }),
    [],
  );
  const { messages, sendMessage, status } = useChat({ transport });
  const [input, setInput] = React.useState("");
  const isLoading = status === "submitted" || status === "streaming";

  const latestAssistantCode = React.useMemo(() => {
    const latestAssistant = [...messages]
      .reverse()
      .find((message) => message.role === "assistant");

    const assistantText = latestAssistant ? getMessageText(latestAssistant) : "";

    if (!assistantText) {
      return null;
    }

    const nextCode = extractLatestCode(assistantText);
    return nextCode || null;
  }, [messages]);

  const files = React.useMemo<SandpackFiles>(() => {
    const code = overrideCode ?? latestAssistantCode ?? starterCode;

    return {
      "/App.js": {
        code,
      },
    };
  }, [overrideCode, latestAssistantCode]);

  const handleReset = () => {
    setOverrideCode(starterCode);
  };

  const handleChatSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();

    if (isLoading || !input.trim()) {
      return;
    }

    setOverrideCode(null);
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm text-muted-foreground">Signed in as</p>
            <p className="font-semibold text-foreground">
              {userEmail ?? "Unknown"}
            </p>
          </div>
          <form action={onSignOut}>
            <Button variant="outline">Sign out</Button>
          </form>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-6 py-6">
        <div>
          <h1 className="text-3xl font-semibold">Workspace</h1>
          <p className="text-muted-foreground">
            Describe the UI you want and review the live preview as the AI
            builds it.
          </p>
        </div>
        <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(280px,360px)_1fr]">
          <section className="flex flex-col gap-4">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Conversation</CardTitle>
                <CardDescription>
                  The AI output will stream below as it generates code.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {messages.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-muted-foreground/30 p-4 text-muted-foreground">
                    Start by describing what you want to build, like “Design a
                    pricing section with three tiers.”
                  </div>
                ) : (
                  messages.map((message: UIMessage) => (
                    <div
                      key={message.id}
                      className={
                        message.role === "user"
                          ? "rounded-xl bg-muted/40 p-4"
                          : "rounded-xl border border-muted/40 bg-background p-4"
                      }
                    >
                      <p className="text-xs uppercase text-muted-foreground">
                        {message.role}
                      </p>
                      <pre className="mt-2 whitespace-pre-wrap text-sm text-foreground">
                        {getMessageText(message)}
                      </pre>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Prompt</CardTitle>
                <CardDescription>Send a request to the AI builder.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <form className="space-y-3" onSubmit={handleChatSubmit}>
                  <textarea
                    className="min-h-[120px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    placeholder="e.g. Build a hero section with a CTA button"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                      {isLoading ? "Generating..." : "Send"}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Responses stream into the preview automatically.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </section>
          <section className="flex min-h-[520px] flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Live preview</p>
                <p className="text-lg font-semibold">Sandbox</p>
              </div>
              <Button variant="secondary" type="button" onClick={handleReset}>
                Reset preview
              </Button>
            </div>
            <div className="flex-1">
              <SandpackPreview files={files} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
