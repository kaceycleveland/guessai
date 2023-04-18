import { createRouteHandlerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { GAME_COOKIE } from '@/lib/cookie-game';
import { Database } from '@/lib/database.types';
import { SupabaseAdminClient } from '@/lib/supabase-admin-client';
import { getCurrentDate } from '@/lib/utils/get-current-date';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST() {
  const supabase = createRouteHandlerSupabaseClient<Database>({
    headers,
    cookies,
  });

  const { data: currentDate } = await getCurrentDate();

  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (userData.user?.id) {
    console.log(`[game/assignment] Attempting to assign game to user ${userData.user?.id}.`);
    const authedCurrentGame = await SupabaseAdminClient.from('game')
      .select(`id`)
      .eq('user_id', userData.user.id)
      .eq('date', currentDate);

    if (authedCurrentGame.data?.length) {
      console.log(`[game/assignment] Found existing game ${authedCurrentGame.data[0].id}`);

      return NextResponse.json({ message: 'Game exists', code: 1 }, { status: 200 });
    }

    const gameCookie = cookies().get(GAME_COOKIE)?.value;

    if (gameCookie) {
      const applyGameOwnership = await SupabaseAdminClient.from('game')
        .update({ user_id: userData.user.id })
        .eq('id', gameCookie)
        .select();

      if (applyGameOwnership.data?.length === 1) {
        console.log(`[game/assignment] user ${userData.user.id} took ownership of ${gameCookie}`);
        return NextResponse.json({ message: 'success', code: 0 }, { status: 200 });
      }
    }

    return NextResponse.json({ message: 'no game to assign', code: 0 });
  }

  return NextResponse.json({ message: 'Failed' }, { status: 500 });
}
