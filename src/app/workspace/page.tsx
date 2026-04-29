import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import SandpackPreview from "@/components/workspace/sandpack-preview";

export default async function WorkspacePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  async function signOut() {
    "use server";
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm text-muted-foreground">Signed in as</p>
            <p className="font-semibold text-foreground">{user.email}</p>
          </div>
          <form action={signOut}>
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
                  Chat history will appear here once AI wiring is enabled.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div className="rounded-xl border border-dashed border-muted-foreground/30 p-4">
                  Start by describing what you want to build, like “Design a
                  pricing section with three tiers.”
                </div>
                <div className="rounded-xl bg-muted/40 p-4">
                  Messages will stream here in Phase 3.
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Prompt</CardTitle>
                <CardDescription>Send a request to the AI builder.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <textarea
                  className="min-h-[96px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  placeholder="e.g. Build a hero section with a CTA button"
                />
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Optional: Add a quick note..."
                    className="flex-1"
                  />
                  <Button type="button">Send</Button>
                </div>
              </CardContent>
            </Card>
          </section>
          <section className="flex min-h-[520px] flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Live preview</p>
                <p className="text-lg font-semibold">Sandbox</p>
              </div>
              <Button variant="secondary" type="button">
                Reset preview
              </Button>
            </div>
            <div className="flex-1">
              <SandpackPreview />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
