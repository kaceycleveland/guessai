import { headers, cookies } from "next/headers";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";
import { SupabaseAdminClient } from "@/lib/supabase-admin-client";
import { narrowItems } from "@/lib/utils/narrow-items";
import { GAME_COOKIE } from "@/lib/api/cookie-game";
import ClueRender from "./clue-render";
import { CluesArray } from "@/types/ordered-clues";
import { getCurrentDate } from "@/lib/utils/get-current-date";

export const revalidate = 0;

export default async function Clues() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  });

  const { data: currentDate } = await getCurrentDate();

  const { data: userData } = await supabase.auth.getUser();
  const gameCookie = cookies().get(GAME_COOKIE)?.value;
  let games;
  const result = await SupabaseAdminClient.rpc("get_current_word").select("*");
  console.log("GOT CURRENT WORD", result);
  if (gameCookie) {
    games = await SupabaseAdminClient.from("game")
      .select("*")
      .eq("date", currentDate)
      .eq("id", gameCookie);
  }

  if (games?.error) {
  }

  let firstClues: CluesArray = [];

  console.log("CURRENT GAME", games);
  const checkForGameOwnership =
    !userData.user?.id && games?.data?.length && games.data[0].user_id; // If there is no authed user and there is a user_id attached to the game
  // If there is no anon game, render the first clue of today.
  if (!games?.data?.length || checkForGameOwnership) {
    const firstClue = await SupabaseAdminClient.from("words")
      .select(`clues!inner(*),date_assignment!inner(*)`)
      .eq("date_assignment.date", currentDate)
      .eq("clues.sort_order", 0)
      .single();

    console.log("FIRST CLUE", firstClue);

    if (firstClue.data?.clues) {
      const firstClueNarrowed = narrowItems(firstClue.data?.clues);
      firstClues.push(...firstClueNarrowed);
    }
    // If there is a game, fetch the user's game and update the anon game if needed.
  }

  const foundGame = games?.data?.length ? games.data[0] : undefined;

  // Update anon game to user ownership
  if (userData.user?.id && foundGame) {
    const updateGameToUser = await SupabaseAdminClient.from("game")
      .update({ user_id: userData.user.id })
      .eq("id", foundGame.id)
      .is("user_id", null)
      .select();
    console.log("updateGameToUser", updateGameToUser);
    if (updateGameToUser.error) throw new Error("User failed to update.");
  }

  let clues;
  let givenClues;
  // Get the given clues for the game
  if (userData.user?.id) {
    givenClues = await SupabaseAdminClient.from("game")
      .select(
        `
      id,
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
      .eq("user_id", userData.user.id)
      .eq("date", currentDate);

    // if (foundUserGamesForDate.data) {
    //   const narrowedClues = foundUserGamesForDate.data
    //     .map((val) => narrowItems(val.given_clues))
    //     .flat()
    //     .map((val) => narrowItems(val.clues))
    //     .flat();
    //     givenClues = narrowedClues;
    // }
  } else if (foundGame) {
    givenClues = await SupabaseAdminClient.from("game")
      .select(
        `
      id,
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
      .eq("id", foundGame.id)
      .is("user_id", null)
      .eq("date", currentDate);
  }

  // Type narrow the given clues and guesses
  if (givenClues?.data?.length) {
    const narrowedGuesses = narrowItems(givenClues.data[0].guesses);
    const narrowedClues = narrowItems(givenClues.data[0].given_clues)
      // .map((val) => narrowItems(val.given_clues))
      // .flat()
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

  return (
    <div className="w-full px-2">
      {/* <button onClick={addClue}>Next Clue</button> */}
      <div className="relative w-full flex flex-col gap-4">
        <ClueRender body={clues} firstClues={firstClues} />
        {/* {visibleClues.map((clue, index) => {
          return (
            <Clue
              key={index}
              initial={index === 0 ? "visible" : "hidden"}
              clueText={clue}
              state="visible"
            />
          );
        })} */}
      </div>
    </div>
  );
}
