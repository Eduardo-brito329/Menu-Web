export default async function handler(req, res) {
    try {
      // Cakto envia POST
      if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
      }
  
      const event = req.body;
  
      console.log("🔔 Webhook recebido da Cakto:", event);
  
      // Campos importantes que a Cakto envia
      const customerEmail = event?.customer?.email;
      const status = event?.status;
      const eventType = event?.event;
      const planName = event?.product?.name;
  
      if (!customerEmail) {
        return res.status(400).json({ error: "Email não encontrado no webhook" });
      }
  
      // Conecta ao Supabase
      const { createClient } = require("@supabase/supabase-js");
  
      const supabase = createClient(
        process.env.VITE_SUPABASE_URL,
        process.env.VITE_SUPABASE_SERVICE_ROLE // precisa ser service_key, você irá colocar na Vercel
      );
  
      // Só libera quando o pagamento for aprovado
      const eventosLiberar = ["payment.paid", "invoice.paid", "subscription.activated"];
  
      if (!eventosLiberar.includes(eventType)) {
        return res.status(200).json({ msg: "Evento ignorado" });
      }
  
      // Atualiza assinatura do usuário
      const { data: userData } = await supabase
        .from("users")
        .select("id")
        .eq("email", customerEmail)
        .maybeSingle();
  
      if (!userData) {
        return res.status(404).json({ error: "Usuário não encontrado no Supabase" });
      }
  
      // Atualiza registro na tabela subscriptions
      const now = new Date();
      const nextYear = new Date();
      nextYear.setFullYear(now.getFullYear() + 1);
  
      await supabase
        .from("subscriptions")
        .update({
          is_paid: true,
          paid_until: nextYear.toISOString(),
          trial_end: null
        })
        .eq("user_id", userData.id);
  
      return res.status(200).json({ msg: "Assinatura liberada com sucesso!" });
    } catch (err) {
      console.error("Erro webhook:", err);
      return res.status(500).json({ error: "Erro interno" });
    }
  }
  