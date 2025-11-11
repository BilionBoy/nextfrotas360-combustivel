"use client"

import { useState } from "react"
import { Car, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import type { Veiculo } from "@/@types/Veiculo"
import VeiculoForm from "./VeiculoForm"
import { veiculosApi } from "../api/veiculos"
import { useToast } from "@/hooks/use-toast"

interface VeiculosTableProps {
  veiculos: Veiculo[]
  onRefetch: () => void
}

export default function VeiculosTable({ veiculos, onRefetch }: VeiculosTableProps) {
  const { toast } = useToast()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedVeiculo, setSelectedVeiculo] = useState<Veiculo | null>(null)

  const handleEdit = async (veiculo: Veiculo) => {
    try {
      await veiculosApi.update(veiculo.id, veiculo)
      toast({ title: "Sucesso!", description: "Veículo atualizado com sucesso." })
      setIsEditOpen(false)
      onRefetch()
    } catch (error) {
      toast({ title: "Erro!", description: "Falha ao atualizar veículo.", variant: "destructive" })
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await veiculosApi.delete(id)
      toast({ title: "Sucesso!", description: "Veículo excluído com sucesso.", variant: "destructive" })
      setIsDeleteOpen(false)
      onRefetch()
    } catch (error) {
      toast({ title: "Erro!", description: "Falha ao excluir veículo.", variant: "destructive" })
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Placa</TableHead>
            <TableHead>Modelo</TableHead>
            <TableHead>Combustível</TableHead>
            <TableHead>Ano</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {veiculos.map((veiculo) => (
            <TableRow key={veiculo.id}>
              <TableCell className="font-medium flex items-center gap-2">
                <Car className="h-4 w-4 text-primary" />
                {veiculo.placa}
              </TableCell>
              <TableCell>{veiculo.modelo}</TableCell>
              <TableCell>{veiculo.tipo_combustivel?.descricao || "-"}</TableCell>
              <TableCell>{veiculo.ano}</TableCell>
              <TableCell className="text-right">
                <Dialog
                  open={isEditOpen && selectedVeiculo?.id === veiculo.id}
                  onOpenChange={(open) => {
                    if (!open) setSelectedVeiculo(null)
                    setIsEditOpen(open)
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedVeiculo(veiculo)
                        setIsEditOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <VeiculoForm veiculo={selectedVeiculo || undefined} onSave={handleEdit} />
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={isDeleteOpen && selectedVeiculo?.id === veiculo.id}
                  onOpenChange={(open) => {
                    if (!open) setSelectedVeiculo(null)
                    setIsDeleteOpen(open)
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedVeiculo(veiculo)
                        setIsDeleteOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmar Exclusão</DialogTitle>
                      <DialogDescription>
                        Tem certeza que deseja excluir o veículo &quot;{selectedVeiculo?.placa}&quot;? Esta ação não
                        pode ser desfeita.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="secondary">Cancelar</Button>
                      </DialogClose>
                      <Button
                        variant="destructive"
                        onClick={() => selectedVeiculo?.id && handleDelete(selectedVeiculo.id)}
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
  )
}
