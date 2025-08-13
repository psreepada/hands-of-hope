ALTER TABLE public.branches 
ADD COLUMN IF NOT EXISTS image_url text;

CREATE INDEX IF NOT EXISTS idx_branches_image_url ON public.branches(image_url);

CREATE TABLE IF NOT EXISTS public.branch_leaders (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  branch_id bigint NOT NULL,
  leader_name text NOT NULL,
  leader_email text NOT NULL,
  leader_description text NOT NULL,
  leader_image_url text,
  leader_order integer DEFAULT 1,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT branch_leaders_pkey PRIMARY KEY (id),
  CONSTRAINT branch_leaders_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE CASCADE
);
w
CREATE INDEX IF NOT EXISTS idx_branch_leaders_branch_id ON public.branch_leaders(branch_id);
CREATE INDEX IF NOT EXISTS idx_branch_leaders_order ON public.branch_leaders(branch_id, leader_order);

ALTER TABLE public.branch_leaders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view branch leaders" ON public.branch_leaders
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage branch leaders" ON public.branch_leaders
FOR ALL USING (auth.role() = 'authenticated');

INSERT INTO public.branch_leaders (branch_id, leader_name, leader_email, leader_description, leader_image_url, leader_order)
SELECT 
  id as branch_id,
  leader_name,
  leader_email,
  COALESCE(leader_description, name || ' Branch President') as leader_description,
  leader_image_url,
  1 as leader_order
FROM public.branches 
WHERE leader_name IS NOT NULL 
  AND leader_email IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.branch_leaders bl WHERE bl.branch_id = branches.id
  );

INSERT INTO storage.buckets (id, name, public)
VALUES ('branch-images', 'branch-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY IF NOT EXISTS "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'branch-images');

CREATE POLICY IF NOT EXISTS "Authenticated upload access" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'branch-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY IF NOT EXISTS "Authenticated update access" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'branch-images'
  AND auth.role() = 'authenticated'
);

CREATE POLICY IF NOT EXISTS "Authenticated delete access" ON storage.objects
FOR DELETE USING (
  bucket_id = 'branch-images'
  AND auth.role() = 'authenticated'
);
