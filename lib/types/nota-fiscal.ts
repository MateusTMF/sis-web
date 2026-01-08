// Tipos completos para NFe (Nota Fiscal Eletrônica) baseado no layout XML 4.00

// ==================== IDENTIFICAÇÃO ====================
export interface NFeIdentificacao {
  cUF: string // Código da UF do emitente
  cNF: string // Código numérico da NF
  natOp: string // Natureza da operação
  mod: string // Modelo do documento (55 = NF-e)
  serie: string // Série do documento
  nNF: string // Número da NF
  dhEmi: string // Data e hora de emissão
  dhSaiEnt?: string // Data e hora de saída/entrada
  tpNF: string // Tipo de operação (0=Entrada, 1=Saída)
  idDest: string // Identificador de destino (1=Op.Interna, 2=Op.Interestadual, 3=Op.Exterior)
  cMunFG: string // Código do município de ocorrência do fato gerador
  tpImp: string // Formato de impressão do DANFE
  tpEmis: string // Tipo de emissão
  cDV: string // Dígito verificador da chave de acesso
  tpAmb: string // Tipo de ambiente (1=Produção, 2=Homologação)
  finNFe: string // Finalidade da NF-e (1=Normal, 2=Complementar, 3=Ajuste, 4=Devolução)
  indFinal: string // Consumidor final (0=Normal, 1=Consumidor Final)
  indPres: string // Presença do comprador (0=Não se aplica, 1=Presencial, etc.)
  procEmi: string // Processo de emissão
  verProc: string // Versão do processo de emissão
  dhCont?: string // Data/Hora contingência
  xJust?: string // Justificativa contingência
}

// ==================== EMITENTE ====================
export interface NFeEndereco {
  xLgr: string // Logradouro
  nro: string // Número
  xCpl?: string // Complemento
  xBairro: string // Bairro
  cMun: string // Código do município
  xMun: string // Nome do município
  UF: string // Sigla da UF
  CEP: string // CEP
  cPais: string // Código do país
  xPais: string // Nome do país
  fone?: string // Telefone
}

export interface NFeEmitente {
  CNPJ?: string
  CPF?: string
  xNome: string // Razão social
  xFant?: string // Nome fantasia
  enderEmit: NFeEndereco
  IE: string // Inscrição Estadual
  IEST?: string // IE do Substituto Tributário
  IM?: string // Inscrição Municipal
  CNAE?: string // CNAE fiscal
  CRT: string // Código de Regime Tributário (1=Simples, 2=Simples Excesso, 3=Regime Normal)
}

// ==================== DESTINATÁRIO ====================
export interface NFeDestinatario {
  CNPJ?: string
  CPF?: string
  idEstrangeiro?: string
  xNome: string // Razão social
  enderDest: NFeEndereco
  indIEDest: string // Indicador da IE do destinatário
  IE?: string // Inscrição Estadual
  ISUF?: string // Inscrição na SUFRAMA
  IM?: string // Inscrição Municipal
  email?: string
}

// ==================== PRODUTOS ====================
export interface NFeProduto {
  cProd: string // Código do produto
  cEAN: string // GTIN/EAN
  xProd: string // Descrição do produto
  NCM: string // Código NCM
  NVE?: string // Nomenclatura de Valor Aduaneiro
  CEST?: string // Código Especificador da Substituição Tributária
  indEscala?: string // Indicador de Escala Relevante
  CNPJFab?: string // CNPJ do fabricante
  cBenef?: string // Código de benefício fiscal
  EXTIPI?: string // Código EX da TIPI
  CFOP: string // Código Fiscal de Operações e Prestações
  uCom: string // Unidade comercial
  qCom: string // Quantidade comercial
  vUnCom: string // Valor unitário de comercialização
  vProd: string // Valor total bruto dos produtos
  cEANTrib: string // GTIN tributável
  uTrib: string // Unidade tributável
  qTrib: string // Quantidade tributável
  vUnTrib: string // Valor unitário de tributação
  vFrete?: string // Valor do frete
  vSeg?: string // Valor do seguro
  vDesc?: string // Valor do desconto
  vOutro?: string // Outras despesas acessórias
  indTot: string // Indica se o item compõe o valor total da NF-e
  xPed?: string // Número do pedido de compra
  nItemPed?: string // Item do pedido de compra
  nFCI?: string // Número de controle da FCI
}

