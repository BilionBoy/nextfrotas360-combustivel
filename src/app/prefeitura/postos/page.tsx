"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Search, Fuel } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { useRouter } from "next/navigation";
import { postosApi } from "./api/postos";
import type { CPosto } from "@/src/@types/Posto";
import { useToast } from "@/src/components/ui/use-toast";

export default function PostosPrecos() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [postos, setPostos] = useState<CPosto[]>([]);
  const [filteredPostos, setFilteredPostos] = useState<CPosto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPostos();
  }, []);

  async function loadPostos() {
    try {
      setLoading(true);
      const data = await postosApi.getAll();
      console.log("[v0] Postos carregados da API:", data);
      setPostos(data);
      setFilteredPostos(data);
    } catch (error) {
      console.error("[v0] Erro ao carregar postos:", error);
      toast({
        title: "Erro ao carregar postos",
        description: "Não foi possível carregar a lista de postos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setFilteredPostos(postos);
    } else {
      const filtered = postos.filter(
        (posto) =>
          posto.nome_fantasia
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          posto.endereco?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPostos(filtered);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8">
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
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Postos e Preços
          </h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Pesquise e compare preços de combustíveis nos postos próximos.
        </p>

        <div className="flex gap-2 mb-8">
          <Input
            placeholder="Buscar por nome ou endereço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-grow"
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Carregando postos...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPostos.map((posto, index) => (
              <motion.div
                key={posto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          {posto.nome_fantasia}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {posto.endereco || "Endereço não informado"}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        <p>
                          <strong>CNPJ:</strong> {posto.cnpj}
                        </p>
                        {posto.telefone && (
                          <p>
                            <strong>Telefone:</strong> {posto.telefone}
                          </p>
                        )}
                        {posto.email && (
                          <p>
                            <strong>Email:</strong> {posto.email}
                          </p>
                        )}
                      </div>
                      {posto.combustiveis && posto.combustiveis.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <Fuel className="h-4 w-4" />
                            Combustíveis Disponíveis
                          </h4>
                          {posto.combustiveis.map((combustivel) => (
                            <div
                              key={combustivel.id}
                              className="flex justify-between items-center p-2 bg-muted/50 rounded-md mb-2"
                            >
                              <span className="text-sm font-medium">
                                {combustivel.tipo_combustivel?.descricao ||
                                  "N/A"}
                              </span>
                              <span className="text-lg font-bold text-primary">
                                R$ {combustivel.preco.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredPostos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Nenhum posto encontrado com os critérios de busca.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
