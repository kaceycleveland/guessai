'use client';

import { Dialog, Transition } from '@headlessui/react';
import { SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Fragment, useCallback, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/button';
import { FormLabel } from '@/components/form-label';
import { Input } from '@/components/input';
import { LoadingBackdrop } from '@/components/loading-backdrop';
import Modal from '@/components/modal';
import { BasicModalProps } from '@/components/modal-hooks';

import { useSupabase } from '../supabase-provider';

export default function SignupModal({ isOpen, closeModal, openModal }: BasicModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { supabase } = useSupabase();
  const { register, handleSubmit, formState } = useForm<SignUpWithPasswordCredentials>();

  const submitSignup = useCallback(
    handleSubmit(async (values) => {
      const result = await supabase.auth.signUp(values);
      startTransition(() => {
        router.refresh();
      });
      return result;
    }),
    [handleSubmit, router, startTransition]
  );

  return (
    <>
      <LoadingBackdrop show={isPending} loadingProps={{ className: 'bg-cyan-500' }} />
      <Modal isOpen={isOpen} closeModal={closeModal} title="Sign up to Save Progress">
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
              Sign up
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
