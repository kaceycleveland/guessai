import { SupabaseAdminClient } from "../supabase-admin-client";

export const getCurrentDate = async () =>
  await SupabaseAdminClient.rpc("get_current_date");
