"use client"

import { useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Filter } from "lucide-react"
import { FiltrosNotas } from "@/components/fiscal/filtros-notas"
import { ListaNotas } from "@/components/fiscal/lista-notas"
import { unificarDocumentos, type DocumentoFiscalUnificado } from "@/lib/mock/notas-fiscais"
import type { FiltroNotaFiscal } from "@/lib/types/nota-fiscal"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default function NotasFiscaisPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [filtros, setFiltros] = useState<FiltroNotaFiscal>({})
  const [filtrosAbertos, setFiltrosAbertos] = useState(false)
  const [documentoSelecionado, setDocumentoSelecionado] = useState<DocumentoFiscalUnificado | null>(null)
  const [modalVisualizarAberto, setModalVisualizarAberto] = useState(false)
  const [documentoExcluir, setDocumentoExcluir] = useState<DocumentoFiscalUnificado | null>(null)

  const todosDocumentos = useMemo(() => unificarDocumentos(), [])

  const documentosFiltrados = useMemo(() => {
    return todosDocumentos.filter((doc) => {
      if (filtros.tipoDocumento && filtros.tipoDocumento !== "todos") {
        if (doc.tipo !== filtros.tipoDocumento) return false
      }
      if (filtros.dataInicio) {
        const dataDoc = new Date(doc.dataEmissao)
        const dataFiltro = new Date(filtros.dataInicio)
        if (dataDoc < dataFiltro) return false
      }
      if (filtros.dataFim) {
        const dataDoc = new Date(doc.dataEmissao)
        const dataFiltro = new Date(filtros.dataFim)
        dataFiltro.setHours(23, 59, 59)
        if (dataDoc > dataFiltro) return false
      }
      if (filtros.numeroNota) {
        if (!doc.numero.includes(filtros.numeroNota)) return false
      }
      if (filtros.serie) {
        if (doc.serie !== filtros.serie) return false
      }
      if (filtros.chaveAcesso) {
        if (!doc.chaveAcesso.includes(filtros.chaveAcesso)) return false
      }
      if (filtros.cnpjEmitente) {
        const cnpjLimpo = filtros.cnpjEmitente.replace(/\D/g, "")
        if (!doc.emitenteCnpj.includes(cnpjLimpo)) return false
      }
      if (filtros.nomeEmitente) {
        if (!doc.emitenteNome.toLowerCase().includes(filtros.nomeEmitente.toLowerCase())) return false
      }
      if (filtros.cnpjDestinatario) {
        const cnpjLimpo = filtros.cnpjDestinatario.replace(/\D/g, "")
        if (!doc.destinatarioCnpj.includes(cnpjLimpo)) return false
      }
      if (filtros.nomeDestinatario) {
        if (!doc.destinatarioNome.toLowerCase().includes(filtros.nomeDestinatario.toLowerCase())) return false
      }
      if (filtros.cfop) {
        if (!doc.cfop.includes(filtros.cfop)) return false
      }
      if (filtros.valorMinimo !== undefined) {
        if (doc.valorTotal < filtros.valorMinimo) return false
      }
      if (filtros.valorMaximo !== undefined) {
        if (doc.valorTotal > filtros.valorMaximo) return false
      }
      if (filtros.status && filtros.status !== "todas") {
        if (doc.status !== filtros.status && doc.status !== filtros.status.replace("a", "o")) return false
      }
      if (filtros.contabilizado !== undefined) {
        if (doc.contabilizado !== filtros.contabilizado) return false
      }
      if (filtros.estoqueLancado !== undefined && doc.tipo === "nfe") {
        if (doc.estoqueLancado !== filtros.estoqueLancado) return false
      }
      return true
    })
  }, [todosDocumentos, filtros])

  const handleNovaEntrada = useCallback(() => {
    router.push("/compras/nfe-entrada/notas/entrada")
  }, [router])

  const handleVisualizar = useCallback(
    (doc: DocumentoFiscalUnificado) => {
      router.push(`/fiscal/notas/${doc.id}`)
    },
    [router],
  )

  const handleEditar = useCallback(
    (doc: DocumentoFiscalUnificado) => {
      router.push(`/fiscal/notas/entrada?id=${doc.id}`)
    },
    [router],
  )

  const handleExcluir = useCallback(
    (doc: DocumentoFiscalUnificado) => {
      toast({
        title: "Função em desenvolvimento",
        description: "A exclusão de documentos fiscais será implementada em breve.",
      })
    },
    [toast],
  )

  const handleLimparFiltros = useCallback(() => {
    setFiltros({})
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Notas Fiscais</h1>
            <p className="text-muted-foreground">Consulte e gerencie todas as notas fiscais e CTe do sistema</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => router.push("/compras/nfe-entrada/dashboard")} variant="outline">
              Dashboard
            </Button>
            <Button onClick={handleNovaEntrada} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Nova Entrada
            </Button>
          </div>
        </div>

        {/* Barra de Ações com Filtro */}
        <Collapsible open={filtrosAbertos} onOpenChange={setFiltrosAbertos}>
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                {filtrosAbertos ? "Ocultar Filtros" : "Exibir Filtros"}
              </Button>
            </CollapsibleTrigger>
            <p className="text-sm text-muted-foreground">
              Exibindo {documentosFiltrados.length} de {todosDocumentos.length} documentos
            </p>
          </div>
          <CollapsibleContent className="mt-4">
            <FiltrosNotas filtros={filtros} onFiltrosChange={setFiltros} onLimparFiltros={handleLimparFiltros} />
          </CollapsibleContent>
        </Collapsible>

        {/* Lista de Documentos */}
        <ListaNotas
          documentos={documentosFiltrados}
          onVisualizar={handleVisualizar}
          onEditar={handleEditar}
          onExcluir={handleExcluir}
        />
      </div>

      <Toaster />
    </div>
  )
}
