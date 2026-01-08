"use client"

import type React from "react"

import { useState, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { parseXML } from "@/lib/utils/xml-parser"
import type { NotaFiscalEletronica } from "@/lib/types/nota-fiscal"
import type { ConhecimentoTransporteEletronico } from "@/lib/types/cte"
import { formatarCNPJ, formatarMoeda, formatarData } from "@/lib/utils/formatters"

interface ModalImportarXMLProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImportar: (tipo: "nfe" | "cte", dados: any) => void
}

type DadosParseados = {
  tipo: "nfe" | "cte"
  dados: Partial<NotaFiscalEletronica> | Partial<ConhecimentoTransporteEletronico>
} | null

export function ModalImportarXML({ open, onOpenChange, onImportar }: ModalImportarXMLProps) {
  const [xmlContent, setXmlContent] = useState("")
  const [dadosParseados, setDadosParseados] = useState<DadosParseados>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [processando, setProcessando] = useState(false)
  const [abaAtiva, setAbaAtiva] = useState("upload")

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setXmlContent(content)
      processarXML(content)
    }
    reader.onerror = () => {
      setErro("Erro ao ler o arquivo")
    }
    reader.readAsText(file)
  }, [])

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setXmlContent(content)
      processarXML(content)
    }
    reader.readAsText(file)
  }, [])

  const processarXML = async (xml: string) => {
    setProcessando(true)
    setErro(null)
    setDadosParseados(null)

    try {
      // Simular delay de processamento
      await new Promise((resolve) => setTimeout(resolve, 500))

      const resultado = parseXML(xml)
      setDadosParseados(resultado)
      setAbaAtiva("revisao")
    } catch (e: any) {
      setErro(e.message || "Erro ao processar o XML")
    } finally {
      setProcessando(false)
    }
  }

  const handleConfirmarImportacao = () => {
    if (dadosParseados) {
      onImportar(dadosParseados.tipo, dadosParseados.dados)
      handleLimpar()
      onOpenChange(false)
    }
  }

  const handleLimpar = () => {
    setXmlContent("")
    setDadosParseados(null)
    setErro(null)
    setAbaAtiva("upload")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Importar XML de Documento Fiscal
          </DialogTitle>
          <DialogDescription>
            Faça upload ou cole o conteúdo do XML de NFe ou CTe para dar entrada no sistema
          </DialogDescription>
        </DialogHeader>

        <Tabs value={abaAtiva} onValueChange={setAbaAtiva}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">1. Upload do XML</TabsTrigger>
            <TabsTrigger value="revisao" disabled={!dadosParseados}>
              2. Revisão dos Dados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4 mt-4">
            {/* Área de Upload */}
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <input id="file-upload" type="file" accept=".xml" onChange={handleFileUpload} className="hidden" />
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Arraste o arquivo XML ou clique para selecionar</p>
              <p className="text-sm text-muted-foreground mt-1">Suporta NFe e CTe no formato XML</p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">ou cole o XML</span>
              </div>
            </div>

            {/* Área de Texto para colar XML */}
            <div className="space-y-2">
              <Label>Conteúdo do XML</Label>
              <Textarea
                placeholder="Cole aqui o conteúdo do XML..."
                value={xmlContent}
                onChange={(e) => setXmlContent(e.target.value)}
                className="font-mono text-xs h-48"
              />
            </div>

            {erro && (
              <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-md">
                <AlertCircle className="h-5 w-5" />
                <span>{erro}</span>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleLimpar}>
                Limpar
              </Button>
              <Button onClick={() => processarXML(xmlContent)} disabled={!xmlContent || processando}>
                {processando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Processar XML
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="revisao" className="mt-4">
            {dadosParseados && (
              <ScrollArea className="h-[500px] pr-4">
                {dadosParseados.tipo === "nfe" ? (
                  <RevisaoNFe dados={dadosParseados.dados as Partial<NotaFiscalEletronica>} />
                ) : (
                  <RevisaoCTe dados={dadosParseados.dados as Partial<ConhecimentoTransporteEletronico>} />
                )}
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          {dadosParseados && (
            <Button onClick={handleConfirmarImportacao}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirmar Entrada
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Componente para revisão de NFe
function RevisaoNFe({ dados }: { dados: Partial<NotaFiscalEletronica> }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="border-blue-600 text-blue-600">
          NFe
        </Badge>
        <span className="font-bold text-lg">Nota Fiscal Eletrônica</span>
      </div>

      {/* Identificação */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Identificação da NF-e</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Número</span>
            <p className="font-medium">{dados.ide?.nNF}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Série</span>
            <p className="font-medium">{dados.ide?.serie}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Modelo</span>
            <p className="font-medium">{dados.ide?.mod}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Natureza Op.</span>
            <p className="font-medium">{dados.ide?.natOp}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Emissão</span>
            <p className="font-medium">{formatarData(dados.ide?.dhEmi || "")}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Saída/Entrada</span>
            <p className="font-medium">{formatarData(dados.ide?.dhSaiEnt || "")}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Tipo</span>
            <p className="font-medium">{dados.ide?.tpNF === "0" ? "Entrada" : "Saída"}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Finalidade</span>
            <p className="font-medium">
              {dados.ide?.finNFe === "1"
                ? "Normal"
                : dados.ide?.finNFe === "2"
                  ? "Complementar"
                  : dados.ide?.finNFe === "3"
                    ? "Ajuste"
                    : "Devolução"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Chave de Acesso */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Chave de Acesso</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-mono text-sm break-all">{dados.chaveAcesso}</p>
        </CardContent>
      </Card>

      {/* Emitente */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Emitente</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">CNPJ</span>
            <p className="font-medium">{formatarCNPJ(dados.emit?.CNPJ || "")}</p>
          </div>
          <div>
            <span className="text-muted-foreground">IE</span>
            <p className="font-medium">{dados.emit?.IE}</p>
          </div>
          <div className="md:col-span-2">
            <span className="text-muted-foreground">Razão Social</span>
            <p className="font-medium">{dados.emit?.xNome}</p>
          </div>
          <div className="md:col-span-2">
            <span className="text-muted-foreground">Endereço</span>
            <p className="font-medium">
              {dados.emit?.enderEmit?.xLgr}, {dados.emit?.enderEmit?.nro} - {dados.emit?.enderEmit?.xBairro}
              <br />
              {dados.emit?.enderEmit?.xMun}/{dados.emit?.enderEmit?.UF} - CEP: {dados.emit?.enderEmit?.CEP}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Destinatário */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Destinatário</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">CNPJ</span>
            <p className="font-medium">{formatarCNPJ(dados.dest?.CNPJ || "")}</p>
          </div>
          <div>
            <span className="text-muted-foreground">IE</span>
            <p className="font-medium">{dados.dest?.IE}</p>
          </div>
          <div className="md:col-span-2">
            <span className="text-muted-foreground">Razão Social</span>
            <p className="font-medium">{dados.dest?.xNome}</p>
          </div>
          <div className="md:col-span-2">
            <span className="text-muted-foreground">Endereço</span>
            <p className="font-medium">
              {dados.dest?.enderDest?.xLgr}, {dados.dest?.enderDest?.nro} - {dados.dest?.enderDest?.xBairro}
              <br />
              {dados.dest?.enderDest?.xMun}/{dados.dest?.enderDest?.UF} - CEP: {dados.dest?.enderDest?.CEP}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Produtos */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Produtos ({dados.det?.length || 0} itens)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {dados.det?.slice(0, 5).map((item, idx) => (
            <div key={idx} className="border-b pb-3 last:border-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{item.prod.xProd}</p>
                  <p className="text-xs text-muted-foreground">
                    Cód: {item.prod.cProd} | NCM: {item.prod.NCM} | CFOP: {item.prod.CFOP}
                  </p>
                </div>
                <p className="font-bold text-sm">{formatarMoeda(Number.parseFloat(item.prod.vProd))}</p>
              </div>
              <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                <span>
                  Qtd: {item.prod.qCom} {item.prod.uCom}
                </span>
                <span>Unit: {formatarMoeda(Number.parseFloat(item.prod.vUnCom))}</span>
                <span>ICMS: {formatarMoeda(Number.parseFloat(item.imposto.ICMS.vICMS || "0"))}</span>
              </div>
            </div>
          ))}
          {(dados.det?.length || 0) > 5 && (
            <p className="text-sm text-muted-foreground text-center">... e mais {(dados.det?.length || 0) - 5} itens</p>
          )}
        </CardContent>
      </Card>

      {/* Totais */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Totais</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Produtos</span>
            <p className="font-medium">{formatarMoeda(Number.parseFloat(dados.total?.ICMSTot?.vProd || "0"))}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Frete</span>
            <p className="font-medium">{formatarMoeda(Number.parseFloat(dados.total?.ICMSTot?.vFrete || "0"))}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Seguro</span>
            <p className="font-medium">{formatarMoeda(Number.parseFloat(dados.total?.ICMSTot?.vSeg || "0"))}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Desconto</span>
            <p className="font-medium">{formatarMoeda(Number.parseFloat(dados.total?.ICMSTot?.vDesc || "0"))}</p>
          </div>
          <div>
            <span className="text-muted-foreground">BC ICMS</span>
            <p className="font-medium">{formatarMoeda(Number.parseFloat(dados.total?.ICMSTot?.vBC || "0"))}</p>
          </div>
          <div>
            <span className="text-muted-foreground">ICMS</span>
            <p className="font-medium">{formatarMoeda(Number.parseFloat(dados.total?.ICMSTot?.vICMS || "0"))}</p>
          </div>
          <div>
            <span className="text-muted-foreground">IPI</span>
            <p className="font-medium">{formatarMoeda(Number.parseFloat(dados.total?.ICMSTot?.vIPI || "0"))}</p>
          </div>
          <div>
            <span className="text-muted-foreground">PIS</span>
            <p className="font-medium">{formatarMoeda(Number.parseFloat(dados.total?.ICMSTot?.vPIS || "0"))}</p>
          </div>
          <div>
            <span className="text-muted-foreground">COFINS</span>
            <p className="font-medium">{formatarMoeda(Number.parseFloat(dados.total?.ICMSTot?.vCOFINS || "0"))}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Total Tributos</span>
            <p className="font-medium">{formatarMoeda(Number.parseFloat(dados.total?.ICMSTot?.vTotTrib || "0"))}</p>
          </div>
          <div className="md:col-span-2">
            <span className="text-muted-foreground">Valor Total da NF</span>
            <p className="font-bold text-lg text-primary">
              {formatarMoeda(Number.parseFloat(dados.total?.ICMSTot?.vNF || "0"))}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Transporte */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Transporte</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Modalidade</span>
            <p className="font-medium">
              {dados.transp?.modFrete === "0"
                ? "Emitente"
                : dados.transp?.modFrete === "1"
                  ? "Destinatário"
                  : dados.transp?.modFrete === "2"
                    ? "Terceiros"
                    : "Sem Frete"}
            </p>
          </div>
          {dados.transp?.transporta && (
            <>
              <div className="md:col-span-2">
                <span className="text-muted-foreground">Transportadora</span>
                <p className="font-medium">{dados.transp.transporta.xNome}</p>
              </div>
              <div>
                <span className="text-muted-foreground">CNPJ</span>
                <p className="font-medium">{formatarCNPJ(dados.transp.transporta.CNPJ || "")}</p>
              </div>
            </>
          )}
          {dados.transp?.vol && dados.transp.vol.length > 0 && (
            <>
              <div>
                <span className="text-muted-foreground">Volumes</span>
                <p className="font-medium">{dados.transp.vol[0].qVol}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Espécie</span>
                <p className="font-medium">{dados.transp.vol[0].esp}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Peso Líquido</span>
                <p className="font-medium">{dados.transp.vol[0].pesoL} kg</p>
              </div>
              <div>
                <span className="text-muted-foreground">Peso Bruto</span>
                <p className="font-medium">{dados.transp.vol[0].pesoB} kg</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Cobrança */}
      {dados.cobr && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Cobrança</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {dados.cobr.fat && (
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <span className="text-muted-foreground">Fatura</span>
                  <p className="font-medium">{dados.cobr.fat.nFat}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Valor Original</span>
                  <p className="font-medium">{formatarMoeda(Number.parseFloat(dados.cobr.fat.vOrig || "0"))}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Desconto</span>
                  <p className="font-medium">{formatarMoeda(Number.parseFloat(dados.cobr.fat.vDesc || "0"))}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Valor Líquido</span>
                  <p className="font-medium">{formatarMoeda(Number.parseFloat(dados.cobr.fat.vLiq || "0"))}</p>
                </div>
              </div>
            )}
            {dados.cobr.dup && dados.cobr.dup.length > 0 && (
              <div>
                <p className="font-medium mb-2">Duplicatas</p>
                <div className="grid grid-cols-3 gap-2">
                  {dados.cobr.dup.map((dup, idx) => (
                    <div key={idx} className="border rounded p-2">
                      <p className="text-xs text-muted-foreground">Nº {dup.nDup}</p>
                      <p className="font-medium">{formatarMoeda(Number.parseFloat(dup.vDup))}</p>
                      <p className="text-xs">{formatarData(dup.dVenc)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Informações Adicionais */}
      {dados.infAdic?.infCpl && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Informações Complementares</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{dados.infAdic.infCpl}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Componente para revisão de CTe
function RevisaoCTe({ dados }: { dados: Partial<ConhecimentoTransporteEletronico> }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="border-orange-600 text-orange-600">
          CTe
        </Badge>
        <span className="font-bold text-lg">Conhecimento de Transporte Eletrônico</span>
      </div>

      {/* Identificação */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Identificação do CT-e</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Número</span>
            <p className="font-medium">{dados.ide?.nCT}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Série</span>
            <p className="font-medium">{dados.ide?.serie}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Modelo</span>
            <p className="font-medium">{dados.ide?.mod}</p>
          </div>
          <div>
            <span className="text-muted-foreground">CFOP</span>
            <p className="font-medium">{dados.ide?.CFOP}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Natureza Op.</span>
            <p className="font-medium">{dados.ide?.natOp}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Emissão</span>
            <p className="font-medium">{formatarData(dados.ide?.dhEmi || "")}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Modal</span>
            <p className="font-medium">
              {dados.ide?.modal === "01"
                ? "Rodoviário"
                : dados.ide?.modal === "02"
                  ? "Aéreo"
                  : dados.ide?.modal === "03"
                    ? "Aquaviário"
                    : dados.ide?.modal === "04"
                      ? "Ferroviário"
                      : "Outros"}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Tipo Serviço</span>
            <p className="font-medium">
              {dados.ide?.tpServ === "0"
                ? "Normal"
                : dados.ide?.tpServ === "1"
                  ? "Subcontratação"
                  : dados.ide?.tpServ === "2"
                    ? "Redespacho"
                    : "Outros"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Chave de Acesso */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Chave de Acesso</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-mono text-sm break-all">{dados.chaveAcesso}</p>
        </CardContent>
      </Card>

      {/* Origem/Destino */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Origem e Destino</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Origem</span>
            <p className="font-medium">
              {dados.ide?.xMunIni} / {dados.ide?.UFIni}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Destino</span>
            <p className="font-medium">
              {dados.ide?.xMunFim} / {dados.ide?.UFFim}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Emitente */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Emitente (Transportadora)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">CNPJ</span>
            <p className="font-medium">{formatarCNPJ(dados.emit?.CNPJ || "")}</p>
          </div>
          <div>
            <span className="text-muted-foreground">IE</span>
            <p className="font-medium">{dados.emit?.IE}</p>
          </div>
          <div className="md:col-span-2">
            <span className="text-muted-foreground">Razão Social</span>
            <p className="font-medium">{dados.emit?.xNome}</p>
          </div>
          <div className="md:col-span-2">
            <span className="text-muted-foreground">Endereço</span>
            <p className="font-medium">
              {dados.emit?.enderEmit?.xLgr}, {dados.emit?.enderEmit?.nro} - {dados.emit?.enderEmit?.xBairro}
              <br />
              {dados.emit?.enderEmit?.xMun}/{dados.emit?.enderEmit?.UF} - CEP: {dados.emit?.enderEmit?.CEP}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Remetente */}
      {dados.rem && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Remetente</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">CNPJ</span>
              <p className="font-medium">{formatarCNPJ(dados.rem.CNPJ || "")}</p>
            </div>
            <div>
              <span className="text-muted-foreground">IE</span>
              <p className="font-medium">{dados.rem.IE}</p>
            </div>
            <div className="md:col-span-2">
              <span className="text-muted-foreground">Razão Social</span>
              <p className="font-medium">{dados.rem.xNome}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Destinatário */}
      {dados.dest && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Destinatário</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">CNPJ</span>
              <p className="font-medium">{formatarCNPJ(dados.dest.CNPJ || "")}</p>
            </div>
            <div>
              <span className="text-muted-foreground">IE</span>
              <p className="font-medium">{dados.dest.IE}</p>
            </div>
            <div className="md:col-span-2">
              <span className="text-muted-foreground">Razão Social</span>
              <p className="font-medium">{dados.dest.xNome}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Valores da Prestação */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Valores da Prestação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-muted-foreground">Valor Total</span>
              <p className="font-bold text-lg text-primary">
                {formatarMoeda(Number.parseFloat(dados.vPrest?.vTPrest || "0"))}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Valor a Receber</span>
              <p className="font-medium">{formatarMoeda(Number.parseFloat(dados.vPrest?.vRec || "0"))}</p>
            </div>
          </div>
          {dados.vPrest?.Comp && dados.vPrest.Comp.length > 0 && (
            <div>
              <p className="font-medium mb-2">Componentes do Valor</p>
              <div className="grid grid-cols-2 gap-2">
                {dados.vPrest.Comp.map((comp, idx) => (
                  <div key={idx} className="flex justify-between border-b py-1">
                    <span>{comp.xNome}</span>
                    <span className="font-medium">{formatarMoeda(Number.parseFloat(comp.vComp))}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Impostos */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Impostos</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">CST ICMS</span>
            <p className="font-medium">{dados.imp?.ICMS?.CST}</p>
          </div>
          <div>
            <span className="text-muted-foreground">BC ICMS</span>
            <p className="font-medium">{formatarMoeda(Number.parseFloat(dados.imp?.ICMS?.vBC || "0"))}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Alíquota ICMS</span>
            <p className="font-medium">{dados.imp?.ICMS?.pICMS}%</p>
          </div>
          <div>
            <span className="text-muted-foreground">Valor ICMS</span>
            <p className="font-medium">{formatarMoeda(Number.parseFloat(dados.imp?.ICMS?.vICMS || "0"))}</p>
          </div>
          {dados.imp?.ICMS?.indSN === "1" && (
            <div className="md:col-span-4">
              <Badge variant="secondary">Simples Nacional - Não gera crédito de ICMS</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações da Carga */}
      {dados.infCTeNorm?.infCarga && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Informações da Carga</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Valor da Carga</span>
              <p className="font-medium">{formatarMoeda(Number.parseFloat(dados.infCTeNorm.infCarga.vCarga || "0"))}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Produto Predominante</span>
              <p className="font-medium">{dados.infCTeNorm.infCarga.proPred}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* NFe Referenciadas */}
      {dados.infCTeNorm?.infDoc?.infNFe && dados.infCTeNorm.infDoc.infNFe.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">NF-e Referenciadas ({dados.infCTeNorm.infDoc.infNFe.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {dados.infCTeNorm.infDoc.infNFe.map((nfe, idx) => (
              <div key={idx} className="font-mono text-xs break-all bg-muted p-2 rounded">
                {nfe.chave}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Observações */}
      {dados.compl?.xObs && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{dados.compl.xObs}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