// ==================== IMPOSTOS DO PRODUTO ====================
export interface NFeICMS {
  orig: string // Origem da mercadoria
  CST?: string // Código de Situação Tributária
  CSOSN?: string // Código de Situação da Operação Simples Nacional
  modBC?: string // Modalidade de determinação da BC
  pRedBC?: string // Percentual de redução da BC
  vBC?: string // Valor da BC do ICMS
  pICMS?: string // Alíquota do imposto
  vICMS?: string // Valor do ICMS
  vBCFCP?: string // Valor da BC do FCP
  pFCP?: string // Percentual do FCP
  vFCP?: string // Valor do FCP
  modBCST?: string // Modalidade de determinação da BC ST
  pMVAST?: string // Percentual da margem de valor adicionado ST
  pRedBCST?: string // Percentual de redução da BC ST
  vBCST?: string // Valor da BC do ICMS ST
  pICMSST?: string // Alíquota do ICMS ST
  vICMSST?: string // Valor do ICMS ST
  vBCFCPST?: string // Valor da BC do FCP ST
  pFCPST?: string // Percentual do FCP ST
  vFCPST?: string // Valor do FCP ST
  vICMSDeson?: string // Valor do ICMS desoneração
  motDesICMS?: string // Motivo da desoneração do ICMS
  pCredSN?: string // Alíquota aplicável de cálculo do crédito (Simples)
  vCredICMSSN?: string // Valor crédito ICMS (Simples)
  vBCSTRet?: string // Valor da BC do ICMS ST retido
  pST?: string // Alíquota suportada pelo Consumidor Final
  vICMSSubstituto?: string // Valor do ICMS próprio do Substituto
  vICMSSTRet?: string // Valor do ICMS ST retido
  vBCFCPSTRet?: string // Valor da BC do FCP retido anteriormente
  pFCPSTRet?: string // Percentual do FCP retido anteriormente
  vFCPSTRet?: string // Valor do FCP retido anteriormente
  pRedBCEfet?: string // Percentual de redução da base de cálculo efetiva
  vBCEfet?: string // Valor da base de cálculo efetiva
  pICMSEfet?: string // Alíquota do ICMS efetiva
  vICMSEfet?: string // Valor do ICMS efetivo
}

export interface NFeIPI {
  CNPJProd?: string // CNPJ do produtor
  cSelo?: string // Código do selo de controle IPI
  qSelo?: string // Quantidade de selo de controle
  cEnq: string // Código de enquadramento legal do IPI
  CST?: string // Código da situação tributária
  vBC?: string // Valor da BC do IPI
  pIPI?: string // Alíquota do IPI
  qUnid?: string // Quantidade total na unidade padrão
  vUnid?: string // Valor por unidade tributável
  vIPI?: string // Valor do IPI
}

export interface NFePIS {
  CST: string // Código de Situação Tributária
  vBC?: string // Valor da Base de Cálculo
  pPIS?: string // Alíquota do PIS (em %)
  vPIS?: string // Valor do PIS
  qBCProd?: string // Quantidade vendida
  vAliqProd?: string // Alíquota do PIS (em reais)
}

export interface NFeCOFINS {
  CST: string // Código de Situação Tributária
  vBC?: string // Valor da Base de Cálculo
  pCOFINS?: string // Alíquota da COFINS (em %)
  vCOFINS?: string // Valor da COFINS
  qBCProd?: string // Quantidade vendida
  vAliqProd?: string // Alíquota da COFINS (em reais)
}

export interface NFeII {
  vBC: string // Valor da BC do II
  vDespAdu: string // Valor das despesas aduaneiras
  vII: string // Valor do II
  vIOF: string // Valor do IOF
}

export interface NFeImpostosProduto {
  ICMS: NFeICMS
  IPI?: NFeIPI
  PIS: NFePIS
  COFINS: NFeCOFINS
  II?: NFeII
  PISST?: NFePIS
  COFINSST?: NFeCOFINS
  ICMSUFDest?: {
    vBCUFDest: string
    vBCFCPUFDest?: string
    pFCPUFDest?: string
    pICMSUFDest: string
    pICMSInter: string
    pICMSInterPart: string
    vFCPUFDest?: string
    vICMSUFDest: string
    vICMSUFRemet: string
  }
}

export interface NFeDetalheProduto {
  nItem: string // Número do item
  prod: NFeProduto
  imposto: NFeImpostosProduto
  infAdProd?: string // Informações adicionais do produto
}

