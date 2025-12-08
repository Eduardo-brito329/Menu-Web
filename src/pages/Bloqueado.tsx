export default function Bloqueado() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-3xl font-bold mb-4">Acesso Bloqueado</h1>
        <p className="text-gray-600 mb-6">
          Seu período de teste expirou ou sua assinatura não está ativa.
        </p>
        <a 
          href="/admin/configuracoes"
          className="text-blue-600 underline"
        >
          Gerenciar Assinatura
        </a>
      </div>
    );
  }
  