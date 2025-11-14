"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChartIcon, FileDown, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/src/components/ui/card";
import { useToast } from "@/src/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const mockConsumoMensal = [
  { mes: "Jul", litros: 850, gasto: 5200 },
  { mes: "Ago", litros: 920, gasto: 5680 },
  { mes: "Set", litros: 780, gasto: 4850 },
  { mes: "Out", litros: 950, gasto: 5890 },
  { mes: "Nov", litros: 1020, gasto: 6320 },
];

const mockPorVeiculo = [
  { veiculo: "ABC-1234", litros: 1450, gasto: 8970 },
  { veiculo: "DEF-5678", litros: 980, gasto: 6076 },
];

export default function RelatoriosGestor() {
  const { toast } = useToast();
  const router = useRouter();

  const totalLitros = useMemo(
    () => mockPorVeiculo.reduce((acc, item) => acc + item.litros, 0),
    []
  );

  const totalGasto = useMemo(
    () => mockPorVeiculo.reduce((acc, item) => acc + item.gasto, 0),
    []
  );

  const handleExport = (format: string) => {
    toast({
      title: `Exportando Relatório em ${format}`,
      description:
        "Seu relatório está sendo gerado e o download começará em breve.",
    });
  };

  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push("/prefeitura")}>
              Voltar
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Relatórios de Consumo
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport("PDF")}>
              <FileDown className="h-4 w-4 mr-2" /> Exportar PDF
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground mb-8">
          Acompanhe o consumo de combustível e gastos da sua frota.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Total de Litros
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                {totalLitros.toLocaleString("pt-BR")}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Últimos 30 dias
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Total de Gastos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                R${" "}
                {totalGasto.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Últimos 30 dias
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Média por Mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                R${" "}
                {(totalGasto / 5).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Últimos 5 meses
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-card p-6 border border-border rounded-lg shadow-md"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChartIcon className="h-5 w-5" />
              Consumo Mensal
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockConsumoMensal}
                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="litros"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="Litros"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="gasto"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    name="Gasto (R$)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-card p-6 border border-border rounded-lg shadow-md"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChartIcon className="h-5 w-5" />
              Consumo por Veículo
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockPorVeiculo}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="veiculo" type="category" width={80} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="litros"
                    fill="hsl(var(--primary))"
                    name="Litros"
                  />
                  <Bar
                    dataKey="gasto"
                    fill="hsl(var(--chart-3))"
                    name="Gasto (R$)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
