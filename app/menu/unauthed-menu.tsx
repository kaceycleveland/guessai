"use client";

import LoginModal from "./login-modal";
import SignupModal from "./signup-modal";

export default function UnauthedMenu() {
  return (
    <div className="flex gap-4">
      <LoginModal />
      <SignupModal />
    </div>
  );
}
