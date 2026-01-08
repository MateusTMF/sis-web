"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileText,
  Truck,
  DollarSign,
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowLeft,
  Package,
} from "lucide-react"
import { unificarDocumentos } from "@/lib/mock/notas-fiscais"
import { formatarMoeda } from "@/lib/utils/formatters"
import { useRouter } from "next/navigation"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

export default function DashboardFiscalPage() {
  const router = useRouter()
  const todosDocumentos = useMemo(() => unificarDocumentos(), [])

  // Estatísticas detalhadas
  const estatisticas = useMemo(() => {
    const hoje = new Date()
    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)

    const nfes = todosDocumentos.filter((d) => d.tipo === "nfe")
    const ctes = todosDocumentos.filter((d) => d.tipo === "cte")

    const nfesMes = nfes.filter((d) => {
      const data = new Date(d.dataEmissao)
      return data >= primeiroDiaMes && data <= ultimoDiaMes
    })

    const ctesMes = ctes.filter((d) => {
      const data = new Date(d.dataEmissao)
      return data >= primeiroDiaMes && data <= ultimoDiaMes
    })

    return {
      totalDocumentos: todosDocumentos.length,
      totalNFes: nfes.length,
      totalCTes: ctes.length,
      valorTotalNFes: nfes.reduce((acc, d) => acc + d.valorTotal, 0),
      valorTotalCTes: ctes.reduce((acc, d) => acc + d.valorTotal, 0),
      valorTotal: todosDocumentos.reduce((acc, d) => acc + d.valorTotal, 0),
      pendentesContabilizacao: todosDocumentos.filter((d) => !d.contabilizado).length,
      pendentesEstoque: nfes.filter((d) => !d.estoqueLancado).length,
      pendentesContas: todosDocumentos.filter((d) => !d.contasLancadas).length,
      nfesMes: nfesMes.length,
      ctesMes: ctesMes.length,
      valorNFesMes: nfesMes.reduce((acc, d) => acc + d.valorTotal, 0),
      valorCTesMes: ctesMes.reduce((acc, d) => acc + d.valorTotal, 0),
      documentosAtivos: todosDocumentos.filter((d) => d.status === "ativa" || d.status === "ativo").length,
      documentosCancelados: todosDocumentos.filter((d) => d.status === "cancelada" || d.status === "cancelado").length,
    }
  }, [todosDocumentos])

  // Dados para gráficos
  const dadosGraficoBarra = [
    { nome: "NFe", quantidade: estatisticas.totalNFes, valor: estatisticas.valorTotalNFes },
    { nome: "CTe", quantidade: estatisticas.totalCTes, valor: estatisticas.valorTotalCTes },
  ]

  const dadosGraficoPizza = [
    { name: "Contabilizados", value: todosDocumentos.length - estatisticas.pendentesContabilizacao },
    { name: "Pendentes Contab.", value: estatisticas.pendentesContabilizacao },
  ]

  const COLORS = ["#10b981", "#f59e0b"]

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => router.push("/compras/nfe-entrada/notas")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Fiscal</h1>
                <p className="text-muted-foreground">Visão geral e estatísticas do sistema fiscal</p>
              </div>
            </div>
          </div>
          <Button onClick={() => router.push("/compras/nfe-entrada/notas")} variant="outline">
            Ver Todas as Notas
          </Button>
        </div>

        {/* Cards principais de resumo */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Docs</p>
                  <p className="text-2xl font-bold">{estatisticas.totalDocumentos}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-xs text-muted-foreground">NF-e</p>
                  <p className="text-2xl font-bold">{estatisticas.totalNFes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-xs text-muted-foreground">CT-e</p>
                  <p className="text-2xl font-bold">{estatisticas.totalCTes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Valor Total</p>
                  <p className="text-lg font-bold">{formatarMoeda(estatisticas.valorTotal)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Ativos</p>
                  <p className="text-2xl font-bold">{estatisticas.documentosAtivos}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Cancelados</p>
                  <p className="text-2xl font-bold">{estatisticas.documentosCancelados}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas do mês */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                NFe este Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estatisticas.nfesMes}</div>
              <p className="text-xs text-muted-foreground mt-1">{formatarMoeda(estatisticas.valorNFesMes)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                CTe este Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estatisticas.ctesMes}</div>
              <p className="text-xs text-muted-foreground mt-1">{formatarMoeda(estatisticas.valorCTesMes)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                Pend. Contabilização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{estatisticas.pendentesContabilizacao}</div>
              <p className="text-xs text-muted-foreground mt-1">Documentos aguardando</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="h-4 w-4 text-amber-500" />
                Pend. Estoque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{estatisticas.pendentesEstoque}</div>
              <p className="text-xs text-muted-foreground mt-1">NFe sem lançamento</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentos por Tipo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosGraficoBarra}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: any, name: string) => {
                      if (name === "valor") return formatarMoeda(value)
                      return value
                    }}
                  />
                  <Legend />
                  <Bar dataKey="quantidade" fill="#3b82f6" name="Quantidade" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status de Contabilização</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dadosGraficoPizza}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dadosGraficoPizza.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Cards de ação rápida */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-amber-500 border-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Pendências Críticas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Contabilização</span>
                <span className="font-bold text-amber-500">{estatisticas.pendentesContabilizacao}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Estoque</span>
                <span className="font-bold text-amber-500">{estatisticas.pendentesEstoque}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Contas a Pagar</span>
                <span className="font-bold text-amber-500">{estatisticas.pendentesContas}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Valores NFe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Geral</span>
                <span className="font-bold">{formatarMoeda(estatisticas.valorTotalNFes)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Este Mês</span>
                <span className="font-bold text-green-600">{formatarMoeda(estatisticas.valorNFesMes)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Quantidade</span>
                <span className="font-bold">{estatisticas.totalNFes}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="h-5 w-5 text-orange-600" />
                Valores CTe (Frete)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Geral</span>
                <span className="font-bold">{formatarMoeda(estatisticas.valorTotalCTes)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Este Mês</span>
                <span className="font-bold text-orange-600">{formatarMoeda(estatisticas.valorCTesMes)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Quantidade</span>
                <span className="font-bold">{estatisticas.totalCTes}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
