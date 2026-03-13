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

// authStore 전역 상태와 인증 액션을 React 컴포넌트에서 사용하기 위한 훅
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
