import { Link } from 'react-router-dom';
import TelaMenu from '@/assets/TelaMenu.png';
import { Button } from '@/components/ui/button';
import { 
  UtensilsCrossed, 
  Smartphone, 
  BarChart3, 
  MessageSquare,
  ArrowRight,
  Check
} from 'lucide-react';

export default function Index() {
  const features = [
    {
      icon: Smartphone,
      title: 'Mobile First',
      description: 'Cardápio otimizado para celulares, como o iFood',
    },
    {
      icon: BarChart3,
      title: 'Painel Admin',
      description: 'Gerencie produtos, pedidos e configurações',
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp',
      description: 'Receba pedidos diretamente no seu WhatsApp',
    },
  ];

  const benefits = [
    '0% de taxas por pedido',
    'Receba pedidos direto no WhatsApp',
    'Digitalização completa em minutos',
    'Design profissional estilo iFood',
    'Painel super simples',
    'Sem mensalidades absurdas',
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* HEADER */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl food-gradient flex items-center justify-center shadow-button">
              <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">MenuApp</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link to="/login">
              <Button size="sm" className="shadow-button">Criar Conta</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="container px-4 text-center">

          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Cardápio Digital Profissional
            </div>
            <div className="inline-flex items-center gap-2 bg-green-600/15 text-green-600 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm">
              🎉 15 Dias Grátis — sem cartão de crédito
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground max-w-3xl mx-auto leading-tight">
            Seu cardápio digital 
            <span className="text-primary"> estilo iFood</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mt-6">
            Crie um cardápio moderno, fácil e profissional. Sem taxas abusivas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link to="/login">
              <Button size="lg" className="text-base px-8 shadow-button hover:scale-105 transition-transform">
                Iniciar teste gratuito
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container px-4">

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Tudo o que você precisa
            </h2>
            <p className="text-muted-foreground mt-3">
              A solução completa para digitalizar seu negócio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((f, i) => (
              <div 
                key={f.title}
                className="p-6 rounded-2xl bg-background border shadow-card hover:shadow-elevated transition-all"
              >
                <div className="w-14 h-14 rounded-xl food-gradient flex items-center justify-center mb-4 shadow-button">
                  <f.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FREE TRIAL */}
      <section className="py-16 md:py-20 bg-card/50 border-y">
        <div className="container px-4 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">Teste grátis por 15 dias</h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Use tudo sem pagar nada. Sem cartão de crédito.
          </p>

          <Link to="/login" className="inline-block mt-8">
            <Button size="lg" className="shadow-button px-8">
              Começar agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* COMPARATIVO */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4">
          
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Comparativo direto
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

            {/* MEU SISTEMA */}
            <div className="p-8 rounded-2xl border bg-background shadow-card hover:shadow-elevated transition-all">
              <h3 className="text-2xl font-bold text-primary mb-4">MenuApp</h3>
              <p className="text-muted-foreground mb-6">
                Feito para pequenos negócios — preço justo e sem taxas.
              </p>

              <ul className="space-y-3">
                {[
                  '0% de taxas por pedido',
                  'Mensalidade acessível',
                  'Pedidos vão para o WhatsApp',
                  'Configuração em minutos',
                  'Design estilo iFood',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* OUTROS */}
            <div className="p-8 rounded-2xl border bg-card shadow-card hover:shadow-elevated transition-all">
              <h3 className="text-2xl font-bold mb-4">Outros Sistemas</h3>
              <p className="text-muted-foreground mb-6">
                Taxas abusivas e mensalidades muito altas.
              </p>

              <ul className="space-y-3">
                {[
                  'Taxas por pedido (12%–30%)',
                  'Mensalidades acima de R$ 200',
                  'Plataformas que ficam com parte do lucro',
                  'Painéis difíceis de usar',
                  'Dependência total do marketplace',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-red-500 mt-1">✘</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/login">
              <Button size="lg" className="shadow-button px-10 hover:scale-105 transition-transform">
                Criar meu cardápio agora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS + CELULAR */}
      <section className="py-16 md:py-24">
        <div className="container px-4 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">

          {/* BENEFÍCIOS */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Por que escolher o MenuApp?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-accent" />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <Link to="/login" className="inline-block mt-8">
              <Button size="lg" className="shadow-button">
                Criar Meu Cardápio
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* CELULAR DEMONSTRATIVO (mantido como antes) */}
          <div className="flex-1 flex justify-center">
            <div className="w-64 h-[450px] bg-foreground rounded-[40px] p-3 shadow-elevated">
              <div className="w-full h-full bg-background rounded-[32px] overflow-hidden">
                <img
                  src={TelaMenu}
                  alt="Visualização do Cardápio"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Pronto para começar?
          </h2>
          <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8">
            Crie sua conta e tenha seu cardápio digital funcionando em poucos minutos.
          </p>
          <Link to="/login">
            <Button size="lg" variant="secondary" className="px-8 shadow-button">
              Criar Conta Agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 border-t">
        <div className="container px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg food-gradient flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">MenuApp</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 MenuApp. Todos os direitos reservados.
          </p>
        </div>
      </footer>

    </div>
  );
}
