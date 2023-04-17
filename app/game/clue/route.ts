import { createRouteHandlerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { GAME_COOKIE } from '@/lib/api/cookie-game';
import { createGame } from '@/lib/create-game';
import { Database } from '@/lib/database.types';
import { hasPermission } from '@/lib/permissions/has-permission';
import { SupabaseAdminClient } from '@/lib/supabase-admin-client';
import { getCurrentDate } from '@/lib/utils/get-current-date';
import { narrowItems } from '@/lib/utils/narrow-items';
import { GenerateWord } from '@/types/generate-word';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST() {
  const supabase = createRouteHandlerSupabaseClient<Database>({
    headers,
    cookies,
  });

  const initData = await Promise.all([
    SupabaseAdminClient.rpc('get_current_word'),
    getCurrentDate(),
    supabase.auth.getUser(),
  ]);
  const { data: currentWordId } = initData[0];
  const { data: currentDate } = initData[1];
  const { data: userData } = initData[2];

  const userId = userData.user?.id;
  const gameCookie = cookies().get(GAME_COOKIE)?.value;

  console.log(`[game/clue] Requesting clue on ${currentDate} for user ${userId}`);

  let gameAndClues;
  // Authed flow
  const cluesQuery = SupabaseAdminClient.from('game')
    .select(
      `
    id,
    given_clues (
      clues (
        clue, sort_order
      )
    )
    `
    )
    .eq('word_id', currentWordId)
    .eq('date', currentDate);
  if (userId) {
    gameAndClues = await cluesQuery.eq('user_id', userId);
  } else if (gameCookie) {
    gameAndClues = await cluesQuery.is('user_id', null).eq('id', gameCookie);

    // Update the anonymous game to the found user
    if (gameAndClues.data?.length && gameAndClues.data[0].id && userId) {
      const gameUserUpdateQuery = await SupabaseAdminClient.from('game')
        .update({ user_id: userId })
        .eq('id', gameAndClues.data[0].id);
      if (gameUserUpdateQuery.error)
        return NextResponse.json({ message: gameUserUpdateQuery.error.message }, { status: 500 });
    }
  }

  if (gameAndClues?.error) return NextResponse.json({ message: gameAndClues.error.message }, { status: 500 });

  const narrowedGamesAndClues =
    gameAndClues && gameAndClues.data.length
      ? {
          id: gameAndClues.data[0].id,
          clues: narrowItems(gameAndClues.data[0].given_clues)
            .map((val) => narrowItems(val.clues))
            .flat(),
        }
      : undefined;

  const checkForNoGivenClues = narrowedGamesAndClues?.clues && !narrowedGamesAndClues.clues.length;
  if (!narrowedGamesAndClues || checkForNoGivenClues) {
    // New game flow, add the first and second clue as the second one was requested
    const firstAndSecondClueQuery = await SupabaseAdminClient.from('words')
      .select(`clues!inner(*),date_assignment!inner(*)`)
      .eq('date_assignment.date', currentDate)
      .or(`sort_order.eq.${0},sort_order.eq.${1}`, { foreignTable: 'clues' });

    if (firstAndSecondClueQuery.error)
      return NextResponse.json({ message: firstAndSecondClueQuery.error.message }, { status: 500 });

    if (firstAndSecondClueQuery.data.length) {
      const firstAndSecondClueNarrowed = firstAndSecondClueQuery.data.map((val) => narrowItems(val.clues)).flat();

      const { game, clueInsertResult } = await createGame(userData.user?.id, firstAndSecondClueNarrowed);

      if (game.error) return NextResponse.json({ message: game.error.message }, { status: 500 });

      if (clueInsertResult?.error)
        return NextResponse.json({ message: clueInsertResult.error.message }, { status: 500 });

      return NextResponse.json(
        {
          message: 'success',
          game_id: !userData.user?.id ? game.data.id : undefined,
        },
        { status: 200 }
      );
    }
  }

  // If a game exists, then get the next clue.
  if (narrowedGamesAndClues) {
    const { id: foundGameId, clues: givenClues } = narrowedGamesAndClues;
    const lastClue = givenClues[givenClues.length - 1];

    const foundNextClue = await SupabaseAdminClient.from('game')
      .select(
        `id,
         words (
              clues (
                id, clue, sort_order
              )
            )`
      )
      .eq('words.clues.sort_order', ++lastClue.sort_order)
      .eq('id', foundGameId);

    if (foundNextClue.error) return NextResponse.json({ message: foundNextClue.error.message }, { status: 500 });

    const nextClues = foundNextClue.data
      ?.map((data) => narrowItems(data.words))
      .flat()
      .map((data) => narrowItems(data.clues))
      .flat();

    const narrowedClues = narrowItems(foundNextClue.data.map((clueData) => narrowItems(clueData.words)))
      .flat()
      .map((val) => narrowItems(val.clues))
      .flat();

    await SupabaseAdminClient.from('given_clues').upsert({
      game_id: foundGameId,
      clue_id: narrowedClues[0].id,
    });

    console.log(
      `[game/clue] Giving user ${userId} clue ${narrowedClues[0].id} (order ${narrowedClues[0].sort_order}) in game ${foundGameId}`
    );
    return NextResponse.json({ message: 'success' }, { status: 200 });
  }

  return NextResponse.json({ message: 'Failed' }, { status: 500 });
}
