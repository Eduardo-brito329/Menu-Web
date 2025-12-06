import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Store, Product } from '@/types';
import { CartProvider } from '@/contexts/CartContext';
import { MenuHeader } from '@/components/menu/MenuHeader';
import { ProductCard } from '@/components/menu/ProductCard';
import { CartSheet } from '@/components/menu/CartSheet';
import { Skeleton } from '@/components/ui/skeleton';
import { UtensilsCrossed } from 'lucide-react';

export default function Menu() {
  const { storeId } = useParams<{ storeId: string }>();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (storeId) {
      fetchStoreAndProducts();
    }
  }, [storeId]);

  const fetchStoreAndProducts = async () => {
    try {
      // Fetch store
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('*')
        .eq('id', storeId)
        .maybeSingle();

      if (storeError || !storeData) {
        setError(true);
        return;
      }

      setStore(storeData as Store);

      // Fetch active products
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId)
        .eq('active', true)
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      setProducts((productsData as Product[]) || []);
    } catch (err) {
      console.error('Error fetching menu:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || 'Outros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Loading skeleton */}
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

  if (error || !store) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Cardápio não encontrado
          </h1>
          <p className="text-muted-foreground">
            O cardápio que você está procurando não existe ou foi removido.
          </p>
        </div>
      </div>
    );
  }

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
              <h2 className="font-semibold text-foreground mb-1">
                Cardápio vazio
              </h2>
              <p className="text-sm text-muted-foreground">
                Este estabelecimento ainda não adicionou produtos.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
                <section key={category}>
                  <h2 className="text-lg font-bold text-foreground mb-4 sticky top-0 bg-background py-2 z-10">
                    {category}
                  </h2>
                  <div className="grid gap-4">
                    {categoryProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>

        <CartSheet storeId={storeId!} whatsapp={store.whatsapp} />
      </div>
    </CartProvider>
  );
}
