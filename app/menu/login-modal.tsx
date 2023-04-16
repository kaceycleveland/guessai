'use client';

import { SignInWithPasswordCredentials } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { LoadingBackdrop } from '@/components/loading-backdrop';
import Modal from '@/components/modal';
import { BasicModalProps } from '@/components/modal-hooks';
import { GAME_COOKIE } from '@/lib/api/cookie-game';
import { postGameAssignment, postGameAssignmentKey } from '@/lib/api/post-game-assignment';

import { useSupabase } from '../supabase-provider';

export default function LoginModal({ isOpen, closeModal, openModal }: BasicModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { supabase } = useSupabase();
  const { trigger } = useSWRMutation(postGameAssignmentKey, postGameAssignment, {
    onSuccess: () => {
      closeModal();
      startTransition(() => {
        router.refresh();
      });
    },
  });
  const { register, handleSubmit, formState } = useForm<SignInWithPasswordCredentials>();

  const submitSignup = useCallback(
    handleSubmit(async (values) => {
      const result = await supabase.auth.signInWithPassword(values);
      const res = await trigger();
      if (res?.data.code) {
        document.cookie = `${GAME_COOKIE}=;`;
      }
      return result;
    }),
    [handleSubmit, trigger]
  );

  return (
    <>
      <LoadingBackdrop isFullScreen show={isPending} loadingProps={{ className: 'bg-cyan-500' }} />
      <Modal isOpen={isOpen} closeModal={closeModal} title="Login">
        <form onSubmit={submitSignup}>
          <div className="mt-2 flex flex-col gap-2">
            <div>
              <Input placeholder="Email" {...register('email')} />
            </div>
            <div>
              <Input type="password" placeholder="Password" {...register('password')} />
            </div>
          </div>

          <div className="mt-4 flex w-full justify-end">
            <Button type="submit" disabled={formState.isSubmitting}>
              Login
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
