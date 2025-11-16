"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, Search, Fuel, Star } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { useRouter } from "next/navigation";
import { combustiveisApi } from "./api/combustiveis";
import type { CCombustivel } from "@/src/@types/Combustivel";
import { useToast } from "@/src/components/ui/use-toast";

export default function PostosPrecos() {
  const router = useRouter();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [postos, setPostos] = useState<any[]>([]);
  const [filteredPostos, setFilteredPostos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const data = await combustiveisApi.getAll();

      // 🔥 AGRUPAR POR EMPRESA
      const grupos: Record<number, any> = {};

      data.forEach((c: CCombustivel) => {
        const empresa = c.f_empresa_fornecedora;
        if (!empresa) return;

        if (!grupos[empresa.id]) {
          grupos[empresa.id] = {
            empresa,
            combustiveis: [],
          };
        }

        grupos[empresa.id].combustiveis.push(c);
      });

      // converter para array
      const postosArray = Object.values(grupos);

      setPostos(postosArray);
      setFilteredPostos(postosArray);
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os postos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = () => {
    const term = searchTerm.toLowerCase();

    if (!term.trim()) return setFilteredPostos(postos);

    setFilteredPostos(
      postos.filter(
        (item) =>
          item.empresa.nome_fantasia.toLowerCase().includes(term) ||
          (item.empresa.endereco?.toLowerCase() ?? "").includes(term)
      )
    );
  };

  // 📌 encontrar o menor preço GERAL
  const cheapestPrice = useMemo(() => {
    const prices: number[] = [];

    postos.forEach((p) => {
      p.combustiveis.forEach((c: CCombustivel) => prices.push(Number(c.preco)));
    });

    return prices.length > 0 ? Math.min(...prices) : Infinity;
  }, [postos]);

  return (
    <div className="min-h-screen w-full bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => router.push("/prefeitura")}>
            Voltar
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold">Postos e Preços</h1>
        </div>

        <p className="text-muted-foreground mb-8">
          Encontre os melhores preços de combustível nos postos habilitados.
        </p>

        <div className="flex gap-2 mb-10">
          <Input
            placeholder="Pesquisar por nome, endereço ou bandeira..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-1" /> Pesquisar
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground text-lg">
            Carregando postos...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPostos.map((item: any, index) => {
              const empresa = item.empresa;
              const combustiveis = item.combustiveis;

              const menor = combustiveis.reduce((a: any, b: any) =>
                Number(a.preco) < Number(b.preco) ? a : b
              );

              const isCheapest = Number(menor.preco) === cheapestPrice;

              return (
                <motion.div
                  key={empresa.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Card
                    className={`h-full relative p-2 ${
                      isCheapest ? "border-2 border-green-500" : ""
                    }`}
                  >
                    {isCheapest && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                        <Star className="h-4 w-4" />
                      </div>
                    )}

                    <CardHeader>
                      <CardTitle className="text-xl">
                        {empresa.nome_fantasia}
                      </CardTitle>

                      <p className="text-sm text-muted-foreground -mt-1">
                        {empresa.cnjp}
                      </p>

                      <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4" />
                        {empresa.endereco}
                      </p>
                    </CardHeader>

                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {menor.c_tipo_combustivel?.descricao ??
                          "Tipo não informado"}
                      </p>

                      <p className="text-4xl font-bold text-green-600 my-3">
                        R$ {Number(menor.preco).toFixed(2)}
                      </p>

                      <Button className="w-full mt-2">Selecionar Posto</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
