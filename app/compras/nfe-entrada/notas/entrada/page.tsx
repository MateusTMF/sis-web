"use client"

import { Suspense } from "react"
import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  X,
  FileText,
  Truck,
  CreditCard,
  Package,
  CheckSquare,
  Upload,
  Search,
  Plus,
  Trash2,
  RefreshCw,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Calculator,
  Link2,
  Percent,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import type { NotaFiscalEletronica } from "@/lib/types/nota-fiscal"
import type { ConhecimentoTransporteEletronico } from "@/lib/types/cte"
import { parseXML } from "@/lib/utils/xml-parser"
import { formatarMoeda } from "@/lib/utils/formatters"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type TabType = "nfe" | "cte" | "contas" | "conferencia" | "validacao"

// Mock Data
const PRODUTOS_SISTEMA = [
  {
    id: "PROD001",
    codigo: "001",
    nome: "Produto Exemplo 1",
    unidade: "UN",
    estoque: 100,
    custoMedio: 45.5,
    fornecedorVinculado: null,
  },
  {
    id: "PROD002",
    codigo: "002",
    nome: "Produto Exemplo 2",
    unidade: "KG",
    estoque: 50,
    custoMedio: 22.0,
    fornecedorVinculado: null,
  },
  {
    id: "PROD004",
    codigo: "1409",
    nome: "TINTA ESMALTE SINTETICO PRETO",
    unidade: "LT",
    estoque: 200,
    custoMedio: 88.0,
    fornecedorVinculado: { cnpj: "11908486000187", codigoProdutoFornecedor: "1409" },
  },
]

const CFOP_OPTIONS = [
  { value: "1101", label: "1101 - Compra p/ industrialização" },
  { value: "1102", label: "1102 - Compra p/ comercialização" },
  {
    value: "1401",
    label: "1401 - Compra p/ industrialização em operação com mercadoria sujeita ao regime de substituição tributária",
  },
  {
    value: "1403",
    label: "1403 - Compra p/ comercialização em operação com mercadoria sujeita ao regime de substituição tributária",
  },
  { value: "2101", label: "2101 - Compra p/ industrialização" },
  { value: "2102", label: "2102 - Compra p/ comercialização" },
]

const CST_ICMS_OPTIONS = [
  { value: "000", label: "000 - Tributada integralmente" },
  { value: "010", label: "010 - Tributada e com cobrança de ICMS por ST" },
  { value: "020", label: "020 - Com redução de base de cálculo" },
  { value: "030", label: "030 - Isenta/não tributada com cobrança de ICMS por ST" },
  { value: "040", label: "040 - Isenta" },
  { value: "041", label: "041 - Não tributada" },
  { value: "050", label: "050 - Suspensão" },
  { value: "060", label: "060 - ICMS cobrado anteriormente por ST" },
  { value: "070", label: "070 - Com redução e cobrança de ICMS por ST" },
  { value: "090", label: "090 - Outras" },
]

const CST_PIS_COFINS_OPTIONS = [
  { value: "01", label: "01 - Tributável (base de cálculo = valor da operação)" },
  { value: "02", label: "02 - Tributável (base de cálculo = valor da operação - alíquota diferenciada)" },
  { value: "04", label: "04 - Tributável monofásica - revenda a alíquota zero" },
  { value: "06", label: "06 - Tributável a alíquota zero" },
  { value: "07", label: "07 - Isenta da contribuição" },
  { value: "08", label: "08 - Sem incidência da contribuição" },
  { value: "09", label: "09 - Com suspensão da contribuição" },
]

const CONTAS_DESPESA = [
  { codigo: "1928", nome: "DESP EXAMES ADMISSIONAL/DEMISSIONAL" },
  { codigo: "1931", nome: "DESP COMPRA MERCADORIAS" },
  { codigo: "1932", nome: "DESP FRETE SOBRE COMPRAS" },
]

const HISTORICOS_PADRAO = [
  { codigo: "130", nome: "EXAMES LABORATORIAIS" },
  { codigo: "131", nome: "COMPRA DE MERCADORIAS" },
  { codigo: "133", nome: "FRETE SOBRE COMPRAS" },
]

const TIPOS_PAGAMENTO = [
  { id: "1", nome: "DINHEIRO" },
  { id: "2", nome: "BOLETO" },
  { id: "3", nome: "CHEQUE" },
  { id: "4", nome: "TRANSFERÊNCIA" },
  { id: "5", nome: "PIX" },
]

interface ItemEditado {
  cfop: string
  cstIcms: string
  cstPis: string
  cstCofins: string
  aliqIcms: number
  aliqIpi: number
  aliqPis: number
  aliqCofins: number
  bcIcms: number
  bcIcmsSt: number
  vIcmsSt: number
  redBc: number
}

interface LancamentoCusto {
  id: string
  contaDebito: string
  descricaoDebito: string
  historicoPadrao: string
  valor: number
  historicoLivre: string
}

interface Parcela {
  numero: number
  dataVencimento: string
  valor: number
  situacao: string
}

