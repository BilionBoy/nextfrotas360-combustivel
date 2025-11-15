"use client";

import { useState } from "react";
import { Car, Edit, Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/src/components/ui/dialog";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/src/components/ui/table";

import VeiculoForm from "./VeiculoForm";
import type { GVeiculo, CreateGVeiculoDTO } from "@/src/@types/Veiculo";
import { veiculosApi } from "../api/veiculos";
import { useToast } from "@/src/components/ui/use-toast";

interface VeiculosTableProps {
  veiculos: GVeiculo[];
  onRefetch: () => void;
}

export default function VeiculosTable({
  veiculos,
  onRefetch,
}: VeiculosTableProps) {
  const { toast } = useToast();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedVeiculo, setSelectedVeiculo] = useState<GVeiculo | null>(null);

  // ======================================================================
  // EDITAR (compatível com CreateGVeiculoDTO)
  // ======================================================================
  async function handleEdit(data: CreateGVeiculoDTO) {
    try {
      if (!selectedVeiculo) return;

      await veiculosApi.update(selectedVeiculo.id, data);

      toast({
        title: "Sucesso!",
        description: "Veículo atualizado com sucesso!",
      });

      setIsEditOpen(false);
      onRefetch();
    } catch (err) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o veículo.",
        variant: "destructive",
      });
    }
  }

  // ======================================================================
  // EXCLUIR
  // ======================================================================
  async function handleDelete(id: number) {
    try {
      await veiculosApi.delete(id);

      toast({
        title: "Excluído",
        description: "Veículo removido com sucesso!",
        variant: "success",
      });

      setIsDeleteOpen(false);
      onRefetch();
    } catch (err) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o veículo.",
        variant: "destructive",
      });
    }
  }

  // ======================================================================
  // VIEW
  // ======================================================================
  return (
    <div className="bg-card border border-border rounded-lg shadow-md overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Placa</TableHead>
            <TableHead>Modelo</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Cor</TableHead>
            <TableHead>Ano</TableHead>
            <TableHead>KM</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tipo de Veículo</TableHead>
            <TableHead>Unidade</TableHead>
            <TableHead>Centro de Custo</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {veiculos.map((v) => (
            <TableRow key={v.id}>
              <TableCell className="font-medium flex items-center gap-2">
                <Car className="h-4 w-4 text-primary" />
                {v.placa}
              </TableCell>

              <TableCell>{v.modelo || "-"}</TableCell>
              <TableCell>{v.marca || "-"}</TableCell>
              <TableCell>{v.cor || "-"}</TableCell>
              <TableCell>{v.ano || "-"}</TableCell>
              <TableCell>{v.km_atual || "-"}</TableCell>

              <TableCell>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                  {v.a_status?.descricao || "-"}
                </span>
              </TableCell>

              <TableCell>{v.g_tipo_veiculo?.descricao || "-"}</TableCell>
              <TableCell>{v.a_unidade?.nome_fantasia || "-"}</TableCell>
              <TableCell>{v.g_centro_custo?.nome || "-"}</TableCell>

              <TableCell className="text-right">
                {/* ================= EDITAR ================= */}
                <Dialog
                  open={isEditOpen && selectedVeiculo?.id === v.id}
                  onOpenChange={(open) => {
                    if (!open) setSelectedVeiculo(null);
                    setIsEditOpen(open);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedVeiculo(v);
                        setIsEditOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <VeiculoForm
                      veiculo={selectedVeiculo || undefined}
                      onSave={handleEdit}
                    />
                  </DialogContent>
                </Dialog>

                {/* ================= EXCLUIR ================= */}
                <Dialog
                  open={isDeleteOpen && selectedVeiculo?.id === v.id}
                  onOpenChange={(open) => {
                    if (!open) setSelectedVeiculo(null);
                    setIsDeleteOpen(open);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedVeiculo(v);
                        setIsDeleteOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmar exclusão</DialogTitle>
                      <DialogDescription>
                        Tem certeza que deseja excluir{" "}
                        <strong>{selectedVeiculo?.placa}</strong>? Essa ação não
                        pode ser desfeita.
                      </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="secondary">Cancelar</Button>
                      </DialogClose>

                      <Button
                        variant="destructive"
                        onClick={() =>
                          selectedVeiculo?.id &&
                          handleDelete(selectedVeiculo.id)
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
    </div>
  );
}
