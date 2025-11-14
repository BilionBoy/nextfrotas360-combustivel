// app/@pages/posto/combustiveis/components/CombustiveisTable.tsx
"use client";

import { Fuel, Edit, Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/src/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/src/components/ui/dialog";
import { motion } from "framer-motion";
import { CombustivelForm } from "./CombustivelForm";
import type { CCombustivel } from "@/src/@types/Combustivel";
import type { CTipoCombustivel } from "@/src/@types/TipoCombustivel";
import { useState } from "react";

interface Props {
  combustiveis: CCombustivel[];
  tiposCombustivel: CTipoCombustivel[];
  onSave: (data: any, id?: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function CombustiveisTable({
  combustiveis,
  tiposCombustivel,
  onSave,
  onDelete,
}: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const getTipoNome = (id: number) =>
    tiposCombustivel.find((t) => t.id === id)?.descricao || "—";

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("pt-BR");

  if (combustiveis.length === 0)
    return (
      <div className="p-8 text-center">
        <Fuel className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Nenhum combustível cadastrado.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Clique em <strong>“Adicionar Combustível”</strong> para começar.
        </p>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden border border-border rounded-lg bg-card shadow-sm"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Preço (R$)</TableHead>
            <TableHead>Validade</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {combustiveis.map((c) => (
            <TableRow
              key={c.id}
              className="hover:bg-muted/50 transition-colors"
            >
              <TableCell className="flex items-center gap-2 font-medium">
                <Fuel className="h-4 w-4 text-primary" />
                {getTipoNome(c.c_tipo_combustivel_id)}
              </TableCell>
              <TableCell>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(c.preco ?? 0))}
              </TableCell>
              <TableCell>{formatDate(c.validade)}</TableCell>
              <TableCell className="text-right flex justify-end gap-2">
                {/* Editar */}
                <Dialog
                  open={isEditOpen && selectedId === c.id}
                  onOpenChange={(open) => {
                    setIsEditOpen(open);
                    if (!open) setSelectedId(null);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedId(c.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <CombustivelForm
                      combustivel={c}
                      tiposCombustivel={tiposCombustivel}
                      onSave={(data) => onSave(data, c.id)}
                      closeDialog={() => setIsEditOpen(false)}
                    />
                  </DialogContent>
                </Dialog>

                {/* Excluir */}
                <Dialog
                  open={isDeleteOpen && selectedId === c.id}
                  onOpenChange={(open) => {
                    setIsDeleteOpen(open);
                    if (!open) setSelectedId(null);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedId(c.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmar exclusão</DialogTitle>
                      <DialogDescription>
                        Deseja realmente excluir{" "}
                        <strong>{getTipoNome(c.c_tipo_combustivel_id)}</strong>?
                        Esta ação não pode ser desfeita.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="secondary">Cancelar</Button>
                      </DialogClose>
                      <Button
                        variant="destructive"
                        onClick={() => c.id && onDelete(c.id)}
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
    </motion.div>
  );
}
