"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Fuel, PlusCircle, Edit, Trash2, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { combustiveisApi } from "./api/combustiveis";
import { tiposCombustivelApi } from "./api/tiposCombustivel";
import type { CCombustivel } from "@/@types/Combustivel";
import type { CTipoCombustivel } from "@/@types/TipoCombustivel";

interface CombustivelFormProps {
  combustivel?: CCombustivel;
  tiposCombustivel: CTipoCombustivel[];
  onSave: (combustivel: {
    c_tipo_combustivel_id: number;
    preco: number;
    validade: string;
  }) => Promise<void>;
  closeDialog: () => void;
}

function CombustivelForm({
  combustivel,
  tiposCombustivel,
  onSave,
  closeDialog,
}: CombustivelFormProps) {
  const [formData, setFormData] = useState({
    c_tipo_combustivel_id: combustivel?.c_tipo_combustivel_id?.toString() || "",
    preco: combustivel?.preco?.toString() || "",
    validade: combustivel?.validade ? combustivel.validade.split("T")[0] : "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, c_tipo_combustivel_id: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSave({
        c_tipo_combustivel_id: Number.parseInt(formData.c_tipo_combustivel_id),
        preco: Number.parseFloat(formData.preco),
        validade: formData.validade,
      });
      closeDialog();
    } catch (error) {
      console.error("[v0] Error saving combustivel:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {combustivel ? "Editar Combustível" : "Adicionar Novo Combustível"}
        </DialogTitle>
        <DialogDescription>
          {combustivel
            ? "Atualize os detalhes do combustível."
            : "Preencha os detalhes do novo combustível."}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="tipo" className="text-right">
            Tipo
          </Label>
          <Select
            value={formData.c_tipo_combustivel_id}
            onValueChange={handleSelectChange}
            required
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {tiposCombustivel.map((tipo) => (
                <SelectItem key={tipo.id} value={tipo.id.toString()}>
                  {tipo.descricao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="preco" className="text-right">
            Preço (R$)
          </Label>
          <Input
            id="preco"
            name="preco"
            type="number"
            step="0.01"
            value={formData.preco}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="validade" className="text-right">
            Validade
          </Label>
          <Input
            id="validade"
            name="validade"
            type="date"
            value={formData.validade}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="secondary" disabled={isSubmitting}>
            Cancelar
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function GestaoCombustiveis() {
  const { toast } = useToast();
  const router = useRouter();

  const [combustiveis, setCombustiveis] = useState<CCombustivel[]>([]);
  const [tiposCombustivel, setTiposCombustivel] = useState<CTipoCombustivel[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCombustivel, setSelectedCombustivel] =
    useState<CCombustivel | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [combustiveisResponse, tiposResponse] = await Promise.all([
        combustiveisApi.getAll(),
        tiposCombustivelApi.getAll(),
      ]);

      console.log("[v0] Combustiveis loaded:", combustiveisResponse);
      console.log("[v0] Tipos loaded:", tiposResponse);

      setCombustiveis(combustiveisResponse);
      setTiposCombustivel(tiposResponse);
    } catch (error) {
      console.error("[v0] Error loading data:", error);
      toast({
        title: "Erro ao carregar dados",
        description:
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os combustíveis. Verifique a conexão com a API.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (combustivelData: {
    c_tipo_combustivel_id: number;
    preco: number;
    validade: string;
  }) => {
    try {
      if (selectedCombustivel?.id) {
        const response = await combustiveisApi.update(
          selectedCombustivel.id,
          combustivelData
        );

        setCombustiveis((prev) =>
          prev.map((c) => (c.id === selectedCombustivel.id ? response : c))
        );

        toast({
          title: "Sucesso!",
          description: "Combustível atualizado com sucesso.",
        });
      } else {
        const response = await combustiveisApi.create(combustivelData);

        setCombustiveis((prev) => [...prev, response]);

        toast({
          title: "Sucesso!",
          description: "Combustível adicionado com sucesso.",
        });
      }

      setSelectedCombustivel(null);
    } catch (error) {
      console.error("[v0] Error saving combustivel:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o combustível. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await combustiveisApi.delete(id);

      setCombustiveis((prev) => prev.filter((c) => c.id !== id));
      setIsDeleteOpen(false);
      setSelectedCombustivel(null);

      toast({
        title: "Sucesso!",
        description: "Combustível excluído com sucesso.",
      });
    } catch (error) {
      console.error("[v0] Error deleting combustivel:", error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o combustível. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const getTipoNome = (tipoId: number) => {
    const tipo = tiposCombustivel.find((t) => t.id === tipoId);
    return tipo?.descricao || "Desconhecido";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-background p-4 md:p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando combustíveis...</p>
        </div>
      </div>
    );
  }

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
            <Button variant="outline" onClick={() => router.push("/posto")}>
              Voltar
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Gestão de Combustíveis
            </h1>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" /> Adicionar Combustível
              </Button>
            </DialogTrigger>
            <DialogContent>
              <CombustivelForm
                tiposCombustivel={tiposCombustivel}
                onSave={handleSave}
                closeDialog={() => {
                  setIsAddOpen(false);
                  setSelectedCombustivel(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-muted-foreground mb-8">
          Atualize a tabela de preços dos combustíveis disponíveis no seu posto.
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-card border border-border rounded-lg shadow-md overflow-hidden"
        >
          {combustiveis.length === 0 ? (
            <div className="p-8 text-center">
              <Fuel className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Nenhum combustível cadastrado.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Clique em &quot;Adicionar Combustível&quot; para começar.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Combustível</TableHead>
                  <TableHead>Preço (R$)</TableHead>
                  <TableHead>Validade do Preço</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {combustiveis.map((combustivel) => (
                  <TableRow key={combustivel.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <Fuel className="h-4 w-4 text-primary" />
                      {getTipoNome(combustivel.c_tipo_combustivel_id)}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(Number(combustivel?.preco ?? 0))}
                    </TableCell>

                    <TableCell>{formatDate(combustivel.validade)}</TableCell>
                    <TableCell className="text-right">
                      <Dialog
                        open={
                          isEditOpen &&
                          selectedCombustivel?.id === combustivel.id
                        }
                        onOpenChange={(open) => {
                          if (!open) setSelectedCombustivel(null);
                          setIsEditOpen(open);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedCombustivel(combustivel);
                              setIsEditOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <CombustivelForm
                            combustivel={selectedCombustivel || undefined}
                            tiposCombustivel={tiposCombustivel}
                            onSave={handleSave}
                            closeDialog={() => {
                              setIsEditOpen(false);
                              setSelectedCombustivel(null);
                            }}
                          />
                        </DialogContent>
                      </Dialog>

                      <Dialog
                        open={
                          isDeleteOpen &&
                          selectedCombustivel?.id === combustivel.id
                        }
                        onOpenChange={(open) => {
                          if (!open) setSelectedCombustivel(null);
                          setIsDeleteOpen(open);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedCombustivel(combustivel);
                              setIsDeleteOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirmar Exclusão</DialogTitle>
                            <DialogDescription>
                              Tem certeza que deseja excluir o combustível
                              &quot;
                              {getTipoNome(
                                selectedCombustivel?.c_tipo_combustivel_id || 0
                              )}
                              &quot;? Esta ação não pode ser desfeita.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="secondary">Cancelar</Button>
                            </DialogClose>
                            <Button
                              variant="destructive"
                              onClick={() =>
                                selectedCombustivel?.id &&
                                handleDelete(selectedCombustivel.id)
                              }
                            >
                              Excluir
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
