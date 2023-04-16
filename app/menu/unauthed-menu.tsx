'use client';

import { Button } from '@/components/button';
import useModal from '@/components/modal-hooks';

import LoginModal from './login-modal';
import SignupModal from './signup-modal';

export default function UnauthedMenu() {
  const loginModal = useModal();
  const signUpModal = useModal();
  return (
    <div className="flex gap-4">
      <Button onClick={loginModal.openModal}>Login</Button>
      <Button variant="secondary" onClick={signUpModal.openModal}>
        Sign up
      </Button>
      <LoginModal {...loginModal} />
      <SignupModal {...signUpModal} />
    </div>
  );
}
