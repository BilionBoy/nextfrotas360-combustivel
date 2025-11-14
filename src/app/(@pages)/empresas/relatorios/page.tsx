"use client";

import type React from "react";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FileDown, Filter, Fuel, Truck } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useToast } from "@/src/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const rawData = [
  {
    id: 1,
    frotista: "Transportadora Veloz",
    combustivel: "Diesel S10",
    volume: 350,
    data: "2025-11-01",
  },
  {
    id: 2,
    frotista: "Logística Rápida",
    combustivel: "Gasolina Aditivada",
    volume: 120,
    data: "2025-11-02",
  },
  {
    id: 3,
    frotista: "Transportadora Veloz",
    combustivel: "ARLA 32",
    volume: 50,
    data: "2025-11-02",
  },
  {
    id: 4,
    frotista: "Frota Urbana",
    combustivel: "Etanol",
    volume: 200,
    data: "2025-11-03",
  },
  {
    id: 5,
    frotista: "Logística Rápida",
    combustivel: "Diesel S10",
    volume: 400,
    data: "2025-11-04",
  },
  {
    id: 6,
    frotista: "Transportadora Veloz",
    combustivel: "Diesel S10",
    volume: 300,
    data: "2025-11-05",
  },
  {
    id: 7,
    frotista: "Frota Urbana",
    combustivel: "Gasolina Comum",
    volume: 150,
    data: "2025-11-06",
  },
  {
    id: 8,
    frotista: "Cargas Express",
    combustivel: "Diesel S10",
    volume: 500,
    data: "2025-11-07",
  },
];

export default function RelatoriosOperacionais() {
  const { toast } = useToast();
  const router = useRouter();
  const [filters, setFilters] = useState({
    frotista: "",
    combustivel: "",
    dataInicio: "",
    dataFim: "",
  });
  const [filteredData, setFilteredData] = useState(rawData);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    let data = rawData;

    if (filters.frotista) {
      data = data.filter((d) =>
        d.frotista.toLowerCase().includes(filters.frotista.toLowerCase())
      );
    }
    if (filters.combustivel) {
      data = data.filter((d) =>
        d.combustivel.toLowerCase().includes(filters.combustivel.toLowerCase())
      );
    }
    if (filters.dataInicio) {
      data = data.filter(
        (d) => new Date(d.data) >= new Date(filters.dataInicio)
      );
    }
    if (filters.dataFim) {
      data = data.filter((d) => new Date(d.data) <= new Date(filters.dataFim));
    }

    setFilteredData(data);
    toast({
      title: "Filtros Aplicados!",
      description: "Os relatórios foram atualizados com sucesso.",
    });
  };

  const volumePorCombustivel = useMemo(() => {
    const grouped = filteredData.reduce((acc, item) => {
      if (!acc[item.combustivel]) {
        acc[item.combustivel] = 0;
      }
      acc[item.combustivel] += item.volume;
      return acc;
    }, {} as Record<string, number>);
    return Object.keys(grouped).map((key) => ({
      name: key,
      volume: grouped[key],
    }));
  }, [filteredData]);

  const volumePorFrotista = useMemo(() => {
    const grouped = filteredData.reduce((acc, item) => {
      if (!acc[item.frotista]) {
        acc[item.frotista] = 0;
      }
      acc[item.frotista] += item.volume;
      return acc;
    }, {} as Record<string, number>);
    return Object.keys(grouped)
      .map((key) => ({ name: key, volume: grouped[key] }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5);
  }, [filteredData]);

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
            <Button variant="outline" onClick={() => router.push("/empresas")}>
              Voltar
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Relatórios Operacionais
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport("PDF")}>
              <FileDown className="h-4 w-4 mr-2" /> Exportar PDF
            </Button>
            <Button variant="outline" onClick={() => handleExport("Excel")}>
              <FileDown className="h-4 w-4 mr-2" /> Exportar Excel
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground mb-8">
          Acompanhe o volume de vendas e a performance do seu posto.
        </p>

        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Filter /> Filtros
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              name="frotista"
              value={filters.frotista}
              onChange={handleFilterChange}
              type="text"
              placeholder="Filtrar por frotista..."
            />
            <Input
              name="combustivel"
              value={filters.combustivel}
              onChange={handleFilterChange}
              type="text"
              placeholder="Filtrar por combustível..."
            />
            <Input
              name="dataInicio"
              value={filters.dataInicio}
              onChange={handleFilterChange}
              type="date"
            />
            <Input
              name="dataFim"
              value={filters.dataFim}
              onChange={handleFilterChange}
              type="date"
            />
          </div>
          <Button className="mt-4" onClick={applyFilters}>
            Aplicar Filtros
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div className="bg-card p-6 border border-border rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Fuel /> Volume por Combustível (Litros)
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={volumePorCombustivel}
                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip cursor={{ fill: "rgba(13, 148, 136, 0.1)" }} />
                  <Legend />
                  <Bar
                    dataKey="volume"
                    fill="hsl(var(--primary))"
                    name="Volume (L)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          <motion.div className="bg-card p-6 border border-border rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Truck /> Top 5 Frotistas (Volume)
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={volumePorFrotista}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip cursor={{ fill: "rgba(13, 148, 136, 0.1)" }} />
                  <Legend />
                  <Bar
                    dataKey="volume"
                    fill="hsl(var(--secondary))"
                    name="Volume (L)"
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
