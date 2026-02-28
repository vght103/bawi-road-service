import { useStore } from "@nanostores/react";
import {
  $user,
  $session,
  $loading,
  signUp,
  signIn,
  signOut,
  changePassword,
  deleteAccount,
  findEmail,
  sendPasswordResetEmail,
} from "@/stores/authStore";

export function useAuth() {
  const user = useStore($user);
  const session = useStore($session);
  const loading = useStore($loading);

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    changePassword,
    deleteAccount,
    findEmail,
    sendPasswordResetEmail,
  };
}
