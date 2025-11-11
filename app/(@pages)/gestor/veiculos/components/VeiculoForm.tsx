"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
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
import type { Veiculo } from "@/@types/Veiculo";
import type { CTipoCombustivel } from "@/@types/TipoCombustivel";
import { tiposCombustivelApi } from "../api/tiposCombustivel";

interface VeiculoFormProps {
  veiculo?: Veiculo;
  onSave: (veiculo: Veiculo) => void;
}

export default function VeiculoForm({ veiculo, onSave }: VeiculoFormProps) {
  const [tipos, setTipos] = useState<CTipoCombustivel[]>([]);
  const [formData, setFormData] = useState({
    placa: veiculo?.placa || "",
    modelo: veiculo?.modelo || "",
    tipo_combustivel_id: veiculo?.tipo_combustivel_id?.toString() || "",
    ano: veiculo?.ano?.toString() || "",
  });

  useEffect(() => {
    async function loadTipos() {
      const data = await tiposCombustivelApi.getAll();
      setTipos(data);
    }
    loadTipos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...veiculo,
      ...formData,
      tipo_combustivel_id: Number.parseInt(formData.tipo_combustivel_id),
      ano: Number.parseInt(formData.ano),
    } as Veiculo);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {veiculo ? "Editar Veículo" : "Adicionar Novo Veículo"}
        </DialogTitle>
        <DialogDescription>
          {veiculo
            ? "Atualize os detalhes do veículo."
            : "Preencha os detalhes do novo veículo."}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="placa" className="text-right">
            Placa
          </Label>
          <Input
            id="placa"
            name="placa"
            value={formData.placa}
            onChange={handleChange}
            className="col-span-3"
            placeholder="ABDC-1234"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="modelo" className="text-right">
            Modelo
          </Label>
          <Input
            id="modelo"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="tipo_combustivel_id" className="text-right">
            Combustível
          </Label>
          <Select
            value={formData.tipo_combustivel_id}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, tipo_combustivel_id: value }))
            }
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecione o combustível" />
            </SelectTrigger>
            <SelectContent>
              {tipos.map((tipo) => (
                <SelectItem key={tipo.id} value={tipo.id.toString()}>
                  {tipo.descricao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="ano" className="text-right">
            Ano
          </Label>
          <Input
            id="ano"
            name="ano"
            type="number"
            value={formData.ano}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Cancelar
          </Button>
        </DialogClose>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Salvar
        </Button>
      </DialogFooter>
    </form>
  );
}
