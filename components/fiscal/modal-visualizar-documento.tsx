"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Truck, Building, User, Package, DollarSign, FileCode } from "lucide-react"
import type { DocumentoFiscalUnificado } from "@/lib/mock/notas-fiscais"
import { notasFiscaisMock, ctesMock } from "@/lib/mock/notas-fiscais"
import { formatarCNPJ, formatarMoeda, formatarData } from "@/lib/utils/formatters"

interface ModalVisualizarDocumentoProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  documento: DocumentoFiscalUnificado | null
}

export function ModalVisualizarDocumento({ open, onOpenChange, documento }: ModalVisualizarDocumentoProps) {
  if (!documento) return null

  // Buscar dados completos do documento
  const dadosCompletos =
    documento.tipo === "nfe"
      ? notasFiscaisMock.find((n) => n.id === documento.id)
      : ctesMock.find((c) => c.id === documento.id)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {documento.tipo === "nfe" ? (
              <FileText className="h-5 w-5 text-blue-600" />
            ) : (
              <Truck className="h-5 w-5 text-orange-600" />
            )}
            {documento.tipo === "nfe" ? "NF-e" : "CT-e"} {documento.numero} - Série {documento.serie}
            <Badge
              variant="outline"
              className={
                documento.tipo === "nfe" ? "border-blue-600 text-blue-600" : "border-orange-600 text-orange-600"
              }
            >
              {documento.tipo.toUpperCase()}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="geral">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="geral">
              <FileText className="h-4 w-4 mr-2" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="participantes">
              <Building className="h-4 w-4 mr-2" />
              Participantes
            </TabsTrigger>
            <TabsTrigger value="itens">
              <Package className="h-4 w-4 mr-2" />
              {documento.tipo === "nfe" ? "Produtos" : "Carga"}
            </TabsTrigger>
            <TabsTrigger value="impostos">
              <DollarSign className="h-4 w-4 mr-2" />
              Impostos
            </TabsTrigger>
            <TabsTrigger value="xml">
              <FileCode className="h-4 w-4 mr-2" />
              XML
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] mt-4">
            <TabsContent value="geral" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Identificação</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Número</span>
                    <p className="font-medium">{documento.numero}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Série</span>
                    <p className="font-medium">{documento.serie}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CFOP</span>
                    <p className="font-medium">{documento.cfop}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status</span>
                    <p className="font-medium capitalize">{documento.status}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Data Emissão</span>
                    <p className="font-medium">{formatarData(documento.dataEmissao)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Data Entrada</span>
                    <p className="font-medium">{formatarData(documento.dataEntrada)}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-muted-foreground">Valor Total</span>
                    <p className="font-bold text-lg text-primary">{formatarMoeda(documento.valorTotal)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Chave de Acesso</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-mono text-sm break-all bg-muted p-3 rounded">{documento.chaveAcesso}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Status de Lançamentos</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${documento.contabilizado ? "bg-green-500" : "bg-amber-500"}`}
                    />
                    <span className="text-sm">Contabilizado</span>
                  </div>
                  {documento.tipo === "nfe" && (
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-3 w-3 rounded-full ${documento.estoqueLancado ? "bg-green-500" : "bg-amber-500"}`}
                      />
                      <span className="text-sm">Estoque</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${documento.contasLancadas ? "bg-green-500" : "bg-amber-500"}`}
                    />
                    <span className="text-sm">Contas</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="participantes" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Emitente
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">CNPJ</span>
                    <p className="font-medium">{formatarCNPJ(documento.emitenteCnpj)}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Razão Social</span>
                    <p className="font-medium">{documento.emitenteNome}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Destinatário
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">CNPJ</span>
                    <p className="font-medium">{formatarCNPJ(documento.destinatarioCnpj)}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Razão Social</span>
                    <p className="font-medium">{documento.destinatarioNome}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="itens" className="space-y-4">
              {documento.tipo === "nfe" && dadosCompletos && "det" in dadosCompletos && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Produtos ({dadosCompletos.det.length} itens)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {dadosCompletos.det.map((item, idx) => (
                      <div key={idx} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium">{item.prod.xProd}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Cód: {item.prod.cProd} | NCM: {item.prod.NCM} | CFOP: {item.prod.CFOP}
                            </p>
                          </div>
                          <p className="font-bold">{formatarMoeda(Number.parseFloat(item.prod.vProd))}</p>
                        </div>
                        <div className="grid grid-cols-4 gap-2 mt-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Quantidade</span>
                            <p>
                              {item.prod.qCom} {item.prod.uCom}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Valor Unit.</span>
                            <p>{formatarMoeda(Number.parseFloat(item.prod.vUnCom))}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Origem</span>
                            <p>{item.imposto.ICMS.orig}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">CST</span>
                            <p>{item.imposto.ICMS.CST || item.imposto.ICMS.CSOSN}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {documento.tipo === "cte" &&
                dadosCompletos &&
                "infCTeNorm" in dadosCompletos &&
                dadosCompletos.infCTeNorm && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Informações da Carga</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-muted-foreground">Valor da Carga</span>
                          <p className="font-medium">
                            {formatarMoeda(Number.parseFloat(dadosCompletos.infCTeNorm.infCarga?.vCarga || "0"))}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Produto Predominante</span>
                          <p className="font-medium">{dadosCompletos.infCTeNorm.infCarga?.proPred}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
            </TabsContent>

            <TabsContent value="impostos" className="space-y-4">
              {documento.tipo === "nfe" && dadosCompletos && "total" in dadosCompletos && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Totais de Impostos</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">BC ICMS</span>
                      <p className="font-medium">
                        {formatarMoeda(Number.parseFloat(dadosCompletos.total.ICMSTot.vBC))}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">ICMS</span>
                      <p className="font-medium">
                        {formatarMoeda(Number.parseFloat(dadosCompletos.total.ICMSTot.vICMS))}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">BC ST</span>
                      <p className="font-medium">
                        {formatarMoeda(Number.parseFloat(dadosCompletos.total.ICMSTot.vBCST))}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">ICMS ST</span>
                      <p className="font-medium">
                        {formatarMoeda(Number.parseFloat(dadosCompletos.total.ICMSTot.vST))}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">IPI</span>
                      <p className="font-medium">
                        {formatarMoeda(Number.parseFloat(dadosCompletos.total.ICMSTot.vIPI))}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">PIS</span>
                      <p className="font-medium">
                        {formatarMoeda(Number.parseFloat(dadosCompletos.total.ICMSTot.vPIS))}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">COFINS</span>
                      <p className="font-medium">
                        {formatarMoeda(Number.parseFloat(dadosCompletos.total.ICMSTot.vCOFINS))}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Tributos</span>
                      <p className="font-medium">
                        {formatarMoeda(Number.parseFloat(dadosCompletos.total.ICMSTot.vTotTrib || "0"))}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {documento.tipo === "cte" && dadosCompletos && "imp" in dadosCompletos && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">ICMS do CT-e</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">CST</span>
                      <p className="font-medium">{dadosCompletos.imp.ICMS.CST}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">BC ICMS</span>
                      <p className="font-medium">
                        {formatarMoeda(Number.parseFloat(dadosCompletos.imp.ICMS.vBC || "0"))}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Alíquota</span>
                      <p className="font-medium">{dadosCompletos.imp.ICMS.pICMS || "0"}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Valor ICMS</span>
                      <p className="font-medium">
                        {formatarMoeda(Number.parseFloat(dadosCompletos.imp.ICMS.vICMS || "0"))}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="xml">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Conteúdo XML Original</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-96 whitespace-pre-wrap">
                    {dadosCompletos?.xmlOriginal || "XML não disponível"}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
