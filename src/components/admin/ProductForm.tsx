import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Product } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  storeId: string;
  product?: Product | null;
  onSuccess: () => void;
}

export function ProductForm({ open, onClose, storeId, product, onSuccess }: ProductFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price ? String(product.price) : '',
    image_url: product?.image_url ?? '',
    category: product?.category ?? '',
    active: product?.active ?? true,
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      setImageFile(file);
    }
  };

  
  const uploadImage = async () => {
    if (!imageFile) return formData.image_url;
  
    const fileExt = imageFile.name.split('.').pop();
    const safeName = formData.name.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${safeName}-${Date.now()}.${fileExt}`;
  
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, imageFile, {
        upsert: false,
        cacheControl: "3600",
      });
  
    if (uploadError) {
      console.error("Upload error:", uploadError);
      toast.error("Erro ao fazer upload da imagem.");
      return null;
    }
  
    const { data: publicData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);
  
    if (!publicData?.publicUrl) {
      console.error("URL generation error");
      toast.error("Erro ao gerar URL pública da imagem.");
      return null;
    }
  
    return publicData.publicUrl;
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const image_url = await uploadImage();
      if (!image_url) throw new Error('Erro ao gerar URL da imagem');

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        price: Number(formData.price),
        image_url,
        category: formData.category.trim() || null,
        active: formData.active,
        store_id: storeId,
      };

      if (product) {
        const { error } = await supabase.from('products').update(payload).eq('id', product.id);
        if (error) throw error;
        toast.success('Produto atualizado com sucesso!');
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
        toast.success('Produto criado com sucesso!');
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao salvar produto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{product ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label>Nome *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Preço */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Preço (R$) *</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ex: Lanches"
              />
            </div>
          </div>

          {/* Upload da imagem */}
          <div className="space-y-2">
            <Label>Imagem do Produto *</Label>

            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageSelect}
            />

            {/* Pré-visualização */}
            {(imageFile || formData.image_url) && (
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : formData.image_url}
                alt="preview"
                className="w-24 h-24 object-cover rounded-md mt-2 border"
              />
            )}
          </div>

          {/* Ativo */}
          <div className="flex items-center justify-between py-2">
            <Label>Produto ativo</Label>
            <Switch
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
