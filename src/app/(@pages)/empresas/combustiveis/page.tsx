"use client";

import { motion } from "framer-motion";
import { PlusCircle, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/src/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useCombustiveis } from "./hooks/useCombustiveis";
import { CombustiveisTable } from "./components/CombustiveisTable";
import { CombustivelForm } from "./components/CombustivelForm";

export default function GestaoCombustiveis() {
  const router = useRouter();
  const {
    combustiveis,
    tiposCombustivel,
    isLoading,
    handleSave,
    handleDelete,
    isAddOpen,
    setIsAddOpen,
  } = useCombustiveis();

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );

  return (
    <div className="min-h-screen bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={() => router.push("/empresas")}>
            Voltar
          </Button>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-5 w-5 mr-2" /> Adicionar Combustível
              </Button>
            </DialogTrigger>
            <DialogContent>
              <CombustivelForm
                tiposCombustivel={tiposCombustivel}
                onSave={handleSave}
                closeDialog={() => setIsAddOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <CombustiveisTable
          combustiveis={combustiveis}
          tiposCombustivel={tiposCombustivel}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      </motion.div>
    </div>
  );
}
