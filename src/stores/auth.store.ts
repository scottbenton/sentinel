import deepEqual from "fast-deep-equal";
import { useEffect } from "react";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";
import { AuthService } from "@/services/auth.service";

export enum AuthStatus {
  Loading,
  Unauthenticated,
  Authenticated,
}

interface AuthState {
  status: AuthStatus;
  userId: string | null;
}
interface AuthActions {
  subscribeToAuthStatus: () => () => void;

  sendOTPCodeToEmail: (email: string) => Promise<void>;
  verifyOTPCode: (email: string, otpCode: string) => Promise<void>;

  signOut: () => Promise<void>;
}

export const useAuthStore = createWithEqualityFn<AuthState & AuthActions>()(
  immer((set) => ({
    status: AuthStatus.Loading,
    userId: null,

    subscribeToAuthStatus: () => {
      return AuthService.listenForAuthChanges((userId) => {
        set((state) => {
          state.userId = userId;
          state.status = userId
            ? AuthStatus.Authenticated
            : AuthStatus.Unauthenticated;
        });
      });
    },

    sendOTPCodeToEmail: (email) => {
      return AuthService.sendOTPCodeToEmail(email);
    },
    verifyOTPCode: (email, otpCode) => {
      return AuthService.verifyOTPCode(email, otpCode);
    },

    signOut: () => {
      return AuthService.logout();
    },
  })),
  deepEqual,
);

export function useUID() {
  return useAuthStore((state) => state.userId);
}

export function useAuthStatus() {
  return useAuthStore((state) => state.status);
}

export function useListenToAuth() {
  const subscribeToAuthStatus = useAuthStore(
    (store) => store.subscribeToAuthStatus,
  );

  useEffect(() => {
    return subscribeToAuthStatus();
  }, [subscribeToAuthStatus]);
}
