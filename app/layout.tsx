import { Suspense } from 'react';
import 'react-toastify/dist/ReactToastify.css';

import { Loading } from '@/components/loading';

import { ClientToastContainer } from './client-toast-container';
import './globals.css';
import Menu from './menu';
import SupabaseProvider from './supabase-provider';
import './toastify-theme.css';

export const metadata = {
  title: 'GuessAI',
  description: 'Guess a word from AI!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>
          <main className="min-h-full bg-gradient-to-bl from-indigo-950 to-slate-800 flex flex-col">
            {/** @ts-ignore */}
            <Menu />
            <ClientToastContainer theme="dark" limit={2} />
            <div className="flex-1 flex flex-col justify-center items-center w-full p-4">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center w-full p-6">
                    <Loading className="bg-cyan-500" />
                  </div>
                }
              >
                {children}
              </Suspense>
            </div>
          </main>
        </SupabaseProvider>
      </body>
    </html>
  );
}
