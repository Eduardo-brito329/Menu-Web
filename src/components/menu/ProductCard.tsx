import { Product } from '@/types';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`${product.name} adicionado ao carrinho!`, { duration: 1200 });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);

  return (
    <div className="group bg-card rounded-xl shadow-card overflow-hidden hover:shadow-elevated transition-all duration-300 animate-fade-in">
      <div className="flex gap-3 p-3 md:p-4">

        {/* TEXTOS */}
        <div className="flex-1 min-w-0 flex flex-col">
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="mt-auto pt-3 flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              {formatPrice(Number(product.price))}
            </span>

            <Button
              size="sm"
              onClick={handleAddToCart}
              className="rounded-full shadow-button hover:scale-105 transition-transform"
            >
              <Plus className="w-4 h-4 mr-1" />
              Adicionar
            </Button>
          </div>
        </div>

        {/* IMAGEM OTIMIZADA */}
        {product.image_url && (
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden flex-shrink-0 bg-muted relative">

            {/* Blur Placeholder */}
            <div className="absolute inset-0 bg-muted/40 blur-xl scale-110" />

            <img
              src={`${product.image_url}?width=500&quality=70&format=webp`}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover relative z-10 group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}
      </div>
    </div>
  );
}
