// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import * as log from 'https://deno.land/std/log/mod.ts';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { OpenAI } from 'https://deno.land/x/openai/mod.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

import { corsHeaders } from '../_shared/cors.ts';
import { cleanClues, cleanWord } from './clean-data.ts';
import { CLEAN_CLUES_PROMPT, DEFAULT_REQUEST_SETTINGS, GET_CLUES_PROMPT, GET_WORD_PROMPT } from './prompts.ts';

const sharedHeaders = {
  ...corsHeaders,
  'Content-Type': 'application/json',
};

serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('NEXT_PUBLIC_SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('NEXT_PUBLIC_SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const openAiClient = new OpenAI(Deno.env.get('OPENAI_KEY') ?? '');
    // Now we can get the session or user object
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    // And we can run queries in the context of our authenticated user
    const { data, error } = await supabaseClient.from('role_assignment').select(`
    roles ( id, name )
    `);
    if (error) throw error;

    const isAdmin = Boolean(
      data.find(({ roles }) => {
        if (roles) {
          if ('length' in roles) {
            return roles.find((role) => {
              return role.id === 1;
            });
          }

          return roles.id === 1;
        }

        return false;
      })
    );

    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'No permission' }), {
        headers: sharedHeaders,
        status: 401,
      });
    }

    const wordResponse = await openAiClient.createChatCompletion({
      ...DEFAULT_REQUEST_SETTINGS,
      messages: [
        {
          role: 'system',
          content: GET_WORD_PROMPT,
        },
      ],
    });

    const extractedWord = wordResponse.choices.length ? wordResponse.choices[0].message?.content : undefined;

    if (!extractedWord)
      return new Response(JSON.stringify({ error: 'Issue with extracted word.' }), {
        headers: sharedHeaders,
        status: 400,
      });

    const word = cleanWord(extractedWord);

    if (!word)
      return new Response(JSON.stringify({ error: 'Issue with cleaning word.' }), {
        headers: sharedHeaders,
        status: 400,
      });

    const cluesResponse = await openAiClient.createChatCompletion({
      ...DEFAULT_REQUEST_SETTINGS,
      messages: [
        {
          role: 'system',
          content: GET_WORD_PROMPT,
        },
        {
          role: 'assistant',
          content: word,
        },
        {
          role: 'system',
          content: GET_CLUES_PROMPT,
        },
      ],
    });

    const extractedClues = cluesResponse.choices.length ? cluesResponse.choices[0].message?.content : undefined;

    if (!extractedClues)
      return new Response(JSON.stringify({ error: 'Issue with extracted clue.' }), {
        headers: sharedHeaders,
        status: 400,
      });

    const cleanedCluesResponse = await openAiClient.createChatCompletion({
      ...DEFAULT_REQUEST_SETTINGS,
      messages: [
        {
          role: 'system',
          content: GET_WORD_PROMPT,
        },
        {
          role: 'assistant',
          content: word,
        },
        {
          role: 'system',
          content: GET_CLUES_PROMPT,
        },
        {
          role: 'assistant',
          content: cleanClues(word, extractedClues).join('\n'),
        },
        {
          role: 'system',
          content: CLEAN_CLUES_PROMPT,
        },
      ],
    });

    const extractedCleanedClues = cleanedCluesResponse.choices.length
      ? cleanedCluesResponse.choices[0].message?.content
      : undefined;

    if (!extractedCleanedClues)
      return new Response(JSON.stringify({ error: 'Issue with extracted clean clues.' }), {
        headers: sharedHeaders,
        status: 400,
      });

    const clues = cleanClues(word, extractedCleanedClues);

    log.info(`found word '${word}' and ${clues.length} clues.`);

    const returnBody = JSON.stringify({ word: word, clues: clues });

    return new Response(returnBody, {
      headers: sharedHeaders,
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: sharedHeaders,
      status: 400,
    });
  }
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
