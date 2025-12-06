// src/lib/phone.ts
export function normalizePhone(raw: string | undefined | null, defaultCountry = '55'): string {
    if (!raw) return '';
  
    // remove tudo que não é dígito
    let digits = String(raw).replace(/\D/g, '');
  
    // remove zeros iniciais (ex: 0DDD)
    digits = digits.replace(/^0+/, '');
  
    // se já começa com o country code (ex: 55) retorna
    if (digits.startsWith(defaultCountry)) return digits;
  
    // se o número tem 10 ou 11 dígitos (DDD + número) — falta o código do país
    // 10 = 2 (DDD) + 8 (telefone fixo), 11 = 2 + 9 (celular com 9 dígitos)
    if (digits.length === 8 || digits.length === 9 || digits.length === 10 || digits.length === 11) {
      return defaultCountry + digits;
    }
  
    // se tiver 12+ dígitos e não começar com country, assume que já tem código (padrão)
    return digits;
  }
  