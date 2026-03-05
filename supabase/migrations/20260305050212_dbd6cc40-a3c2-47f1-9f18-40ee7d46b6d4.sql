
-- Create stories table for ephemeral 24h status posts
CREATE TABLE public.stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT,
  media_url TEXT,
  media_type TEXT DEFAULT 'text',
  background_color TEXT DEFAULT '#0d9488',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '24 hours')
);

-- Enable RLS
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- Everyone can view non-expired stories
CREATE POLICY "Anyone can view active stories"
ON public.stories FOR SELECT
USING (expires_at > now());

-- Users can create their own stories
CREATE POLICY "Users can create stories"
ON public.stories FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own stories
CREATE POLICY "Users can delete their own stories"
ON public.stories FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Enable realtime for stories
ALTER PUBLICATION supabase_realtime ADD TABLE public.stories;
