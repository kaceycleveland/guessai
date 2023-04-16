import { SupabaseAdminClient } from "./supabase-admin-client";

/**
 * Creates a new game with the given `userId` if specified.
 * An anonymous game is created otherwise.
 *
 */
export const createGame = async (userId?: string, clues?: { id: number }[]) => {
  const game = await SupabaseAdminClient.from("game")
    .insert({ user_id: userId })
    .select(
      `
      *,
      words ( word )
    `
    )
    .single();

  let clueInsertResult;
  if (game.data && clues) {
    clueInsertResult = await SupabaseAdminClient.from("given_clues")
      .upsert(
        clues.map((clue) => ({
          game_id: game.data.id,
          clue_id: clue.id,
        }))
      )
      .select();
  }

  return { game, clueInsertResult };
};
