"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Download, ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { ordensProducaoMockDetalhes } from "@/lib/types/ordem-producao-extended"
import Sidebar from "@/components/sidebar"

export default function DetalheOrdemPage({ params }: { params: { id: string } }) {
  const ordem = ordensProducaoMockDetalhes[0] // Mock - substituir com busca real

  if (!ordem) {
    return (
      <div className="min-h-screen bg-background p-12">
        <Sidebar />
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Ordem não encontrada</h1>
            </div>
            <Link href="/producao/ordens-producao">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "em-producao":
        return "bg-blue-500"
      case "aguardando":
        return "bg-yellow-500"
      case "concluida":
        return "bg-green-500"
      case "pausada":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "em-producao":
        return "Em Produção"
      case "aguardando":
        return "Aguardando"
      case "concluida":
        return "Concluída"
      case "pausada":
        return "Pausada"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-background p-12">
      <Sidebar />
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">OP: {ordem.numeroOP}</h1>
              <Badge className={getStatusColor(ordem.status)}>{getStatusText(ordem.status)}</Badge>
              <Badge variant="outline">{ordem.prioridade.toUpperCase()}</Badge>
            </div>
            <p className="text-muted-foreground">
              {ordem.projeto.tipoTransformador} - {ordem.projeto.potencia} kVA
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/producao/ordens-producao/${ordem.id}/editar`}>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </Link>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Link href="/producao/ordens-producao">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="resumo" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="resumo">Resumo</TabsTrigger>
            <TabsTrigger value="projeto">Projeto</TabsTrigger>
            <TabsTrigger value="progresso">Progresso</TabsTrigger>
            <TabsTrigger value="anotacoes">Anotações</TabsTrigger>
          </TabsList>

          {/* Resumo */}
          <TabsContent value="resumo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Ordem</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Número OP</p>
                  <p className="font-semibold">{ordem.numeroOP}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <p className="font-semibold">{getStatusText(ordem.status)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Prioridade</p>
                  <p className="font-semibold capitalize">{ordem.prioridade}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Datas</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Data de Criação</p>
                  <p className="font-semibold">{new Date(ordem.dataCriacao).toLocaleDateString("pt-BR")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Data de Prazo</p>
                  <p className="font-semibold">{new Date(ordem.dataPrazo).toLocaleDateString("pt-BR")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Data de Início</p>
                  <p className="font-semibold">
                    {ordem.dataInicio ? new Date(ordem.dataInicio).toLocaleDateString("pt-BR") : "-"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operacional</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Operador</p>
                  <p className="font-semibold">{ordem.operador || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Máquina</p>
                  <p className="font-semibold">{ordem.maquina || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Seção</p>
                  <p className="font-semibold">{ordem.secao || "-"}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projeto */}
          <TabsContent value="projeto" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Projeto</CardTitle>
                <CardDescription>
                  Projeto: {ordem.projeto.numero} - {ordem.projeto.nome}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Seção 1: Dados Gerais */}
                <div>
                  <h3 className="font-semibold mb-4">Dados Gerais</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Potência</p>
                      <p className="font-semibold">{ordem.projeto.potencia} kVA</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Classe</p>
                      <p className="font-semibold">{ordem.projeto.classe} kV</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fases</p>
                      <p className="font-semibold">{ordem.projeto.fases} F</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Frequência</p>
                      <p className="font-semibold">{ordem.projeto.frequencia} Hz</p>
                    </div>
                  </div>
                </div>

                {/* Seção 2: Tensões */}
                <div>
                  <h3 className="font-semibold mb-4">Tensões</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">AT Primária</p>
                      <p className="font-semibold">{ordem.projeto.tensaoATPrimaria} V</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">BT</p>
                      <p className="font-semibold">{ordem.projeto.tensaoBT} V</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo de Núcleo</p>
                      <p className="font-semibold">{ordem.projeto.tipoNucleo}</p>
                    </div>
                  </div>
                </div>

                {/* Seção 3: Enrolamento AT */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">Enrolamento AT</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo Fio</p>
                      <p className="font-semibold">{ordem.projeto.tipoFioAT}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Diâmetro</p>
                      <p className="font-semibold">{ordem.projeto.diametroFioAT} mm</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Espiras</p>
                      <p className="font-semibold">{ordem.projeto.numeroEspirasAT}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Peso</p>
                      <p className="font-semibold">{ordem.projeto.pesoFioAT} kg</p>
                    </div>
                  </div>
                </div>

                {/* Seção 4: Enrolamento BT */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">Enrolamento BT</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo Fio</p>
                      <p className="font-semibold">{ordem.projeto.tipoFioBT}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Diâmetro</p>
                      <p className="font-semibold">{ordem.projeto.diametroFioBT} mm</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Espiras</p>
                      <p className="font-semibold">{ordem.projeto.numeroEspirasBT}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Peso</p>
                      <p className="font-semibold">{ordem.projeto.pesoFioBT} kg</p>
                    </div>
                  </div>
                </div>

                {/* Seção 5: Tanque */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">Tanque</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo</p>
                      <p className="font-semibold">{ordem.projeto.tipoTanque}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Altura</p>
                      <p className="font-semibold">{ordem.projeto.alturaTanque} mm</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Peso</p>
                      <p className="font-semibold">{ordem.projeto.pesoTanque} kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Volume Óleo</p>
                      <p className="font-semibold">{ordem.projeto.volumeOleo} L</p>
                    </div>
                  </div>
                </div>

                {ordem.projeto.observacoes && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Observações</h3>
                    <p className="text-sm text-muted-foreground">{ordem.projeto.observacoes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progresso */}
          <TabsContent value="progresso" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Progresso da Ordem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold">Progresso Geral</p>
                    <p className="text-2xl font-bold">{ordem.progresso}%</p>
                  </div>
                  <Progress value={ordem.progresso} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground mb-2">Etapas de Produção</p>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Bobinagem</span>
                            <span className="text-sm font-semibold">100%</span>
                          </div>
                          <Progress value={100} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Montagem</span>
                            <span className="text-sm font-semibold">60%</span>
                          </div>
                          <Progress value={60} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Testes</span>
                            <span className="text-sm font-semibold">0%</span>
                          </div>
                          <Progress value={0} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Acabamento</span>
                            <span className="text-sm font-semibold">0%</span>
                          </div>
                          <Progress value={0} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground mb-4">Status por Componente</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Núcleo</span>
                          <Badge variant="outline">Pronto</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Enrol. AT</span>
                          <Badge variant="outline">Pronto</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Enrol. BT</span>
                          <Badge variant="outline">Pronto</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Tanque</span>
                          <Badge className="bg-yellow-500">Em Processo</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Testes Elétricos</span>
                          <Badge variant="secondary">Pendente</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Anotações */}
          <TabsContent value="anotacoes" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Anotações e Observações</CardTitle>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Anotação
                </Button>
              </CardHeader>
              <CardContent>
                {ordem.observacoes && (
                  <Card className="bg-muted/50 border-l-4 border-blue-500 mb-4">
                    <CardContent className="pt-4">
                      <p className="text-sm">{ordem.observacoes}</p>
                    </CardContent>
                  </Card>
                )}

                {ordem.anotacoes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Nenhuma anotação adicionada ainda</p>
                ) : (
                  <div className="space-y-4">
                    {ordem.anotacoes.map((anotacao) => (
                      <Card key={anotacao.id} className="bg-muted/50">
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-semibold text-sm">{anotacao.usuario}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(anotacao.data).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                          <p className="text-sm">{anotacao.conteudo}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
