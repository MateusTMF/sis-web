"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { OrdemProducaoDetalhes } from "@/lib/types/ordem-producao-extended"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { DetalhesEtapaSetor } from "./detalhes-etapa-setor"

interface CardOpSetorSimplesProps {
  op: OrdemProducaoDetalhes
  setor: string
}

export function CardOpSetorSimples({ op, setor }: CardOpSetorSimplesProps) {
  const [expanded, setExpanded] = useState(false)
  const etapa = op.etapas[setor as keyof typeof op.etapas]

  if (!etapa) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluida":
        return "bg-green-500"
      case "em-progresso":
        return "bg-blue-500"
      case "nao-iniciada":
        return "bg-gray-400"
      case "com-erro":
        return "bg-red-500"
      case "pausada":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    const statusMap = {
      concluida: "Concluída",
      "em-progresso": "Em Progresso",
      "nao-iniciada": "Não Iniciada",
      "com-erro": "Com Erro",
      pausada: "Pausada",
    }
  return statusMap[status as keyof typeof statusMap] || status
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">OP: {op.numeroOP}</h3>
              <Badge className={getStatusColor(etapa.status)}>{getStatusText(etapa.status)}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {op.projeto.nome} - {op.projeto.potencia} kVA
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-4 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Progresso</p>
            <p className="font-semibold">{etapa.progresso}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="font-semibold capitalize">{etapa.status.replace("-", " ")}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Tempo Est.</p>
            <p className="font-semibold">{etapa.tempoEstimado}min</p>
          </div>
          <div>
            <p className="text-muted-foreground">Tempo Real</p>
            <p className="font-semibold">{etapa.tempoReal || "-"}min</p>
          </div>
        </div>

        <Progress value={etapa.progresso} className="h-2" />

        {expanded && (
          <div className="pt-4 border-t">
            <DetalhesEtapaSetor op={op} setor={setor} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
