import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, type } = await req.json();

    if (!content) {
      return new Response(
        JSON.stringify({ error: "Content is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a content moderation AI. Analyze the following ${type || "content"} for:
1. Toxicity (hate speech, harassment, threats)
2. Spam (promotional content, repetitive messages)
3. Inappropriate content (adult content, violence)
4. Cultural sensitivity issues

Return a JSON object with:
- "safe": boolean (true if content is safe to post)
- "flags": array of strings (any issues found: "toxic", "spam", "inappropriate", "culturally_insensitive")
- "reason": string (brief explanation if not safe)
- "severity": string ("low", "medium", "high") if there are issues

Be lenient with casual conversation and cultural expressions. Only flag content that is clearly problematic.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Please analyze this content:\n\n"${content}"` },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      // Default to allowing content if moderation fails
      return new Response(
        JSON.stringify({
          safe: true,
          flags: [],
          reason: null,
          severity: null,
          fallback: true,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "";

    // Parse the AI response
    let moderationResult;
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        moderationResult = JSON.parse(jsonMatch[0]);
      } else {
        // Default to safe if can't parse
        moderationResult = {
          safe: true,
          flags: [],
          reason: null,
          severity: null,
        };
      }
    } catch (parseError) {
      // Default to safe if can't parse
      moderationResult = {
        safe: true,
        flags: [],
        reason: null,
        severity: null,
      };
    }

    return new Response(JSON.stringify(moderationResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Moderation error:", error);
    
    // Default to allowing content if there's an error
    return new Response(
      JSON.stringify({
        safe: true,
        flags: [],
        reason: null,
        severity: null,
        error: true,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
