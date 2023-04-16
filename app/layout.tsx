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
          <main className="flex min-h-full flex-col bg-gradient-to-bl from-indigo-950 to-slate-800">
            {/** @ts-ignore */}
            <Menu />
            <ClientToastContainer theme="dark" limit={2} />
            <div className="flex w-full flex-1 flex-col items-center justify-center p-4">
              <Suspense
                fallback={
                  <div className="flex w-full items-center justify-center p-6">
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
