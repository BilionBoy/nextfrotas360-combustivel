"use client";

import { useState, useEffect } from "react";

import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

import type {
  CreateRequisicaoDTO,
  CRequisicaoCombustivel,
} from "@/src/@types/RequisicaoCombustivel";
import type { GVeiculo } from "@/src/@types/Veiculo";
import type { CPosto } from "@/src/@types/Posto";
import type { CTipoCombustivel } from "@/src/@types/TipoCombustivel";

import { veiculosApi } from "../api/veiculos";
import { postosApi } from "../api/postos";
import { tiposCombustivelApi } from "../api/tiposCombustivel";

interface Props {
  initial?: CRequisicaoCombustivel | null;
  onSave: (data: CreateRequisicaoDTO) => void;
}

function RequisicaoForm({ initial, onSave }: Props) {
  const [veiculos, setVeiculos] = useState<GVeiculo[]>([]);
  const [postos, setPostos] = useState<CPosto[]>([]);
  const [tipos, setTipos] = useState<CTipoCombustivel[]>([]);

  const [form, setForm] = useState({
    g_veiculo_id: initial?.g_veiculo?.id?.toString() || "",
    c_posto_id: initial?.c_posto?.id?.toString() || "",
    c_tipo_combustivel_id:
      initial?.c_tipo_combustivel?.id?.toString() || "",
    km_atual: initial?.km_atual?.toString() || "",
    destino: initial?.destino || "",
    quantidade_litros: initial?.quantidade_litros?.toString() || "",
    completar_tanque: initial?.completar_tanque ?? false,
  });

  useEffect(() => {
    async function loadData() {
      const [v, p, t] = await Promise.all([
        veiculosApi.getAll().catch(() => []),
        postosApi.getAll().catch(() => []),
        tiposCombustivelApi.getAll().catch(() => []),
      ]);

      setVeiculos(v);
      setPostos(p);
      setTipos(t);
    }

    loadData();
  }, []);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      g_veiculo_id: Number(form.g_veiculo_id),
      c_posto_id: Number(form.c_posto_id),
      c_tipo_combustivel_id: Number(form.c_tipo_combustivel_id),
      km_atual: form.km_atual ? Number(form.km_atual) : undefined,
      destino: form.destino || undefined,
      quantidade_litros: form.quantidade_litros
        ? Number(form.quantidade_litros)
        : undefined,
      completar_tanque: form.completar_tanque,
    });
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      {/* GRID */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Veículo */}
        <div className="space-y-1">
          <Label>Veículo</Label>
          <Select
            value={form.g_veiculo_id}
            onValueChange={(v) => handleChange("g_veiculo_id", v)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o veículo" />
            </SelectTrigger>
            <SelectContent>
              {veiculos.map((v) => (
                <SelectItem key={v.id} value={v.id.toString()}>
                  {v.placa} — {v.marca} {v.modelo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Posto */}
        <div className="space-y-1">
          <Label>Posto</Label>
          <Select
            value={form.c_posto_id}
            onValueChange={(v) => handleChange("c_posto_id", v)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o posto" />
            </SelectTrigger>
            <SelectContent>
              {postos.map((p) => (
                <SelectItem key={p.id} value={p.id.toString()}>
                  {p.nome_fantasia}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tipo de combustível */}
        <div className="space-y-1">
          <Label>Combustível</Label>
          <Select
            value={form.c_tipo_combustivel_id}
            onValueChange={(v) =>
              handleChange("c_tipo_combustivel_id", v)
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o combustível" />
            </SelectTrigger>
            <SelectContent>
              {tipos.map((t) => (
                <SelectItem key={t.id} value={t.id.toString()}>
                  {t.descricao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* KM Atual */}
        <div className="space-y-1">
          <Label>KM Atual</Label>
          <Input
            value={form.km_atual}
            onChange={(e) => handleChange("km_atual", e.target.value)}
            placeholder="Ex: 12450"
            type="number"
          />
        </div>

        {/* Destino */}
        <div className="col-span-2 space-y-1">
          <Label>Destino</Label>
          <Input
            value={form.destino}
            onChange={(e) => handleChange("destino", e.target.value)}
            placeholder="Ex: Centro da cidade"
          />
        </div>

        {/* Litros */}
        <div className="space-y-1">
          <Label>Litros</Label>
          <Input
            value={form.quantidade_litros}
            onChange={(e) =>
              handleChange("quantidade_litros", e.target.value)
            }
            placeholder="Ex: 30.5"
            type="number"
            disabled={form.completar_tanque}
          />
        </div>

        {/* Completar tanque */}
        <div className="flex items-end gap-2">
          <input
            type="checkbox"
            checked={form.completar_tanque}
            onChange={(e) =>
              handleChange("completar_tanque", e.target.checked)
            }
          />
          <Label>Completar tanque</Label>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Salvar
      </Button>
    </form>
  );
}

export default RequisicaoForm;
