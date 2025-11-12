"use client";

import { useEffect, useState } from "react";
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
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import type { GVeiculo } from "@/@types/Veiculo";
import type { OStatus } from "@/@types/Status";
import type { GTipoVeiculo } from "@/@types/TipoVeiculo";
import type { AUnidade } from "@/@types/Unidade";
import type { GCentroCusto } from "@/@types/CentroCusto";

import { statusApi } from "../api/status";
import { tiposVeiculoApi } from "../api/tiposVeiculo";
import { unidadesApi } from "../api/unidades";
import { centrosCustoApi } from "../api/centrosCusto";

interface VeiculoFormProps {
  veiculo?: GVeiculo;
  onSave: (veiculo: GVeiculo) => void;
}

export default function VeiculoForm({ veiculo, onSave }: VeiculoFormProps) {
  const [statusList, setStatusList] = useState<OStatus[]>([]);
  const [tiposVeiculo, setTiposVeiculo] = useState<GTipoVeiculo[]>([]);
  const [unidades, setUnidades] = useState<AUnidade[]>([]);
  const [centros, setCentros] = useState<GCentroCusto[]>([]);

  const [formData, setFormData] = useState({
    placa: veiculo?.placa || "",
    chassi: veiculo?.chassi || "",
    renavam: veiculo?.renavam || "",
    modelo: veiculo?.modelo || "",
    marca: veiculo?.marca || "",
    cor: veiculo?.cor || "",
    ano: veiculo?.ano?.toString() || "",
    km_atual: veiculo?.km_atual || "",

    a_status_id: veiculo?.a_status?.id?.toString() || "",
    g_tipo_veiculo_id: veiculo?.g_tipo_veiculo?.id?.toString() || "",
    a_unidade_id: veiculo?.a_unidade?.id?.toString() || "",
    g_centro_custo_id: veiculo?.g_centro_custo?.id?.toString() || "",
  });

  // -----------------------------
  // LOAD SELECT OPTIONS
  // -----------------------------
  useEffect(() => {
    async function loadFormOptions() {
      const [status, tipos, unid, cent] = await Promise.all([
        statusApi.getAll().catch(() => []),
        tiposVeiculoApi.getAll().catch(() => []),
        unidadesApi.getAll().catch(() => []),
        centrosCustoApi.getAll().catch(() => []),
      ]);

      setStatusList(status);
      setTiposVeiculo(tipos);
      setUnidades(unid);
      setCentros(cent);
    }

    loadFormOptions();
  }, []);

  // -----------------------------
  // HANDLERS
  // -----------------------------
  const handleChange = (name: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      ...veiculo,
      placa: formData.placa,
      chassi: formData.chassi,
      renavam: formData.renavam,
      modelo: formData.modelo,
      marca: formData.marca,
      cor: formData.cor,
      ano: Number(formData.ano),
      km_atual: formData.km_atual,

      a_status_id: Number(formData.a_status_id),
      g_tipo_veiculo_id: Number(formData.g_tipo_veiculo_id),
      a_unidade_id: Number(formData.a_unidade_id),
      g_centro_custo_id: Number(formData.g_centro_custo_id),
    } as GVeiculo);
  };

  // -----------------------------
  // VIEW
  // -----------------------------
  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {veiculo ? "Editar Veículo" : "Adicionar Novo Veículo"}
        </DialogTitle>
        <DialogDescription>
          Preencha os dados do veículo da frota.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        {/* PLACA */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="placa" className="text-right">
            Placa
          </Label>
          <Input
            id="placa"
            className="col-span-3"
            value={formData.placa}
            onChange={(e) => handleChange("placa", e.target.value)}
            required
          />
        </div>

        {/* CHASSI */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="chassi" className="text-right">
            Chassi
          </Label>
          <Input
            id="chassi"
            className="col-span-3"
            value={formData.chassi}
            onChange={(e) => handleChange("chassi", e.target.value)}
          />
        </div>

        {/* RENAVAM */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="renavam" className="text-right">
            Renavam
          </Label>
          <Input
            id="renavam"
            className="col-span-3"
            value={formData.renavam}
            onChange={(e) => handleChange("renavam", e.target.value)}
          />
        </div>

        {/* MODELO */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="modelo" className="text-right">
            Modelo
          </Label>
          <Input
            id="modelo"
            className="col-span-3"
            value={formData.modelo}
            onChange={(e) => handleChange("modelo", e.target.value)}
            required
          />
        </div>

        {/* MARCA */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="marca" className="text-right">
            Marca
          </Label>
          <Input
            id="marca"
            className="col-span-3"
            value={formData.marca}
            onChange={(e) => handleChange("marca", e.target.value)}
          />
        </div>

        {/* COR */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="cor" className="text-right">
            Cor
          </Label>
          <Input
            id="cor"
            className="col-span-3"
            value={formData.cor}
            onChange={(e) => handleChange("cor", e.target.value)}
          />
        </div>

        {/* ANO */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="ano" className="text-right">
            Ano
          </Label>
          <Input
            id="ano"
            type="number"
            className="col-span-3"
            value={formData.ano}
            onChange={(e) => handleChange("ano", e.target.value)}
            required
          />
        </div>

        {/* KM ATUAL */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="km_atual" className="text-right">
            Km Atual
          </Label>
          <Input
            id="km_atual"
            className="col-span-3"
            value={formData.km_atual}
            onChange={(e) => handleChange("km_atual", e.target.value)}
          />
        </div>

        {/* STATUS */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Status</Label>
          <Select
            value={formData.a_status_id}
            onValueChange={(v) => handleChange("a_status_id", v)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {statusList.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>
                  {s.descricao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* TIPO VEÍCULO */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Tipo de Veículo</Label>
          <Select
            value={formData.g_tipo_veiculo_id}
            onValueChange={(v) => handleChange("g_tipo_veiculo_id", v)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {tiposVeiculo.map((t) => (
                <SelectItem key={t.id} value={t.id.toString()}>
                  {t.descricao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* UNIDADE */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Unidade</Label>
          <Select
            value={formData.a_unidade_id}
            onValueChange={(v) => handleChange("a_unidade_id", v)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {unidades.map((u) => (
                <SelectItem key={u.id} value={u.id.toString()}>
                  {u.nome_fantasia}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* CENTRO DE CUSTO */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Centro de Custo</Label>
          <Select
            value={formData.g_centro_custo_id}
            onValueChange={(v) => handleChange("g_centro_custo_id", v)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {centros.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary">Cancelar</Button>
        </DialogClose>

        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Salvar
        </Button>
      </DialogFooter>
    </form>
  );
}
