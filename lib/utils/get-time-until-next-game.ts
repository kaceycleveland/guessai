import { SupabaseAdminClient } from '../supabase-admin-client';

export const getTimeUntilNextGame = async () => {
  const { data } = await SupabaseAdminClient.rpc('get_time_until_tomorrow');
  return data ? parseInt(data) : undefined;
};
