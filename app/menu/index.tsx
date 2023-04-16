import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { addDays, format } from 'date-fns';
import { cookies, headers } from 'next/headers';
import Link from 'next/link';

import { parseToDate } from '@/lib/utils/date-format';
import { getCurrentDate } from '@/lib/utils/get-current-date';

import AuthedMenu from './authed-menu';
import UnauthedMenu from './unauthed-menu';

export default async function Menu() {
  const supabase = createServerComponentSupabaseClient({
    headers,
    cookies,
  });

  const { data: currentDate } = await getCurrentDate();

  const formattedDate = currentDate ? format(parseToDate(currentDate), 'PPP') : undefined;

  const { data: userData } = await supabase.auth.getUser();

  return (
    <div className="sticky top-0 z-10 flex h-20 w-full items-center bg-slate-900 bg-opacity-50 p-4 backdrop-blur-lg">
      <div className="m-auto flex w-full max-w-4xl items-center justify-between px-2">
        <Link href="/">
          <h1 className="inline-block bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-4xl font-bold text-transparent">
            GuessAI
          </h1>
        </Link>
        <div className="flex items-center gap-4 text-white">
          <div>{formattedDate}</div>
          {userData.user?.id ? <AuthedMenu /> : <UnauthedMenu />}
        </div>
      </div>
    </div>
  );
}
