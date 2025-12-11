import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import { CheckoutForm } from './CheckoutForm';

interface CartSheetProps {
  storeId: string;
  whatsapp?: string | null;
}

export function CartSheet({ storeId, whatsapp }: CartSheetProps) {
  const { items, updateQuantity, removeItem, total, itemCount } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 rounded-full shadow-elevated hover:scale-105 transition-transform z-50 gap-2 px-6"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="font-semibold">{formatPrice(total)}</span>
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center animate-bounce-in">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col overflow-hidden">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Seu Carrinho
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingCart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Carrinho vazio</h3>
            <p className="text-sm text-muted-foreground">
              Adicione itens para fazer seu pedido
            </p>
          </div>
        ) : showCheckout ? (
          <div className="flex-1 overflow-y-auto pr-1">
          <CheckoutForm
            storeId={storeId}
            whatsapp={whatsapp}
            onBack={() => setShowCheckout(false)}
          />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl"
                >
                  {item.product.image_url && (
                    <img
                    src={`${item.product.image_url}?width=200&quality=75&format=webp`}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                    <p className="text-sm font-semibold text-primary mt-0.5">
                      {formatPrice(Number(item.product.price) * item.quantity)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8 rounded-full"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-6 text-center font-semibold text-sm">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8 rounded-full"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-destructive hover:text-destructive"
                      onClick={() => removeItem(item.product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span className="font-medium">Total</span>
                <span className="font-bold text-primary">{formatPrice(total)}</span>
              </div>
              <Button
                size="lg"
                className="w-full rounded-xl shadow-button"
                onClick={() => setShowCheckout(true)}
              >
                Finalizar Pedido
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
