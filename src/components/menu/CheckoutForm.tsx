import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Send, MapPin, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  mode: z.enum(['local', 'retirada']),
  notes: z.string().max(500).optional(),
});

interface CheckoutFormProps {
  storeId: string;
  whatsapp?: string | null;
  onBack: () => void;
}

export function CheckoutForm({ storeId, whatsapp, onBack }: CheckoutFormProps) {
  const { items, total, clearCart } = useCart();
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'local' | 'retirada'>('local');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = checkoutSchema.safeParse({ name, mode, notes });
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const orderItems = items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: Number(item.product.price),
        quantity: item.quantity,
      }));

      const { error } = await supabase.from('orders').insert({
        store_id: storeId,
        items: orderItems,
        total,
        customer_name: name.trim(),
        customer_mode: mode,
        customer_notes: notes.trim() || null,
      });

      if (error) throw error;

      // Send to WhatsApp if available
      if (whatsapp) {
        const modeText = mode === 'local' ? 'Consumo no Local' : 'Retirada';
        const itemsList = items
          .map((item) => `• ${item.quantity}x ${item.product.name} - ${formatPrice(Number(item.product.price) * item.quantity)}`)
          .join('\n');
        
          const message = encodeURIComponent(
            `🍽️ *Novo Pedido*\n\n` +
            `👤 *Cliente:* ${name}\n` +
            `📍 *Tipo:* ${modeText}\n` +
            `${notes ? `📝 *Observação:* ${notes}\n` : ''}` +
            `\n*Itens do Pedido:*\n${itemsList}\n\n` +
            `💰 *Total:* ${formatPrice(total)}\n\n` +
            `Obrigado pelo pedido! 🙌`
          );          

        window.location.href = `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${message}`;
      }

      toast.success('Pedido realizado com sucesso!');
      clearCart();
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Erro ao criar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="self-start mb-4 -ml-2"
        onClick={onBack}
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Voltar
      </Button>

      <div className="flex-1 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Seu Nome *</Label>
          <Input
            id="name"
            placeholder="Digite seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label>Como deseja receber? *</Label>
          <RadioGroup
            value={mode}
            onValueChange={(value) => setMode(value as 'local' | 'retirada')}
            className="grid grid-cols-2 gap-3"
          >
            <Label
              htmlFor="local"
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                mode === 'local'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <RadioGroupItem value="local" id="local" className="sr-only" />
              <MapPin className={`w-6 h-6 ${mode === 'local' ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-sm font-medium ${mode === 'local' ? 'text-primary' : ''}`}>
                No Local
              </span>
            </Label>
            <Label
              htmlFor="retirada"
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                mode === 'retirada'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <RadioGroupItem value="retirada" id="retirada" className="sr-only" />
              <ShoppingBag className={`w-6 h-6 ${mode === 'retirada' ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-sm font-medium ${mode === 'retirada' ? 'text-primary' : ''}`}>
                Retirada
              </span>
            </Label>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Observações (opcional)</Label>
          <Textarea
            id="notes"
            placeholder="Alguma observação sobre o pedido?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <div className="border-t pt-4 mt-4 space-y-4">
        <div className="flex justify-between items-center text-lg">
          <span className="font-medium">Total</span>
          <span className="font-bold text-primary">{formatPrice(total)}</span>
        </div>
        <Button
          type="submit"
          size="lg"
          className="w-full rounded-xl shadow-button"
          disabled={loading}
        >
          {loading ? (
            'Enviando...'
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Enviar Pedido
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
