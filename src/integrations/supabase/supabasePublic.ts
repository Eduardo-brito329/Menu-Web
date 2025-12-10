import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/**
 * Client público para páginas públicas (como o cardápio),
 * SEM autenticação, SEM sessão, SEM localStorage.
 *
 * Isso garante que o usuário é sempre tratado como ANON,
 * permitindo que as políticas públicas do Supabase funcionem
 * corretamente, mesmo sem login.
 */
export const supabasePublic = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON,
  {
    global: { fetch },

    auth: {
      persistSession: false,        // não mantém sessão
      autoRefreshToken: false,      // não tenta renovar token
      storage: {
        getItem: () => null,        // evita carregar token do localStorage
        setItem: () => {},          // impede salvar tokens
        removeItem: () => {},       // impede apagar tokens reais
      }
    }
  }
);
