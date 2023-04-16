import { Database } from "@/lib/database.types";
import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { SupabaseAdminClient } from "@/lib/supabase-admin-client";
import { GuessWord } from "@/types/guess-word";
import { GAME_COOKIE } from "@/lib/api/cookie-game";
import { narrowItems } from "@/lib/utils/narrow-items";
import { createGame } from "@/lib/create-game";
import { getCurrentDate } from "@/lib/utils/get-current-date";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const { word }: GuessWord = await request.json();
  const { data: currentDate } = await getCurrentDate();

  const supabase = createRouteHandlerSupabaseClient<Database>({
    headers,
    cookies,
  });

  const { data: userData } = await supabase.auth.getUser();
  const foundCookie = request.cookies.get(GAME_COOKIE)?.value;
  const gameCookie = foundCookie ? foundCookie : undefined;

  console.log("GUESSING COOKIE", gameCookie);

  const gameQuery = SupabaseAdminClient.from("game").select(
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
  );

  let getCurrentGameDetails;
  // Authed flow, ignore cookie
  if (userData.user?.id) {
    getCurrentGameDetails = await gameQuery
      .eq("user_id", userData.user.id)
      .eq("date", currentDate);
  }

  // Anon flow, use cookie
  if (gameCookie && !userData.user?.id) {
    console.log("guessing with anon flow with game " + gameCookie);
    getCurrentGameDetails = await gameQuery
      .is("user_id", null)
      .eq("id", gameCookie)
      .eq("date", currentDate);
  }

  if (getCurrentGameDetails?.error)
    return NextResponse.json(
      { message: getCurrentGameDetails.error.message },
      { status: 500 }
    );

  console.log("getCurrentGameDetails", getCurrentGameDetails);
  // Handle creating a new game on first guess
  if (!getCurrentGameDetails?.data?.length && word) {
    const firstClue = await SupabaseAdminClient.from("words")
      .select(`clues!inner(*),date_assignment!inner(*)`)
      .eq("date_assignment.date", currentDate)
      .or(`sort_order.eq.${0}`, { foreignTable: "clues" });

    console.log("FIRST CLUE", firstClue);
    if (firstClue.data?.length) {
      const firstClueNarrowed = firstClue.data
        .map((val) => narrowItems(val.clues))
        .flat();
      const { game, clueInsertResult } = await createGame(
        userData.user?.id,
        firstClueNarrowed
      );

      if (game.error)
        return NextResponse.json(
          { message: game.error.message },
          { status: 500 }
        );

      if (clueInsertResult?.error)
        return NextResponse.json(
          { message: clueInsertResult.error.message },
          { status: 500 }
        );

      const correct = narrowItems(game.data.words)[0].word === word;
      const givenClueId = clueInsertResult?.data.length
        ? clueInsertResult?.data[0].id
        : undefined;

      if (!givenClueId)
        return NextResponse.json(
          { message: "There was an issue finding the given_clue_id." },
          { status: 500 }
        );

      console.log(
        `Guessing on a brand new game ${game.data.id} guess '${word}' with correct status '${correct}' with ${firstClueNarrowed[0].max_attempts} max guesses`
      );

      const guessInsertResult = await SupabaseAdminClient.from(
        "guesses"
      ).insert({
        guess: word,
        correct,
        given_clue_id: givenClueId,
        game_id: game.data.id,
      });

      if (guessInsertResult.error)
        return NextResponse.json(
          { message: guessInsertResult.error.message },
          { status: 500 }
        );

      return NextResponse.json({
        correct,
        game_id: !userData.user?.id ? game.data.id : undefined,
      });
    }
  }

  if (getCurrentGameDetails?.data?.length && word) {
    const gameDetails = getCurrentGameDetails.data[0];
    const gameId = gameDetails.id;
    const gameWord = narrowItems(gameDetails.words)[0].word;
    const correct = word.toLowerCase() === gameWord?.toLowerCase();
    const allGuesses = narrowItems(gameDetails.guesses);
    const narrowedGivenClues = narrowItems(gameDetails.given_clues).map(
      (givenClue) => {
        const clue = narrowItems(givenClue.clues)[0];
        return {
          id: givenClue.id,
          clue,
          guesses: allGuesses.filter(
            (guessEntry) => guessEntry.given_clue_id === givenClue.id
          ),
        };
      }
    );
    const givenClue = narrowedGivenClues.reduce((prev, current) => {
      return prev.clue.sort_order > current.clue.sort_order ? prev : current;
    });

    const givenClueId = givenClue.id;

    if (givenClue.guesses.length >= givenClue.clue.max_attempts) {
      return NextResponse.json(
        { correct: false, message: "Max attempts hit for clue" },
        { status: 500 }
      );
    }

    console.log(
      `Guessing on game ${gameId} guess '${word}' with correct status '${correct}' with ${givenClue.guesses.length} guesses and ${givenClue.clue.max_attempts} max guesses`
    );

    await SupabaseAdminClient.from("guesses").insert({
      guess: word,
      correct,
      given_clue_id: givenClueId,
      game_id: gameId,
    });

    return NextResponse.json({ correct });
  }

  return NextResponse.json(
    { message: "There was an error guessing" },
    { status: 500 }
  );
}
