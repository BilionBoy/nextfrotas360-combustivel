import { api } from "@/src/lib/api";
import type { CRequisicaoCombustivel } from "@/src/@types/RequisicaoCombustivel";

export const vouchersApi = {
  find: (codigo: string) =>
    api
      .get<CRequisicaoCombustivel>(
        `/api/v1/requisicoes/find_by_code?codigo=${codigo}`
      )
      .then((res) => res.data!),

  validate: (id: number, quantidade_litros: number, valor_total: number) =>
    api
      .patch<CRequisicaoCombustivel>(
        `/api/v1/requisicoes/${id}/validar_voucher`,
        { quantidade_litros, valor_total }
      )
      .then((res) => res.data!),
};
