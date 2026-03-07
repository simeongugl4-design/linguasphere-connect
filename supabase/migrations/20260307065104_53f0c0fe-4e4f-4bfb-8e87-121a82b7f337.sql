
CREATE TABLE public.story_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  emoji text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(story_id, user_id)
);

ALTER TABLE public.story_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view story reactions" ON public.story_reactions
  FOR SELECT USING (true);

CREATE POLICY "Users can react to stories" ON public.story_reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their reaction" ON public.story_reactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can remove their reaction" ON public.story_reactions
  FOR DELETE USING (auth.uid() = user_id);
