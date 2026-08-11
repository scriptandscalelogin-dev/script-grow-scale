import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/site-shell";

export const Route = createFileRoute("/pay/$tier")({
  head: () => ({
    meta: [
      { title: "Complete payment · Script & Scale" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Pay,
});

declare global {
  interface Window {
    Paddle?: {
      Initialize: (opts: { token: string }) => void;
      Checkout: {
        open: (opts: {
          items: { priceId: string; quantity: number }[];
          customer?: { email: string };
        }) => void;
      };
    };
  }
}

// Map friendly tier names to their real Paddle price IDs.
const PRICE_IDS: Record<string, string> = {
  opener: "pri_01kzs4rhm5v6z1bthv2zvgkrph",
  closer: "pri_01kzs56qrz9d9rktnyyk0az6nq",
  rainmaker: "pri_01kzs596zms04gqq4p084626q6",
  onboarding: "pri_01kzs5crgzmwn2es5m1wk94z2r",
};

type Status = "loading" | "ready" | "unknown-tier" | "error";

function Pay() {
  const { tier } = Route.useParams();
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const priceId = PRICE_IDS[tier];
    if (!priceId) {
      setStatus("unknown-tier");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const email = params.get("email") ?? undefined;

    const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN as string | undefined;
    if (!token) {
      console.error("VITE_PADDLE_CLIENT_TOKEN is not set.");
      setStatus("error");
      return;
    }

    const existing = document.getElementById("paddle-js");
    function openCheckout() {
      if (!window.Paddle) {
        setStatus("error");
        return;
      }
      window.Paddle.Initialize({ token: token! });
      window.Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        ...(email ? { customer: { email } } : {}),
      });
      setStatus("ready");
    }

    if (existing) {
      openCheckout();
      return;
    }

    const script = document.createElement("script");
    script.id = "paddle-js";
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.onload = openCheckout;
    script.onerror = () => setStatus("error");
    document.body.appendChild(script);
  }, [tier]);

  return (
    <PageShell>
      <section>
        <div className="container-tight max-w-xl py-24 text-center">
          {status === "loading" && (
            <p className="text-muted-foreground">Loading checkout…</p>
          )}
          {status === "ready" && (
            <p className="text-muted-foreground">
              Complete your payment in the window that just opened. If nothing
              appeared, check your pop-up blocker.
            </p>
          )}
          {status === "unknown-tier" && (
            <p className="text-destructive">
              We couldn't find that plan. Please check the link or contact{" "}
              hello@scriptandscale.co.uk.
            </p>
          )}
          {status === "error" && (
            <p className="text-destructive">
              Something went wrong loading checkout. Please contact{" "}
              hello@scriptandscale.co.uk.
            </p>
          )}
        </div>
      </section>
    </PageShell>
  );
}