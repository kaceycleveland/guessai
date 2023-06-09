import { createRouteHandlerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { Database } from '@/lib/database.types';
import { hasPermission } from '@/lib/permissions/has-permission';
import { SupabaseAdminClient } from '@/lib/supabase-admin-client';
import { GenerateWord } from '@/types/generate-word';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  const { word, clues }: GenerateWord = await request.json();

  const supabase = createRouteHandlerSupabaseClient<Database>({
    headers,
    cookies,
  });
  const permissions = await hasPermission(supabase, ['ADMIN']);

  if (!permissions[0]) {
    return NextResponse.error();
  }

  const wordInsert = await SupabaseAdminClient.from('words').insert({ word }).select();

  if (wordInsert.error) return NextResponse.json({ message: wordInsert.error.message }, { status: 500 });

  if (!wordInsert.data || !wordInsert.data.length) return NextResponse.error();
  const clueInsert = await SupabaseAdminClient.from('clues').insert(
    clues.map((clue, sort_order) => ({
      clue,
      sort_order,
      word_id: wordInsert.data[0].id,
    }))
  );

  if (clueInsert.error) return NextResponse.json({ message: clueInsert.error.message }, { status: 500 });

  return NextResponse.json({ id: wordInsert.data[0].id });
}
