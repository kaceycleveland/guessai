import { createRouteHandlerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { Database } from '@/lib/database.types';
import { hasPermission } from '@/lib/permissions/has-permission';
import { SupabaseAdminClient } from '@/lib/supabase-admin-client';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

/**
 * Get words list
 */
export async function GET() {
  const supabase = createRouteHandlerSupabaseClient<Database>({
    headers,
    cookies,
  });
  const permissions = await hasPermission(supabase, ['ADMIN']);

  if (!permissions[0]) {
    return NextResponse.json({ message: 'Insufficent permissions' }, { status: 401 });
  }

  const getWords = await SupabaseAdminClient.from('words').select(`
      id,
      word
  `);

  const words = getWords.data?.length ? getWords.data : undefined;

  if (getWords.error) {
    return NextResponse.json({ message: getWords.error.message }, { status: 500 });
  }
  if (!words) return NextResponse.error();

  return NextResponse.json({ words });
}
