"use client";

import AuthModal from "@/components/AuthModal";
import { useUserStore } from "@/store/useUserStore";

export default function AuthModalBridge() {
  const authOpen = useUserStore((s) => s.authOpen);
  const closeAuth = useUserStore((s) => s.closeAuth);
  return <AuthModal open={authOpen} onClose={closeAuth} />;
}


