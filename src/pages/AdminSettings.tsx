import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Store as StoreIcon, Phone, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Store } from '@/types';
import { toast } from 'sonner';
import { z } from 'zod';
import { Switch } from "@/components/ui/switch"

const settingsSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  description: z.string().max(500).optional(),
  whatsapp: z.string().max(20).optional(),
  logo_url: z.string().url('URL inválida').optional().or(z.literal('')),
  banner_url: z.string().url('URL inválida').optional().or(z.literal('')),
  is_open: z.boolean().optional(), // ← campo novo corretamente colocado
});


// Função para upload de imagem (mesma usada para produtos)
async function uploadImage(file: File): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Erro ao enviar para storage:", uploadError);
      throw new Error("Falha no upload da imagem");
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(filePath);

    return publicUrl;
  } catch (err) {
    console.error("uploadImage error:", err);
    throw err;
  }
}


export default function AdminSettings() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [store, setStore] = useState<Store | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    whatsapp: '',
    logo_url: '',
    banner_url: '',
    is_open: true, // valor padrão até carregar do Supabase
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchStore();
    }
  }, [user]);

  const fetchStore = async () => {
    try {
      const { data: storeData } = await supabase
        .from('stores')
        .select('*')
        .eq('owner_id', user!.id)
        .maybeSingle();

      if (storeData) {
        setStore(storeData as Store);
        setFormData({
          name: storeData.name || '',
          description: storeData.description || '',
          whatsapp: storeData.whatsapp || '',
          logo_url: storeData.logo_url || '',
          banner_url: storeData.banner_url || '',
          is_open: storeData.is_open ?? true,
        });
      }
    } catch (error) {
      console.error('Error fetching store:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const data = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      whatsapp: formData.whatsapp.trim() || undefined,
      logo_url: formData.logo_url.trim() || undefined,
      banner_url: formData.banner_url.trim() || undefined,
      is_open: formData.is_open,
    };
    

    const validation = settingsSchema.safeParse(data);
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

    setSaving(true);

    try {
      const { error } = await supabase
        .from('stores')
        .update(data)
        .eq('id', store!.id);

      if (error) throw error;

      toast.success('Configurações salvas com sucesso!');
      fetchStore();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
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

  return (
    <AdminLayout storeId={store?.id}>
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Configurações
          </h1>
          <p className="text-muted-foreground mt-1">
            Personalize seu cardápio digital
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Store Info */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StoreIcon className="w-5 h-5" />
                Informações da Loja
              </CardTitle>
              <CardDescription>
                Dados que aparecerão no seu cardápio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Estabelecimento *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Uma breve descrição do seu estabelecimento"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contato
              </CardTitle>
              <CardDescription>
                Número de WhatsApp para receber pedidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsapp: e.target.value })
                  }
                  placeholder="5511999999999"
                />
                <p className="text-xs text-muted-foreground">
                  Digite o número com código do país (ex: 5511999999999)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Aberto / Fechado */}
          <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Status da Loja</CardTitle>
            <CardDescription>Altere manualmente se a loja está aberta ou fechada</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              type="button"
              variant={formData.is_open ? "destructive" : "default"}
              onClick={() =>
                setFormData((prev) => ({ ...prev, is_open: !prev.is_open }))
              }
            >
              {formData.is_open ? "Fechar agora" : "Abrir agora"}
            </Button>
            <p className="mt-2 text-sm text-muted-foreground">
              Status atual:{" "}
              <span className="font-bold">
                {formData.is_open ? "Aberto" : "Fechado"}
              </span>
            </p>
          </CardContent>
        </Card>



          {/* Images */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                Imagens
              </CardTitle>
              <CardDescription>
                Logo e banner do seu cardápio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
              <Label>Logo da Loja</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const url = await uploadImage(file);
                  setFormData({ ...formData, logo_url: url });
                  toast.success("Logo enviada com sucesso!");
                }}
              />
                {formData.logo_url && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted mt-2">
                    <img
                      src={formData.logo_url}
                      alt="Preview do logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
              <Label>Banner do Cardápio</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const url = await uploadImage(file);
                      setFormData({ ...formData, banner_url: url });
                      toast.success("Banner enviado com sucesso!");
                    }}
                  />

                  {formData.banner_url && (
                    <div className="h-24 rounded-lg overflow-hidden bg-muted mt-2">
                      <img
                        src={formData.banner_url}
                        alt="Preview do banner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>

          {/* Menu Link */}
          {store && (
            <Card className="shadow-card border-primary/20 bg-primary/5">
              <CardContent className="py-4">
                <p className="text-sm font-medium text-foreground mb-2">
                  Link do seu cardápio:
                </p>
                <code className="block p-3 bg-card rounded-lg text-sm text-muted-foreground break-all">
                  {window.location.origin}/menu/{store.id}
                </code>
              </CardContent>
            </Card>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full shadow-button"
            disabled={saving}
          >
            {saving ? (
              'Salvando...'
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações
              </>
            )}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
}
