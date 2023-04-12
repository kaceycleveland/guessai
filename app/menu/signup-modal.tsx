"use client";

import { Button } from "@/components/button";
import { FormLabel } from "@/components/form-label";
import { Input } from "@/components/input";
import { UserCredentials } from "@/types/auth";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useSupabase } from "../supabase-provider";
import { SignUpWithPasswordCredentials } from "@supabase/supabase-js";

export default function SignupModal() {
  let [isOpen, setIsOpen] = useState(false);
  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const { supabase } = useSupabase();
  const { register, handleSubmit } = useForm<SignUpWithPasswordCredentials>();

  const submitSignup = useCallback(
    handleSubmit(async (values) => {
      const result = await supabase.auth.signUp(values);
      return result;
    }),
    [handleSubmit]
  );

  return (
    <>
      <Button onClick={openModal}>Sign up</Button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-950 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-white"
                  >
                    Sign up to Save Progress!
                  </Dialog.Title>
                  <form onSubmit={submitSignup}>
                    <div className="mt-2 flex flex-col gap-2">
                      <div>
                        <Input placeholder="Email" {...register("email")} />
                      </div>
                      <div>
                        <Input
                          type="password"
                          placeholder="Password"
                          {...register("password")}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex w-full justify-end">
                      <Button type="submit" onClick={closeModal}>
                        Sign up
                      </Button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
