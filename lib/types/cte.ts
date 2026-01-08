// Tipos completos para CT-e (Conhecimento de Transporte Eletrônico) baseado no layout XML 4.00

// ==================== IDENTIFICAÇÃO ====================
export interface CTeIdentificacao {
  cUF: string // Código da UF do emitente
  cCT: string // Código numérico do CT-e
  CFOP: string // Código Fiscal de Operações e Prestações
  natOp: string // Natureza da operação
  mod: string // Modelo do documento (57 = CT-e)
  serie: string // Série do documento
  nCT: string // Número do CT-e
  dhEmi: string // Data e hora de emissão
  tpImp: string // Formato de impressão do DACTE
  tpEmis: string // Tipo de emissão
  cDV: string // Dígito verificador da chave de acesso
  tpAmb: string // Tipo de ambiente (1=Produção, 2=Homologação)
  tpCTe: string // Tipo do CT-e (0=Normal, 1=Complementar, 2=Anulação, 3=Substituto)
  procEmi: string // Processo de emissão
  verProc: string // Versão do processo
  indGlobalizado?: string // Indicador de CT-e Globalizado
  cMunEnv: string // Código do município de envio
  xMunEnv: string // Nome do município de envio
  UFEnv: string // UF de envio
  modal: string // Modal (01=Rodoviário, 02=Aéreo, 03=Aquaviário, 04=Ferroviário, 05=Dutoviário, 06=Multimodal)
  tpServ: string // Tipo do serviço (0=Normal, 1=Subcontratação, 2=Redespacho, 3=Redespacho Intermediário, 4=Serviço Vinculado a Multimodal)
  cMunIni: string // Código do município de início da prestação
  xMunIni: string // Nome do município de início
  UFIni: string // UF de início
  cMunFim: string // Código do município de fim da prestação
  xMunFim: string // Nome do município de fim
  UFFim: string // UF de fim
  retira: string // Indicador se há retira (0=Não, 1=Sim)
  xDetRetira?: string // Detalhes da retira
  indIEToma: string // Indicador do IE do tomador
  dhCont?: string // Data/Hora contingência
  xJust?: string // Justificativa contingência
  dhSaiEnt?: string // Data/Hora prevista de saída/entrada
}

// ==================== TOMADOR ====================
export interface CTeTomador3 {
  toma: string // Tomador do serviço (0=Remetente, 1=Expedidor, 2=Recebedor, 3=Destinatário)
}

export interface CTeTomador4 {
  toma: string
  CNPJ?: string
  CPF?: string
  IE?: string
  xNome: string
  xFant?: string
  fone?: string
  enderToma: CTeEndereco
  email?: string
}

// ==================== COMPLEMENTO ====================
export interface CTeEntrega {
  comData?: {
    tpPer: string // Tipo do período de entrega (0=Sem Data, 1=Data Programada, 2=Data Período, 3=Data Início)
    dProg?: string // Data programada
    dIni?: string // Data inicial
    dFim?: string // Data final
  }
  comHora?: {
    tpHor: string // Tipo do horário
    hProg?: string
    hIni?: string
    hFim?: string
  }
  semData?: {
    tpPer: string
  }
  semHora?: {
    tpHor: string
  }
  noPeriodo?: {
    tpPer: string
    dIni: string
    dFim: string
  }
  noHora?: {
    tpHor: string
    hIni: string
    hFim: string
  }
}

export interface CTeComplemento {
  xCaracAd?: string // Características adicionais do transporte
  xCaracSer?: string // Características adicionais do serviço
  xEmi?: string // Funcionário emissor
  fluxo?: {
    xOrig?: string
    pass?: { xPass: string }[]
    xDest?: string
    xRota?: string
  }
  Entrega?: CTeEntrega
  origCalc?: string // Município de origem para cálculo do frete
  destCalc?: string // Município de destino para cálculo do frete
  xObs?: string // Observações gerais
  ObsCont?: { xCampo: string; xTexto: string }[]
  ObsFisco?: { xCampo: string; xTexto: string }[]
}

// ==================== EMITENTE ====================
export interface CTeEndereco {
  xLgr: string // Logradouro
  nro: string // Número
  xCpl?: string // Complemento
  xBairro: string // Bairro
  cMun: string // Código do município
  xMun: string // Nome do município
  CEP?: string // CEP
  UF: string // Sigla da UF
  cPais?: string // Código do país
  xPais?: string // Nome do país
  fone?: string // Telefone
}

export interface CTeEmitente {
  CNPJ?: string
  CPF?: string
  IE: string // Inscrição Estadual
  IEST?: string // IE do Substituto Tributário
  xNome: string // Razão social
  xFant?: string // Nome fantasia
  enderEmit: CTeEndereco
  CRT?: string // Código de Regime Tributário
}

