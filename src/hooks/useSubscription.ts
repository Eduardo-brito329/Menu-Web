import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SubscriptionStatus = {
  trial_start: string | null;
  trial_end: string | null;
  is_paid: boolean;
  paid_until: string | null;
};

export function useSubscription() {
  const [loading, setLoading] = useState(true);
  const [sub, setSub] = useState<SubscriptionStatus | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (mounted) {
          setSub(null);
          setLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from("subscriptions")
        .select("trial_start, trial_end, is_paid, paid_until")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!error && mounted) {
        // 🟢 Se não tiver registro, assume que ainda não foi criado → não bloquear
        if (!data) {
          setSub({
            trial_start: null,
            trial_end: null,
            is_paid: false,
            paid_until: null,
          });
        } else {
          setSub(data);
        }
      }

      setLoading(false);
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  // 🟢 Se não existir registro, permitir acesso (até registro ser criado)
  const noRecordYet = useMemo(() => {
    return (
      sub &&
      sub.trial_end === null &&
      sub.paid_until === null &&
      sub.is_paid === false
    );
  }, [sub]);

  const isInTrial = useMemo(() => {
    if (!sub?.trial_end) return false;
    return new Date() <= new Date(sub.trial_end);
  }, [sub]);

  const isPaidActive = useMemo(() => {
    if (!sub?.is_paid) return false;
    if (!sub.paid_until) return false;
    return new Date() <= new Date(sub.paid_until);
  }, [sub]);

  // 🔥 Regra final
  const isAllowed = useMemo(() => {
    return noRecordYet || isInTrial || isPaidActive;
  }, [noRecordYet, isInTrial, isPaidActive]);

  const daysLeftTrial = useMemo(() => {
    if (!sub?.trial_end) return 0;
    return Math.ceil(
      (new Date(sub.trial_end).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    );
  }, [sub]);

  return { loading, sub, isInTrial, isPaidActive, isAllowed, daysLeftTrial };
}
