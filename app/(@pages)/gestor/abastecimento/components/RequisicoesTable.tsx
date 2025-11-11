"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
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

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
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
                <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                  {req.o_status?.descricao || "Pendente"}
                </span>
              </td>
              <td className="p-3">
                {new Date(req.data_emissao).toLocaleDateString("pt-BR")}
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
