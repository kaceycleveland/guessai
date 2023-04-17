import { createRouteHandlerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';

import { Database } from '@/lib/database.types';
import { client } from '@/lib/openai-client';
import { hasPermission } from '@/lib/permissions/has-permission';
import { SupabaseAdminClient } from '@/lib/supabase-admin-client';

import { cleanClues, cleanWord } from './clean-data';
import { CLEAN_CLUES_PROMPT, DEFAULT_REQUEST_SETTINGS, GET_CLUES_PROMPT, GET_WORD_PROMPT } from './prompts';

export const dynamic = 'force-dynamic';

/**
 * Get words list
 */
export async function GET() {
  const supabase = createRouteHandlerSupabaseClient<Database>({
    headers,
    cookies,
  });
  const permissions = await hasPermission(supabase, ['ADMIN']);

  if (!permissions[0]) {
    return NextResponse.json({ message: 'Insufficent permissions' }, { status: 401 });
  }

  const getWords = await SupabaseAdminClient.from('words').select(`
      id,
      word
  `);

  const words = getWords.data?.length ? getWords.data : undefined;

  if (getWords.error) {
    return NextResponse.json({ message: getWords.error.message }, { status: 500 });
  }
  if (!words) return NextResponse.error();

  return NextResponse.json({ words });
}

// TODO: Pull latest words from supabase and ensure the AI does not return it
/**
 * This function handles generating new words from OpenAI
 */
export async function POST() {
  const supabase = createRouteHandlerSupabaseClient<Database>({
    headers,
    cookies,
  });
  const permissions = await hasPermission(supabase, ['ADMIN']);

  if (!permissions[0]) {
    return NextResponse.error();
  }

  const wordResponse = await client.createChatCompletion({
    ...DEFAULT_REQUEST_SETTINGS,
    messages: [
      {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: GET_WORD_PROMPT,
      },
    ],
  });

  const extractedWord = wordResponse.data.choices.length ? wordResponse.data.choices[0].message?.content : undefined;

  if (!extractedWord) return NextResponse.error();

  const word = cleanWord(extractedWord);

  if (!word) return NextResponse.error();

  const cluesResponse = await client.createChatCompletion({
    ...DEFAULT_REQUEST_SETTINGS,
    messages: [
      {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: GET_WORD_PROMPT,
      },
      {
        role: ChatCompletionRequestMessageRoleEnum.Assistant,
        content: word,
      },
      {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: GET_CLUES_PROMPT,
      },
    ],
  });

  const extractedClues = cluesResponse.data.choices.length ? cluesResponse.data.choices[0].message?.content : undefined;

  if (!extractedClues) return NextResponse.error();

  const cleanedCluesResponse = await client.createChatCompletion({
    ...DEFAULT_REQUEST_SETTINGS,
    messages: [
      {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: GET_WORD_PROMPT,
      },
      {
        role: ChatCompletionRequestMessageRoleEnum.Assistant,
        content: word,
      },
      {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: GET_CLUES_PROMPT,
      },
      {
        role: ChatCompletionRequestMessageRoleEnum.Assistant,
        content: cleanClues(word, extractedClues).join('\n'),
      },
      {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: CLEAN_CLUES_PROMPT,
      },
    ],
  });

  const extractedCleanedClues = cleanedCluesResponse.data.choices.length
    ? cleanedCluesResponse.data.choices[0].message?.content
    : undefined;

  if (!extractedCleanedClues) return NextResponse.error();

  const clues = cleanClues(word, extractedCleanedClues);

  return NextResponse.json({ word, clues });
}
