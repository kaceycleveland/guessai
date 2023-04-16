import { Database } from "@/lib/database.types";
import { hasPermission } from "@/lib/permissions/has-permission";
import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { SupabaseAdminClient } from "@/lib/supabase-admin-client";
import { GenerateWord } from "@/types/generate-word";
import { GAME_COOKIE } from "@/lib/api/cookie-game";
import { narrowItems } from "@/lib/utils/narrow-items";
import { createGame } from "@/lib/create-game";
import { getCurrentDate } from "@/lib/utils/get-current-date";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerSupabaseClient<Database>({
    headers,
    cookies,
  });

  const { data: currentDate } = await getCurrentDate();
  const { data: userData, error: authError } = await supabase.auth.getUser();

  const foundCookie = request.cookies.get(GAME_COOKIE)?.value;
  const gameCookie = foundCookie ? foundCookie : undefined;

  console.log("FOUND COOKIE", gameCookie);

  console.log(
    `Requesting clue on ${currentDate} for user ${userData.user?.id}`
  );

  let clues;
  // Authed flow
  if (userData.user?.id) {
    console.log("ENTERED AUTH FLOW", userData.user);
    clues = await SupabaseAdminClient.from("game")
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
      .eq("user_id", userData.user.id)
      .eq("date", currentDate);
  }

  if (gameCookie) {
    console.log("ENTERED GAME COOKIE FLOW");
    clues = await SupabaseAdminClient.from("game")
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
      .is("user_id", null)
      .eq("id", gameCookie)
      .eq("date", currentDate);

    if (clues.data?.length && clues.data[0].id) {
      if (userData.user?.id) {
        console.log("ATTEMPTING TO UPDATE GAME TO USER");
        await SupabaseAdminClient.from("game")
          .update({ user_id: userData.user.id })
          .eq("id", clues.data[0]?.id);
      }
    }
  }

  if (clues?.error)
    return NextResponse.json({ message: clues.error.message }, { status: 500 });

  console.log("CLUES", clues);

  const narrowedCluesAndGame =
    clues && clues.data.length
      ? {
          id: clues.data[0].id,
          clues: narrowItems(clues?.data[0].given_clues)
            .map((val) => narrowItems(val.clues))
            .flat(),
        }
      : undefined;

  const checkForNoGivenClues =
    narrowedCluesAndGame?.clues && !narrowedCluesAndGame.clues.length; // Should never hit this as every game should have at least one clue
  if (!narrowedCluesAndGame || checkForNoGivenClues) {
    const firstAndSecondClue = await SupabaseAdminClient.from("words")
      .select(`clues!inner(*),date_assignment!inner(*)`)
      .eq("date_assignment.date", currentDate)
      .or(`sort_order.eq.${0},sort_order.eq.${1}`, { foreignTable: "clues" });

    console.log("GETTING FIRST AND SECOND CLUE", firstAndSecondClue);

    if (firstAndSecondClue.data?.length) {
      const firstAndSecondClueNarrowed = firstAndSecondClue.data
        .map((val) => narrowItems(val.clues))
        .flat();

      console.log("FIRST AND SECOND CLUE", firstAndSecondClueNarrowed);

      const { game, clueInsertResult } = await createGame(
        userData.user?.id,
        firstAndSecondClueNarrowed
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

      return NextResponse.json(
        {
          message: "success",
          game_id: !userData.user?.id ? game.data.id : undefined,
        },
        { status: 200 }
      );
    }
  }

  if (narrowedCluesAndGame) {
    const foundGameId = narrowedCluesAndGame.id;
    const givenClues = narrowedCluesAndGame.clues;
    const lastClue = givenClues[givenClues.length - 1];

    console.log("LAST CLUE", lastClue);

    // const foundNextClue = await SupabaseAdminClient.from("game")
    //   .select(`id,words!inner(clues!inner(id, clue, sort_order))`)
    //   .eq("words.clues.sort_order", ++lastClue.sort_order)
    //   .eq("id", foundGameId);

    const foundNextClue = await SupabaseAdminClient.from("game")
      .select(
        `id,
         words (
              clues (
                id, clue, sort_order
              )
            )`
      )
      .eq("words.clues.sort_order", ++lastClue.sort_order)
      .eq("id", foundGameId);

    if (foundNextClue.error)
      return NextResponse.json(
        { message: foundNextClue.error.message },
        { status: 500 }
      );

    const nextClues = foundNextClue.data
      ?.map((data) => narrowItems(data.words))
      .flat()
      .map((data) => narrowItems(data.clues))
      .flat();
    console.log(foundNextClue.data?.[0].words);
    console.log("FOUND NEXT CLUE", foundNextClue.data?.[0].id, nextClues);

    if (foundNextClue.data) {
      const narrowedClues = narrowItems(
        foundNextClue.data.map((clueData) => narrowItems(clueData.words))
      )
        .flat()
        .map((val) => narrowItems(val.clues))
        .flat();

      console.log("NARROWED CLUES", narrowedClues);

      await SupabaseAdminClient.from("given_clues").upsert({
        game_id: foundGameId,
        clue_id: narrowedClues[0].id,
      });

      console.log(
        `Giving user ${userData.user?.id} clue ${narrowedClues[0].id} (order ${narrowedClues[0].sort_order}) in game ${foundGameId}`
      );
      return NextResponse.json({ message: "success" }, { status: 200 });
    }
    // console.log("NARROWED CLUES", foundGameId, narrowedClues);
  }

  return NextResponse.json({ message: "Failed" }, { status: 500 });
}