function EntradaNotaContent() {
  const router = useRouter()
  const { toast } = useToast()

  // Estados principais
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [tabAtual, setTabAtual] = useState<TabType>("nfe")
  const [notaFiscal, setNotaFiscal] = useState<Partial<NotaFiscalEletronica> | null>(null)
  const [cteVinculado, setCteVinculado] = useState<Partial<ConhecimentoTransporteEletronico> | null>(null)
  const [statusNota, setStatusNota] = useState<"pendente" | "atualizado" | "bloqueado">("pendente")

  // Estados XML
  const [xmlNfeContent, setXmlNfeContent] = useState("")
  const [xmlCteContent, setXmlCteContent] = useState("")
  const [processandoNfe, setProcessandoNfe] = useState(false)
  const [processandoCte, setProcessandoCte] = useState(false)
  const [erroNfe, setErroNfe] = useState<string | null>(null)
  const [erroCte, setErroCte] = useState<string | null>(null)

  // Estados de vínculo e edição de produtos
  const [vinculos, setVinculos] = useState<Map<string, string>>(new Map())
  const [itensEditados, setItensEditados] = useState<Map<string, ItemEditado>>(new Map())
  const [itemDetalheAberto, setItemDetalheAberto] = useState<string | null>(null)
  const [buscaProduto, setBuscaProduto] = useState("")

  // Estados do cabeçalho da nota
  const [dataEmissao, setDataEmissao] = useState("")
  const [dataEntrada, setDataEntrada] = useState(new Date().toISOString().split("T")[0])
  const [modeloNota, setModeloNota] = useState("55")
  const [tipoNotaFiscal, setTipoNotaFiscal] = useState("66")
  const [tipoFrete, setTipoFrete] = useState("embutido")
  const [tipoPagamentoNota, setTipoPagamentoNota] = useState("prazo")
  const [formaPagamentoNota, setFormaPagamentoNota] = useState("boleto")

  // Estados de contas a pagar
  const [dataLancamento, setDataLancamento] = useState(new Date().toISOString().split("T")[0])
  const [tipoPagamento, setTipoPagamento] = useState("2")
  const [numeroParcelas, setNumeroParcelas] = useState(1)
  const [vencimento, setVencimento] = useState("")
  const [status, setStatus] = useState("ATIVO")
  const [situacaoPagamento, setSituacaoPagamento] = useState("BLOQUEADO")
  const [observacao, setObservacao] = useState("")
  const [banco, setBanco] = useState("")
  const [parcelas, setParcelas] = useState<Parcela[]>([])
  const [showParcelas, setShowParcelas] = useState(false)

  // Estados de centro de custo
  const [contaDespesa, setContaDespesa] = useState("")
  const [historicoPadrao, setHistoricoPadrao] = useState("")
  const [dataBaseCompetencia, setDataBaseCompetencia] = useState(new Date().toISOString().split("T")[0])
  const [historicoLivre, setHistoricoLivre] = useState("")
  const [valorCusto, setValorCusto] = useState(0)
  const [lancamentosCusto, setLancamentosCusto] = useState<LancamentoCusto[]>([])
  const [tabCusto, setTabCusto] = useState("custo")

  // Valores calculados
  const valorNota = notaFiscal ? Number.parseFloat(notaFiscal.total?.ICMSTot?.vNF || "0") : 0
  const valorCte = cteVinculado ? Number.parseFloat(cteVinculado.vPrest?.vTPrest || "0") : 0
  const valorTotal = valorNota + valorCte

  // Auto vincular produtos do fornecedor
  useMemo(() => {
    if (notaFiscal?.det && notaFiscal.emit?.CNPJ) {
      const cnpjFornecedor = notaFiscal.emit.CNPJ
      const novosVinculos = new Map<string, string>()

      notaFiscal.det.forEach((item) => {
        const produtoVinculado = PRODUTOS_SISTEMA.find(
          (p) =>
            p.fornecedorVinculado?.cnpj === cnpjFornecedor &&
            p.fornecedorVinculado?.codigoProdutoFornecedor === item.prod.cProd,
        )
        if (produtoVinculado) {
          novosVinculos.set(item.nItem, produtoVinculado.id)
        }
      })

      if (novosVinculos.size > 0 && vinculos.size === 0) {
        setVinculos(novosVinculos)
      }
    }
  }, [notaFiscal?.det, notaFiscal?.emit?.CNPJ])

  // Handlers de arquivo
  const handleFileUploadNfe = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => setXmlNfeContent(e.target?.result as string)
    reader.readAsText(file)
  }, [])

  const handleFileUploadCte = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => setXmlCteContent(e.target?.result as string)
    reader.readAsText(file)
  }, [])

  const processarNfe = async () => {
    setProcessandoNfe(true)
    setErroNfe(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const resultado = parseXML(xmlNfeContent)
      if (resultado.tipo !== "nfe") throw new Error("XML não é uma NFe válida")
      setNotaFiscal(resultado.dados as Partial<NotaFiscalEletronica>)
      setStatusNota("pendente")
      setValorCusto(Number.parseFloat((resultado.dados as any).total?.ICMSTot?.vNF || "0"))
      const emissao = (resultado.dados as any).ide?.dhEmi?.split("T")[0] || ""
      setDataEmissao(emissao)
      toast({
        title: "NFe importada com sucesso!",
        description: `Nota ${(resultado.dados as any).ide?.nNF} carregada.`,
      })
    } catch (e: any) {
      setErroNfe(e.message || "Erro ao processar XML")
    } finally {
      setProcessandoNfe(false)
    }
  }

  const processarCte = async () => {
    setProcessandoCte(true)
    setErroCte(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const resultado = parseXML(xmlCteContent)
      if (resultado.tipo !== "cte") throw new Error("XML não é um CTe válido")
      setCteVinculado(resultado.dados as Partial<ConhecimentoTransporteEletronico>)
      toast({ title: "CTe vinculado!", description: `CTe ${(resultado.dados as any).ide?.nCT} carregado.` })
    } catch (e: any) {
      setErroCte(e.message || "Erro ao processar XML")
    } finally {
      setProcessandoCte(false)
    }
  }

  const handleVincularProduto = (itemNota: string, produtoSistema: string) => {
    const novosVinculos = new Map(vinculos)
    novosVinculos.set(itemNota, produtoSistema)
    setVinculos(novosVinculos)
  }

  const handleEditarItem = (nItem: string, campo: keyof ItemEditado, valor: any) => {
    const novosItens = new Map(itensEditados)
    const itemAtual = novosItens.get(nItem) || {
      cfop: "",
      cstIcms: "",
      cstPis: "",
      cstCofins: "",
      aliqIcms: 0,
      aliqIpi: 0,
      aliqPis: 0,
      aliqCofins: 0,
      bcIcms: 0,
      bcIcmsSt: 0,
      vIcmsSt: 0,
      redBc: 0,
    }
    novosItens.set(nItem, { ...itemAtual, [campo]: valor })
    setItensEditados(novosItens)
  }

  const getItemEditado = (item: any): ItemEditado => {
    const editado = itensEditados.get(item.nItem)
    const icms = item.imposto?.ICMS?.ICMS00 || item.imposto?.ICMS?.ICMS10 || item.imposto?.ICMS?.ICMS60 || {}
    return {
      cfop: editado?.cfop || item.prod.CFOP || "",
      cstIcms: editado?.cstIcms || icms.CST || "000",
      cstPis: editado?.cstPis || item.imposto?.PIS?.PISAliq?.CST || "01",
      cstCofins: editado?.cstCofins || item.imposto?.COFINS?.COFINSAliq?.CST || "01",
      aliqIcms: editado?.aliqIcms ?? Number.parseFloat(icms.pICMS || "0"),
      aliqIpi: editado?.aliqIpi ?? Number.parseFloat(item.imposto?.IPI?.IPITrib?.pIPI || "0"),
      aliqPis: editado?.aliqPis ?? Number.parseFloat(item.imposto?.PIS?.PISAliq?.pPIS || "0"),
      aliqCofins: editado?.aliqCofins ?? Number.parseFloat(item.imposto?.COFINS?.COFINSAliq?.pCOFINS || "0"),
      bcIcms: editado?.bcIcms ?? Number.parseFloat(icms.vBC || "0"),
      bcIcmsSt: editado?.bcIcmsSt ?? Number.parseFloat(item.imposto?.ICMS?.ICMS10?.vBCST || "0"),
      vIcmsSt: editado?.vIcmsSt ?? Number.parseFloat(item.imposto?.ICMS?.ICMS10?.vICMSST || "0"),
      redBc: editado?.redBc ?? Number.parseFloat(icms.pRedBC || "0"),
    }
  }

  const todosVinculados = useMemo(() => {
    return notaFiscal?.det?.every((item) => vinculos.has(item.nItem)) || false
  }, [notaFiscal?.det, vinculos])

  const gerarParcelas = () => {
    const novasParcelas: Parcela[] = []
    const valorParcela = valorTotal / numeroParcelas
    const hoje = new Date()
    for (let i = 0; i < numeroParcelas; i++) {
      const dataVencimento = new Date(hoje)
      dataVencimento.setDate(dataVencimento.getDate() + 30 * (i + 1))
      novasParcelas.push({
        numero: i + 1,
        dataVencimento: dataVencimento.toISOString().split("T")[0],
        valor: valorParcela,
        situacao: "ABERTO",
      })
    }
    setParcelas(novasParcelas)
    setShowParcelas(true)
    if (novasParcelas.length > 0) setVencimento(novasParcelas[0].dataVencimento)
  }

  const handleEditarParcela = (index: number, campo: keyof Parcela, valor: any) => {
    const novasParcelas = [...parcelas]
    novasParcelas[index] = { ...novasParcelas[index], [campo]: valor }
    setParcelas(novasParcelas)
  }

  const adicionarLancamentoCusto = () => {
    if (!contaDespesa || !valorCusto) return
    const contaSelecionada = CONTAS_DESPESA.find((c) => c.codigo === contaDespesa)
    const historicoSelecionado = HISTORICOS_PADRAO.find((h) => h.codigo === historicoPadrao)
    setLancamentosCusto([
      ...lancamentosCusto,
      {
        id: Date.now().toString(),
        contaDebito: contaDespesa,
        descricaoDebito: contaSelecionada?.nome || "",
        historicoPadrao: historicoSelecionado?.nome || "",
        valor: valorCusto,
        historicoLivre,
      },
    ])
    setValorCusto(0)
    setHistoricoLivre("")
  }

  const handleFinalizarEntrada = () => {
    if (!todosVinculados) {
      toast({ title: "Atenção", description: "Vincule todos os produtos antes de finalizar.", variant: "destructive" })
      return
    }
    setStatusNota("atualizado")
    toast({ title: "Entrada realizada com sucesso!", description: "Nota fiscal registrada no sistema." })
    router.push("/compras/nfe-entrada/notas")
  }

  const handleCancelarEntrada = () => {
    setShowCancelDialog(false)
    router.push("/compras/nfe-entrada/notas")
  }

  const totalLancamentos = lancamentosCusto.reduce((acc, l) => acc + l.valor, 0)
  const totalParcelas = parcelas.reduce((acc, p) => acc + p.valor, 0)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1800px] p-2 sm:p-3 md:p-4 space-y-2 sm:space-y-3">
        {/* Header Compacto */}
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-2 sm:p-3 md:p-4">
            <div className="flex flex-col gap-2">
              {/* Linha 1: Navegação e Ações */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => setShowCancelDialog(true)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div className="min-w-0">
                    <h1 className="text-sm sm:text-base md:text-lg font-semibold truncate">Entrada de Nota Fiscal</h1>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      Lançamento e manutenção de notas fiscal de entrada
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 sm:h-8 text-xs text-destructive bg-transparent"
                    onClick={() => setShowCancelDialog(true)}
                  >
                    <X className="h-3 w-3 mr-1" /> Cancelar
                  </Button>
                  <Button
                    size="sm"
                    className="h-7 sm:h-8 text-xs bg-green-600 hover:bg-green-700"
                    onClick={handleFinalizarEntrada}
                    disabled={!notaFiscal || !todosVinculados}
                  >
                    <CheckSquare className="h-3 w-3 mr-1" /> Finalizar
                  </Button>
                  <Badge
                    variant={
                      statusNota === "atualizado" ? "default" : statusNota === "bloqueado" ? "destructive" : "secondary"
                    }
                    className="text-xs"
                  >
                    {statusNota.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Resumo da Nota - Grid Responsivo */}
              {notaFiscal && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-1.5 sm:gap-2 bg-muted/50 p-2 rounded-lg text-xs">
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Nº Nota</Label>
                    <Input value={notaFiscal.ide?.nNF || ""} className="h-7 text-xs bg-amber-50 font-bold" readOnly />
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Série</Label>
                    <Input value={notaFiscal.ide?.serie || ""} className="h-7 text-xs" readOnly />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <Label className="text-[10px] text-muted-foreground">Modelo</Label>
                    <Select value={modeloNota} onValueChange={setModeloNota}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="55">55 - NFe</SelectItem>
                        <SelectItem value="65">65 - NFC-e</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-[10px] text-muted-foreground">Tipo</Label>
                    <Select value={tipoNotaFiscal} onValueChange={setTipoNotaFiscal}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="66">66 COMPRA MATÉRIA</SelectItem>
                        <SelectItem value="67">67 COMPRA REVENDA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 lg:col-span-2">
                    <Label className="text-[10px] text-muted-foreground">Fornecedor</Label>
                    <Input value={notaFiscal.emit?.xNome || ""} className="h-7 text-xs truncate" readOnly />
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Emissão</Label>
                    <Input
                      type="date"
                      value={dataEmissao}
                      onChange={(e) => setDataEmissao(e.target.value)}
                      className="h-7 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Entrada</Label>
                    <Input
                      type="date"
                      value={dataEntrada}
                      onChange={(e) => setDataEntrada(e.target.value)}
                      className="h-7 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Opções de Pagamento e Valores */}
              {notaFiscal && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-1.5 sm:gap-2 text-xs">
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Frete</Label>
                    <Select value={tipoFrete} onValueChange={setTipoFrete}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="embutido">Embutido</SelectItem>
                        <SelectItem value="terceiro">Terceiro</SelectItem>
                        <SelectItem value="sem">Sem Frete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Pagamento</Label>
                    <Select value={tipoPagamentoNota} onValueChange={setTipoPagamentoNota}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vista">À Vista</SelectItem>
                        <SelectItem value="prazo">A Prazo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Forma</Label>
                    <Select value={formaPagamentoNota} onValueChange={setFormaPagamentoNota}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="boleto">Boleto</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Parcelas</Label>
                    <Input
                      type="number"
                      min={1}
                      value={numeroParcelas}
                      onChange={(e) => setNumeroParcelas(Number(e.target.value))}
                      className="h-7 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground">CTe</Label>
                    <Input
                      value={cteVinculado ? formatarMoeda(valorCte) : "Sem CTe"}
                      className="h-7 text-xs bg-muted"
                      readOnly
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Valor NF</Label>
                    <Input
                      value={formatarMoeda(valorNota)}
                      className="h-7 text-xs bg-blue-50 font-bold text-blue-700"
                      readOnly
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Total</Label>
                    <Input
                      value={formatarMoeda(valorTotal)}
                      className="h-7 text-xs bg-green-50 font-bold text-green-700"
                      readOnly
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs Principais */}
        <Tabs value={tabAtual} onValueChange={(v) => setTabAtual(v as TabType)} className="w-full">
          <TabsList className="w-full h-auto flex flex-wrap justify-start gap-0.5 sm:gap-1 bg-muted/50 p-1 rounded-lg">
            <TabsTrigger value="nfe" className="text-xs flex-1 sm:flex-none h-8">
              <FileText className="h-3 w-3 mr-1 hidden sm:inline" /> NFe
            </TabsTrigger>
            <TabsTrigger value="cte" className="text-xs flex-1 sm:flex-none h-8" disabled={!notaFiscal}>
              <Truck className="h-3 w-3 mr-1 hidden sm:inline" /> CTe
            </TabsTrigger>
            <TabsTrigger value="contas" className="text-xs flex-1 sm:flex-none h-8" disabled={!notaFiscal}>
              <CreditCard className="h-3 w-3 mr-1 hidden sm:inline" /> Contas
            </TabsTrigger>
            <TabsTrigger value="conferencia" className="text-xs flex-1 sm:flex-none h-8" disabled={!notaFiscal}>
              <Package className="h-3 w-3 mr-1 hidden sm:inline" /> Conf.
            </TabsTrigger>
            <TabsTrigger value="validacao" className="text-xs flex-1 sm:flex-none h-8" disabled={!notaFiscal}>
              <CheckSquare className="h-3 w-3 mr-1 hidden sm:inline" /> Valid.
            </TabsTrigger>
          </TabsList>

          {/* Aba NFe */}
          <TabsContent value="nfe" className="mt-2 space-y-2">
            {!notaFiscal ? (
              <Card>
                <CardContent className="p-3 sm:p-4 space-y-3">
                  <div
                    className="border-2 border-dashed rounded-lg p-4 sm:p-8 text-center hover:border-primary transition-colors cursor-pointer"
                    onClick={() => document.getElementById("file-upload-nfe")?.click()}
                  >
                    <input
                      id="file-upload-nfe"
                      type="file"
                      accept=".xml"
                      onChange={handleFileUploadNfe}
                      className="hidden"
                    />
                    <Upload className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Arraste o XML ou clique para selecionar</p>
                    <p className="text-xs text-muted-foreground mt-1">Arquivos XML de NFe</p>
                  </div>
                  <Textarea
                    placeholder="Ou cole o conteúdo do XML aqui..."
                    value={xmlNfeContent}
                    onChange={(e) => setXmlNfeContent(e.target.value)}
                    className="font-mono text-xs h-32"
                  />
                  {erroNfe && (
                    <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-2 rounded text-xs">
                      <AlertCircle className="h-4 w-4 shrink-0" /> {erroNfe}
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setXmlNfeContent("")}>
                      Limpar
                    </Button>
                    <Button size="sm" onClick={processarNfe} disabled={!xmlNfeContent || processandoNfe}>
                      {processandoNfe && <Loader2 className="mr-1 h-3 w-3 animate-spin" />} Processar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Header da Tabela de Itens */}
                <Card>
                  <CardHeader className="p-2 sm:p-3 pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Package className="h-4 w-4" /> ITENS DA NOTA
                      </CardTitle>
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="relative">
                          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                          <Input
                            placeholder="Buscar..."
                            value={buscaProduto}
                            onChange={(e) => setBuscaProduto(e.target.value)}
                            className="h-7 text-xs pl-7 w-32 sm:w-40"
                          />
                        </div>
                        <Badge
                          variant={todosVinculados ? "default" : "secondary"}
                          className="text-xs whitespace-nowrap"
                        >
                          {vinculos.size}/{notaFiscal.det?.length || 0}
                        </Badge>
                      </div>
                    </div>
                    {/* Legenda */}
                    <div className="flex flex-wrap gap-2 sm:gap-3 text-[10px] sm:text-xs mt-2 pb-2 border-b">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded" /> Auto vinculado
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-blue-500 rounded" /> Vinculado manual
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-amber-500 rounded" /> Pendente
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 sm:p-2">
                    <ScrollArea className="h-[300px] sm:h-[350px]">
                      <div className="min-w-[600px]">
                        <Table>
                          <TableHeader>
                            <TableRow className="text-[10px] sm:text-xs">
                              <TableHead className="w-10 sm:w-12">Cod.</TableHead>
                              <TableHead className="min-w-[120px]">Descrição</TableHead>
                              <TableHead className="w-8 sm:w-10">UN</TableHead>
                              <TableHead className="w-12 sm:w-14 text-right">Qtd</TableHead>
                              <TableHead className="w-12 sm:w-14">CFOP</TableHead>
                              <TableHead className="w-14 sm:w-16 text-right">Valor</TableHead>
                              <TableHead className="w-10 sm:w-12 text-right">ICMS</TableHead>
                              <TableHead className="w-10 sm:w-12 text-right">IPI</TableHead>
                              <TableHead className="min-w-[120px]">Vincular</TableHead>
                              <TableHead className="w-14 sm:w-16 text-center">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {notaFiscal.det
                              ?.filter(
                                (item) =>
                                  !buscaProduto ||
                                  item.prod.xProd.toLowerCase().includes(buscaProduto.toLowerCase()) ||
                                  item.prod.cProd.includes(buscaProduto),
                              )
                              .map((item, idx) => {
                                const vinculado = vinculos.get(item.nItem)
                                const produtoVinculado = PRODUTOS_SISTEMA.find((p) => p.id === vinculado)
                                const autoVinculado =
                                  produtoVinculado?.fornecedorVinculado?.codigoProdutoFornecedor === item.prod.cProd
                                const itemEdit = getItemEditado(item)
                                const isDetalheAberto = itemDetalheAberto === item.nItem

                                return (
                                  <>
                                    <TableRow
                                      key={idx}
                                      className={`text-[10px] sm:text-xs cursor-pointer hover:bg-muted/50 ${
                                        vinculado ? (autoVinculado ? "bg-green-50" : "bg-blue-50") : "bg-amber-50"
                                      }`}
                                      onClick={() => setItemDetalheAberto(isDetalheAberto ? null : item.nItem)}
                                    >
                                      <TableCell className="font-mono py-1.5">{item.prod.cProd}</TableCell>
                                      <TableCell className="font-medium truncate max-w-[150px] py-1.5">
                                        {item.prod.xProd}
                                      </TableCell>
                                      <TableCell className="py-1.5">{item.prod.uCom}</TableCell>
                                      <TableCell className="text-right py-1.5">
                                        {Number.parseFloat(item.prod.qCom).toFixed(2)}
                                      </TableCell>
                                      <TableCell className="py-1.5">{itemEdit.cfop}</TableCell>
                                      <TableCell className="text-right font-bold py-1.5">
                                        {formatarMoeda(Number.parseFloat(item.prod.vProd))}
                                      </TableCell>
                                      <TableCell className="text-right py-1.5">
                                        {itemEdit.aliqIcms.toFixed(1)}%
                                      </TableCell>
                                      <TableCell className="text-right py-1.5">
                                        {itemEdit.aliqIpi.toFixed(1)}%
                                      </TableCell>
                                      <TableCell className="py-1.5" onClick={(e) => e.stopPropagation()}>
                                        <Select
                                          value={vinculado || ""}
                                          onValueChange={(v) => handleVincularProduto(item.nItem, v)}
                                        >
                                          <SelectTrigger
                                            className={`h-6 text-[10px] sm:text-xs ${vinculado ? "border-green-500" : "border-amber-500"}`}
                                          >
                                            <SelectValue placeholder="Selecione..." />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {PRODUTOS_SISTEMA.map((p) => (
                                              <SelectItem key={p.id} value={p.id} className="text-xs">
                                                {p.codigo} - {p.nome}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </TableCell>
                                      <TableCell className="text-center py-1.5">
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                          {isDetalheAberto ? (
                                            <ChevronUp className="h-3 w-3" />
                                          ) : (
                                            <ChevronDown className="h-3 w-3" />
                                          )}
                                        </Button>
                                      </TableCell>
                                    </TableRow>

                                    {/* Linha de Detalhes Expandida */}
                                    {isDetalheAberto && (
                                      <TableRow className="bg-muted/30">
                                        <TableCell colSpan={10} className="p-2 sm:p-3">
                                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                            {/* Produto Vinculado Info */}
                                            {produtoVinculado && (
                                              <div className="bg-white p-2 sm:p-3 rounded-lg border">
                                                <h4 className="text-xs font-semibold flex items-center gap-1 mb-2">
                                                  <Link2 className="h-3 w-3" /> Produto Vinculado
                                                </h4>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                                  <div>
                                                    <Label className="text-[10px] text-muted-foreground">Código</Label>
                                                    <p className="font-mono font-bold">{produtoVinculado.codigo}</p>
                                                  </div>
                                                  <div>
                                                    <Label className="text-[10px] text-muted-foreground">Nome</Label>
                                                    <p className="truncate">{produtoVinculado.nome}</p>
                                                  </div>
                                                  <div>
                                                    <Label className="text-[10px] text-muted-foreground">Estoque</Label>
                                                    <p className="font-bold">
                                                      {produtoVinculado.estoque} {produtoVinculado.unidade}
                                                    </p>
                                                  </div>
                                                  <div>
                                                    <Label className="text-[10px] text-muted-foreground">
                                                      Custo Médio
                                                    </Label>
                                                    <p className="font-bold text-blue-600">
                                                      {formatarMoeda(produtoVinculado.custoMedio)}
                                                    </p>
                                                  </div>
                                                </div>
                                                {autoVinculado && (
                                                  <Badge
                                                    variant="outline"
                                                    className="mt-2 text-[10px] border-green-500 text-green-700"
                                                  >
                                                    <CheckCircle className="h-3 w-3 mr-1" /> Vinculado automaticamente
                                                    pelo fornecedor
                                                  </Badge>
                                                )}
                                              </div>
                                            )}

                                            {/* Edição de Tributação */}
                                            <div className="bg-white p-2 sm:p-3 rounded-lg border">
                                              <h4 className="text-xs font-semibold flex items-center gap-1 mb-2">
                                                <Percent className="h-3 w-3" /> Tributação
                                              </h4>
                                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                                <div>
                                                  <Label className="text-[10px]">CFOP</Label>
                                                  <Select
                                                    value={itemEdit.cfop}
                                                    onValueChange={(v) => handleEditarItem(item.nItem, "cfop", v)}
                                                  >
                                                    <SelectTrigger className="h-7 text-xs">
                                                      <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      {CFOP_OPTIONS.map((o) => (
                                                        <SelectItem key={o.value} value={o.value} className="text-xs">
                                                          {o.label}
                                                        </SelectItem>
                                                      ))}
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                <div>
                                                  <Label className="text-[10px]">CST ICMS</Label>
                                                  <Select
                                                    value={itemEdit.cstIcms}
                                                    onValueChange={(v) => handleEditarItem(item.nItem, "cstIcms", v)}
                                                  >
                                                    <SelectTrigger className="h-7 text-xs">
                                                      <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      {CST_ICMS_OPTIONS.map((o) => (
                                                        <SelectItem key={o.value} value={o.value} className="text-xs">
                                                          {o.label}
                                                        </SelectItem>
                                                      ))}
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                <div>
                                                  <Label className="text-[10px]">Alíq. ICMS %</Label>
                                                  <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={itemEdit.aliqIcms}
                                                    onChange={(e) =>
                                                      handleEditarItem(item.nItem, "aliqIcms", Number(e.target.value))
                                                    }
                                                    className="h-7 text-xs"
                                                  />
                                                </div>
                                                <div>
                                                  <Label className="text-[10px]">BC ICMS</Label>
                                                  <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={itemEdit.bcIcms}
                                                    onChange={(e) =>
                                                      handleEditarItem(item.nItem, "bcIcms", Number(e.target.value))
                                                    }
                                                    className="h-7 text-xs"
                                                  />
                                                </div>
                                                <div>
                                                  <Label className="text-[10px]">BC ICMS ST</Label>
                                                  <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={itemEdit.bcIcmsSt}
                                                    onChange={(e) =>
                                                      handleEditarItem(item.nItem, "bcIcmsSt", Number(e.target.value))
                                                    }
                                                    className="h-7 text-xs"
                                                  />
                                                </div>
                                                <div>
                                                  <Label className="text-[10px]">Valor ST</Label>
                                                  <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={itemEdit.vIcmsSt}
                                                    onChange={(e) =>
                                                      handleEditarItem(item.nItem, "vIcmsSt", Number(e.target.value))
                                                    }
                                                    className="h-7 text-xs"
                                                  />
                                                </div>
                                                <div>
                                                  <Label className="text-[10px]">Alíq. IPI %</Label>
                                                  <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={itemEdit.aliqIpi}
                                                    onChange={(e) =>
                                                      handleEditarItem(item.nItem, "aliqIpi", Number(e.target.value))
                                                    }
                                                    className="h-7 text-xs"
                                                  />
                                                </div>
                                                <div>
                                                  <Label className="text-[10px]">Red. BC %</Label>
                                                  <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={itemEdit.redBc}
                                                    onChange={(e) =>
                                                      handleEditarItem(item.nItem, "redBc", Number(e.target.value))
                                                    }
                                                    className="h-7 text-xs"
                                                  />
                                                </div>
                                              </div>
                                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mt-2">
                                                <div>
                                                  <Label className="text-[10px]">CST PIS</Label>
                                                  <Select
                                                    value={itemEdit.cstPis}
                                                    onValueChange={(v) => handleEditarItem(item.nItem, "cstPis", v)}
                                                  >
                                                    <SelectTrigger className="h-7 text-xs">
                                                      <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      {CST_PIS_COFINS_OPTIONS.map((o) => (
                                                        <SelectItem key={o.value} value={o.value} className="text-xs">
                                                          {o.label}
                                                        </SelectItem>
                                                      ))}
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                <div>
                                                  <Label className="text-[10px]">Alíq. PIS %</Label>
                                                  <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={itemEdit.aliqPis}
                                                    onChange={(e) =>
                                                      handleEditarItem(item.nItem, "aliqPis", Number(e.target.value))
                                                    }
                                                    className="h-7 text-xs"
                                                  />
                                                </div>
                                                <div>
                                                  <Label className="text-[10px]">CST COFINS</Label>
                                                  <Select
                                                    value={itemEdit.cstCofins}
                                                    onValueChange={(v) => handleEditarItem(item.nItem, "cstCofins", v)}
                                                  >
                                                    <SelectTrigger className="h-7 text-xs">
                                                      <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      {CST_PIS_COFINS_OPTIONS.map((o) => (
                                                        <SelectItem key={o.value} value={o.value} className="text-xs">
                                                          {o.label}
                                                        </SelectItem>
                                                      ))}
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                                <div>
                                                  <Label className="text-[10px]">Alíq. COFINS %</Label>
                                                  <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={itemEdit.aliqCofins}
                                                    onChange={(e) =>
                                                      handleEditarItem(item.nItem, "aliqCofins", Number(e.target.value))
                                                    }
                                                    className="h-7 text-xs"
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </>
                                )
                              })}
                          </TableBody>
                        </Table>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Totais da Nota */}
                <Card className="bg-muted/30">
                  <CardContent className="p-2 sm:p-3">
                    <h4 className="text-xs font-semibold mb-2">TOTAIS DA NOTA</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                      <div>
                        <span className="text-muted-foreground">Tot.Prod:</span>
                        <p className="font-bold text-blue-600">
                          {formatarMoeda(Number.parseFloat(notaFiscal.total?.ICMSTot?.vProd || "0"))}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Frete:</span>
                        <p className="font-bold">
                          {formatarMoeda(Number.parseFloat(notaFiscal.total?.ICMSTot?.vFrete || "0"))}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Seguro:</span>
                        <p className="font-bold">
                          {formatarMoeda(Number.parseFloat(notaFiscal.total?.ICMSTot?.vSeg || "0"))}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Desconto:</span>
                        <p className="font-bold text-green-600">
                          {formatarMoeda(Number.parseFloat(notaFiscal.total?.ICMSTot?.vDesc || "0"))}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">BC ICMS:</span>
                        <p className="font-bold">
                          {formatarMoeda(Number.parseFloat(notaFiscal.total?.ICMSTot?.vBC || "0"))}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">ICMS:</span>
                        <p className="font-bold text-blue-600">
                          {formatarMoeda(Number.parseFloat(notaFiscal.total?.ICMSTot?.vICMS || "0"))}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">IPI:</span>
                        <p className="font-bold text-blue-600">
                          {formatarMoeda(Number.parseFloat(notaFiscal.total?.ICMSTot?.vIPI || "0"))}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total NF:</span>
                        <p className="font-bold text-lg text-primary">{formatarMoeda(valorNota)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Aba CTe */}
          <TabsContent value="cte" className="mt-2">
            <Card>
              <CardContent className="p-3 sm:p-4 space-y-3">
                {!cteVinculado ? (
                  <>
                    <div
                      className="border-2 border-dashed rounded-lg p-4 sm:p-6 text-center hover:border-primary transition-colors cursor-pointer"
                      onClick={() => document.getElementById("file-upload-cte")?.click()}
                    >
                      <input
                        id="file-upload-cte"
                        type="file"
                        accept=".xml"
                        onChange={handleFileUploadCte}
                        className="hidden"
                      />
                      <Truck className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">Importar XML do CT-e (Opcional)</p>
                      <p className="text-xs text-muted-foreground mt-1">Se não houver frete, continue sem vincular</p>
                    </div>
                    <Textarea
                      placeholder="Ou cole o XML do CTe..."
                      value={xmlCteContent}
                      onChange={(e) => setXmlCteContent(e.target.value)}
                      className="font-mono text-xs h-24"
                    />
                    {erroCte && (
                      <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-2 rounded text-xs">
                        <AlertCircle className="h-4 w-4 shrink-0" /> {erroCte}
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row justify-between gap-2">
                      <Button variant="secondary" size="sm" onClick={() => setTabAtual("contas")}>
                        Continuar Sem Frete
                      </Button>
                      <Button size="sm" onClick={processarCte} disabled={!xmlCteContent || processandoCte}>
                        {processandoCte && <Loader2 className="mr-1 h-3 w-3 animate-spin" />} Vincular CTe
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-green-900">CT-e Vinculado</h3>
                        <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-green-800">
                          <div>
                            <span className="text-green-600 text-xs">Número:</span>{" "}
                            <span className="font-bold">{cteVinculado.ide?.nCT}</span>
                          </div>
                          <div>
                            <span className="text-green-600 text-xs">Série:</span>{" "}
                            <span className="font-bold">{cteVinculado.ide?.serie}</span>
                          </div>
                          <div>
                            <span className="text-green-600 text-xs">Valor:</span>{" "}
                            <span className="font-bold">{formatarMoeda(valorCte)}</span>
                          </div>
                          <div>
                            <span className="text-green-600 text-xs">Modal:</span>{" "}
                            <span className="font-bold">
                              {cteVinculado.ide?.modal === "01" ? "Rodoviário" : cteVinculado.ide?.modal}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-green-800">
                          <span className="text-green-600 text-xs">Transportadora:</span>{" "}
                          <span className="font-bold">{cteVinculado.emit?.xNome}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCteVinculado(null)
                          setXmlCteContent("")
                        }}
                      >
                        <X className="h-3 w-3 mr-1" /> Remover
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Contas a Pagar */}
          <TabsContent value="contas" className="mt-2 space-y-2">
            <Card>
              <CardContent className="p-2 sm:p-3 space-y-3">
                {/* Dados do Lançamento */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5 sm:gap-2 text-xs">
                  <div>
                    <Label className="text-[10px]">Lançamento</Label>
                    <Input value="AUTO" className="h-7 text-xs bg-amber-50" readOnly />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <Label className="text-[10px]">Data Lanç.</Label>
                    <Input
                      type="date"
                      value={dataLancamento}
                      onChange={(e) => setDataLancamento(e.target.value)}
                      className="h-7 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px]">Nota Fiscal</Label>
                    <Input value={notaFiscal?.ide?.nNF || ""} className="h-7 text-xs bg-muted" readOnly />
                  </div>
                  <div>
                    <Label className="text-[10px]">Série</Label>
                    <Input value={notaFiscal?.ide?.serie || ""} className="h-7 text-xs bg-muted" readOnly />
                  </div>
                  <div className="col-span-2 sm:col-span-2 lg:col-span-1">
                    <Label className="text-[10px]">Fornecedor</Label>
                    <Input value={notaFiscal?.emit?.xNome || ""} className="h-7 text-xs truncate" readOnly />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-1.5 sm:gap-2 text-xs">
                  <div>
                    <Label className="text-[10px]">Tipo Pagamento</Label>
                    <Select value={tipoPagamento} onValueChange={setTipoPagamento}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIPOS_PAGAMENTO.map((t) => (
                          <SelectItem key={t.id} value={t.id} className="text-xs">
                            {t.id} - {t.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[10px]">Qtd. Parcelas</Label>
                    <div className="flex gap-1">
                      <Input
                        type="number"
                        min={1}
                        value={numeroParcelas}
                        onChange={(e) => setNumeroParcelas(Number(e.target.value))}
                        className="h-7 text-xs"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 w-7 p-0 shrink-0 bg-transparent"
                        onClick={gerarParcelas}
                      >
                        <Calculator className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-[10px]">Valor Total</Label>
                    <Input value={formatarMoeda(valorTotal)} className="h-7 text-xs bg-muted font-bold" readOnly />
                  </div>
                  <div>
                    <Label className="text-[10px]">1º Vencimento</Label>
                    <Input
                      type="date"
                      value={vencimento}
                      onChange={(e) => setVencimento(e.target.value)}
                      className="h-7 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px]">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ATIVO">ATIVO</SelectItem>
                        <SelectItem value="PAGO">PAGO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[10px]">Situação</Label>
                    <Badge
                      variant={situacaoPagamento === "BLOQUEADO" ? "destructive" : "default"}
                      className="w-full justify-center h-7 text-xs"
                    >
                      {situacaoPagamento}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-[10px]">Banco</Label>
                    <Select value={banco} onValueChange={setBanco}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="001">001 - BB</SelectItem>
                        <SelectItem value="237">237 - BRAD</SelectItem>
                        <SelectItem value="341">341 - ITAU</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-[10px]">Observação</Label>
                  <Input
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                    className="h-7 text-xs"
                    placeholder="Observações..."
                  />
                </div>

                {/* Pré-visualização de Parcelas */}
                <Collapsible open={showParcelas} onOpenChange={setShowParcelas}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full h-8 text-xs bg-transparent">
                      {showParcelas ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
                      {parcelas.length > 0
                        ? `Ver/Editar ${parcelas.length} Parcela(s) - Total: ${formatarMoeda(totalParcelas)}`
                        : "Gerar Parcelas"}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    {parcelas.length === 0 ? (
                      <div className="text-center py-4 text-xs text-muted-foreground">
                        <Calculator className="h-6 w-6 mx-auto mb-2 opacity-50" />
                        <p>Clique no botão ao lado de "Qtd. Parcelas" para gerar</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <ScrollArea className="h-[180px] border rounded-lg p-2">
                          <div className="space-y-2">
                            {parcelas.map((parcela, idx) => (
                              <div
                                key={idx}
                                className="grid grid-cols-4 gap-2 items-center bg-muted/50 p-2 rounded text-xs"
                              >
                                <div>
                                  <Label className="text-[10px]">Parcela</Label>
                                  <p className="font-bold">
                                    {parcela.numero}/{parcelas.length}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-[10px]">Vencimento</Label>
                                  <Input
                                    type="date"
                                    value={parcela.dataVencimento}
                                    onChange={(e) => handleEditarParcela(idx, "dataVencimento", e.target.value)}
                                    className="h-7 text-xs"
                                  />
                                </div>
                                <div>
                                  <Label className="text-[10px]">Valor</Label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={parcela.valor}
                                    onChange={(e) => handleEditarParcela(idx, "valor", Number(e.target.value))}
                                    className="h-7 text-xs"
                                  />
                                </div>
                                <div>
                                  <Label className="text-[10px]">Situação</Label>
                                  <Select
                                    value={parcela.situacao}
                                    onValueChange={(v) => handleEditarParcela(idx, "situacao", v)}
                                  >
                                    <SelectTrigger className="h-7 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="ABERTO">ABERTO</SelectItem>
                                      <SelectItem value="PAGO">PAGO</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        <div className="flex justify-between items-center text-xs px-2">
                          <span className="text-muted-foreground">Total das Parcelas:</span>
                          <span
                            className={`font-bold ${Math.abs(totalParcelas - valorTotal) < 0.01 ? "text-green-600" : "text-red-600"}`}
                          >
                            {formatarMoeda(totalParcelas)}
                            {Math.abs(totalParcelas - valorTotal) >= 0.01 &&
                              ` (Dif: ${formatarMoeda(valorTotal - totalParcelas)})`}
                          </span>
                        </div>
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>

            {/* Centro de Custo */}
            <Card>
              <CardContent className="p-0">
                <Tabs value={tabCusto} onValueChange={setTabCusto}>
                  <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-8 p-0">
                    <TabsTrigger
                      value="custo"
                      className="text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-primary h-8"
                    >
                      Centro de Custo
                    </TabsTrigger>
                    <TabsTrigger
                      value="movimentacao"
                      className="text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-primary h-8"
                    >
                      Movimentação
                    </TabsTrigger>
                    <TabsTrigger
                      value="baixas"
                      className="text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-primary h-8"
                    >
                      Baixas
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="custo" className="p-2 sm:p-3 space-y-2 mt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                      <div>
                        <Label className="text-[10px]">Conta de Despesa (Débito)</Label>
                        <Select value={contaDespesa} onValueChange={setContaDespesa}>
                          <SelectTrigger className="h-7 text-xs">
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                          <SelectContent>
                            {CONTAS_DESPESA.map((c) => (
                              <SelectItem key={c.codigo} value={c.codigo} className="text-xs">
                                {c.codigo} - {c.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-[10px]">Conta (Crédito)</Label>
                        <Input
                          value={notaFiscal?.emit?.xNome || ""}
                          className="h-7 text-xs bg-muted truncate"
                          readOnly
                        />
                      </div>
                      <div>
                        <Label className="text-[10px]">Histórico Padrão</Label>
                        <Select value={historicoPadrao} onValueChange={setHistoricoPadrao}>
                          <SelectTrigger className="h-7 text-xs">
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                          <SelectContent>
                            {HISTORICOS_PADRAO.map((h) => (
                              <SelectItem key={h.codigo} value={h.codigo} className="text-xs">
                                {h.codigo} - {h.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-[10px]">Data Competência</Label>
                        <Input
                          type="date"
                          value={dataBaseCompetencia}
                          onChange={(e) => setDataBaseCompetencia(e.target.value)}
                          className="h-7 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div className="sm:col-span-2">
                        <Label className="text-[10px]">Histórico livre</Label>
                        <Input
                          value={historicoLivre}
                          onChange={(e) => setHistoricoLivre(e.target.value)}
                          className="h-7 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-[10px]">Valor</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={valorCusto}
                          onChange={(e) => setValorCusto(Number(e.target.value))}
                          className="h-7 text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs bg-transparent"
                        onClick={adicionarLancamentoCusto}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Novo Custo
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent">
                        <RefreshCw className="h-3 w-3 mr-1" /> At.Movimento
                      </Button>
                    </div>

                    <ScrollArea className="h-[120px] border rounded">
                      <Table>
                        <TableHeader>
                          <TableRow className="text-[10px]">
                            <TableHead>Cód.</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Hist.</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                            <TableHead className="w-8"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {lancamentosCusto.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center text-muted-foreground text-xs py-4">
                                Nenhum lançamento
                              </TableCell>
                            </TableRow>
                          ) : (
                            lancamentosCusto.map((l) => (
                              <TableRow key={l.id} className="text-[10px]">
                                <TableCell>{l.contaDebito}</TableCell>
                                <TableCell className="truncate max-w-[100px]">{l.descricaoDebito}</TableCell>
                                <TableCell className="truncate max-w-[80px]">{l.historicoPadrao}</TableCell>
                                <TableCell className="text-right font-bold">{formatarMoeda(l.valor)}</TableCell>
                                <TableCell>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 text-destructive"
                                    onClick={() => setLancamentosCusto(lancamentosCusto.filter((x) => x.id !== l.id))}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </ScrollArea>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">
                        Total: <span className="font-bold">{formatarMoeda(totalLancamentos)}</span>
                      </span>
                      <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700">
                        <Save className="h-3 w-3 mr-1" /> Salvar
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="movimentacao" className="p-4 text-center text-muted-foreground mt-0">
                    <RefreshCw className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Movimentações aparecerão aqui</p>
                  </TabsContent>

                  <TabsContent value="baixas" className="p-4 text-center text-muted-foreground mt-0">
                    <CreditCard className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Baixas e pagamentos</p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Conferência */}
          <TabsContent value="conferencia" className="mt-2">
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Conferência de mercadoria será habilitada após finalização</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Validação */}
          <TabsContent value="validacao" className="mt-2">
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Validação tributária será feita automaticamente</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog de Cancelamento */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar entrada?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar? Todas as alterações não salvas serão perdidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelarEntrada}
              className="w-full sm:w-auto bg-destructive hover:bg-destructive/90"
            >
              Sim, cancelar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  )
}

export default function EntradaNotaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <EntradaNotaContent />
    </Suspense>
  )
}
