"use client";

import React, { useEffect, useState } from "react"; // <-- IMPORTANTE

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

import type { GVeiculo, CreateGVeiculoDTO } from "@/@types/Veiculo";
import type { OStatus } from "@/@types/Status";
import type { GTipoVeiculo } from "@/@types/TipoVeiculo";
import type { AUnidade } from "@/@types/Unidade";
import type { GCentroCusto } from "@/@types/CentroCusto";

import { statusApi } from "../api/status";
import { tiposVeiculoApi } from "../api/tiposVeiculo";
import { unidadesApi } from "../api/unidades";
import { centrosCustoApi } from "../api/centrosCusto";

// =========================================================
// INPUT GROUP
// =========================================================

interface InputGroupProps {
  label: string;
  icon?: React.ReactNode; // <--- CORRIGIDO
  value: string;
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
}

function InputGroup({
  label,
  icon,
  value,
  placeholder,
  required = false,
  onChange,
}: InputGroupProps) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs flex items-center gap-1 opacity-70">
        {icon}
        {label}
      </Label>

      <Input
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 text-sm"
      />
    </div>
  );
}

// =========================================================
// SELECT GROUP
// =========================================================

interface SelectGroupProps<T> {
  label: string;
  icon?: React.ReactNode; // <--- CORRIGIDO
  value: string;
  items: T[];
  displayKey: keyof T;
  valueKey: keyof T;
  placeholder?: string;
  onChange: (value: string) => void;
}

function SelectGroup<T extends Record<string, any>>({
  label,
  icon,
  value,
  items,
  displayKey,
  valueKey,
  placeholder,
  onChange,
}: SelectGroupProps<T>) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs flex items-center gap-1 opacity-70">
        {icon}
        {label}
      </Label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 text-sm">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {items.map((item) => (
            <SelectItem
              key={String(item[valueKey])}
              value={String(item[valueKey])}
            >
              {String(item[displayKey])}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// =========================================================
// FORM PRINCIPAL
// =========================================================

interface VeiculoFormProps {
  veiculo?: GVeiculo;
  onSave: (data: CreateGVeiculoDTO) => void;
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

  // =========================================================
  // LOAD OPTIONS
  // =========================================================
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

  // =========================================================
  // HANDLERS
  // =========================================================
  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateGVeiculoDTO = {
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
    };

    onSave(payload);
  };

  // =========================================================
  // VIEW
  // =========================================================
  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">
          {veiculo ? "Editar Veículo" : "Novo Veículo"}
        </DialogTitle>
        <DialogDescription className="text-sm opacity-70">
          Preencha os dados do veículo.
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-4 py-4">
        <InputGroup
          label="Placa"
          placeholder="ABC-1234"
          value={formData.placa}
          onChange={(v) => handleChange("placa", v)}
        />

        <InputGroup
          label="Chassi"
          placeholder="Número do chassi"
          value={formData.chassi}
          onChange={(v) => handleChange("chassi", v)}
        />

        <InputGroup
          label="Renavam"
          placeholder="Renavam"
          value={formData.renavam}
          onChange={(v) => handleChange("renavam", v)}
        />

        <InputGroup
          label="Modelo"
          placeholder="Ex: Ranger"
          required
          value={formData.modelo}
          onChange={(v) => handleChange("modelo", v)}
        />

        <InputGroup
          label="Marca"
          placeholder="Ex: Ford"
          value={formData.marca}
          onChange={(v) => handleChange("marca", v)}
        />

        <InputGroup
          label="Cor"
          placeholder="Ex: Preto"
          value={formData.cor}
          onChange={(v) => handleChange("cor", v)}
        />

        <InputGroup
          label="Ano"
          placeholder="2025"
          value={formData.ano}
          onChange={(v) => handleChange("ano", v)}
        />

        <InputGroup
          label="Km Atual"
          placeholder="Ex: 12.450"
          value={formData.km_atual}
          onChange={(v) => handleChange("km_atual", v)}
        />

        <SelectGroup<OStatus>
          label="Status"
          placeholder="Selecione"
          value={formData.a_status_id}
          items={statusList}
          valueKey="id"
          displayKey="descricao"
          onChange={(v) => handleChange("a_status_id", v)}
        />

        <SelectGroup<GTipoVeiculo>
          label="Tipo de Veículo"
          placeholder="Selecione"
          value={formData.g_tipo_veiculo_id}
          items={tiposVeiculo}
          valueKey="id"
          displayKey="descricao"
          onChange={(v) => handleChange("g_tipo_veiculo_id", v)}
        />

        <SelectGroup<AUnidade>
          label="Unidade"
          placeholder="Selecione"
          value={formData.a_unidade_id}
          items={unidades}
          valueKey="id"
          displayKey="nome_fantasia"
          onChange={(v) => handleChange("a_unidade_id", v)}
        />

        <SelectGroup<GCentroCusto>
          label="Centro de Custo"
          placeholder="Selecione"
          value={formData.g_centro_custo_id}
          items={centros}
          valueKey="id"
          displayKey="nome"
          onChange={(v) => handleChange("g_centro_custo_id", v)}
        />
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
