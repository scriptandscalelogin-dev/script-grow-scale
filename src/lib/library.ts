export type ContentKind = "script" | "sop" | "objection";
export type ContentStatus = "draft" | "published" | "archived";

export const KIND_LABELS: Record<ContentKind, string> = {
  script: "Script",
  sop: "SOP",
  objection: "Objection sheet",
};

export const KINDS: ContentKind[] = ["script", "sop", "objection"];
export const STATUSES: ContentStatus[] = ["draft", "published", "archived"];
