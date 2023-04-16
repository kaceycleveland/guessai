"use client";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useSupabase } from "../supabase-provider";
import { SignInWithPasswordCredentials } from "@supabase/supabase-js";
import Modal from "@/components/modal";
import useSWRMutation from "swr/mutation";
import { BasicModalProps } from "@/components/modal-hooks";
import {
  postGameAssignment,
  postGameAssignmentKey,
} from "@/lib/api/post-game-assignment";
import { useRouter } from "next/navigation";
import { GAME_COOKIE } from "@/lib/api/cookie-game";

export default function LoginModal({
  isOpen,
  closeModal,
  openModal,
}: BasicModalProps) {
  const router = useRouter();
  const { supabase } = useSupabase();
  const { trigger } = useSWRMutation(
    postGameAssignmentKey,
    postGameAssignment,
    { onSuccess: router.refresh }
  );
  const { register, handleSubmit } = useForm<SignInWithPasswordCredentials>();

  const submitSignup = useCallback(
    handleSubmit(async (values) => {
      const result = await supabase.auth.signInWithPassword(values).then(() => {
        trigger().then((res) => {
          if (res?.data.code) {
            document.cookie = `${GAME_COOKIE}=;`;
          }
        });
      });
      return result;
    }),
    [handleSubmit, trigger]
  );

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} title="Login">
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
            Login
          </Button>
        </div>
      </form>
    </Modal>
  );
}
