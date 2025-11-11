"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Fuel } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Mock authentication logic
    if (email.includes("posto") || email === "posto@nextfuel.com") {
      router.push("/posto")
    } else if (email.includes("gestor") || email === "gestor@nextfuel.com") {
      router.push("/gestor")
    } else if (email.includes("admin") || email === "admin@nextfuel.com") {
      router.push("/admin")
    } else {
      toast({
        title: "Erro ao fazer login",
        description: "Email ou senha incorretos.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-2">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center">
                <Fuel className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">NEXTFUEL360</CardTitle>
              <CardDescription className="text-base mt-2">Sistema de Gestão de Combustível</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full h-11 text-base">
                Entrar
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Contas de teste:</p>
              <p className="mt-1">posto@nextfuel.com | gestor@nextfuel.com | admin@nextfuel.com</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
