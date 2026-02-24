import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { supabase, supabaseConfigured } from "@/lib/supabase";

export type UserRole = "ADMIN" | "STUDENT";

export interface Member {
  id: string;
  name: string | null;
  phone: string | null;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    metadata: { name: string; phone: string },
  ) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<{ error: string | null }>;
  deleteAccount: () => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  console.log("user", user);
  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        queryClient.invalidateQueries({ queryKey: ["member", session.user.id] });
      } else {
        queryClient.removeQueries({ queryKey: ["member"] });
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  async function signUp(email: string, password: string, metadata: { name: string; phone: string }) {
    if (!supabaseConfigured)
      return {
        error: "일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      };
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: metadata.name,
          phone: metadata.phone,
        },
      },
    });
    return { error: error?.message ?? null };
  }

  async function signIn(email: string, password: string) {
    if (!supabaseConfigured)
      return {
        error: "일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      };
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error?.message ?? null };
  }

  async function signOut() {
    await supabase.auth.signOut();
    queryClient.removeQueries({ queryKey: ["member"] });
  }

  async function changePassword(newPassword: string) {
    if (!supabaseConfigured) return { error: "일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { error: error?.message ?? null };
  }

  async function deleteAccount() {
    if (!supabaseConfigured) return { error: "일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
    const { error } = await supabase.rpc("delete_own_account");
    if (error) return { error: error.message };
    await supabase.auth.signOut();
    queryClient.removeQueries({ queryKey: ["member"] });
    return { error: null };
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, changePassword, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext는 AuthProvider 안에서 사용해야 합니다.");
  }
  return context;
}
