import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type SignupPageProps = {
  searchParams?: Promise<{ error?: string; message?: string }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const resolvedSearchParams = await searchParams;
  const errorMessage =
    typeof resolvedSearchParams?.error === "string"
      ? resolvedSearchParams.error
      : "";
  const infoMessage =
    typeof resolvedSearchParams?.message === "string"
      ? resolvedSearchParams.message
      : "";

  async function signUp(formData: FormData) {
    "use server";
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: siteUrl
        ? {
            emailRedirectTo: `${siteUrl}/auth/callback`,
          }
        : undefined,
    });

    if (error) {
      redirect(`/signup?error=${encodeURIComponent(error.message)}`);
    }

    if (!data.session) {
      redirect(
        "/login?message=" +
          encodeURIComponent("Check your email to confirm your account."),
      );
    }

    redirect("/workspace");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Start an AI-powered workspace in minutes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={signUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
              />
            </div>
            {errorMessage ? (
              <p className="text-sm text-destructive">{errorMessage}</p>
            ) : null}
            {infoMessage ? (
              <p className="text-sm text-muted-foreground">{infoMessage}</p>
            ) : null}
            <Button type="submit" className="w-full">
              Create account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 text-sm text-muted-foreground">
          <span>
            Already have an account?{" "}
            <Link className="text-primary underline" href="/login">
              Log in
            </Link>
          </span>
          <Link className="text-primary underline" href="/">
            Back to home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
