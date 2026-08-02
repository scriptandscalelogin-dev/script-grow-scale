ALTER TABLE public.content_items
  ADD COLUMN IF NOT EXISTS attachment_url text,
  ADD COLUMN IF NOT EXISTS attachment_storage_path text,
  ADD COLUMN IF NOT EXISTS attachment_file_name text,
  ADD COLUMN IF NOT EXISTS attachment_mime_type text;

CREATE POLICY "Admins manage all content attachment files"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'content-attachments' AND private.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (bucket_id = 'content-attachments' AND private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients read assigned published content attachments"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'content-attachments'
  AND EXISTS (
    SELECT 1
    FROM public.content_items ci
    JOIN public.content_assignments a ON a.content_id = ci.id AND a.profile_id = auth.uid()
    WHERE ci.status = 'published'::content_status
      AND ci.id::text = (storage.foldername(name))[1]
  )
);