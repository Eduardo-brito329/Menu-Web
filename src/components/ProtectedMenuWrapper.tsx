import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function ProtectedMenuWrapper({
  storeId,
  children
}: {
  storeId: string;
  children: JSX.Element;
}) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      if (!storeId) {
        setAllowed(false);
        return;
      }

      // Buscar loja
      const { data: store } = await supabase
        .from("stores")
        .select("owner_id")
        .eq("id", storeId)
        .maybeSingle();

      if (!store) {
        setAllowed(false);
        return;
      }

      // Buscar assinatura
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("trial_end, paid_until, is_paid")
        .eq("user_id", store.owner_id)
        .maybeSingle();

      if (!sub) {
        setAllowed(false);
        return;
      }

      const now = new Date();
      const trialOk = sub.trial_end && new Date(sub.trial_end) >= now;
      const paidOk = sub.is_paid && sub.paid_until && new Date(sub.paid_until) >= now;

      setAllowed(trialOk || paidOk);
    };

    checkAccess();
  }, [storeId]);

  if (allowed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando cardápio...
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-2xl font-bold mb-3">Cardápio Indisponível</h1>
        <p className="text-gray-600">
          Esta loja está com a assinatura expirada.
        </p>
      </div>
    );
  }

  return children;
}
