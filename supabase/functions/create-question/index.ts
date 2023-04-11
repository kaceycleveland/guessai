import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.182.0/http/server.ts";
import { CreateCompletionRequest } from "https://deno.land/x/openai/mod.ts";

serve(async (req) => {
  const { query } = await req.json();

  const completionConfig: CreateCompletionRequest = {
    model: "text-davinci-003",
    prompt: query,
    max_tokens: 256,
    temperature: 0,
    stream: true,
  };

  return fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("OPENAI_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(completionConfig),
  });
});
