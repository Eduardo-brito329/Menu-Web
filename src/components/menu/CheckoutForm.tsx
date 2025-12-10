import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup } from '@/components/ui/radio-group';
import { ArrowLeft, Send, MapPin, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { z } from 'zod';
import { normalizePhone } from '@/lib/phone';
import { supabasePublic } from '@/integrations/supabase/supabasePublic';

/* ============================
   Validations
============================ */
const checkoutSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  mode: z.enum(['local', 'retirada']),
  notes: z.string().max(500).optional(),
});

/* ============================
   Helpers
============================ */

const formatPrice = (price: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

function openWhatsAppNow(whatsapp: string, message: string) {
  const phone = normalizePhone(whatsapp);
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  const newTab = window.open(url, '_blank', 'noopener,noreferrer');

  // Fallback
  if (!newTab) {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}

function buildMessage({ name, mode, notes, items, total }: any) {
  const modeText = mode === 'local' ? 'Consumo no Local' : 'Retirada';

  const list = items
    .map(
      (i: any) =>
        `• ${i.quantity}x ${i.name} - ${formatPrice(Number(i.price) * i.quantity)}`
    )
    .join('\n');

  return (
    `🍽️ *Novo Pedido*\n\n` +
    `👤 *Cliente:* ${name}\n` +
    `📍 *Tipo:* ${modeText}\n` +
    (notes ? `📝 *Observação:* ${notes}\n` : '') +
    `\n*Itens do Pedido:*\n${list}\n\n` +
    `💰 *Total:* ${formatPrice(total)}\n\n` +
    `Obrigado pelo pedido! 🙌`
  );
}

/* ============================
   Component
============================ */

export function CheckoutForm({ storeId, whatsapp, onBack }: any) {
  const { items, total, clearCart } = useCart();

  const [name, setName] = useState('');
  const [mode, setMode] = useState<'local' | 'retirada'>('local');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = checkoutSchema.safeParse({ name, mode, notes });
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // monta objetos
    const orderItems = items.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: Number(item.product.price),
      quantity: item.quantity,
    }));

    const message = buildMessage({
      name,
      mode,
      notes,
      items: orderItems,
      total,
    });

    setLoading(true);

    /* -------------------------------------------------
       1️⃣ ABRIR WHATSAPP IMEDIATAMENTE (Chrome Mobile exige isso)
    ---------------------------------------------------- */
    if (whatsapp) {
      openWhatsAppNow(whatsapp, message);
    }

    /* -------------------------------------------------
       2️⃣ RPC EM PARALELO (não trava botão do usuário)
    ---------------------------------------------------- */
    setTimeout(async () => {
      try {
        const { error } = await supabasePublic.rpc('create_order', {
          store_uuid: storeId,
          items: orderItems,
          total,
          customer_name: name.trim(),
          customer_mode: mode,
          customer_notes: notes.trim() || null,
          user_agent: navigator.userAgent,
          created_at_client: new Date().toISOString(),
        });

        if (error) {
          console.error('Erro RPC create_order:', error);
          toast.error('Pedido enviado pelo WhatsApp, mas falhou no sistema.');
        } else {
          toast.success('Pedido registrado e enviado com sucesso!');
        }
      } catch (err) {
        console.error('Erro no RPC:', err);
        toast.error('Erro ao registrar o pedido.');
      } finally {
        clearCart();
        setLoading(false);
      }
    }, 100); // 100ms garante compatibilidade máxima

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
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-3">
          <Label>Como deseja receber? *</Label>
          <RadioGroup
            value={mode}
            onValueChange={(v) => setMode(v as any)}
            className="grid grid-cols-2 gap-3"
          >
            <Label
              htmlFor="local"
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer ${
                mode === 'local'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <input type="radio" id="local" value="local" readOnly checked={mode === 'local'} className="sr-only" />
              <MapPin className={`w-6 h-6 ${mode === 'local' ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={mode === 'local' ? 'text-primary' : ''}>No Local</span>
            </Label>

            <Label
              htmlFor="retirada"
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer ${
                mode === 'retirada'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <input type="radio" id="retirada" value="retirada" readOnly checked={mode === 'retirada'} className="sr-only" />
              <ShoppingBag className={`w-6 h-6 ${mode === 'retirada' ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={mode === 'retirada' ? 'text-primary' : ''}>Retirada</span>
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

        <Button type="submit" size="lg" className="w-full rounded-xl shadow-button" disabled={loading}>
          {loading ? 'Enviando...' : (<><Send className="w-4 h-4 mr-2" /> Enviar Pedido</>)}
        </Button>
      </div>
    </form>
  );
}
