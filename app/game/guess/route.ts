import { createRouteHandlerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { GAME_COOKIE } from '@/lib/api/cookie-game';
import { createGame } from '@/lib/create-game';
import { Database } from '@/lib/database.types';
import { SupabaseAdminClient } from '@/lib/supabase-admin-client';
import { getCurrentDate } from '@/lib/utils/get-current-date';
import { narrowItems } from '@/lib/utils/narrow-items';
import { GuessWord } from '@/types/guess-word';

import { POST as postNewClue } from '../clue/route';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  const { word: origWord }: GuessWord = await request.json();

  const word = origWord?.toLowerCase();

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
  const foundCookie = request.cookies.get(GAME_COOKIE)?.value;
  const gameCookie = foundCookie ? foundCookie : undefined;

  console.log('GUESSING COOKIE', gameCookie);

  const gameQuery = SupabaseAdminClient.from('game')
    .select(
      `
  id,
  words (
    word
  ),
  guesses (
    guess,
    correct,
    given_clue_id
  ),
  given_clues (
    id,
    clues (
      clue, sort_order, max_attempts
    )
  )
  `
    )
    .eq('word_id', currentWordId)
    .eq('date', currentDate);

  let getCurrentGameDetails;
  // Authed flow, ignore cookie
  if (userId) {
    getCurrentGameDetails = await gameQuery.eq('user_id', userId);
  }

  // Anon flow, use cookie
  if (gameCookie && !userData.user?.id) {
    getCurrentGameDetails = await gameQuery.is('user_id', null).eq('id', gameCookie);
  }

  if (getCurrentGameDetails?.error)
    return NextResponse.json({ message: getCurrentGameDetails.error.message }, { status: 500 });

  // Handle creating a new game on first guess
  if (!getCurrentGameDetails?.data?.length && word) {
    const firstClueQuery = await SupabaseAdminClient.from('words')
      .select(`clues!inner(*),date_assignment!inner(*)`)
      .eq('date_assignment.date', currentDate)
      .or(`sort_order.eq.${0}`, { foreignTable: 'clues' });

    if (firstClueQuery.error) return NextResponse.json({ message: firstClueQuery.error.message }, { status: 500 });

    if (firstClueQuery.data.length) {
      const firstClueNarrowed = firstClueQuery.data.map((val) => narrowItems(val.clues)).flat();
      const { game, clueInsertResult } = await createGame(userId, firstClueNarrowed);

      if (game.error) return NextResponse.json({ message: game.error.message }, { status: 500 });

      if (clueInsertResult?.error)
        return NextResponse.json({ message: clueInsertResult.error.message }, { status: 500 });

      const correct = narrowItems(game.data.words)[0].word === word;
      const givenClueId = clueInsertResult?.data.length ? clueInsertResult?.data[0].id : undefined;

      if (!givenClueId)
        return NextResponse.json({ message: 'There was an issue finding the given_clue_id.' }, { status: 500 });

      console.log(
        `Guessing on a brand new game ${game.data.id} guess '${word}' with correct status '${correct}' with ${firstClueNarrowed[0].max_attempts} max guesses`
      );

      const guessInsertResult = await SupabaseAdminClient.from('guesses').insert({
        guess: word,
        correct,
        given_clue_id: givenClueId,
        game_id: game.data.id,
      });

      if (guessInsertResult.error)
        return NextResponse.json({ message: guessInsertResult.error.message }, { status: 500 });

      return NextResponse.json({
        correct,
        game_id: !userData.user?.id ? game.data.id : undefined,
      });
    }
  }

  // Existing game flow
  if (getCurrentGameDetails?.data.length && word) {
    const gameDetails = getCurrentGameDetails.data[0];
    const gameId = gameDetails.id;
    const gameWord = narrowItems(gameDetails.words)[0].word;
    const correct = word.toLowerCase() === gameWord?.toLowerCase();
    const allGuesses = narrowItems(gameDetails.guesses);
    const narrowedGivenClues = narrowItems(gameDetails.given_clues).map((givenClue) => {
      const clue = narrowItems(givenClue.clues)[0];
      return {
        id: givenClue.id,
        clue,
        guesses: allGuesses.filter((guessEntry) => guessEntry.given_clue_id === givenClue.id),
      };
    });
    const givenClue = narrowedGivenClues.reduce((prev, current) => {
      return prev.clue.sort_order > current.clue.sort_order ? prev : current;
    });

    const givenClueId = givenClue.id;

    if (givenClue.guesses.length >= givenClue.clue.max_attempts) {
      return NextResponse.json({ correct: false, word, message: 'Max attempts hit for clue' }, { status: 500 });
    }

    console.log(
      `Guessing on game ${gameId} guess '${word}' with correct status '${correct}' with ${givenClue.guesses.length} guesses and ${givenClue.clue.max_attempts} max guesses`
    );

    const guessInsertQuery = await SupabaseAdminClient.from('guesses').insert({
      guess: word,
      correct,
      given_clue_id: givenClueId,
      game_id: gameId,
    });

    if (guessInsertQuery.error) return NextResponse.json({ message: guessInsertQuery.error.message }, { status: 500 });

    if (givenClue.guesses.length + 1 >= givenClue.clue.max_attempts) {
      const result = await postNewClue();
      if (!result.ok) return result;
    }

    return NextResponse.json({ correct, word });
  }

  return NextResponse.json({ message: 'There was an error guessing' }, { status: 500 });
}
