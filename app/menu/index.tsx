import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';
import Link from 'next/link';

import { getTimeUntilNextGame } from '@/lib/utils/get-time-until-next-game';

import AuthedMenu from './authed-menu';
import { Countdown } from './countdown';
import UnauthedMenu from './unauthed-menu';

export default async function Menu() {
  const supabase = createServerComponentSupabaseClient({
    headers,
    cookies,
  });

  const secondsUntilTomorrow = await getTimeUntilNextGame();

  const { data: userData } = await supabase.auth.getUser();

  return (
    <div className="bg-opacity/50 sticky top-0 z-10 flex h-20 w-full items-center bg-slate-900 px-2 py-4 backdrop-blur-lg sm:p-4">
      <div className="m-auto flex w-full max-w-4xl items-center justify-between px-2">
        <Link href="/">
          <h1 className="inline-block bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-4xl font-bold text-transparent">
            GuessAI
          </h1>
        </Link>
        <div className="flex items-center gap-4 text-white">
          <div className="">{secondsUntilTomorrow && <Countdown timeInSeconds={secondsUntilTomorrow} />}</div>
          {userData.user?.id ? <AuthedMenu /> : <UnauthedMenu />}
        </div>
      </div>
    </div>
  );
}
