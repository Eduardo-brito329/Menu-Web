import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Eye, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Store, Order } from '@/types';

export default function Admin() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [store, setStore] = useState<Store | null>(null);
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    pendingOrders: 0,
    todayOrders: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchStoreAndStats();
    }
  }, [user]);

  const fetchStoreAndStats = async () => {
    try {
      // Fetch store
      const { data: storeData } = await supabase
        .from('stores')
        .select('*')
        .eq('owner_id', user!.id)
        .maybeSingle();

      if (storeData) {
        setStore(storeData as Store);

        // Fetch products count
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('store_id', storeData.id);

        // Fetch orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*')
          .eq('store_id', storeData.id);

        const orders = ordersData || [];
        const today = new Date().toISOString().split('T')[0];
        const todayOrders = orders.filter(
          (o) => o.created_at.split('T')[0] === today
        );
        const pendingOrders = orders.filter((o) => o.status === 'pending');

        setStats({
          products: productsCount || 0,
          orders: orders.length,
          pendingOrders: pendingOrders.length,
          todayOrders: todayOrders.length,
        });
      }
    } catch (error) {
      console.error('Error fetching store data:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return null;

  const statCards = [
    {
      title: 'Total de Produtos',
      value: stats.products,
      icon: Package,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Total de Pedidos',
      value: stats.orders,
      icon: ShoppingCart,
      color: 'text-food-green',
      bg: 'bg-food-green/10',
    },
    {
      title: 'Pedidos Pendentes',
      value: stats.pendingOrders,
      icon: Eye,
      color: 'text-food-yellow',
      bg: 'bg-food-yellow/10',
    },
    {
      title: 'Pedidos Hoje',
      value: stats.todayOrders,
      icon: TrendingUp,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
  ];

  return (
    <AdminLayout storeId={store?.id}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Bem-vindo, {store?.name || 'Restaurante'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Confira o resumo do seu cardápio
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.title} className="shadow-card hover:shadow-elevated transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/admin/produtos')}
              className="p-4 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all text-left group"
            >
              <Package className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
              <h3 className="font-semibold mt-2 group-hover:text-primary transition-colors">
                Gerenciar Produtos
              </h3>
              <p className="text-sm text-muted-foreground">
                Adicione, edite ou remova itens do cardápio
              </p>
            </button>
            <button
              onClick={() => navigate('/admin/configuracoes')}
              className="p-4 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all text-left group"
            >
              <Eye className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
              <h3 className="font-semibold mt-2 group-hover:text-primary transition-colors">
                Personalizar Loja
              </h3>
              <p className="text-sm text-muted-foreground">
                Atualize logo, banner e informações
              </p>
            </button>
            {store && (
              <a
                href={`/menu/${store.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all text-left group"
              >
                <TrendingUp className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                <h3 className="font-semibold mt-2 group-hover:text-primary transition-colors">
                  Ver Cardápio
                </h3>
                <p className="text-sm text-muted-foreground">
                  Visualize como os clientes veem
                </p>
              </a>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
