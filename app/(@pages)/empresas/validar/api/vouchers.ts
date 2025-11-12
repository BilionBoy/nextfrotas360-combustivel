import { createItem } from "@/lib/fetchApi";
import type { CRequisicaoCombustivel } from "@/@types/RequisicaoCombustivel";

export const vouchersApi = {
  validate: (codigo: string, c_posto_id?: number) =>
    createItem<CRequisicaoCombustivel>("/api/v1/vouchers/validate", {
      codigo,
      c_posto_id,
    }),
};
