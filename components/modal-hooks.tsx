import { useCallback, useMemo, useState } from "react";

export default function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const openModal = useCallback(() => setIsOpen(true), []);

  return useMemo(
    () => ({ isOpen, closeModal, openModal }),
    [isOpen, closeModal, openModal]
  );
}

export type BasicModalProps = ReturnType<typeof useModal>;
