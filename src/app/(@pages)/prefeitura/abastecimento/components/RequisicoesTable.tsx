// src/app/(@pages)/gestor/abastecimento/components/RequisicoesTable.tsx

"use client";

import { Button } from "@/src/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { CRequisicaoCombustivel } from "@/src/@types/RequisicaoCombustivel";

interface Props {
  requisicoes: CRequisicaoCombustivel[];
  onEdit: (req: CRequisicaoCombustivel) => void;
  onDelete: (id: number) => void;
}

export function RequisicoesTable({ requisicoes, onEdit, onDelete }: Props) {
  if (requisicoes.length === 0)
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma requisição encontrada.
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b bg-muted/40">
            <th className="p-3 text-left">Veículo</th>
            <th className="p-3 text-left">Posto</th>
            <th className="p-3 text-left">Combustível</th>
            <th className="p-3 text-left">Valor Total</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Data</th>
            <th className="p-3 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {requisicoes.map((r) => (
            <tr key={r.id} className="border-b hover:bg-muted/50">
              <td className="p-3">{r.g_veiculo?.placa || "-"}</td>
              <td className="p-3">{r.c_posto?.nome_fantasia || "-"}</td>
              <td className="p-3">
                {r.c_tipo_combustivel?.descricao || "-"}
              </td>
              <td className="p-3">{r.valor_total_formatado || "-"}</td>
              <td className="p-3 capitalize">
                {r.voucher_status || r.o_status?.descricao || "-"}
              </td>
              <td className="p-3">
                {r.data_emissao
                  ? new Date(r.data_emissao).toLocaleDateString("pt-BR")
                  : "-"}
              </td>

              <td className="p-3">
                <div className="flex justify-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(r)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(r.id)}
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
