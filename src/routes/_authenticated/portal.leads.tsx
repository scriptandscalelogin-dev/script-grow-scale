import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/site-shell";

type Lead = {
  id: string;
  email: string;
  source: string;
  created_at: string;
};

export const Route = createFileRoute("/_authenticated/portal/leads")({
  head: () => ({
    meta: [
      { title: "Leads · Portal · Script & Scale" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LeadsPage,
});

function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadLeads();
    const channel = supabase
      .channel("landing_page_leads_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "landing_page_leads",
        },
        () => loadLeads()
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  async function loadLeads() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("landing_page_leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error("Error loading leads:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredLeads =
    filter === "all"
      ? leads
      : leads.filter((l) => l.source === filter);

  const sources = [...new Set(leads.map((l) => l.source))];

  return (
    <PageShell>
      <section className="container-tight py-12">
        <div className="mb-8">
          <h1 className="font-serif text-3xl">Leads</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Real-time capture from ads.scriptandscale.co.uk
          </p>
        </div>

        {/* Filter */}
        {sources.length > 0 && (
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-md text-sm ${
                filter === "all"
                  ? "bg-highlight text-foreground"
                  : "bg-card border border-rule text-muted-foreground hover:border-highlight"
              }`}
            >
              All ({leads.length})
            </button>
            {sources.map((source) => (
              <button
                key={source}
                onClick={() => setFilter(source)}
                className={`px-3 py-1 rounded-md text-sm ${
                  filter === source
                    ? "bg-highlight text-foreground"
                    : "bg-card border border-rule text-muted-foreground hover:border-highlight"
                }`}
              >
                {source} ({leads.filter((l) => l.source === source).length})
              </button>
            ))}
          </div>
        )}

        {/* Leads Table */}
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : filteredLeads.length === 0 ? (
          <p className="rounded-md border border-rule bg-card p-6 text-center text-sm text-muted-foreground">
            No leads captured yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-rule">
            <table className="w-full text-sm">
              <thead className="bg-card">
                <tr>
                  <th className="border-b border-rule px-4 py-3 text-left font-semibold">Email</th>
                  <th className="border-b border-rule px-4 py-3 text-left font-semibold">Source</th>
                  <th className="border-b border-rule px-4 py-3 text-left font-semibold">Captured</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-rule hover:bg-card/50">
                    <td className="px-4 py-3 mono text-xs">{lead.email}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block rounded-md bg-highlight/10 px-2 py-1 text-xs font-medium">
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(lead.created_at).toLocaleDateString("en-GB")}{" "}
                      {new Date(lead.created_at).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Export CTA */}
        {filteredLeads.length > 0 && (
          <div className="mt-6">
            <button
              onClick={() => {
                const csv = [
                  ["Email", "Source", "Captured at"].join(","),
                  ...filteredLeads.map((l) =>
                    [
                      l.email,
                      l.source,
                      new Date(l.created_at).toISOString(),
                    ].join(",")
                  ),
                ].join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
                a.click();
              }}
              className="btn-secondary"
            >
              Export CSV
            </button>
          </div>
        )}
      </section>
    </PageShell>
  );
}
