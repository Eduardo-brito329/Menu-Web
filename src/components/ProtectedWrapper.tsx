import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedWrapper({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { loading: subLoading, isAllowed } = useSubscription();

  const loading = authLoading || subLoading;

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    // 🔥 Regra correta:
    // Só bloqueia se a assinatura NÃO for permitida
    if (!isAllowed) {
      navigate("/bloqueado");
      return;
    }

  }, [loading, user, isAllowed, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  return <>{children}</>;
}
