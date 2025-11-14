import { createItem } from "@/src/lib/fetchApi";
import type { CRequisicaoCombustivel } from "@/src/@types/RequisicaoCombustivel";

export const vouchersApi = {
  validate: (codigo: string, c_posto_id?: number) =>
    createItem<CRequisicaoCombustivel>("/api/v1/vouchers/validate", {
      codigo,
      c_posto_id,
    }),
};
