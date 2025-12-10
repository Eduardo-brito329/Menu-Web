import { useParams } from "react-router-dom";
import { ProtectedMenuWrapper } from "@/components/ProtectedMenuWrapper";
import Menu from "./Menu";

export default function MenuRouteWrapper() {
  const { storeId } = useParams();

  if (!storeId) {
    return <div>Loja não encontrada.</div>;
  }

  return (
    <ProtectedMenuWrapper storeId={storeId}>
      <Menu />
    </ProtectedMenuWrapper>
  );
}
