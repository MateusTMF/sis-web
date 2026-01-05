"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { OrdemProducaoDetalhes } from "@/lib/types/ordem-producao-extended"
import { useState } from "react"
import { CheckCircle2, Clock, AlertCircle, Pause as Pause2 } from "lucide-react"

interface DetalhesEtapaSetorProps {
  op: OrdemProducaoDetalhes
  setor: string
}

export function DetalhesEtapaSetor({ op, setor }: DetalhesEtapaSetorProps) {
  const etapa = op.etapas[setor as keyof typeof op.etapas]
  const [status, setStatus] = useState(etapa?.status || "nao-iniciada")
  const [progresso, setProgresso] = useState(etapa?.progresso || 0)
  const [observacoes, setObservacoes] = useState(etapa?.observacoes || "")
  const [tempoReal, setTempoReal] = useState(etapa?.tempoReal?.toString() || "")

  if (!etapa) return null

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "concluida":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "em-progresso":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "pausada":
        return <Pause2 className="h-5 w-5 text-yellow-500" />
      case "com-erro":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const handleSave = () => {
    console.log("[v0] Saving etapa:", {
      setor,
      status,
      progresso,
      observacoes,
      tempoReal,
    })
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl">Etapa do {setor}</CardTitle>
            {getStatusIcon(status)}
          </div>
          <Badge>{status.replace("-", " ")}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Selecione o Status</label>
<Select value={status} onValueChange={(value) => setStatus(value as typeof status)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nao-iniciada">Não Iniciada</SelectItem>
              <SelectItem value="em-progresso">Em Progresso</SelectItem>
              <SelectItem value="pausada">Pausada</SelectItem>
              <SelectItem value="concluida">Concluída</SelectItem>
              <SelectItem value="com-erro">Com Erro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Progresso da Etapa</label>
            <span className="text-sm font-semibold">{progresso}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={progresso}
            onChange={(e) => setProgresso(Number(e.target.value))}
            className="w-full"
          />
          <Progress value={progresso} className="h-2" />
        </div>

        {/* Tempos */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tempo Estimado (min)</label>
            <input
              type="text"
              disabled
              value={etapa.tempoEstimado}
              className="w-full px-3 py-2 border rounded-md bg-muted"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tempo Real (min)</label>
            <input
              type="number"
              value={tempoReal}
              onChange={(e) => setTempoReal(e.target.value)}
              placeholder="Insira o tempo gasto"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        {/* Observações */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Observações e Anotações</label>
          <Textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Descreva o que foi feito, problemas encontrados, etc."
            className="min-h-24"
          />
        </div>

        {/* Ações */}
        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} className="flex-1">
            Salvar Progresso
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
