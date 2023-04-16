"use client";

import { Button } from "@/components/button";
import { FormLabel } from "@/components/form-label";
import { Input } from "@/components/input";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useSupabase } from "../supabase-provider";
import { SignUpWithPasswordCredentials } from "@supabase/supabase-js";
import Modal from "@/components/modal";
import { BasicModalProps } from "@/components/modal-hooks";

export default function SignupModal({
  isOpen,
  closeModal,
  openModal,
}: BasicModalProps) {
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
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      title="Sign up to Save Progress"
    >
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
    </Modal>
  );
}
