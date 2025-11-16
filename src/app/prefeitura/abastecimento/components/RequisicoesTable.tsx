"use client";

import { useState, useRef } from "react";
import { Button } from "@/src/components/ui/button";
import { Pencil, Trash2, Eye, Printer, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";

import type { CRequisicaoCombustivel } from "@/src/@types/RequisicaoCombustivel";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Props {
  requisicoes: CRequisicaoCombustivel[];
  onEdit: (req: CRequisicaoCombustivel) => void;
  onDelete: (id: number) => void;
}

export function RequisicoesTable({ requisicoes, onEdit, onDelete }: Props) {
  const [selected, setSelected] = useState<CRequisicaoCombustivel | null>(null);
  const [qrCode, setQrCode] = useState<string>("");
  const [showQrModal, setShowQrModal] = useState(false);

  const printRef = useRef<HTMLDivElement | null>(null);

  async function openQr(req: CRequisicaoCombustivel) {
    setSelected(req);

    const qrValue = req.voucher_codigo ?? `REQ-${req.id}`;

    const qr = await QRCode.toDataURL(qrValue, {
      margin: 2,
      scale: 6,
    });

    setQrCode(qr);
    setShowQrModal(true);
  }

  function handlePrint() {
    if (!printRef.current) return;

    const content = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=800,height=600");

    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Voucher ${selected?.voucher_codigo}</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            img { max-width: 200px; display: block; margin: auto; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }

  async function handleDownloadPDF() {
    if (!printRef.current) return;

    const element = printRef.current;
    const canvas = await html2canvas(element, { scale: 3 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();

    const ratio = canvas.height / canvas.width;
    const height = width * ratio;

    pdf.addImage(imgData, "PNG", 0, 10, width, height);
    pdf.save(`voucher_${selected?.voucher_codigo}.pdf`);
  }

  if (requisicoes.length === 0)
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma requisição encontrada.
      </div>
    );

  return (
    <>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openQr(r)}
                    >
                      <Eye className="h-4 w-4 text-blue-600" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(r)}
                    >
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

      <Dialog open={showQrModal} onOpenChange={setShowQrModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Voucher de Abastecimento</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div
                ref={printRef}
                style={{
                  background: "#fff",
                  color: "#000",
                  padding: "20px",
                  borderRadius: "8px",
                  width: "100%",
                }}
              >
                <img
                  src={qrCode}
                  className="w-48 h-48 border p-2 rounded-lg bg-white"
                />

                <p className="text-lg font-semibold tracking-widest">
                  {selected.voucher_codigo}
                </p>

                <p className="text-sm" style={{ color: "#555" }}>
                  Validade:{" "}
                  {selected.voucher_validade
                    ? new Date(selected.voucher_validade).toLocaleString(
                        "pt-BR"
                      )
                    : "-"}
                </p>

                <div
                  className="w-full text-sm mt-2 border-t pt-3 space-y-1"
                  style={{ borderColor: "#ddd" }}
                >
                  <p>
                    <strong>Veículo:</strong> {selected.g_veiculo?.placa}
                  </p>
                  <p>
                    <strong>Posto:</strong> {selected.c_posto?.nome_fantasia}
                  </p>
                  <p>
                    <strong>Combustível:</strong>{" "}
                    {selected.c_tipo_combustivel?.descricao}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button
                  onClick={handlePrint}
                  className="flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Imprimir
                </Button>

                <Button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
