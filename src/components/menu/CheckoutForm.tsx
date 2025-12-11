import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup } from '@/components/ui/radio-group';
import { ArrowLeft, Send, MapPin, ShoppingBag, Wallet, Truck } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { z } from 'zod';
import { normalizePhone } from '@/lib/phone';
import { supabasePublic } from '@/integrations/supabase/supabasePublic';

/* ============================
   Validations
============================ */
const checkoutSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  mode: z.enum(['local', 'retirada', 'entrega']),
  payment: z.string().min(2, 'Selecione uma forma de pagamento'),
  notes: z.string().max(500).optional(),
  address: z
    .object({
      street: z.string().min(2, 'Informe a rua'),
      number: z.string().min(1, 'Informe o número'),
      neighborhood: z.string().min(2, 'Informe o bairro'),
      reference: z.string().optional(),
    })
    .optional(),
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

function buildMessage({ name, mode, notes, items, total, payment, address }: any) {
  const modeText =
    mode === 'local'
      ? 'Consumo no Local'
      : mode === 'retirada'
      ? 'Retirada'
      : 'Entrega';

  const list = items
    .map(
      (i: any) =>
        `• ${i.quantity}x ${i.name} - ${formatPrice(Number(i.price) * i.quantity)}`
    )
    .join('\n');

  const addressText =
    mode === 'entrega'
      ? `\n📍 *Endereço:* ${address.street}, ${address.number} - ${address.neighborhood}
${address.reference ? `🔎 *Referência:* ${address.reference}\n` : ''}`
      : '';

  return (
    `🍽️ *Novo Pedido*\n\n` +
    `👤 *Cliente:* ${name}\n` +
    `🚚 *Tipo:* ${modeText}\n` +
    `💳 *Pagamento:* ${payment}\n` +
    addressText +
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
  const [mode, setMode] = useState<'local' | 'retirada' | 'entrega'>('local');
  const [payment, setPayment] = useState('');
  const [notes, setNotes] = useState('');

  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [reference, setReference] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = checkoutSchema.safeParse({
      name,
      mode,
      payment,
      notes,
      address:
        mode === 'entrega'
          ? {
              street,
              number,
              neighborhood,
              reference,
            }
          : undefined,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        fieldErrors[err.path.join('.')] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const orderItems = items.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: Number(item.product.price),
      quantity: item.quantity,
    }));

    const address =
      mode === 'entrega'
        ? { street, number, neighborhood, reference }
        : null;

    const message = buildMessage({
      name,
      mode,
      items: orderItems,
      notes,
      total,
      payment,
      address,
    });

    setLoading(true);

    /* 1️⃣ ABRIR WHATSAPP IMEDIATAMENTE */
    if (whatsapp) {
      openWhatsAppNow(whatsapp, message);
    }

    /* 2️⃣ REGISTRAR PEDIDO EM PARALELO */
    setTimeout(async () => {
      try {
        const { error } = await supabasePublic.rpc('create_order', {
          store_uuid: storeId,
          items: orderItems,
          total,
          customer_name: name.trim(),
          customer_mode: mode,
          payment_method: payment,
          address,
          customer_notes: notes.trim() || null,
          user_agent: navigator.userAgent,
          created_at_client: new Date().toISOString(),
        });

        if (error) {
          console.error('Erro RPC create_order:', error);
          toast.error('Pedido enviado pelo WhatsApp, mas não foi salvo no sistema.');
        } else {
          toast.success('Pedido enviado e salvo com sucesso!');
        }
      } catch (err) {
        console.error('Erro RPC:', err);
        toast.error('Erro ao registrar o pedido.');
      } finally {
        clearCart();
        setLoading(false);
      }
    }, 100);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
      {/* VOLTAR */}
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
        {/* NOME */}
        <div className="space-y-2">
          <Label>Seu Nome *</Label>
          <Input
            placeholder="Digite seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? 'border-destructive' : ''}
          />
        </div>

        {/* ENTREGA / RETIRADA / LOCAL */}
        <div className="space-y-3">
          <Label>Como deseja receber? *</Label>
          <RadioGroup
          value={mode}
          onValueChange={(v) => setMode(v as any)}
          className="grid grid-cols-3 gap-3"
        >
          <div
            onClick={() => setMode("local")}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer ${
              mode === "local" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
          >
            <MapPin className="w-6 h-6" />
            <span>No Local</span>
          </div>

          <div
            onClick={() => setMode("retirada")}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer ${
              mode === "retirada" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
          >
            <ShoppingBag className="w-6 h-6" />
            <span>Retirada</span>
          </div>

          <div
            onClick={() => setMode("entrega")}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer ${
              mode === "entrega" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
          >
            <Truck className="w-6 h-6" />
            <span>Entrega</span>
          </div>
        </RadioGroup>

        </div>

        {/* ENDEREÇO se ENTREGA */}
        {mode === 'entrega' && (
          <div className="space-y-3 border p-4 rounded-xl bg-muted/20">
            <Label className="font-semibold">Endereço *</Label>

            <Input
              placeholder="Rua / Avenida"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className={errors['address.street'] ? 'border-destructive' : ''}
            />

            <Input
              placeholder="Número"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className={errors['address.number'] ? 'border-destructive' : ''}
            />

            <Input
              placeholder="Bairro"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className={errors['address.neighborhood'] ? 'border-destructive' : ''}
            />

            <Input
              placeholder="Ponto de referência (opcional)"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>
        )}

        {/* FORMA DE PAGAMENTO */}
        <div className="space-y-3">
          <Label>Forma de Pagamento *</Label>

          <RadioGroup
          value={payment}
          onValueChange={(v) => setPayment(v)}
          className="grid grid-cols-2 gap-3"
        >
          {["PIX", "Dinheiro", "Cartão", "Cartão na Entrega"].map((option) => (
            <div
              key={option}
              onClick={() => setPayment(option)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 cursor-pointer ${
                payment === option ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              }`}
            >
              <Wallet className="w-5 h-5" />
              <span>{option}</span>
            </div>
          ))}
        </RadioGroup>

        </div>

        {/* OBSERVAÇÃO */}
        <div className="space-y-2">
          <Label>Observações (opcional)</Label>
          <Textarea
            placeholder="Alguma observação sobre o pedido?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      {/* FOOTER */}
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
