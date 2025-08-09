import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";

type UserState = {
  user: User | null;
  session: Session | null;
  authOpen: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  openAuth: () => void;
  closeAuth: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  session: null,
  authOpen: false,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  openAuth: () => set({ authOpen: true }),
  closeAuth: () => set({ authOpen: false }),
}));


