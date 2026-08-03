import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/site-shell";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set your password · Script & Scale" },
      { name: "description", content: "Set or reset your Script & Scale portal password." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // The recovery link opens with a hash containing tokens; Supabase-js parses it automatically
    // and emits PASSWORD_RECOVERY. We also check current session for direct visits.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setHasRecoverySession(!!session);
        setReady(true);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setHasRecoverySession(!!data.session);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don’t match.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
    setTimeout(() => navigate({ to: "/portal", replace: true }), 1500);
  }

  return (
    <PageShell>
      <section>
        <div className="container-tight flex min-h-[70vh] items-center py-16">
          <div className="mx-auto w-full max-w-md">
            <div className="eyebrow">Client portal</div>
            <h1 className="mt-3 font-serif text-4xl">Set your password</h1>

            {!ready ? (
              <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
            ) : !hasRecoverySession ? (
              <div className="mt-6 space-y-4 text-sm">
                <p className="text-muted-foreground">
                  This link is invalid or has expired. Password-reset links are single-use and expire after 24 hours.
                </p>
                <p>
                  <Link to="/auth" className="underline underline-offset-4">
                    Back to sign in
                  </Link>{" "}
                  or request a new reset link there.
                </p>
              </div>
            ) : done ? (
              <p className="mt-6 text-sm">
                Password updated. Redirecting to your portal…
              </p>
            ) : (
              <form onSubmit={submit} className="mt-8 space-y-5">
                <p className="text-sm text-muted-foreground">
                  Choose a new password (at least 8 characters).
                </p>
                <div>
                  <label htmlFor="pw" className="eyebrow">New password</label>
                  <input
                    id="pw"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="cf" className="eyebrow">Confirm password</label>
                  <input
                    id="cf"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none"
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <button type="submit" disabled={busy} className="btn-primary w-full">
                  {busy ? "Saving…" : "Set password"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
