"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Trash2, FileText, Truck, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import type { DocumentoFiscalUnificado } from "@/lib/mock/notas-fiscais"
import { formatarCNPJ, formatarData, formatarMoeda } from "@/lib/utils/formatters"

interface ListaNotasProps {
  documentos: DocumentoFiscalUnificado[]
  onVisualizar: (doc: DocumentoFiscalUnificado) => void
  onEditar: (doc: DocumentoFiscalUnificado) => void
  onExcluir: (doc: DocumentoFiscalUnificado) => void
}

export function ListaNotas({ documentos, onVisualizar, onEditar, onExcluir }: ListaNotasProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativa":
      case "ativo":
        return (
          <Badge variant="default" className="bg-green-600">
            Ativa
          </Badge>
        )
      case "cancelada":
      case "cancelado":
        return <Badge variant="destructive">Cancelada</Badge>
      case "inutilizada":
      case "inutilizado":
        return <Badge variant="secondary">Inutilizada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTipoIcon = (tipo: "nfe" | "cte") => {
    return tipo === "nfe" ? (
      <FileText className="h-5 w-5 text-blue-600" />
    ) : (
      <Truck className="h-5 w-5 text-orange-600" />
    )
  }

  const getTipoBadge = (tipo: "nfe" | "cte") => {
    return tipo === "nfe" ? (
      <Badge variant="outline" className="border-blue-600 text-blue-600">
        NFe
      </Badge>
    ) : (
      <Badge variant="outline" className="border-orange-600 text-orange-600">
        CTe
      </Badge>
    )
  }

  if (documentos.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium">Nenhum documento encontrado</p>
          <p className="text-sm text-muted-foreground mt-1">Tente ajustar os filtros ou importar novos documentos</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {documentos.map((doc) => (
        <Card key={`${doc.tipo}-${doc.id}`} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {getTipoIcon(doc.tipo)}
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">
                      {doc.tipo === "nfe" ? "NF-e" : "CT-e"} {doc.numero}
                    </CardTitle>
                    {getTipoBadge(doc.tipo)}
                    {getStatusBadge(doc.status)}
                  </div>
                  <CardDescription className="mt-1">
                    Série {doc.serie} • CFOP {doc.cfop} • Emissão: {formatarData(doc.dataEmissao)}
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => onVisualizar(doc)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => onEditar(doc)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => onExcluir(doc)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <p className="text-xs text-muted-foreground">Emitente</p>
                <p className="font-medium text-sm truncate">{doc.emitenteNome}</p>
                <p className="text-xs text-muted-foreground">{formatarCNPJ(doc.emitenteCnpj)}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-muted-foreground">Destinatário</p>
                <p className="font-medium text-sm truncate">{doc.destinatarioNome}</p>
                <p className="text-xs text-muted-foreground">{formatarCNPJ(doc.destinatarioCnpj)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Valor Total</p>
                <p className="font-bold text-lg text-primary">{formatarMoeda(doc.valorTotal)}</p>
              </div>
            </div>

            {/* Status de Lançamentos */}
            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t">
              <div className="flex items-center gap-1.5 text-sm">
                {doc.contabilizado ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={doc.contabilizado ? "text-green-600" : "text-muted-foreground"}>Contabilizado</span>
              </div>

              {doc.tipo === "nfe" && (
                <div className="flex items-center gap-1.5 text-sm">
                  {doc.estoqueLancado ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  )}
                  <span className={doc.estoqueLancado ? "text-green-600" : "text-amber-500"}>Estoque</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-sm">
                {doc.contasLancadas ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                )}
                <span className={doc.contasLancadas ? "text-green-600" : "text-amber-500"}>Contas</span>
              </div>

              <div className="ml-auto">
                <span className="text-xs text-muted-foreground">Entrada: {formatarData(doc.dataEntrada)}</span>
              </div>
            </div>

            {/* Chave de Acesso */}
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-muted-foreground">Chave de Acesso</p>
              <p className="font-mono text-xs break-all">{doc.chaveAcesso}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