// ==================== TOTAIS ====================
export interface NFeICMSTot {
  vBC: string // Base de cálculo do ICMS
  vICMS: string // Valor do ICMS
  vICMSDeson?: string // Valor do ICMS desonerado
  vFCPUFDest?: string // Valor do ICMS relativo ao FCP UF destino
  vICMSUFDest?: string // Valor do ICMS interestadual UF destino
  vICMSUFRemet?: string // Valor do ICMS interestadual UF remetente
  vFCP?: string // Valor do FCP
  vBCST: string // Base de cálculo do ICMS ST
  vST: string // Valor do ICMS ST
  vFCPST?: string // Valor do FCP ST
  vFCPSTRet?: string // Valor do FCP ST retido
  vProd: string // Valor total dos produtos
  vFrete: string // Valor do frete
  vSeg: string // Valor do seguro
  vDesc: string // Valor do desconto
  vII: string // Valor do II
  vIPI: string // Valor do IPI
  vIPIDevol?: string // Valor do IPI devolvido
  vPIS: string // Valor do PIS
  vCOFINS: string // Valor da COFINS
  vOutro: string // Outras despesas acessórias
  vNF: string // Valor total da NF-e
  vTotTrib?: string // Valor aproximado total dos tributos
}

export interface NFeISSQNTot {
  vServ?: string // Valor total dos serviços
  vBC?: string // Base de cálculo do ISS
  vISS?: string // Valor total do ISS
  vPIS?: string // Valor do PIS sobre serviços
  vCOFINS?: string // Valor da COFINS sobre serviços
  dCompet: string // Data da prestação do serviço
  vDeducao?: string // Valor dedução para redução da BC
  vOutro?: string // Valor outras retenções
  vDescIncond?: string // Valor desconto incondicionado
  vDescCond?: string // Valor desconto condicionado
  vISSRet?: string // Valor retenção ISS
  cRegTrib?: string // Código do regime especial de tributação
}

export interface NFeRetTrib {
  vRetPIS?: string // Valor retido de PIS
  vRetCOFINS?: string // Valor retido de COFINS
  vRetCSLL?: string // Valor retido de CSLL
  vBCIRRF?: string // Base de cálculo do IRRF
  vIRRF?: string // Valor retido do IRRF
  vBCRetPrev?: string // Base de cálculo da retenção da Prev. Social
  vRetPrev?: string // Valor da retenção da Prev. Social
}

export interface NFeTotais {
  ICMSTot: NFeICMSTot
  ISSQNtot?: NFeISSQNTot
  retTrib?: NFeRetTrib
}

// ==================== TRANSPORTE ====================
export interface NFeTransportadora {
  CNPJ?: string
  CPF?: string
  xNome?: string // Razão social
  IE?: string // Inscrição Estadual
  xEnder?: string // Endereço completo
  xMun?: string // Nome do município
  UF?: string // Sigla da UF
}

export interface NFeVeiculo {
  placa: string // Placa do veículo
  UF: string // Sigla da UF
  RNTC?: string // Registro Nacional de Transportadores de Carga
}

export interface NFeVolume {
  qVol?: string // Quantidade de volumes
  esp?: string // Espécie dos volumes
  marca?: string // Marca dos volumes
  nVol?: string // Numeração dos volumes
  pesoL?: string // Peso líquido (em kg)
  pesoB?: string // Peso bruto (em kg)
  lacres?: { nLacre: string }[] // Lacres dos volumes
}

export interface NFeTransporte {
  modFrete: string // Modalidade do frete (0=Emitente, 1=Destinatário, 2=Terceiros, 9=Sem Frete)
  transporta?: NFeTransportadora
  retTransp?: {
    vServ: string // Valor do serviço
    vBCRet: string // BC da retenção do ICMS
    pICMSRet: string // Alíquota da retenção
    vICMSRet: string // Valor do ICMS retido
    CFOP: string // CFOP
    cMunFG: string // Código do município de ocorrência do FG
  }
  veicTransp?: NFeVeiculo
  reboque?: NFeVeiculo[]
  vagao?: string // Identificação do vagão
  balsa?: string // Identificação da balsa
  vol?: NFeVolume[]
}

// ==================== COBRANÇA ====================
export interface NFeFatura {
  nFat?: string // Número da fatura
  vOrig?: string // Valor original
  vDesc?: string // Valor do desconto
  vLiq?: string // Valor líquido
}

