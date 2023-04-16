import { Database } from "@/lib/database.types";
import { hasPermission } from "@/lib/permissions/has-permission";
import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { SupabaseAdminClient } from "@/lib/supabase-admin-client";
import { GenerateWord } from "@/types/generate-word";

export async function POST(request: Request) {
  const { word, clues }: GenerateWord = await request.json();

  console.log(word, clues);

  const supabase = createRouteHandlerSupabaseClient<Database>({
    headers,
    cookies,
  });
  const permissions = await hasPermission(supabase, ["ADMIN"]);

  if (!permissions[0]) {
    return NextResponse.error();
  }

  const wordInsert = await SupabaseAdminClient.from("words")
    .insert({ word })
    .select();

  if (!wordInsert.data || !wordInsert.data.length) return NextResponse.error();
  const clueInsert = await SupabaseAdminClient.from("clues").insert(
    clues.map((clue, sort_order) => ({
      clue,
      sort_order,
      word_id: wordInsert.data[0].id,
    }))
  );

  return NextResponse.json({ id: wordInsert.data[0].id });
}
