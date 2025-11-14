"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/src/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useToast } from "@/src/components/ui/use-toast";

import { useVeiculos } from "./hooks/useVeiculos";
import { veiculosApi } from "./api/veiculos";

import VeiculosTable from "./components/VeiculosTable";
import VeiculoForm from "./components/VeiculoForm";

import type { GVeiculo } from "@/src/@types/Veiculo";

export default function MeusVeiculosPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { veiculos, loading, refetch } = useVeiculos();

  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleCreate = async (veiculo: GVeiculo) => {
    try {
      await veiculosApi.create(veiculo);

      toast({
        title: "Sucesso!",
        description: "Veículo cadastrado com sucesso.",
      });

      setIsAddOpen(false);
      refetch();
    } catch (error) {
      console.error("[v0] Erro ao criar veículo:", error);
      toast({
        title: "Erro!",
        description: "Não foi possível cadastrar o veículo.",
        variant: "destructive",
      });
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
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push("/prefeitura")}>
              Voltar
            </Button>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Meus Veículos
            </h1>
          </div>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" /> Adicionar Veículo
              </Button>
            </DialogTrigger>

            <DialogContent>
              <VeiculoForm onSave={handleCreate} />
            </DialogContent>
          </Dialog>
        </div>

        <p className="text-muted-foreground mb-8">
          Gerencie os veículos cadastrados na sua frota.
        </p>

        {/* Tabela */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando veículos...
            </div>
          ) : (
            <VeiculosTable veiculos={veiculos} onRefetch={refetch} />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
