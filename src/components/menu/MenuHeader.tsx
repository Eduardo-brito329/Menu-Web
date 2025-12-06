import { Store } from '@/types';
import { MapPin, Phone } from 'lucide-react';

interface MenuHeaderProps {
  store: Store;
}

export function MenuHeader({ store }: MenuHeaderProps) {
  return (
    <header className="relative">
      {/* Banner */}
      <div className="h-40 md:h-56 w-full overflow-hidden bg-gradient-to-r from-primary/20 to-primary/10">
        {store.banner_url ? (
          <img
            src={store.banner_url}
            alt={`Banner de ${store.name}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full food-gradient opacity-80" />
        )}
      </div>

      {/* Store Info */}
      <div className="container relative -mt-12 px-4">
        <div className="bg-card rounded-2xl shadow-elevated p-4 md:p-6 animate-slide-up">
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0 shadow-card">
              {store.logo_url ? (
                <img
                  src={store.logo_url}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full food-gradient flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary-foreground">
                    {store.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">
                {store.name}
              </h1>
              {store.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {store.description}
                </p>
              )}
           <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent bg-accent/10 px-2.5 py-1 rounded-full">
              <span className="text-sm font-semibold">
                {store.is_open ? (
                  <span className="text-green-600">Aberto agora</span>
                ) : (
                  <span className="text-red-600">Fechado agora</span>
                )}
              </span>
            </span>

            {store.whatsapp && (
              <a
                href={`https://wa.me/${store.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                WhatsApp
              </a>
            )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