// ==================== REMETENTE ====================
export interface CTeRemetente {
  CNPJ?: string
  CPF?: string
  IE?: string
  xNome: string
  xFant?: string
  fone?: string
  enderReme: CTeEndereco
  email?: string
}

// ==================== EXPEDIDOR ====================
export interface CTeExpedidor {
  CNPJ?: string
  CPF?: string
  IE?: string
  xNome: string
  xFant?: string
  fone?: string
  enderExped: CTeEndereco
  email?: string
}

// ==================== RECEBEDOR ====================
export interface CTeRecebedor {
  CNPJ?: string
  CPF?: string
  IE?: string
  xNome: string
  xFant?: string
  fone?: string
  enderReceb: CTeEndereco
  email?: string
}

// ==================== DESTINATÁRIO ====================
export interface CTeDestinatario {
  CNPJ?: string
  CPF?: string
  IE?: string
  xNome: string
  xFant?: string
  fone?: string
  enderDest: CTeEndereco
  email?: string
}

// ==================== VALORES DA PRESTAÇÃO ====================
export interface CTeComponenteValor {
  xNome: string // Nome do componente
  vComp: string // Valor do componente
}

export interface CTeValorPrestacao {
  vTPrest: string // Valor total da prestação
  vRec: string // Valor a receber
  Comp?: CTeComponenteValor[] // Componentes do valor
}

// ==================== IMPOSTOS ====================
export interface CTeICMS {
  CST: string // Código de Situação Tributária
  vBC?: string // Valor da BC do ICMS
  pICMS?: string // Alíquota do ICMS
  vICMS?: string // Valor do ICMS
  pRedBC?: string // Percentual de redução da BC
  vCred?: string // Valor do crédito outorgado/presumido
  vTotTrib?: string // Valor total de tributos
  outraUF?: {
    vBCOutraUF: string
    pICMSOutraUF: string
    pRedBCOutraUF?: string
    vICMSOutraUF: string
  }
  vICMSUFIni?: string // Valor ICMS UF início
  vICMSUFFim?: string // Valor ICMS UF fim
  // Campos para Simples Nacional
  indSN?: string // Indicador de Simples Nacional
}

export interface CTeImpostos {
  ICMS: CTeICMS
  vTotTrib?: string // Valor total dos tributos
  infAdFisco?: string // Informações adicionais de interesse do Fisco
  ICMSUFFim?: {
    vBCUFFim: string
    pFCPUFFim: string
    pICMSUFFim: string
    pICMSInter: string
    vFCPUFFim: string
    vICMSUFFim: string
    vICMSUFIni: string
  }
  infTribFed?: {
    vPIS: string
    vCOFINS: string
    vIR: string
    vINSS: string
    vCSLL: string
  }
}

// ==================== INFORMAÇÕES DA CARGA ====================
export interface CTeCarga {
  vCarga?: string // Valor total da carga
  proPred: string // Produto predominante
  xOutCat?: string // Outras características da carga
  infQ?: {
    cUnid: string // Código da unidade de medida
    tpMed: string // Tipo de medida
    qCarga: string // Quantidade
  }[]
}

// ==================== DOCUMENTOS ORIGINÁRIOS ====================
export interface CTeDocAnterior {
  emiDocAnt?: {
    CNPJ?: string
    CPF?: string
    IE?: string
    UF: string
    xNome: string
    idDocAnt: {
      idDocAntPap?: {
        tpDoc: string
        serie: string
        subser?: string
        nDoc: string
        dEmi: string
      }[]
      idDocAntEle?: {
        chCTe: string
      }[]
    }[]
  }[]
}

export interface CTeInfNFe {
  chave: string // Chave de acesso da NF-e
  PIN?: string // PIN SUFRAMA
  dPrev?: string // Data prevista de entrega
  infUnidCarga?: {
    tpUnidCarga: string
    idUnidCarga: string
    lacUnidCarga?: { nLacre: string }[]
    qtdRat?: string
  }[]
  infUnidTransp?: {
    tpUnidTransp: string
    idUnidTransp: string
    lacUnidTransp?: { nLacre: string }[]
    infUnidCarga?: any[]
    qtdRat?: string
  }[]
}

export interface CTeInfOutros {
  tpDoc: string // Tipo de documento
  descOutros?: string // Descrição do documento
  nDoc?: string // Número do documento
  dEmi?: string // Data de emissão
  vDocFisc?: string // Valor do documento
  dPrev?: string // Data prevista de entrega
}

