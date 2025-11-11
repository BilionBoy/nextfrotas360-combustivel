"use client";

import { motion } from "framer-motion";
import { QrCode, Fuel, Wallet, FileText, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

const modules = [
  {
    title: "Validar Requisição",
    description: "Leia o QR Code ou digite o código para iniciar.",
    icon: QrCode,
    href: "/empresas/validar",
    buttonText: "Iniciar",
  },
  {
    title: "Gestão de Combustíveis",
    description: "Atualize preços e tipos de combustíveis.",
    icon: Fuel,
    href: "/empresas/combustiveis",
    buttonText: "Gerenciar",
  },
  {
    title: "Financeiro",
    description: "Acompanhe seus recebíveis e antecipações.",
    icon: Wallet,
    href: "/empresas/financeiro",
    buttonText: "Ver Extrato",
  },
  {
    title: "Relatórios Operacionais",
    description: "Visualize o volume de vendas e performance.",
    icon: FileText,
    href: "/empresas/relatorios",
    buttonText: "Gerar Relatório",
  },
];

export default function PostoDashboard() {
  const router = useRouter();

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
          <h2 className="text-4xl font-bold text-foreground mb-2">
            Dashboard Posto de Combustível
          </h2>
          <p className="text-lg text-muted-foreground">
            Gerencia abastecimentos, preços e finanças do seu posto.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module, index) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <module.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{module.title}</CardTitle>
                  <CardDescription className="text-sm pt-2">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    onClick={() => router.push(module.href)}
                    className="w-full h-11"
                  >
                    {module.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
