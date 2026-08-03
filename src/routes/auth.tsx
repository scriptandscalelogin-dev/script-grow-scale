import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/site-shell";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in · Script & Scale" },
      { name: "description", content: "Client portal sign-in for Script & Scale." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Auth,
});

function Auth() {
  const navigate = useNavigate();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/portal", replace: true });
    });
  }, [navigate]);

  async function onSignIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.invalidate();
    navigate({ to: "/portal", replace: true });
  }

  async function onForgot(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setNotice("If an account exists for that email, a reset link has been sent. Check your inbox (and spam).");
  }

  return (
    <PageShell>
      <section>
        <div className="container-tight flex min-h-[70vh] items-center py-16">
          <div className="mx-auto w-full max-w-md">
            <div className="eyebrow">Client portal</div>
            <h1 className="mt-3 font-serif text-4xl">
              {mode === "signin" ? "Sign in" : "Reset password"}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {mode === "signin" ? (
                <>
                  Portal accounts are created by Script &amp; Scale. If you don’t have one and want to,{" "}
                  <Link to="/contact" className="underline underline-offset-4">book a call</Link>.
                </>
              ) : (
                <>Enter your account email and we’ll send a reset link.</>
              )}
            </p>
            <form onSubmit={mode === "signin" ? onSignIn : onForgot} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="eyebrow">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none"
                />
              </div>
              {mode === "signin" && (
                <div>
                  <label htmlFor="password" className="eyebrow">Password</label>
                  <input
                    id="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none"
                  />
                </div>
              )}
              {error && <p className="text-sm text-destructive">{error}</p>}
              {notice && <p className="text-sm text-muted-foreground">{notice}</p>}
              <button type="submit" disabled={busy} className="btn-primary w-full">
                {busy
                  ? mode === "signin"
                    ? "Signing in…"
                    : "Sending…"
                  : mode === "signin"
                    ? "Sign in"
                    : "Send reset link"}
              </button>
              <div className="text-center text-sm">
                {mode === "signin" ? (
                  <button
                    type="button"
                    onClick={() => { setMode("forgot"); setError(null); setNotice(null); }}
                    className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
                  >
                    Forgot password?
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setMode("signin"); setError(null); setNotice(null); }}
                    className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
                  >
                    Back to sign in
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
