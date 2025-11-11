"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Landmark, Download, FileText, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const initialTransacoes = [
  {
    id: 1,
    data: "2025-11-06",
    desc: "Abastecimento #12345",
    valor: 695.42,
    status: "Liquidado",
  },
  {
    id: 2,
    data: "2025-11-07",
    desc: "Abastecimento #12346",
    valor: 342.1,
    status: "A receber",
  },
  {
    id: 3,
    data: "2025-11-07",
    desc: "Abastecimento #12347",
    valor: 480.5,
    status: "A receber",
  },
];

interface Transacao {
  id: number;
  data: string;
  desc: string;
  valor: number;
  status: string;
}

export default function Financeiro() {
  const { toast } = useToast();
  const router = useRouter();
  const [transacoes, setTransacoes] = useState<Transacao[]>(initialTransacoes);
  const [isAntecipacaoOpen, setIsAntecipacaoOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [antecipacaoValor, setAntecipacaoValor] = useState(0);

  const saldoAReceber = transacoes
    .filter((t) => t.status === "A receber")
    .reduce((acc, t) => acc + t.valor, 0);

  const totalLiquidado = transacoes
    .filter((t) => t.status === "Liquidado")
    .reduce((acc, t) => acc + t.valor, 0);

  const handleSolicitarAntecipacao = () => {
    if (antecipacaoValor <= 0 || antecipacaoValor > saldoAReceber) {
      toast({
        title: "Valor Inválido",
        description:
          "Por favor, insira um valor maior que zero e menor ou igual ao saldo a receber.",
        variant: "destructive",
      });
      return;
    }

    const novaTransacao: Transacao = {
      id: Date.now(),
      data: new Date().toISOString().split("T")[0],
      desc: `Antecipação #${String(Date.now()).slice(-4)}`,
      valor: -antecipacaoValor,
      status: "Liquidado",
    };

    setTransacoes((prev) => [...prev, novaTransacao]);

    toast({
      title: "Antecipação Solicitada!",
      description: `O valor de R$ ${antecipacaoValor
        .toFixed(2)
        .replace(".", ",")} foi antecipado com sucesso.`,
    });

    setAntecipacaoValor(0);
    setIsAntecipacaoOpen(false);
  };

  const handleExportar = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Exportação Iniciada!",
      description:
        "Seu extrato está sendo gerado e o download começará em breve.",
    });
    setIsExportOpen(false);
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Liquidado":
        return "success";
      case "A receber":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push("//empresas")}>
              Voltar
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Financeiro
            </h1>
          </div>
          <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Exportar Extrato
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleExportar}>
                <DialogHeader>
                  <DialogTitle>Exportar Extrato</DialogTitle>
                  <DialogDescription>
                    Selecione o período e o formato para exportação.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="data-inicio" className="text-right">
                      Data Início
                    </Label>
                    <Input
                      id="data-inicio"
                      type="date"
                      className="col-span-3"
                      defaultValue="2025-10-01"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="data-fim" className="text-right">
                      Data Fim
                    </Label>
                    <Input
                      id="data-fim"
                      type="date"
                      className="col-span-3"
                      defaultValue="2025-11-07"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button type="submit">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-card border border-border rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Saldo a Receber
            </h2>
            <p className="text-5xl font-bold text-primary">
              R$ {saldoAReceber.toFixed(2).replace(".", ",")}
            </p>
            <p className="text-muted-foreground">
              Previsão de liquidação em até 7 dias úteis.
            </p>
            <Dialog
              open={isAntecipacaoOpen}
              onOpenChange={setIsAntecipacaoOpen}
            >
              <DialogTrigger asChild>
                <Button className="mt-4" disabled={saldoAReceber <= 0}>
                  <Landmark className="mr-2 h-4 w-4" /> Solicitar Antecipação
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Solicitar Antecipação de Recebíveis</DialogTitle>
                  <DialogDescription>
                    Digite o valor que deseja antecipar. O valor será creditado
                    após a análise. Taxas podem ser aplicadas.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="valor-antecipar" className="text-right">
                      Valor (R$)
                    </Label>
                    <Input
                      id="valor-antecipar"
                      type="number"
                      step="0.01"
                      value={antecipacaoValor}
                      onChange={(e) =>
                        setAntecipacaoValor(
                          Number.parseFloat(e.target.value) || 0
                        )
                      }
                      className="col-span-3"
                      placeholder={saldoAReceber.toFixed(2)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button onClick={handleSolicitarAntecipacao}>
                    <Save className="mr-2 h-4 w-4" />
                    Confirmar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="bg-card border border-border rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Total Liquidado
            </h2>
            <p
              className={`text-3xl font-bold ${
                totalLiquidado >= 0 ? "text-success" : "text-destructive"
              }`}
            >
              R$ {totalLiquidado.toFixed(2).replace(".", ",")}
            </p>
            <p className="text-muted-foreground">Últimos 30 dias</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-card border border-border rounded-lg shadow-md overflow-hidden"
        >
          <h2 className="text-xl font-semibold text-foreground p-6 flex items-center gap-2">
            <FileText /> Últimas Transações
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor (R$)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transacoes
                .sort(
                  (a, b) =>
                    new Date(b.data).getTime() - new Date(a.data).getTime()
                )
                .map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{formatDate(t.data)}</TableCell>
                    <TableCell className="font-medium">{t.desc}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(t.status) as any}>
                        {t.status}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`text-right font-bold ${
                        t.valor >= 0 ? "text-success" : "text-destructive"
                      }`}
                    >
                      {t.valor.toFixed(2).replace(".", ",")}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </motion.div>
      </motion.div>
    </div>
  );
}
