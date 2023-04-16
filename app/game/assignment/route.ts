import { Database } from "@/lib/database.types";
import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { SupabaseAdminClient } from "@/lib/supabase-admin-client";
import { GAME_COOKIE } from "@/lib/api/cookie-game";
import { getCurrentDate } from "@/lib/utils/get-current-date";

export async function POST() {
  const supabase = createRouteHandlerSupabaseClient<Database>({
    headers,
    cookies,
  });

  const { data: currentDate } = await getCurrentDate();

  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (userData.user?.id) {
    console.log(`Attempting to assign game to user ${userData.user?.id}.`);
    const authedCurrentGame = await SupabaseAdminClient.from("game")
      .select(`id`)
      .eq("user_id", userData.user.id)
      .eq("date", currentDate);

    if (authedCurrentGame.data?.length) {
      console.log("AUTHED CURRENT GAME", authedCurrentGame);
      console.log(`Found existing game ${authedCurrentGame.data[0].id}`);

      return NextResponse.json(
        { message: "Game exists", code: 1 },
        { status: 200 }
      );
    }

    const gameCookie = cookies().get(GAME_COOKIE)?.value;

    console.log("FOUND COOKIE", gameCookie);

    if (gameCookie) {
      const applyGameOwnership = await SupabaseAdminClient.from("game")
        .update({ user_id: userData.user.id })
        .eq("id", gameCookie)
        .select();

      console.log("APPLIED GAME OWNERSHIP TO COOKIE", applyGameOwnership);

      if (applyGameOwnership.data?.length === 1) {
        console.log(`user ${userData.user.id} took ownership of ${gameCookie}`);
        return NextResponse.json(
          { message: "success", code: 0 },
          { status: 200 }
        );
      }
    }

    return NextResponse.json({ message: "no game to assign", code: 0 });
  }

  return NextResponse.json({ message: "Failed" }, { status: 500 });
}
