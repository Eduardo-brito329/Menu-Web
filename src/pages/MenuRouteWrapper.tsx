// src/pages/MenuRouteWrapper.tsx
import { useParams } from "react-router-dom";
import Menu from "./Menu";

export default function MenuRouteWrapper() {
  const { storeId } = useParams();

  if (!storeId) {
    return <div>Loja não encontrada.</div>;
  }

  // AQUI é onde entra o "return <Menu storeId={storeId} />;"
  // Isso fica NO COMPONENTE WRAPPER, não no App.tsx.
  return <Menu storeId={storeId} />;
}
