-- Enable Row Level Security on storage.objects
-- This ensures the storage policies we created will be enforced

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY; 