export interface NFeDuplicata {
  nDup: string // Número da duplicata
  dVenc: string // Data de vencimento
  vDup: string // Valor da duplicata
}

export interface NFeCobranca {
  fat?: NFeFatura
  dup?: NFeDuplicata[]
}

// ==================== PAGAMENTO ====================
export interface NFePagamento {
  indPag?: string // Indicador de pagamento (0=Pagamento à vista, 1=Pagamento à prazo)
  tPag: string // Forma de pagamento
  xPag?: string // Descrição da forma de pagamento
  vPag: string // Valor do pagamento
  card?: {
    tpIntegra: string // Tipo de integração
    CNPJ?: string // CNPJ da credenciadora
    tBand?: string // Bandeira da operadora
    cAut?: string // Número de autorização
  }
  vTroco?: string // Valor do troco
}

// ==================== INFORMAÇÕES ADICIONAIS ====================
export interface NFeInformacoesAdicionais {
  infAdFisco?: string // Informações adicionais de interesse do Fisco
  infCpl?: string // Informações complementares de interesse do Contribuinte
  obsCont?: { xCampo: string; xTexto: string }[]
  obsFisco?: { xCampo: string; xTexto: string }[]
  procRef?: { nProc: string; indProc: string }[]
}

// ==================== EXPORTAÇÃO ====================
export interface NFeExportacao {
  UFSaidaPais: string // Sigla da UF de embarque
  xLocExporta: string // Local de embarque
  xLocDespacho?: string // Local de despacho
}

// ==================== COMPRAS (para escrituração) ====================
export interface NFeCompra {
  xNEmp?: string // Nota de empenho
  xPed?: string // Pedido
  xCont?: string // Contrato
}

// ==================== NF REFERENCIADA ====================
export interface NFeReferenciada {
  refNFe?: string // Chave de acesso da NF-e referenciada
  refNFP?: {
    cUF: string
    AAMM: string
    CNPJ?: string
    CPF?: string
    IE: string
    mod: string
    serie: string
    nNF: string
  }
  refCTe?: string // Chave de acesso do CT-e referenciado
  refECF?: {
    mod: string
    nECF: string
    nCOO: string
  }
}

// ==================== AUTORIZAÇÃO XML ====================
export interface NFeAutXML {
  CNPJ?: string
  CPF?: string
}

// ==================== PROTOCOLO ====================
export interface NFeProtocolo {
  tpAmb: string
  verAplic: string
  chNFe: string
  dhRecbto: string
  nProt: string
  digVal: string
  cStat: string
  xMotivo: string
}

// ==================== NFE COMPLETA ====================
export interface NotaFiscalEletronica {
  id: string
  chaveAcesso: string
  xmlOriginal: string
  dataEntrada: string
  usuarioEntrada: string
  status: "ativa" | "cancelada" | "inutilizada"

  // Dados da NF-e
  ide: NFeIdentificacao
  emit: NFeEmitente
  dest: NFeDestinatario
  retirada?: NFeEndereco
  entrega?: NFeEndereco
  autXML?: NFeAutXML[]
  det: NFeDetalheProduto[]
  total: NFeTotais
  transp: NFeTransporte
  cobr?: NFeCobranca
  pag: NFePagamento[]
  infAdic?: NFeInformacoesAdicionais
  exporta?: NFeExportacao
  compra?: NFeCompra
  cana?: any // Grupo de cana-de-açúcar
  NFref?: NFeReferenciada[]

  // Protocolo de autorização
  protNFe?: NFeProtocolo

  // Campos para controle interno
  contabilizado: boolean
  estoqueLancado: boolean
  contasLancadas: boolean
  observacoesInternas?: string
}

// ==================== FILTROS ====================
export interface FiltroNotaFiscal {
  tipoDocumento?: "nfe" | "cte" | "todos"
  dataInicio?: string
  dataFim?: string
  numeroNota?: string
  serie?: string
  chaveAcesso?: string
  cnpjEmitente?: string
  nomeEmitente?: string
  cnpjDestinatario?: string
  nomeDestinatario?: string
  cfop?: string
  valorMinimo?: number
  valorMaximo?: number
  status?: "ativa" | "cancelada" | "inutilizada" | "todas"
  contabilizado?: boolean
  estoqueLancado?: boolean
}
