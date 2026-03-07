
CREATE TABLE public.story_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  viewer_id uuid NOT NULL,
  viewed_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(story_id, viewer_id)
);

ALTER TABLE public.story_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view story views" ON public.story_views
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can record views" ON public.story_views
  FOR INSERT WITH CHECK (auth.uid() = viewer_id);
