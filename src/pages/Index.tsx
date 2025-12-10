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
    'Cardápio digital profissional',
    'Sem taxas por pedido',
    'Fácil de configurar',
    'Atualizações em tempo real',
    'Design moderno e responsivo',
    'Suporte a categorias',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link to="/login">
              <Button size="sm" className="shadow-button">
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="container px-4 text-center">
        <div className="flex flex-col items-center gap-3 mb-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Cardápio Digital Profissional
          </div>
          <div className="inline-flex items-center gap-2 bg-green-600/15 text-green-600 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm">
            🎉 15 Dias Grátis — sem cartão de crédito
          </div>
        </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground max-w-3xl mx-auto leading-tight animate-slide-up">
            Seu cardápio digital
            <span className="text-primary"> estilo iFood</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mt-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Crie um cardápio online profissional para seu restaurante em minutos. 
            Sem complicação, sem taxas por pedido.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/login">
              <Button size="lg" className="text-base px-8 shadow-button hover:scale-105 transition-transform">
                Inicie seu teste gratuito
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Tudo que você precisa
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Uma solução completa para digitalizar seu cardápio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-background border shadow-card hover:shadow-elevated transition-all duration-300 group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl food-gradient flex items-center justify-center mb-4 shadow-button group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Trial Highlight */}
    <section className="py-16 md:py-20 bg-card/50 border-y">
      <div className="container px-4 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Teste grátis por 15 dias
        </h2>

        <p className="text-muted-foreground mt-4 text-lg">
          Crie seu cardápio digital agora e utilize todas as funcionalidades por 15 dias,
          sem pagar nada e sem necessidade de cartão de crédito.
          Ideal para testar, configurar sua loja e começar a vender.
        </p>

        <Link to="/login" className="inline-block mt-8">
          <Button size="lg" className="shadow-button hover:scale-105 transition-transform text-base px-8">
            Começar agora — é grátis!
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </section>


      {/* Benefits */}
      <section className="py-16 md:py-24">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Por que escolher nosso sistema?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
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
        </div> {/* ← FECHAMENTO que faltava */}
        </div>   {/* ← FECHAMENTO que faltava */}

      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Pronto para começar?
          </h2>
          <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8">
            Crie sua conta e tenha seu cardápio digital funcionando em poucos minutos.
          </p>
          <Link to="/login">
            <Button size="lg" variant="secondary" className="text-base px-8 hover:scale-105 transition-transform">
              Criar Conta Agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg food-gradient flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">MenuApp</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 MenuApp. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
