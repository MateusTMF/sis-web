"use client"

import { useRouter } from "next/navigation"
import type { ProjetoTecnico } from "@/lib/types/projeto"
import Sidebar from "@/components/sidebar"
import { Card } from "@/components/ui/card"
import { FormCadastroProjeto } from "@/components/projeto/form-cadastro-projeto"

export default function NovoProjeto() {
  const router = useRouter()

  const handleSalvarProjeto = (projeto: ProjetoTecnico) => {
    const projetoComId = {
      ...projeto,
      id: `proj-${Date.now()}`,
    }
    // Aqui você salvaria no banco de dados
    console.log("Projeto salvo:", projetoComId)
    router.push("/producao/projetos")
  }

  return (
    <div className="min-h-screen bg-background p-12">
      <Sidebar />
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Criar Novo Projeto</h1>
          <p className="text-muted-foreground">Preencha todos os dados técnicos do transformador</p>
        </div>

        <Card className="p-6">
          <FormCadastroProjeto onSalvar={handleSalvarProjeto} />
        </Card>
      </div>
    </div>
  )
}
