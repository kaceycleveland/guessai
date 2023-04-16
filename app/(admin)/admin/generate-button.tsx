"use client";

import { Button } from "@/components/button";
import useModal from "@/components/modal-hooks";
import GenerateModal from "./generate-modal";

export const GenerateButton = () => {
  const generateModal = useModal();
  return (
    <>
      <Button onClick={generateModal.openModal}>Generate new word</Button>
      <GenerateModal {...generateModal} />
    </>
  );
};
