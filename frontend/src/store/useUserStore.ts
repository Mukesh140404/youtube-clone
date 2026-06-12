// store/useUserStore.ts
import { create } from "zustand";

import {type  IUser } from "@/types/user.type";

interface UserState {
  user: IUser | null;
  isAuthenticated: boolean;

  setUser: (user: IUser) => void;
  clearUser: () => void;
  updateUser: (data: Partial<IUser>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) =>
    set(() => ({
      user,
      isAuthenticated: true,
    })),

  clearUser: () =>
    set(() => ({
      user: null,
      isAuthenticated: false,
    })),

  updateUser: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),
}));