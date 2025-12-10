import { useEffect, useState } from 'react';
import { supabasePublic } from '@/integrations/supabase/supabasePublic';
import { Store, Product } from '@/types';
import { CartProvider } from '@/contexts/CartContext';
import { MenuHeader } from '@/components/menu/MenuHeader';
import { ProductCard } from '@/components/menu/ProductCard';
import { CartSheet } from '@/components/menu/CartSheet';
import { Skeleton } from '@/components/ui/skeleton';
import { UtensilsCrossed } from 'lucide-react';

export default function Menu({ storeId }: { storeId: string }) {
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (!storeId) return;
    checkStoreStatus();
  }, [storeId]);

  const checkStoreStatus = async () => {
    try {
      const { data, error } = await supabasePublic.rpc("check_store_status", {
        store_uuid: storeId,
      });
      if (error) {
        console.error("Erro RPC:", error);
        return;
      }
      if (data?.allowed === false) {
        setBlocked(true);
        setLoading(false);
        return;
      }
      fetchStoreAndProducts();
    } catch (err) {
      console.error("Erro RPC:", err);
    }
  };

  const fetchStoreAndProducts = async () => {
    try {
      const { data: storeData, error: storeError } = await supabasePublic
        .from('stores')
        .select('*')
        .eq('id', storeId)
        .maybeSingle();

      if (storeError) {
        console.error("STORE ERROR:", storeError);
        return;
      }
      if (!storeData) return;

      setStore(storeData as Store);

      const { data: productsData, error: productsError } = await supabasePublic
        .from('products')
        .select('*')
        .eq('store_id', storeId)
        .eq('active', true)
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (productsError) {
        console.error("PRODUCTS ERROR:", productsError);
      }

      setProducts(productsData || []);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  if (blocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <div>
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Cardápio Indisponível</h1>
          <p className="text-muted-foreground">Este estabelecimento não está ativo no momento.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-40 md:h-56 bg-muted animate-pulse" />
        <div className="container px-4 -mt-12">
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <div className="container px-4 mt-6 space-y-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Cardápio não encontrado</h1>
        </div>
      </div>
    );
  }

  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || 'Outros';
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <CartProvider>
      <div className="min-h-screen bg-background pb-24">
        <MenuHeader store={store} />

        <main className="container px-4 mt-6">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="font-semibold">Cardápio vazio</h2>
              <p className="text-sm text-muted-foreground">Nenhum produto disponível.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedProducts).map(([category, items]) => (
                <section key={category}>
                  <h2 className="text-lg font-bold mb-4 sticky top-0 bg-background py-2">
                    {category}
                  </h2>
                  <div className="grid gap-4">
                    {items.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>

        <CartSheet storeId={storeId} whatsapp={store.whatsapp} />
      </div>
    </CartProvider>
  );
}
