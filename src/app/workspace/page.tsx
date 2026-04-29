import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import WorkspaceClient from "@/components/workspace/workspace-client";

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

  return <WorkspaceClient userEmail={user.email ?? null} onSignOut={signOut} />;
}
