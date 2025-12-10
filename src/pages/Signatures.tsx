import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function Signatures() {
  const plans = [
    {
      title: "Plano Mensal",
      price: "39,90",
      description: "Ideal para começar agora sem compromisso.",
      highlight: false,
      benefits: [
        "Cardápio digital completo",
        "Recebimento de pedidos no WhatsApp",
        "Atualizações ilimitadas",
        "Suporte básico",
      ],
      caktoUrl: "COLE_SEU_LINK_AQUI_MENSAL",
    },
    {
      title: "Plano Trimestral",
      price: "97,00",
      description: "Mais vendido! Economia e flexibilidade.",
      highlight: true,
      benefits: [
        "Tudo do Plano Mensal",
        "Economia de R$ 22,70",
        "Prioridade no suporte",
        "Relatórios de vendas",
      ],
      caktoUrl: "COLE_SEU_LINK_AQUI_TRIMESTRAL",
    },
    {
      title: "Plano Anual",
      price: "297,00",
      description: "Melhor custo-benefício para negócios estabelecidos.",
      highlight: false,
      benefits: [
        "Tudo do Trimestral",
        "Economia de R$ 180 ao ano",
        "Suporte premium",
        "Acesso antecipado a novidades",
      ],
      caktoUrl: "COLE_SEU_LINK_AQUI_ANUAL",
    },
  ];

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Assinatura</h1>
          <p className="text-muted-foreground mt-2">
            Escolha o plano ideal para o seu negócio e desbloqueie todos os recursos do MenuApp.
          </p>
        </div>

        {/* PLANS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.title}
              className={`relative border-2 ${
                plan.highlight ? "border-primary shadow-xl" : "border-muted"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow">
                  Mais Popular
                </span>
              )}

              <CardHeader>
                <CardTitle className="text-center text-xl">{plan.title}</CardTitle>
                <p className="text-center mt-2">
                  <span className="text-4xl font-bold">R$ {plan.price}</span>
                </p>
                <p className="text-center text-muted-foreground text-sm mt-1">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.benefits.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary" />
                      {b}
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full mt-4"
                  size="lg"
                  onClick={() => (window.location.href = plan.caktoUrl)}
                >
                  Assinar Agora
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* COMPARATIVO */}
        <div className="bg-card border rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 text-center">Comparativo dos Planos</h2>

          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="p-3 text-left">Benefício</th>
                  <th className="p-3 text-center">Mensal</th>
                  <th className="p-3 text-center">Trimestral</th>
                  <th className="p-3 text-center">Anual</th>
                </tr>
              </thead>

              <tbody>
                {[
                  { name: "Cardápio digital completo", m: true, t: true, a: true },
                  { name: "Pedidos via WhatsApp", m: true, t: true, a: true },
                  { name: "Suporte priorizado", m: false, t: true, a: true },
                  { name: "Relatórios de Vendas", m: false, t: true, a: true },
                  { name: "Suporte Premium", m: false, t: false, a: true },
                  { name: "Acesso antecipado às novidades", m: false, t: false, a: true },
                ].map((row) => (
                  <tr key={row.name} className="border-t">
                    <td className="p-3">{row.name}</td>
                    <td className="p-3 text-center">{row.m ? "✔️" : "—"}</td>
                    <td className="p-3 text-center">{row.t ? "✔️" : "—"}</td>
                    <td className="p-3 text-center">{row.a ? "✔️" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
