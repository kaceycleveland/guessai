'use client';

import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/navigation';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';

import { LoadingBackdrop } from '@/components/loading-backdrop';
import { GAME_COOKIE } from '@/lib/api/cookie-game';
import { hasPermission } from '@/lib/permissions/has-permission';

import { useSupabase } from '../supabase-provider';

export default function AuthedMenu() {
  const router = useRouter();
  const { supabase } = useSupabase();
  const [isPending, startTransition] = useTransition();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    hasPermission(supabase, ['ADMIN']).then((permissions) => {
      setIsAdmin(Boolean(permissions.length ? permissions[0] : undefined));
    });
  }, [supabase]);

  const navigateAdmin = useCallback(() => {
    router.push('/admin');
  }, [router]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut().then(() => {
      document.cookie = `${GAME_COOKIE}=;`;

      startTransition(() => {
        router.refresh();
      });
    });
  }, [supabase, router, startTransition]);

  const handleGamesRoute = useCallback(() => {
    router.push('/game');
  }, [router]);

  return (
    <>
      <LoadingBackdrop show={isPending} loadingProps={{ className: 'bg-cyan-500' }} />
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="bg-opacity/20 hover:bg-opacity/30 focus-visible:ring-opacity/75 inline-flex w-full justify-center rounded-md bg-slate-950 p-3 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:px-4">
            <span className="hidden md:block">Options</span>
            <ChevronDownIcon
              className="h-5 w-5 text-violet-200 hover:text-violet-100 md:-mr-1 md:ml-2"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="ring-opacity/5 absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded bg-slate-950 shadow-lg ring-1 ring-black focus:outline-none">
            {isAdmin && (
              <div className="p-1 ">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-violet-500' : ''
                      } group flex w-full items-center rounded-md p-2 text-sm text-white`}
                      onClick={navigateAdmin}
                    >
                      Admin
                    </button>
                  )}
                </Menu.Item>
              </div>
            )}
            <div className="p-1 ">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-violet-500' : ''
                    } group flex w-full items-center rounded-md p-2 text-sm text-white`}
                    onClick={handleGamesRoute}
                  >
                    Games
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="p-1 ">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-violet-500' : ''
                    } group flex w-full items-center rounded-md p-2 text-sm text-white`}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
}
