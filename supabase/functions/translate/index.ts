import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, sourceLanguage, targetLanguage, context } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!text || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: text and targetLanguage" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sourceInfo = sourceLanguage && sourceLanguage !== "auto" 
      ? `from ${sourceLanguage}` 
      : "(auto-detect the source language)";

    const contextInfo = context 
      ? `Context: ${context}. ` 
      : "";

    const systemPrompt = `You are LINGUAONE AI, a professional translator with expertise in 100+ languages. Your translations are:
- Natural and fluent, not word-for-word literal translations
- Culturally appropriate and contextually aware
- Preserving the original tone, intent, and nuance
- Accurate with idioms, expressions, and colloquialisms

${contextInfo}Translate the following text ${sourceInfo} to ${targetLanguage}.

IMPORTANT: 
- Return ONLY the translated text, nothing else
- Do not include any explanations, notes, or the original text
- Preserve formatting (line breaks, paragraphs)
- If the text is already in the target language, return it as-is`;

    // Retry logic for transient errors
    const maxRetries = 3;
    let lastError: Error | null = null;
    let response: Response | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: text },
            ],
            temperature: 0.3,
            max_tokens: 4000,
          }),
        });

        if (response.ok) break;

        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: "API credits exhausted. Please add credits to continue." }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Retry on 5xx errors
        if (response.status >= 500 && attempt < maxRetries - 1) {
          console.log(`Attempt ${attempt + 1} failed with ${response.status}, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }

        const errorText = await response.text();
        console.error("Translation API error:", response.status, errorText);
        lastError = new Error(`Translation failed: ${response.status}`);
      } catch (e) {
        lastError = e instanceof Error ? e : new Error("Network error");
        if (attempt < maxRetries - 1) {
          console.log(`Attempt ${attempt + 1} failed with network error, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
      }
    }

    if (!response?.ok) {
      throw lastError || new Error("Translation failed after retries");
    }

    const data = await response.json();
    const translatedText = data.choices?.[0]?.message?.content?.trim();

    if (!translatedText) {
      throw new Error("No translation received from AI");
    }

    return new Response(
      JSON.stringify({ 
        translatedText,
        sourceLanguage: sourceLanguage || "auto",
        targetLanguage 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Translation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Translation failed";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
