"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DollarSign, TrendingUp, CreditCard, Users, Building2, Truck, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const mockTransacoesData = [
  { mes: "Jul", valor: 45000 },
  { mes: "Ago", valor: 52000 },
  { mes: "Set", valor: 48000 },
  { mes: "Out", valor: 61000 },
  { mes: "Nov", valor: 68000 },
]

const mockRentabilidadeData = [
  { mes: "Jul", rentabilidade: 4500 },
  { mes: "Ago", rentabilidade: 5200 },
  { mes: "Set", rentabilidade: 4800 },
  { mes: "Out", rentabilidade: 6100 },
  { mes: "Nov", rentabilidade: 6800 },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("visao-geral")

  return (
    <div className="min-h-screen w-full bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">NEXTFUEL360</h1>
          <Button variant="ghost" onClick={() => router.push("/")}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold text-foreground mb-2">Dashboard Super Admin</h2>
          <p className="text-lg text-muted-foreground">
            Visão completa da plataforma, métricas financeiras e gerenciamento.
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            <TabsTrigger value="postos">Postos</TabsTrigger>
            <TabsTrigger value="frotistas">Frotistas</TabsTrigger>
          </TabsList>

          <TabsContent value="visao-geral" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Valor Transacionado</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ 274.000,00</div>
                    <p className="text-xs text-muted-foreground mt-1">+12.5% em relação ao mês anterior</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Rentabilidade</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ 27.400,00</div>
                    <p className="text-xs text-muted-foreground mt-1">10% de comissão média</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Pagamentos Pendentes</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ 45.200,00</div>
                    <p className="text-xs text-muted-foreground mt-1">15 transações a liquidar</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">342</div>
                    <p className="text-xs text-muted-foreground mt-1">+24 novos este mês</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Evolução de Transações</CardTitle>
                    <CardDescription>Valor transacionado nos últimos 5 meses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockTransacoesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="mes" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="valor"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            name="Valor (R$)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Rentabilidade Mensal</CardTitle>
                    <CardDescription>Comissões geradas pela plataforma</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mockRentabilidadeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="mes" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="rentabilidade" fill="hsl(var(--chart-2))" name="Rentabilidade (R$)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="usuarios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Gerenciamento de Usuários
                </CardTitle>
                <CardDescription>Visualize e gerencie todos os usuários da plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Módulo de gerenciamento de usuários</p>
                    <p className="text-sm mt-2">Em desenvolvimento</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="postos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-6 w-6" />
                  Gerenciamento de Postos
                </CardTitle>
                <CardDescription>Visualize e gerencie todos os postos de combustível</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Módulo de gerenciamento de postos</p>
                    <p className="text-sm mt-2">Em desenvolvimento</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="frotistas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-6 w-6" />
                  Gerenciamento de Frotistas
                </CardTitle>
                <CardDescription>Visualize e gerencie todos os gestores de frota</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Módulo de gerenciamento de frotistas</p>
                    <p className="text-sm mt-2">Em desenvolvimento</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Regras Financeiras
              </CardTitle>
              <CardDescription>Configure taxas e comissões da plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Gerenciar Regras</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Pagamentos
              </CardTitle>
              <CardDescription>Gerencie pagamentos e antecipações</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-transparent" variant="outline">
                Gerenciar Pagamentos
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
