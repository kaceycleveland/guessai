import Clues from "./clues";
import GuessBox from "./guess-box";
import { headers, cookies } from "next/headers";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";
import { SupabaseAdminClient } from "@/lib/supabase-admin-client";
import { narrowItems } from "@/lib/utils/narrow-items";
import { GAME_COOKIE } from "@/lib/api/cookie-game";
import { CluesArray, OrderedClues } from "@/types/ordered-clues";
import { getCurrentDate } from "@/lib/utils/get-current-date";

export const revalidate = 0;

export default async function Page() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  });
  const initData = await Promise.all([
    SupabaseAdminClient.rpc("get_current_word"),
    getCurrentDate(),
    supabase.auth.getUser(),
  ]);
  const { data: currentWordId } = initData[0];
  const { data: currentDate } = initData[1];
  const { data: userData } = initData[2];

  const userId = userData.user?.id;
  const gameCookie = cookies().get(GAME_COOKIE)?.value;
  let games;
  const gameQuery = SupabaseAdminClient.from("game")
    .select("*")
    .eq("word_id", currentWordId)
    .eq("date", currentDate);
  if (gameCookie) {
    games = await gameQuery.eq("id", gameCookie);
  } else if (userId) {
    games = await gameQuery.eq("user_id", userId);
  }

  if (games?.error) {
    //TODO: Implement error page catch
  }
  const foundGame = games?.data?.length ? games.data[0] : undefined;

  let setNewGameToNewWord = false;
  if (foundGame && foundGame.word_id !== currentWordId) {
    setNewGameToNewWord = true;
  }

  console.log("SET NEW GAME", foundGame?.word_id, currentWordId);

  let firstClues: CluesArray = [];
  const isNewGameFromAuthedUser = foundGame && foundGame.user_id === userId; // If there is no authed user and there is a user_id attached to the game
  // If there is no anon game, render the first clue of today.
  if (!foundGame || isNewGameFromAuthedUser) {
    const firstClue = await SupabaseAdminClient.from("words")
      .select(`clues!inner(*),date_assignment!inner(*)`)
      .eq("date_assignment.date", currentDate)
      .eq("clues.sort_order", 0)
      .single();

    if (firstClue.data?.clues) {
      const firstClueNarrowed = narrowItems(firstClue.data?.clues);
      firstClues.push(...firstClueNarrowed);
    }
    // If there is a game, fetch the user's game and update the anon game if needed.
  }

  // Update anon game to user ownership
  if (userData.user?.id && foundGame) {
    const updateGameToUser = await SupabaseAdminClient.from("game")
      .update({ user_id: userData.user.id })
      .eq("id", foundGame.id)
      .is("user_id", null)
      .select();
    console.log("updateGameToUser", updateGameToUser);
    if (updateGameToUser.error) throw new Error(updateGameToUser.error.message);
  }

  let givenClues;
  let clues: OrderedClues = firstClues.map((clue) => ({ clue }));

  if (!setNewGameToNewWord) {
    const getGivenCluesQuery = SupabaseAdminClient.from("game")
      .select(
        `
  id,
  word_id,
  guesses (
    guess,
    correct,
    given_clue_id
  ),
  given_clues (
      id,
      clues (
          clue, sort_order, max_attempts, word_id
      )
  )
`
      )
      .eq("word_id", currentWordId);
    console.log(userId);
    // Get the given clues for the game
    if (userId) {
      givenClues = await getGivenCluesQuery
        .eq("user_id", userId)
        .eq("date", currentDate);
    } else if (foundGame) {
      givenClues = await getGivenCluesQuery
        .eq("id", foundGame.id)
        .is("user_id", null)
        .eq("date", currentDate);
    }

    // Type narrow the given clues and guesses
    if (givenClues?.data?.length) {
      const narrowedGuesses = narrowItems(givenClues.data[0].guesses);
      const narrowedClues = narrowItems(givenClues.data[0].given_clues)
        .map((items) => ({
          given_clue_id: items.id,
          clue: narrowItems(items.clues)[0],
        }))
        .flat()
        .map((items) => {
          const foundGuesses = narrowedGuesses.filter(
            (guessEntry) => items.given_clue_id === guessEntry.given_clue_id
          );
          return {
            ...items,
            guesses: foundGuesses,
          };
        });
      clues = narrowedClues;
    }
  }

  const recentClue = clues[clues.length - 1];
  const { count: totalCluesAvailable } = await SupabaseAdminClient.from("clues")
    .select("*", { count: "exact", head: true })
    .eq("word_id", recentClue.clue.word_id);

  const isClueBlocked = totalCluesAvailable === clues.length;
  const isGuessBlocked =
    recentClue.guesses?.length === recentClue.clue.max_attempts;

  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl">
      {/* @ts-ignore */}
      <Clues clues={clues} total={totalCluesAvailable} />
      <GuessBox isClueBlocked={isClueBlocked} isGuessBlocked={isGuessBlocked} />
    </div>
  );
}
