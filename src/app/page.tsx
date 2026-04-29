import Link from "next/link";

import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-10 px-6 py-16">
        <div className="space-y-4">
          <p className="text-sm font-medium text-muted-foreground">
            Atoms AI Workspace
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Plan, generate, and preview UI with an AI-native workflow.
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            This demo wires Supabase auth and the foundation for our AI-driven
            coding workspace. Sign in to continue.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {user ? (
            <Button asChild>
              <Link href="/workspace">Go to workspace</Link>
            </Button>
          ) : (
            <>
              <Button asChild>
                <Link href="/signup">Create account</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/login">Log in</Link>
              </Button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
