"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Clock, AlertCircle, Zap, ArrowRight } from "lucide-react"
import { ordensProducaoMockDetalhes } from "@/lib/types/ordem-producao-extended"
import { SETORES } from "@/lib/types/setor-producao"
import Sidebar from "@/components/sidebar"
import { CardOpSetorSimples } from "@/components/setor/card-op-setor-simples"

export default function AltaTensaoPage() {
  const setor = "alta-tensao"
  const setorInfo = SETORES[setor]

  const opsDoSetor = ordensProducaoMockDetalhes.filter((op) => op.etapas[setor])

  const stats = {
    total: opsDoSetor.length,
    concluidas: opsDoSetor.filter((o) => o.etapas[setor].status === "concluida").length,
    emProgresso: opsDoSetor.filter((o) => o.etapas[setor].status === "em-progresso").length,
    naoIniciadas: opsDoSetor.filter((o) => o.etapas[setor].status === "nao-iniciada").length,
    comErro: opsDoSetor.filter((o) => o.etapas[setor].status === "com-erro").length,
  }

  const progressoMedio =
    opsDoSetor.length > 0
      ? Math.round(opsDoSetor.reduce((sum, o) => sum + o.etapas[setor].progresso, 0) / opsDoSetor.length)
      : 0

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-10 p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">{setorInfo.nome}</h1>
            <p className="text-lg text-muted-foreground">{setorInfo.descricao}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.concluidas}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.emProgresso}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Não Iniciadas</CardTitle>
                <ArrowRight className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.naoIniciadas}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Com Erro</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.comErro}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Progresso Geral do Setor</CardTitle>
              <CardDescription>Média de conclusão de todas as OPs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{progressoMedio}%</span>
              </div>
              <Progress value={progressoMedio} className="h-3" />
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Minhas Ordens de Produção</h2>
            {opsDoSetor.length > 0 ? (
              <div className="space-y-3">
                {opsDoSetor.map((op) => (
                  <CardOpSetorSimples key={op.id} op={op} setor={setor} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-lg font-medium">Nenhuma ordem para este setor</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
