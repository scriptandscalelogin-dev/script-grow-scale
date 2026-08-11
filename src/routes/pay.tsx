import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/site-shell";

export const Route = createFileRoute("/pay")({
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

type Status = "loading" | "ready" | "missing-price" | "error";

function Pay() {
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const priceId = params.get("price");
    const email = params.get("email") ?? undefined;

    if (!priceId) {
      setStatus("missing-price");
      return;
    }

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
        items: [{ priceId: priceId!, quantity: 1 }],
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
  }, []);

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
          {status === "missing-price" && (
            <p className="text-destructive">
              No price specified. This link should include a{" "}
              <code>?price=</code> parameter.
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