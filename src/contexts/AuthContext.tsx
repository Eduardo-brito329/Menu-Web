import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // -------------------------------------------------------
  // SIGN IN
  // -------------------------------------------------------
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  // -------------------------------------------------------
  // SIGN UP LIMPO (SEM RPC, SEM TABELAS EXTRAS)
  // -------------------------------------------------------
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
  
    if (error) return { error };
    if (!data.user) return { error: new Error("Usuário não retornado.") };
  
    // CHAMAR A FUNÇÃO COM O ID DO USUÁRIO
    const { data: rpcData, error: setupError } = await supabase.rpc("create_user_setup", {
      user_uuid: data.user.id
    });
    
    console.log("RPC RESULT:", rpcData);
    console.error("RPC ERROR:", setupError);
    
  
    if (setupError) {
      console.error(setupError);
      return { error: setupError };
    }
  
    return { error: null };
  };
  
  

  // -------------------------------------------------------
  // SESSION LISTENER
  // -------------------------------------------------------
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // -------------------------------------------------------
  // SIGN OUT
  // -------------------------------------------------------
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
