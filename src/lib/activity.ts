import { supabase } from "@/integrations/supabase/client";

export type ActivityEventType = "login" | "view_content";
export type ActivityTargetKind = "script" | "sop" | "objection";

export async function logActivity(
  event_type: ActivityEventType,
  opts: {
    target_kind?: ActivityTargetKind | null;
    target_id?: string | null;
    metadata?: Record<string, unknown>;
  } = {},
) {
  try {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    await supabase.from("activity_log").insert({
      user_id: data.user.id,
      event_type,
      target_kind: opts.target_kind ?? null,
      target_id: opts.target_id ?? null,
      metadata: (opts.metadata ?? {}) as never,
    });
  } catch {
    // best-effort; never block UI
  }
}

export function formatActivity(row: {
  event_type: string;
  target_kind: string | null;
  metadata: Record<string, unknown> | null;
}): string {
  if (row.event_type === "login") return "Signed in";
  if (row.event_type === "view_content") {
    const kind = row.target_kind ?? "content";
    const title = (row.metadata?.title as string | undefined) ?? "an item";
    return `Viewed ${kind}: ${title}`;
  }
  return row.event_type;
}
