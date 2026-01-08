"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { X } from "lucide-react"
import type { FiltroNotaFiscal } from "@/lib/types/nota-fiscal"

interface FiltrosNotasProps {
  filtros: FiltroNotaFiscal
  onFiltrosChange: (filtros: FiltroNotaFiscal) => void
  onLimparFiltros: () => void
}

export function FiltrosNotas({ filtros, onFiltrosChange, onLimparFiltros }: FiltrosNotasProps) {
  const handleChange = (campo: keyof FiltroNotaFiscal, valor: any) => {
    onFiltrosChange({ ...filtros, [campo]: valor })
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Filtros de Pesquisa</h3>
          <Button variant="outline" size="sm" onClick={onLimparFiltros}>
            <X className="mr-2 h-4 w-4" />
            Limpar Filtros
          </Button>
        </div>

        {/* Linha 1: Tipo, Período */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Tipo de Documento</Label>
            <Select
              value={filtros.tipoDocumento || "todos"}
              onValueChange={(v) => handleChange("tipoDocumento", v === "todos" ? undefined : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="nfe">NFe - Nota Fiscal</SelectItem>
                <SelectItem value="cte">CTe - Conhecimento Transporte</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Data Início</Label>
            <Input
              type="date"
              value={filtros.dataInicio || ""}
              onChange={(e) => handleChange("dataInicio", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Data Fim</Label>
            <Input
              type="date"
              value={filtros.dataFim || ""}
              onChange={(e) => handleChange("dataFim", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={filtros.status || "todas"}
              onValueChange={(v) => handleChange("status", v === "todas" ? undefined : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="ativa">Ativa</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
                <SelectItem value="inutilizada">Inutilizada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Linha 2: Número, Série, Chave */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Número da Nota</Label>
            <Input
              placeholder="Ex: 27523"
              value={filtros.numeroNota || ""}
              onChange={(e) => handleChange("numeroNota", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Série</Label>
            <Input
              placeholder="Ex: 1"
              value={filtros.serie || ""}
              onChange={(e) => handleChange("serie", e.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Chave de Acesso</Label>
            <Input
              placeholder="44 dígitos"
              value={filtros.chaveAcesso || ""}
              onChange={(e) => handleChange("chaveAcesso", e.target.value)}
              maxLength={44}
            />
          </div>
        </div>

        {/* Linha 3: Emitente */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>CNPJ Emitente</Label>
            <Input
              placeholder="00.000.000/0000-00"
              value={filtros.cnpjEmitente || ""}
              onChange={(e) => handleChange("cnpjEmitente", e.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Nome/Razão Social Emitente</Label>
            <Input
              placeholder="Buscar por nome"
              value={filtros.nomeEmitente || ""}
              onChange={(e) => handleChange("nomeEmitente", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>CFOP</Label>
            <Input
              placeholder="Ex: 6101"
              value={filtros.cfop || ""}
              onChange={(e) => handleChange("cfop", e.target.value)}
            />
          </div>
        </div>

        {/* Linha 4: Destinatário e Valores */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>CNPJ Destinatário</Label>
            <Input
              placeholder="00.000.000/0000-00"
              value={filtros.cnpjDestinatario || ""}
              onChange={(e) => handleChange("cnpjDestinatario", e.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Nome/Razão Social Destinatário</Label>
            <Input
              placeholder="Buscar por nome"
              value={filtros.nomeDestinatario || ""}
              onChange={(e) => handleChange("nomeDestinatario", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Valor Mínimo</Label>
            <Input
              type="number"
              placeholder="R$ 0,00"
              value={filtros.valorMinimo || ""}
              onChange={(e) => handleChange("valorMinimo", Number.parseFloat(e.target.value) || undefined)}
            />
          </div>
        </div>

        {/* Linha 5: Checkboxes de Status */}
        <div className="flex flex-wrap gap-6 pt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="contabilizado"
              checked={filtros.contabilizado === true}
              onCheckedChange={(checked) => handleChange("contabilizado", checked === true ? true : undefined)}
            />
            <Label htmlFor="contabilizado" className="text-sm font-normal cursor-pointer">
              Apenas Contabilizadas
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="estoqueLancado"
              checked={filtros.estoqueLancado === true}
              onCheckedChange={(checked) => handleChange("estoqueLancado", checked === true ? true : undefined)}
            />
            <Label htmlFor="estoqueLancado" className="text-sm font-normal cursor-pointer">
              Estoque Lançado
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="naoContabilizado"
              checked={filtros.contabilizado === false}
              onCheckedChange={(checked) => handleChange("contabilizado", checked === true ? false : undefined)}
            />
            <Label htmlFor="naoContabilizado" className="text-sm font-normal cursor-pointer">
              Pendente Contabilização
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
