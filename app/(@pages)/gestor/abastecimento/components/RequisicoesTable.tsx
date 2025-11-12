"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CheckCircle, Clock, XCircle } from "lucide-react";
import type { CRequisicaoCombustivel } from "@/@types/RequisicaoCombustivel";

interface RequisicoesTableProps {
  requisicoes: CRequisicaoCombustivel[];
  onEdit: (requisicao: CRequisicaoCombustivel) => void;
  onDelete: (id: number) => void;
}

export function RequisicoesTable({
  requisicoes,
  onEdit,
  onDelete,
}: RequisicoesTableProps) {
  if (requisicoes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma requisição encontrada
      </div>
    );
  }

  const getVoucherStatusBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "validado":
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-green-100 text-green-800 font-medium">
            <CheckCircle className="h-3.5 w-3.5" /> Validado
          </span>
        );
      case "pendente":
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800 font-medium">
            <Clock className="h-3.5 w-3.5" /> Pendente
          </span>
        );
      case "expirado":
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-gray-200 text-gray-700 font-medium">
            <XCircle className="h-3.5 w-3.5" /> Expirado
          </span>
        );
      case "cancelado":
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-red-100 text-red-800 font-medium">
            <XCircle className="h-3.5 w-3.5" /> Cancelado
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 font-medium">
            <Clock className="h-3.5 w-3.5" /> {status || "Desconhecido"}
          </span>
        );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-muted/40">
            <th className="text-left p-3 font-semibold">Veículo</th>
            <th className="text-left p-3 font-semibold">Posto</th>
            <th className="text-left p-3 font-semibold">Combustível</th>
            <th className="text-left p-3 font-semibold">Valor Total</th>
            <th className="text-left p-3 font-semibold">Status</th>
            <th className="text-left p-3 font-semibold">Data</th>
            <th className="text-center p-3 font-semibold">Ações</th>
          </tr>
        </thead>
        <tbody>
          {requisicoes.map((req) => (
            <tr key={req.id} className="border-b hover:bg-muted/50">
              <td className="p-3">{req.g_veiculo?.placa || "-"}</td>
              <td className="p-3">{req.c_posto?.nome_fantasia || "-"}</td>
              <td className="p-3">
                {req.c_tipo_combustivel?.descricao || "-"}
              </td>
              <td className="p-3">{req.valor_total_formatado || "-"}</td>

              <td className="p-3">
                {getVoucherStatusBadge(
                  req.voucher_status || req.o_status?.descricao
                )}
              </td>

              <td className="p-3">
                {req.data_emissao
                  ? new Date(req.data_emissao).toLocaleDateString("pt-BR")
                  : "-"}
              </td>

              <td className="p-3">
                <div className="flex gap-2 justify-center">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(req)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(req.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
