-- Private storage buckets used by the portal.
-- roleplays: client roleplay recordings, read via signed URLs.
-- content-attachments: files attached to library content items, read via signed URLs.
-- Access is controlled by the storage.objects policies defined in earlier migrations.
-- Idempotent: safe to run on a project where the buckets already exist.
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('roleplays', 'roleplays', false),
  ('content-attachments', 'content-attachments', false)
ON CONFLICT (id) DO NOTHING;
