// app/@pages/posto/combustiveis/components/CombustivelForm.tsx
"use client";

import { useState } from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import type { CCombustivel } from "@/@types/Combustivel";
import type { CTipoCombustivel } from "@/@types/TipoCombustivel";

interface CombustivelFormProps {
  combustivel?: CCombustivel;
  tiposCombustivel: CTipoCombustivel[];
  onSave: (data: {
    c_tipo_combustivel_id: number;
    preco: number;
    validade: string;
  }) => Promise<void>;
  closeDialog: () => void;
}

export function CombustivelForm({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSelectChange = (value: string) =>
    setFormData((prev) => ({ ...prev, c_tipo_combustivel_id: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        c_tipo_combustivel_id: Number(formData.c_tipo_combustivel_id),
        preco: Number(formData.preco),
        validade: formData.validade,
      });
      closeDialog();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {combustivel ? "Editar Combustível" : "Novo Combustível"}
        </DialogTitle>
        <DialogDescription>
          {combustivel
            ? "Atualize as informações."
            : "Preencha os dados do combustível."}
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
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Salvar
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
