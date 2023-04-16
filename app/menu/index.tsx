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
    <div className="sticky top-0 z-10 w-full p-4 bg-slate-900 bg-opacity-50 backdrop-blur-lg">
      <div className="max-w-4xl w-full px-2 m-auto flex justify-between items-center">
        <Link href="/">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 inline-block text-transparent bg-clip-text">
            GuessAI
          </h1>
        </Link>
        <div className="flex text-white items-center gap-4">
          <div>{formattedDate}</div>
          {userData.user?.id ? <AuthedMenu /> : <UnauthedMenu />}
        </div>
      </div>
    </div>
  );
}
