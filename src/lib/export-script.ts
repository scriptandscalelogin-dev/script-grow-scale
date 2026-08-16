import { INTAKE_QUESTIONS, type ScriptConfig } from "@/lib/call-script";

function esc(s: string) {
  return (s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function nl2p(text: string) {
  return (text || "")
    .split("\n\n")
    .filter(Boolean)
    .map((p) => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`)
    .join("\n");
}

export function exportScriptHtml(businessName: string, config: ScriptConfig): string {
  const title = businessName ? `${businessName} — Sales Script` : "Sales Script";
  const questionLabels = INTAKE_QUESTIONS.filter((b) => b.kind === "question").map((b) =>
    b.kind === "question" ? b.label : "",
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${esc(title)}</title>
<style>
  body { font-family: Georgia, 'Times New Roman', serif; max-width: 720px; margin: 60px auto; padding: 0 24px; color: #1a1a1a; line-height: 1.6; }
  h1 { font-size: 2rem; margin-bottom: 0.25rem; }
  h2 { font-size: 1.3rem; margin-top: 2.5rem; border-top: 1px solid #ddd; padding-top: 1.5rem; }
  .meta { color: #666; font-size: 0.85rem; margin-bottom: 2rem; }
  ol, ul { padding-left: 1.3rem; }
  li { margin-bottom: 0.4rem; }
  .tier { border: 1px solid #ddd; border-radius: 6px; padding: 1rem; margin-bottom: 1rem; }
  .tier b { display: block; margin-bottom: 0.3rem; }
  .objection { border-left: 3px solid #C5A059; padding-left: 1rem; margin-bottom: 1.5rem; }
  .objection h3 { font-size: 1rem; margin: 0 0 0.5rem 0; }
  p { margin: 0.75rem 0; }
</style>
</head>
<body>
  <h1>${esc(title)}</h1>
  <div class="meta">Exported from Script &amp; Scale. This file is yours to keep, no login or subscription required to read it.</div>

  <h2>Diagnostic questions</h2>
  <p>Ask these, in order, live on a call. Capture the answers in their own words.</p>
  <ol>
    ${questionLabels.map((q) => `<li>${esc(q)}</li>`).join("\n    ")}
  </ol>

  <h2>Recap</h2>
  <p>Summarize what you heard back to them in their own words, especially why they took the call, what they said about their own business, who their dream client is, why they'd choose them over competitors, and their average deal value. Confirm you've understood it correctly before moving on.</p>

  <h2>What we actually do</h2>
  ${nl2p(config.pitchBody)}

  <h2>Transition</h2>
  ${nl2p(config.transitionBody)}

  <h2>The offer</h2>
  ${config.offer
    .map(
      (t) =>
        `<div class="tier"><b>${esc(t.name)} — £${Number(t.price).toLocaleString("en-GB")}/mo</b>${esc(t.cadence)}, ${esc(t.tagline)}</div>`,
    )
    .join("\n  ")}

  <h2>The mechanic</h2>
  ${nl2p(config.mechanicBody)}

  <h2>Objections</h2>
  ${config.objections
    .map(
      (o) =>
        `<div class="objection"><h3>${esc(o.title)}</h3>${nl2p(o.body)}</div>`,
    )
    .join("\n  ")}

  <h2>The proof</h2>
  ${nl2p(config.proofBody)}

  <h2>The risk reversal</h2>
  ${nl2p(config.riskReversalBody)}

  <h2>What's included</h2>
  ${config.whatsIncluded
    .map(
      (t) =>
        `<div class="tier"><b>${esc(t.name)} (£${Number(t.price).toLocaleString("en-GB")}/mo)</b><ul>${t.includes.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`,
    )
    .join("\n  ")}

  <h2>The close</h2>
  ${nl2p(config.closeBody)}
</body>
</html>`;
}

export function downloadScriptHtml(businessName: string, config: ScriptConfig) {
  const html = exportScriptHtml(businessName, config);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const slug = (businessName || "sales-script").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  a.download = `${slug || "sales-script"}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
