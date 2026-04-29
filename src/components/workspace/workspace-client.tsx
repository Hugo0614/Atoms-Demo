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
  SandpackPreviewMode,
  starterCode,
} from "@/components/workspace/sandpack-preview";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type WorkspaceClientProps = {
  userEmail: string | null;
  onSignOut: () => void;
};

type ProjectRecord = {
  id: string;
  code_content: string;
  chat_history: UIMessage[] | null;
  created_at: string;
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

function ensureMessageIds(messages: UIMessage[]) {
  return messages.map((message, index) => {
    if (message.id) {
      return message;
    }

    const fallbackId =
      globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${index}`;

    return {
      ...message,
      id: fallbackId,
    };
  });
}

function formatTimestamp(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function WorkspaceClient({ userEmail, onSignOut }: WorkspaceClientProps) {
  const [overrideCode, setOverrideCode] = React.useState<string | null>(null);
  const [previewMode, setPreviewMode] =
    React.useState<SandpackPreviewMode>("preview");
  const [projects, setProjects] = React.useState<ProjectRecord[]>([]);
  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(
    null,
  );
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [projectsError, setProjectsError] = React.useState<string | null>(null);
  const [isLoadingProjects, setIsLoadingProjects] = React.useState(true);

  const supabase = React.useMemo(() => createSupabaseBrowserClient(), []);

  const transport = React.useMemo(
    () => new TextStreamChatTransport({ api: "/api/chat" }),
    [],
  );
  const { messages, sendMessage, setMessages, status } = useChat({ transport });
  const [input, setInput] = React.useState("");
  const isLoading = status === "submitted" || status === "streaming";

  const loadProjects = React.useCallback(async () => {
    setIsLoadingProjects(true);
    setProjectsError(null);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setProjects([]);
      setIsLoadingProjects(false);
      return;
    }

    const { data, error } = await supabase
      .from("projects")
      .select("id, code_content, chat_history, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setProjectsError(error.message);
      setProjects([]);
    } else {
      setProjects((data ?? []) as ProjectRecord[]);
    }

    setIsLoadingProjects(false);
  }, [supabase]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadProjects();
  }, [loadProjects]);

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

  const currentCode = overrideCode ?? latestAssistantCode ?? starterCode;

  const handleReset = () => {
    setOverrideCode(starterCode);
  };

  const handleNewSession = () => {
    setSelectedProjectId(null);
    setOverrideCode(starterCode);
    setMessages([]);
    setInput("");
  };

  const handleSaveProject = async () => {
    setIsSaving(true);
    setSaveError(null);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setSaveError("You need to be signed in to save projects.");
      setIsSaving(false);
      return;
    }

    const payload = {
      user_id: user.id,
      code_content: currentCode,
      chat_history: messages,
    };

    const result = selectedProjectId
      ? await supabase
          .from("projects")
          .update(payload)
          .eq("id", selectedProjectId)
          .select("id, code_content, chat_history, created_at")
          .single()
      : await supabase
          .from("projects")
          .insert(payload)
          .select("id, code_content, chat_history, created_at")
          .single();

    if (result.error) {
      setSaveError(result.error.message);
      setIsSaving(false);
      return;
    }

    const savedProject = result.data as ProjectRecord;
    setSelectedProjectId(savedProject.id);
    setProjects((current) => {
      const filtered = current.filter((project) => project.id !== savedProject.id);
      return [savedProject, ...filtered];
    });

    setIsSaving(false);
  };

  const handleLoadProject = (project: ProjectRecord) => {
    const history = Array.isArray(project.chat_history)
      ? ensureMessageIds(project.chat_history)
      : [];

    setSelectedProjectId(project.id);
    setOverrideCode(project.code_content);
    setMessages(history);
    setInput("");
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
        <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(220px,280px)_minmax(320px,420px)_1fr]">
          <section className="flex flex-col gap-4">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>My Projects</CardTitle>
                <CardDescription>
                  Load a saved session or start a new one.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex flex-col gap-2">
                  <Button variant="secondary" onClick={handleNewSession}>
                    New session
                  </Button>
                  <Button variant="outline" onClick={loadProjects}>
                    Refresh list
                  </Button>
                </div>
                {projectsError ? (
                  <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive">
                    {projectsError}
                  </div>
                ) : null}
                {isLoadingProjects ? (
                  <p className="text-xs text-muted-foreground">
                    Loading saved sessions...
                  </p>
                ) : projects.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-muted-foreground/30 p-4 text-muted-foreground">
                    No saved sessions yet. Save your first project to see it
                    here.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {projects.map((project) => (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => handleLoadProject(project)}
                        className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition hover:border-primary/40 ${
                          project.id === selectedProjectId
                            ? "border-primary/60 bg-primary/5"
                            : "border-muted/40"
                        }`}
                      >
                        <p className="text-xs uppercase text-muted-foreground">
                          Saved session
                        </p>
                        <p className="mt-1 font-medium text-foreground">
                          {formatTimestamp(project.created_at)}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
          <section className="flex flex-col gap-4">
            <Card className="flex-1">
              <CardHeader className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <CardTitle>Conversation</CardTitle>
                    <CardDescription>
                      The AI output will stream below as it generates code.
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    onClick={handleSaveProject}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save project"}
                  </Button>
                </div>
                {saveError ? (
                  <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                    {saveError}
                  </div>
                ) : null}
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
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Preview mode</p>
                <p className="text-lg font-semibold">Sandbox</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant={previewMode === "code" ? "default" : "secondary"}
                  type="button"
                  onClick={() => setPreviewMode("code")}
                >
                  Code editor
                </Button>
                <Button
                  variant={previewMode === "preview" ? "default" : "secondary"}
                  type="button"
                  onClick={() => setPreviewMode("preview")}
                >
                  Live preview
                </Button>
                <Button variant="outline" type="button" onClick={handleReset}>
                  Reset preview
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <SandpackPreview files={files} mode={previewMode} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
