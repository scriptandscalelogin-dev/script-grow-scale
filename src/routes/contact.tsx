import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { PageShell } from "@/components/site-shell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Book a discovery call · Script & Scale" },
      { name: "description", content: "Tell us about your last five deals. 20-minute diagnostic, no pitch deck, no obligation." },
      { property: "og:title", content: "Book a discovery call · Script & Scale" },
      { property: "og:description", content: "20-minute pipeline diagnostic. If it isn't a fit, I'll say so." },
      { property: "og:image", content: "https://scriptandscale.co.uk/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://scriptandscale.co.uk/og-image.png" },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1, "Your name").max(100),
  email: z.string().trim().email("A valid email").max(255),
  company: z.string().trim().min(1, "Company name").max(150),
  company_type: z.string().trim().max(100).optional(),
  message: z.string().trim().min(1, "A short message").max(2000),
});

function CalEmbed() {
  useEffect(() => {
    const initCal = () => {
      if ((window as any).Cal) {
        const Cal = (window as any).Cal;
        Cal("init", "chat-with-me", { origin: "https://app.cal.com" });
        Cal.config = Cal.config || {};
        Cal.config.forwardQueryParams = true;
        Cal.ns["chat-with-me"]("inline", {
          elementOrSelector: "#my-cal-inline-chat-with-me",
          config: { layout: "month_view", useSlotsViewOnSmallScreen: true },
          calLink: "arno-script-scale/chat-with-me",
        });
        Cal.ns["chat-with-me"]("ui", {
          cssVarsPerTheme: {
            light: { "cal-brand": "#B5A642" },
            dark: { "cal-brand": "#ececec" },
          },
          hideEventTypeDetails: false,
          layout: "month_view",
        });
      }
    };

    const checkAndInit = setInterval(() => {
      if ((window as any).Cal) {
        initCal();
        clearInterval(checkAndInit);
      }
    }, 100);

    return () => clearInterval(checkAndInit);
  }, []);

  return (
    <>
      <div style={{ width: "100%", height: "100%", overflow: "scroll" }} id="my-cal-inline-chat-with-me"></div>
      <script type="text/javascript">
        {`
          (function (C, A, L) {
            let p = function (a, ar) { a.q.push(ar); };
            let d = C.document;
            C.Cal = C.Cal || function () {
              let cal = C.Cal;
              let ar = arguments;
              if (!cal.loaded) {
                cal.ns = {};
                cal.q = cal.q || [];
                d.head.appendChild(d.createElement("script")).src = A;
                cal.loaded = true;
              }
              if (ar[0] === L) {
                const api = function () { p(api, arguments); };
                const namespace = ar[1];
                api.q = api.q || [];
                if(typeof namespace === "string"){
                  cal.ns[namespace] = cal.ns[namespace] || api;
                  p(cal.ns[namespace], ar);
                  p(cal, ["initNamespace", namespace]);
                } else p(cal, ar);
                return;
              }
              p(cal, ar);
            };
          })(window, "https://app.cal.com/embed/embed.js", "init");
          Cal("init", "chat-with-me", {origin:"https://app.cal.com"});
          Cal.config = Cal.config || {};
          Cal.config.forwardQueryParams = true;
          Cal.ns["chat-with-me"]("inline", {
            elementOrSelector:"#my-cal-inline-chat-with-me",
            config: {"layout":"month_view","useSlotsViewOnSmallScreen":"true"},
            calLink: "arno-script-scale/chat-with-me",
          });
          Cal.ns["chat-with-me"]("ui", {"cssVarsPerTheme":{"light":{"cal-brand":"#B5A642"},"dark":{"cal-brand":"#ececec"}},"hideEventTypeDetails":false,"layout":"month_view"});
        `}
      </script>
    </>
  );
}

function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "submitted">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{ name: string; email: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg(null);
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      company: fd.get("company"),
      company_type: fd.get("company_type") || undefined,
      message: fd.get("message"),
    });
    if (!parsed.success) {
      setStatus("error");
      setErrorMsg(parsed.error.issues[0]?.message ?? "Check the form and try again.");
      return;
    }
    const { error } = await supabase.from("contact_submissions").insert(parsed.data);
    if (error) {
      setStatus("error");
      setErrorMsg("Something went wrong. Email hello@scriptandscale.co.uk instead.");
      return;
    }
    setSubmittedData({ name: parsed.data.name, email: parsed.data.email });
    setStatus("submitted");
  }

  if (status === "submitted" && submittedData) {
    return (
      <PageShell>
        <section className="rule-b">
          <div className="container-tight py-20">
            <div className="eyebrow">Book a call</div>
            <h1 className="mt-4 font-serif text-5xl md:text-6xl">Pick a time</h1>
            <p className="mt-6 max-w-2xl text-muted-foreground">
              Great. Your diagnostic note is on the way. Pick a time below.
            </p>
          </div>
        </section>

        <section>
          <div className="container-tight py-16">
            <div style={{ height: "700px" }}>
              <CalEmbed />
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="rule-b">
        <div className="container-tight py-20">
          <div className="eyebrow">Book a call</div>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl">20-Minute Pipeline Diagnostic</h1>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Tell me about your last five deals. What came in, what closed, what stalled. I'll say
            whether Script &amp; Scale would move the needle. If it wouldn't, I'll say that too.
          </p>
        </div>
      </section>

      <section>
        <div className="container-tight grid gap-12 py-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <form onSubmit={onSubmit} className="space-y-5">
              <Field name="name" label="Your name" required autoComplete="name" />
              <Field name="email" type="email" label="Email" required autoComplete="email" />
              <Field name="company" label="Company" required autoComplete="organization" />
              <div>
                <label htmlFor="company_type" className="eyebrow">Company type</label>
                <select
                  id="company_type"
                  name="company_type"
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none"
                >
                  <option value="">Select one</option>
                  <option>MSP</option>
                  <option>ITSM provider</option>
                  <option>Consultancy</option>
                  <option>Technical services</option>
                  <option>Trade business</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="eyebrow">
                  What are your last five deals looking like?
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  maxLength={2000}
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none"
                  placeholder="Rough shape of your pipeline, where deals stall, what you've tried."
                />
              </div>
              {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
              <button
                type="submit"
                disabled={status === "sending"}
                className="btn-primary"
              >
                {status === "sending" ? "Sending…" : "Continue to booking"}
              </button>
            </form>
          </div>
          <aside className="md:col-span-5 md:border-l md:border-rule md:pl-10">
            <div className="eyebrow">What happens next</div>
            <ol className="mono mt-4 space-y-4 text-sm list-none">
              <li><span className="text-highlight">01</span>. I read your note.</li>
              <li><span className="text-highlight">02</span>. Pick a time below.</li>
              <li><span className="text-highlight">03</span>. 20-minute diagnostic. No slide deck.</li>
              <li><span className="text-highlight">04</span>. If we work together, onboarding starts the week after.</li>
            </ol>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}

function Field({
  name, label, type = "text", required, autoComplete,
}: {
  name: string; label: string; type?: string; required?: boolean; autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="eyebrow">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        maxLength={255}
        className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none"
      />
    </div>
  );
}