export interface CTeDocumentos {
  infNFe?: CTeInfNFe[]
  infNF?: {
    nRoma?: string
    nPed?: string
    mod: string
    serie: string
    nDoc: string
    dEmi: string
    vBC: string
    vICMS: string
    vBCST: string
    vST: string
    vProd: string
    vNF: string
    nCFOP: string
    nPeso?: string
    PIN?: string
    dPrev?: string
    infUnidCarga?: any[]
    infUnidTransp?: any[]
  }[]
  infOutros?: CTeInfOutros[]
}

// ==================== MODAL RODOVIÁRIO ====================
export interface CTeRodoviario {
  RNTRC?: string // Registro Nacional de Transportadores Rodoviários de Carga
  occ?: {
    serie?: string
    nOcc: string
    dEmi: string
    emiOcc: {
      CNPJ: string
      cInt?: string
      IE: string
      UF: string
      fone?: string
    }
  }[]
}

// ==================== VEÍCULOS ====================
export interface CTeVeiculo {
  cInt?: string // Código interno
  RENAVAM?: string
  placa: string
  tara?: string
  capKG?: string
  capM3?: string
  tpProp?: string // Tipo de proprietário
  tpVeic?: string // Tipo de veículo
  tpRod?: string // Tipo de rodado
  tpCar?: string // Tipo de carroceria
  UF?: string
  prop?: {
    CPF?: string
    CNPJ?: string
    RNTRC: string
    xNome: string
    IE?: string
    UF: string
    tpProp: string
  }
}

// ==================== MOTORISTA ====================
export interface CTeMotorista {
  xNome: string
  CPF: string
}

// ==================== INFORMAÇÕES CTe NORMAL ====================
export interface CTeInfCTeNorm {
  infCarga: CTeCarga
  infDoc: CTeDocumentos
  docAnt?: CTeDocAnterior
  infModal: {
    versaoModal: string
    rodo?: CTeRodoviario
  }
  veicNovos?: CTeVeiculo[]
  cobr?: {
    fat?: {
      nFat?: string
      vOrig?: string
      vDesc?: string
      vLiq?: string
    }
    dup?: {
      nDup: string
      dVenc: string
      vDup: string
    }[]
  }
  infCteSub?: {
    chCte: string
    refCteAnu?: string
    tomaICMS?: {
      refNFe?: string
      refNF?: any
      refCte?: string
    }
  }
  infGlobalizado?: {
    xObs: string
  }
  infServVinc?: {
    infCTeMultimodal: {
      chCTeMultimodal: string
    }[]
  }
}

// ==================== PROTOCOLO ====================
export interface CTeProtocolo {
  tpAmb: string
  verAplic: string
  chCTe: string
  dhRecbto: string
  nProt: string
  digVal: string
  cStat: string
  xMotivo: string
}

// ==================== AUTORIZAÇÃO XML ====================
export interface CTeAutXML {
  CNPJ?: string
  CPF?: string
}

// ==================== INFORMAÇÕES ADICIONAIS ====================
export interface CTeInformacoesAdicionais {
  infAdFisco?: string
  infCpl?: string
}

// ==================== CT-e COMPLETO ====================
export interface ConhecimentoTransporteEletronico {
  id: string
  chaveAcesso: string
  xmlOriginal: string
  dataEntrada: string
  usuarioEntrada: string
  status: "ativo" | "cancelado" | "inutilizado"

  // Dados do CT-e
  ide: CTeIdentificacao
  compl?: CTeComplemento
  emit: CTeEmitente
  rem?: CTeRemetente
  exped?: CTeExpedidor
  receb?: CTeRecebedor
  dest?: CTeDestinatario
  vPrest: CTeValorPrestacao
  imp: CTeImpostos
  infCTeNorm?: CTeInfCTeNorm
  autXML?: CTeAutXML[]
  infAdic?: CTeInformacoesAdicionais
  infRespTec?: {
    CNPJ: string
    xContato: string
    email: string
    fone: string
  }
  infSolicNFF?: {
    xSolic: string
  }

  // Tomador (pode ser toma3 ou toma4)
  toma3?: CTeTomador3
  toma4?: CTeTomador4

  // Protocolo de autorização
  protCTe?: CTeProtocolo

  // Campos para controle interno
  contabilizado: boolean
  contasLancadas: boolean
  observacoesInternas?: string
}

// ==================== TIPO UNIÃO PARA DOCUMENTOS ====================
export type DocumentoFiscal =
  | {
      tipo: "nfe"
      documento: import("./nota-fiscal").NotaFiscalEletronica
    }
  | {
      tipo: "cte"
      documento: ConhecimentoTransporteEletronico
    }
