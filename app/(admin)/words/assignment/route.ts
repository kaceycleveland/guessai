import { createRouteHandlerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { Database } from '@/lib/database.types';
import { hasPermission } from '@/lib/permissions/has-permission';
import { SupabaseAdminClient } from '@/lib/supabase-admin-client';
import { PutWordToDate } from '@/types/put-word-to-date';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const after = searchParams.get('after') as string;
  const before = searchParams.get('before') as string;

  const supabase = createRouteHandlerSupabaseClient<Database>({
    headers,
    cookies,
  });
  const permissions = await hasPermission(supabase, ['ADMIN']);

  if (!permissions[0]) {
    return NextResponse.error();
  }

  const getWords = await SupabaseAdminClient.from('words')
    .select(
      `
        *,
        date_assignment!inner(*)
    `
    )
    .gte('date_assignment.date', after)
    .lte('date_assignment.date', before);

  if (getWords.error) {
    return NextResponse.json({ message: getWords.error.message }, { status: 500 });
  }

  const words = getWords.data?.length ? getWords.data : undefined;

  const dateReturn: Record<string, { word: string; id: number }[]> = {};
  words?.forEach((wordBody) => {
    if (wordBody.date_assignment) {
      if ('length' in wordBody.date_assignment) {
        wordBody.date_assignment.forEach(({ date }) => {
          if (wordBody.word) {
            if (dateReturn[date]) {
              dateReturn[date].push({ id: wordBody.id, word: wordBody.word });
            } else {
              dateReturn[date] = [{ id: wordBody.id, word: wordBody.word }];
            }
          }
        });
      } else {
        if (wordBody.word) {
          if (dateReturn[wordBody.date_assignment.date]) {
            dateReturn[wordBody.date_assignment.date].push({ id: wordBody.id, word: wordBody.word });
          } else {
            dateReturn[wordBody.date_assignment.date] = [{ id: wordBody.id, word: wordBody.word }];
          }
        }
      }
    }
  });

  return NextResponse.json({ dates: dateReturn });
}

export async function PUT(req: NextRequest) {
  const { date, word_id }: PutWordToDate = await req.json();

  const supabase = createRouteHandlerSupabaseClient<Database>({
    headers,
    cookies,
  });
  const permissions = await hasPermission(supabase, ['ADMIN']);

  if (!permissions[0]) {
    return;
  }

  const putWord = await SupabaseAdminClient.from('date_assignment')
    .upsert(
      {
        date,
        word_id,
      },
      { onConflict: 'date' }
    )
    .select();

  if (putWord.error) {
    let status = 200;
    if (putWord.error.code !== '23505') status = 400;
    return NextResponse.json({ message: putWord.error.message }, { status });
  }

  if (!putWord.data?.length) return NextResponse.error();

  return NextResponse.json({ id: putWord.data[0].id });
}
