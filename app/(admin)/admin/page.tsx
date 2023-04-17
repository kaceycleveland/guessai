import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { Database } from '@/lib/database.types';
import { hasPermission } from '@/lib/permissions/has-permission';
import { getCurrentDate } from '@/lib/utils/get-current-date';

import { GenerateButton } from './generate-button';
import { WordManagement } from './word-management';

export const revalidate = 0;

export default async function AdminPage() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  });
  const { data: currentDate } = await getCurrentDate();
  const permissions = await hasPermission(supabase, ['ADMIN']);

  if (!permissions[0] || !currentDate) notFound();

  return (
    <div className="flex w-full max-w-4xl flex-col gap-8">
      <GenerateButton />
      <WordManagement currentDate={currentDate} />
    </div>
  );
}
