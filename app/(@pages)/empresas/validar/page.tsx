"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { QrCode, ScanLine, CheckCircle, Fuel, Droplet, Milestone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { jsPDF } from "jspdf"

const mockPrecosCombustiveis = [
  { tipo: "Gasolina Comum", preco: 5.89 },
  { tipo: "Gasolina Aditivada", preco: 6.05 },
  { tipo: "Etanol", preco: 3.99 },
  { tipo: "Diesel S10", preco: 6.2 },
  { tipo: "ARLA 32", preco: 4.5 },
]

export default function ValidarRequisicao() {
  const { toast } = useToast()
  const router = useRouter()
  const [codigo, setCodigo] = useState("")
  const [isValidated, setIsValidated] = useState(false)
  const [validatedReq, setValidatedReq] = useState<any>(null)

  const generatePDF = (req: any) => {
    const doc = new jsPDF()
    const now = new Date()

    doc.setFontSize(22)
    doc.setFont("helvetica", "bold")
    doc.text("NEXTFUEL360", doc.internal.pageSize.getWidth() / 2, 20, {
      align: "center",
    })

    doc.setFontSize(18)
    doc.setFont("helvetica", "normal")
    doc.text("Comprovante de Abastecimento", doc.internal.pageSize.getWidth() / 2, 30, {
      align: "center",
    })

    doc.line(20, 35, doc.internal.pageSize.getWidth() - 20, 35)

    doc.setFontSize(12)
    const startY = 50
    const lineHeight = 10

    doc.setFont("helvetica", "bold")
    doc.text("Código da Requisição:", 20, startY)
    doc.setFont("helvetica", "normal")
    doc.text(req.code, 80, startY)

    doc.setFont("helvetica", "bold")
    doc.text("Data e Hora:", 20, startY + lineHeight)
    doc.setFont("helvetica", "normal")
    doc.text(now.toLocaleString("pt-BR"), 80, startY + lineHeight)

    doc.setFont("helvetica", "bold")
    doc.text("Veículo:", 20, startY + lineHeight * 2)
    doc.setFont("helvetica", "normal")
    doc.text(req.veiculo_id, 80, startY + lineHeight * 2)

    doc.setFont("helvetica", "bold")
    doc.text("Posto:", 20, startY + lineHeight * 3)
    doc.setFont("helvetica", "normal")
    doc.text(req.posto_id, 80, startY + lineHeight * 3)

    doc.setFont("helvetica", "bold")
    doc.text("Combustível:", 20, startY + lineHeight * 4)
    doc.setFont("helvetica", "normal")
    doc.text(req.combustivel, 80, startY + lineHeight * 4)

    const limiteDescricao =
      typeof req.limite_valor === "number" ? `R$ ${req.limite_valor.toFixed(2)}` : "Completar o tanque"

    doc.setFont("helvetica", "bold")
    doc.text("Limite Autorizado:", 20, startY + lineHeight * 5)
    doc.setFont("helvetica", "normal")
    doc.text(limiteDescricao, 80, startY + lineHeight * 5)

    doc.setFont("helvetica", "bold")
    doc.text("Status:", 20, startY + lineHeight * 6)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(34, 139, 34)
    doc.text("VALIDADO E CONCLUÍDO", 80, startY + lineHeight * 6)
    doc.setTextColor(0, 0, 0)

    doc.line(
      20,
      doc.internal.pageSize.getHeight() - 40,
      doc.internal.pageSize.getWidth() - 20,
      doc.internal.pageSize.getHeight() - 40,
    )
    doc.setFontSize(10)
    doc.text("Assinatura do Frentista", doc.internal.pageSize.getWidth() / 4, doc.internal.pageSize.getHeight() - 30, {
      align: "center",
    })
    doc.text(
      "Assinatura do Motorista",
      (doc.internal.pageSize.getWidth() / 4) * 3,
      doc.internal.pageSize.getHeight() - 30,
      { align: "center" },
    )

    doc.save(`comprovante-${req.code}.pdf`)
  }

  const handleValidation = () => {
    const requisicoes = JSON.parse(
      typeof window !== "undefined" ? localStorage.getItem("requisicoes_nextfuel") || "[]" : "[]",
    )
    const reqEncontrada = requisicoes.find((r: any) => r.code === codigo && r.status === "PENDENTE")

    if (reqEncontrada) {
      const expira = new Date(reqEncontrada.expira_em)
      if (expira < new Date()) {
        toast({
          title: "Requisição Expirada!",
          description: "Este código não é mais válido.",
          variant: "destructive",
        })
        return
      }

      const combustivelData = mockPrecosCombustiveis.find((c) => c.tipo === reqEncontrada.combustivel)

      let litros = null
      if (combustivelData && typeof reqEncontrada.limite_valor === "number") {
        litros = (reqEncontrada.limite_valor / combustivelData.preco).toFixed(3)
      }

      setValidatedReq({
        ...reqEncontrada,
        precoLitro: combustivelData?.preco,
        litros: litros,
      })
      setIsValidated(true)
    } else {
      toast({
        title: "Requisição Inválida!",
        description: "Código não encontrado, já utilizado ou incorreto. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const confirmAndFinalize = () => {
    const requisicoes = JSON.parse(
      typeof window !== "undefined" ? localStorage.getItem("requisicoes_nextfuel") || "[]" : "[]",
    )
    const requisicoesAtualizadas = requisicoes.map((r: any) =>
      r.code === validatedReq.code ? { ...r, status: "CONCLUIDO" } : r,
    )
    localStorage.setItem("requisicoes_nextfuel", JSON.stringify(requisicoesAtualizadas))

    toast({
      title: "Requisição Concluída!",
      description: "O download do comprovante em PDF começará em breve.",
    })

    generatePDF(validatedReq)
    setIsValidated(false)
    setValidatedReq(null)
    setCodigo("")
  }

  const handleScan = () => {
    toast({
      title: "Leitor de QR Code",
      description: "Funcionalidade de câmera não implementada. Por favor, insira o código manualmente.",
    })
  }

  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="absolute top-4 left-4">
          <Button variant="outline" onClick={() => router.push("/empresas")}>
            Voltar
          </Button>
        </div>
        <div className="bg-card border border-border rounded-lg shadow-xl p-6 md:p-10 text-center">
          <QrCode className="h-20 w-20 text-primary mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Validar Requisição</h1>
          <p className="text-muted-foreground mb-8">
            Insira o código numérico ou escaneie o QR Code para autorizar o abastecimento.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <Input
              placeholder="Insira o código aqui... (ex: A7F9-29QK-4C1M)"
              className="text-center sm:text-left h-12 text-lg flex-grow"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            />
            <Button onClick={handleValidation} className="h-12 text-lg">
              <CheckCircle className="mr-2 h-5 w-5" /> Validar
            </Button>
          </div>

          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-muted-foreground">OU</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <Button variant="secondary" onClick={handleScan} className="w-full h-16 text-lg">
            <ScanLine className="mr-3 h-7 w-7" /> Escanear QR Code
          </Button>
        </div>
      </motion.div>

      <Dialog open={isValidated} onOpenChange={() => setIsValidated(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <CheckCircle className="h-8 w-8 text-green-500" />
              Requisição Válida!
            </DialogTitle>
            <DialogDescription>Confira os detalhes abaixo e confirme para finalizar o abastecimento.</DialogDescription>
          </DialogHeader>
          {validatedReq && (
            <div className="my-4 space-y-4">
              <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Fuel /> Combustível
                </span>
                <span className="font-bold text-lg">{validatedReq.combustivel}</span>
              </div>
              {validatedReq.limite_valor === "COMPLETAR" ? (
                <div className="flex justify-center items-center bg-blue-100 dark:bg-blue-900/50 p-4 rounded-lg">
                  <span className="font-bold text-xl text-blue-600 dark:text-blue-300">COMPLETAR O TANQUE</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg">
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Milestone /> Limite
                    </span>
                    <span className="font-bold text-lg text-green-600">R$ {validatedReq.limite_valor.toFixed(2)}</span>
                  </div>
                  {validatedReq.precoLitro && (
                    <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg">
                      <span className="text-sm font-medium text-muted-foreground">Preço / Litro</span>
                      <span className="font-semibold text-md">R$ {validatedReq.precoLitro.toFixed(2)}</span>
                    </div>
                  )}
                  {validatedReq.litros && (
                    <div className="flex justify-between items-center bg-primary/10 p-4 rounded-lg border border-primary/50">
                      <span className="text-md font-bold text-primary flex items-center gap-2">
                        <Droplet /> Abastecer
                      </span>
                      <span className="font-extrabold text-2xl text-primary">{validatedReq.litros} Litros</span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsValidated(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmAndFinalize}>Confirmar e Gerar PDF</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
